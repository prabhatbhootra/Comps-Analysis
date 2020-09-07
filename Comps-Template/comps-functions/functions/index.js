const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const config = {
    apiKey: "apiKey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "comps-9febb",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

const FBAuth = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized'});
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            console.log(decodedToken);
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.email = data.docs[0].data().email;
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token', err);
            return res.status(403).json(err);
        })
}

/*  Modify get to use path /results/:uid  
    get from db collection where username (uid) === uid in path query param
*/
app.get('/results', FBAuth, (req, res) => {
    db
        .collection('results')
        .where('username', '==', req.user.email)
        .get()
        .then((data) => {
            let resultsArr = [];
            data.forEach((doc) => {
                resultsArr.push({
                    resultId: doc.id,
                    username: doc.data().username,
                    name: doc.data().name,
                    createdAt: doc.data().createdAt,
                    analysis: doc.data().analysis
                });
            });
            return res.json(resultsArr);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
});

/* Modify post request */
app.post('/result', FBAuth, (req, res) => {
    //if(req.body.analysis.trim() === ''){
    //    return res.status(400).json({ analysis: 'Analysis must not be empty' });
    //}
    /*
    use this Payload instead of newResult below = {
        uid (called username in firebase docs): decode req token to uid,
        name: req name of analysis
        createdAt: new Date().toISOString(),
        analysis: req.body.analysis
    }
    */
    const newResult = {
        //uid: req.user.uid,
        username: req.user.email,
        name: req.body.name,
        createdAt: new Date().toISOString(),
        analysis: req.body.analysis
    };
    db
        .collection('results')
        .add(newResult)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully!`});
        })
        .catch((err) => {
            res.status(500).json({error: 'something went wrong'});
            console.error(err);
        });
});

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

//Sign up route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    let errors = {};

    if(isEmpty(newUser.email)){
        errors.email = 'Must not be empty';
    } else if(!isEmail(newUser.email)){
        errors.email = 'Must be a valid email address';
    }

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);
    
    let token, userId;
    db.doc(`/users/${newUser.email}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ username: 'this username (email) is already taken'});
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                userId: userId,
                email: newUser.email,
                createdAt: new Date().toISOString()
            };
            return db.doc(`/users/${newUser.email}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use' })
            } else {
                return res.status(500).json({ general: 'Something went wrong, please try again'});
            }
        })
});

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {}
    
    if(isEmpty(user.email)) errors.email = 'Must not be empty';
    if(isEmpty(user.password)) errors.password = 'Must not be empty';

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({general: 'Wrong credentials, please try again'});
        });
})

/* Modify delete use path /result/:uid  */
app.delete('/result/:resultId', FBAuth, (req, res) => {
    const document = db.doc(`/results/${req.params.resultId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Result not found'});
            }
            if(doc.data().username !== req.user.email){
                return res.status(403).json({ error: 'Unauthorized'});
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Result deleted successfully'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        });
})

exports.api = functions.https.onRequest(app);
