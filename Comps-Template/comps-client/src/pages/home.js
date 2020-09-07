import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
//import AppIcon from '../images/icon.png';
//import axios from 'axios';

//MUI Stuff
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { FormHelperText } from '@material-ui/core';

const styles = (theme) => ({
    ...theme.spreadIt,
    card: {
        maxWidth: 345,
        margin: 100
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto'
        /*
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
        */
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
        //avatar can be deleted
    },
    button: {
        marginTop: 20,
        position: 'relative'
    },
    box: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

class Home extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            expanded: false,
            expandedOther: false,
            checkedEVToSales: false,
            checkedEVToEBITDA: false,
            checkedPToE: false,
            checkedPToB: false,
            checkedPToCF: false

        };
        this.handleSelectedMultiples = this.handleSelectedMultiples.bind(this);
        this.handleViewResults = this.handleViewResults.bind(this);
    }
    
    componentDidMount() {
        const token = localStorage.FBIdToken;
        if(token === undefined){
            //const decodedToken = jwtDecode(token);
            window.location.href = '/login';
            alert('Please log in.');
        }
        /*
        axios.get('/results')
            .then(res => {
                this.setState({
                    results: res.data
                })
            })
            .catch(err => console.log(err));
        */
    }

    async handleSelectedMultiples(event) {
        event.preventDefault();
        if (this.state.checkedEVToSales === false && this.state.checkedEVToEBITDA === false && this.state.checkedPToE === false && this.state.checkedPToB === false && this.state.checkedPToCF === false) {
            alert("Please select the multiples you wish to include in the analysis");
        } else if (document.getElementsByName("target")[0].value === '') {
            alert("Please enter a valid ticker for a company to be valued");
        }
        else {
            const validTicker = await fetch('https://cloud.iexapis.com/stable/stock/' + document.getElementsByName("target")[0].value + '/quote?token=mytoken');
            if (!validTicker.ok) {
                alert("Please enter a valid ticker for a company to be valued");
                document.getElementsByName("target")[0].value = "";
                return;
            } else {
                this.props.callBackFromParent({
                    checkedEVToSales: this.state.checkedEVToSales,
                    checkedEVToEBITDA: this.state.checkedEVToEBITDA,
                    checkedPToE: this.state.checkedPToE,
                    checkedPToB: this.state.checkedPToB,
                    checkedPToCF: this.state.checkedPToCF
                })
                this.props.callBackTargetTicker(document.getElementsByName("target")[0].value.toUpperCase());
                this.props.history.push('/analysis');
            }
        }
    }

    handleViewResults(event) {
        event.preventDefault();
        this.props.history.push('/savedresults');
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleExpandClick = () => {
        this.setState({ expanded : !this.state.expanded});
    };

    handleSecondExpandClick = () => {
        this.setState({ expandedOther: !this.state.expandedOther});
    }

    render() {
        /*
        let resultsMarkup = this.state.results ? (
            this.state.results.map((result, i) => <p key={i}>{JSON.parse(JSON.stringify(result.analysis))}</p>)
        ) : (
            <p>Loading...</p>
        );
        */
       const { classes } = this.props;
        return (
            <div className={classes.box}>
                <Card className={classes.card} m={2}>
                    <CardHeader
                        /*
                        avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            R
                        </Avatar>
                        }
                        action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                        }
                        */
                        title="Perform a comparable company's analysis:"
                        subheader="Simply select a company and edit the information as needed"
                    />
                    {/*
                    <CardMedia
                        className={classes.media}
                        image="/static/images/cards/paella.jpg"
                        title="Paella dish"
                    />
                    */}
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                        Please enter the ticker of the company you would like to value below. Then click on
                        the expand arrow and select the multiples you would like to include in the analysis
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <div><span>Enter Stock Ticker for target company to be valued:</span></div>
                        <div><Input type="text" name="target"/></div>
                        <IconButton
                            className={classes.expand}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="show more"
                        >
                        <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Please select the relevant multiples to that you wish to include in the analysis:
                            </Typography>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.checkedEVToSales} onChange={this.handleChange('checkedEVToSales')} value="checkedEVToSales" />
                                    }
                                    label="EV/Sales"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.checkedEVToEBITDA} onChange={this.handleChange('checkedEVToEBITDA')} value="checkedEVToEBITDA" />
                                    }
                                    label="EV/EBITDA"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.checkedPToE} onChange={this.handleChange('checkedPToE')} value="checkedPToE" />
                                    }
                                    label="P/E"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.checkedPToB} onChange={this.handleChange('checkedPToB')} value="checkedPToB" />
                                    }
                                    label="P/B"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.checkedPToCF} onChange={this.handleChange('checkedPToCF')} value="checkedPToCF" />
                                    }
                                    label="P/Cash Flow"
                                />
                            </FormGroup>
                            <Button type="submit" variant="contained" color="primary" className={classes.button} onClick={this.handleSelectedMultiples}>
                                Proceed to New Comparable Companies Analysis 
                            </Button>
                        </CardContent>
                    </Collapse>
                </Card>
                <Card className={classes.card} m={2}>
                    <CardHeader
                        /*
                        avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            R
                        </Avatar>
                        }
                        action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                        }
                        */
                        title="View saved results of comparable companies analysis:"
                        subheader="Simply select the result and view the information"
                    />
                    {/*
                    <CardMedia
                        className={classes.media}
                        image="/static/images/cards/paella.jpg"
                        title="Paella dish"
                    />
                    */}
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                        Please click on the expand arrow below and then click on the button that appears to
                        proceed to the page to view your history of analyses.
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton
                        className={classes.expand}
                        onClick={this.handleSecondExpandClick}
                        aria-expanded={this.state.expandedOther}
                        aria-label="show more"
                        >
                        <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expandedOther} timeout="auto" unmountOnExit>
                        <CardContent>
                            {/*
                            <Typography paragraph>Method:</Typography>
                            <Typography paragraph>
                                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                                minutes.
                            </Typography>
                            <Typography paragraph>
                                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                            </Typography>
                            <Typography paragraph>
                                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                                minutes more. (Discard any mussels that don’t open.)
                            </Typography>
                            <Typography>
                                Set aside off of the heat to let rest for 10 minutes, and then serve.
                            </Typography>
                            */}
                            <Button type="submit" variant="contained" color="primary" className={classes.button} onClick={this.handleViewResults}>
                                Proceed to View Saved Results
                            </Button>
                        </CardContent>
                    </Collapse>
                </Card>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home);
