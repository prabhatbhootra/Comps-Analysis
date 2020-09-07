import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';

//Components
import Navbar from './components/Navbar';
import AuthRoute from './components/AuthRoute';

//Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Analysis from './pages/Analysis';
import Results from './pages/Results';
import SavedResults from './pages/SavedResults';
import ViewResults from './pages/ViewResults';

const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#484848',
        main: '#121212',
        dark: '#000000',
        contrastText: '#b3e5fc'
      },
      secondary: {
        light: '#4f5b62',
        main: '#263238',
        dark: '#000a12',
        contrastText: '#bbdefb'
      }
    },
    spreadIt: {
      form: {
        textAlign: 'center'
      },
      image: {
        margin: '20px auto 20px auto'
      },
      pageTitle: {
        margin: '20px auto 20px auto'
      },
      textField: {
        margin: '10px auto 10px auto'
      },
      button: {
        marginTop: 20,
        position: 'relative'
      },
      customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
      },
      progress: {
        position: 'absolute'
      }
    }
});

/*  MODIFY THIS
let authenticated;
const token = localStorage.FBIdToken;
if(token){
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    window.location.href = '/login'
    authenticated = false;
  } else {
    authenticated = true;
  }
}
*/

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedMultiples: null,
      peerData: null,
      targetTicker: null,
      viewResults: null
    };
    this.callBackFromHome = this.callBackFromHome.bind(this);
    this.callBackFromAnalysis = this.callBackFromAnalysis.bind(this);
    this.callBackForTicker = this.callBackForTicker.bind(this);
  }

  callBackFromHome = (selections) => {
    this.setState({selectedMultiples : selections});
    //this.props.history.push('/analysis');
  }

  callBackFromAnalysis = (data) => {
    this.setState({peerData: data});
  }

  callBackForTicker = (ticker) => {
    this.setState({targetTicker: ticker});
  }

  callBackForViewResults = (result) => {
    this.setState({viewResults: result});
  }
  
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Navbar/>
            <div className="container">
              <Switch>
                <Route exact path="/" render={props => (
                  <Home
                    {...props}
                    callBackFromParent={this.callBackFromHome}
                    callBackTargetTicker={this.callBackForTicker}
                  />
                  )}
                />
                <Route exact path="/login" render={props => ( // changed from /login t
                  <Login {...props}/>
                )} /> {/*authenticated={authenticated} */}
                <Route exact path="/signup" render={props => (
                  <Signup {...props}/>
                )} /> {/*authenticated={authenticated} */}
                {/* <AuthRoute exact path="/analysis" component={analysis} multiples={this.state.selectedMultiples}/> */}
                {/* <AuthRoute exact path="/analysis" component={Analysis} /> */}
                <Route exact path="/analysis" render={props => (
                  <Analysis
                    {...props}
                    multiples={this.state.selectedMultiples}
                    callBackForPeerData={this.callBackFromAnalysis}
                    ticker={this.state.targetTicker}
                  />
                  )}
                />
                <Route exact path="/results" render={props => (
                  <Results
                    {...props}
                    data={this.state.peerData}
                    ticker={this.state.targetTicker}
                  />
                  )}
                />
                <Route exact path="/savedresults" render={props => (
                  <SavedResults 
                    {...props}
                    callBackOfResults={this.callBackForViewResults}
                  />
                )} />
                <Route exact path="/viewresults" render={props => (
                  <ViewResults 
                    {...props}
                    result={this.state.viewResults}
                  />
                )} />
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
