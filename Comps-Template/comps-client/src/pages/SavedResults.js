import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

import { borders } from '@material-ui/system';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';


import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
    ...theme.spreadIt,
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden'
    },
    gridList: {
        width: 500,
        //height: 'auto'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        //marginBottom: 12,
    },
    box: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
/*
const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
*/

class SavedResults extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            rows: []
        }
    }

    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    setStateRowsAsync(updatedRows) {
        new Promise((resolve) => this.setState({rows : updatedRows}, () => resolve()));
    }

    onDelete(param) {
        //event.preventDefault();
        let newRows = this.state.rows;
        for (let i = 0; i < newRows.length; i++) {
            if (newRows[i].resultId === param.resultId) {
                newRows.splice(i, 1);
            }
        }
        this.setStateRowsAsync(newRows);
        axios.delete(`/result/${param.resultId}`)
            .then(response => {
                console.log(response);
                alert('Result has been deleted')
            })
            .catch(error => {
                console.log(error);
                alert('Session has timed out. Please sign out and login again');
            })
    }

    handleClick(param) {
        this.props.callBackOfResults(param);
        this.props.history.push('/viewresults');
    }

    async componentDidMount() {
        const token = localStorage.FBIdToken;
        if (token === undefined) {
            this.props.history.push('/login');
            alert('Please log in.');
        } else {
            axios.get('/results')
                .then(response => {
                    const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    console.dir(sortedData);
                    this.setStateRowsAsync(sortedData);
                })
                .catch(error => {
                    console.log(error);
                    alert('Session has timed out. Please sign out and login again');
                })
        }
    }

    render() {
        const { classes } = this.props;
        return (
            /*
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Analysis Name</StyledTableCell>
                            <StyledTableCell align="right">Created At</StyledTableCell>
                            <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
                            <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                            <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            */
            <div>
                {this.state.rows.length > 0 ?
                    <div className={classes.root}>
                            <GridList cellHeight={160} className={classes.gridList} cols={1} border={1}> {/*cellHeight={160} */}
                                {this.state.rows.map((row) => (
                                    <GridListTile key={row.resultId} cols={1}>
                                        <Card variant="outlined">{/* className={classes.root}*/}
                                            <CardContent>
                                                <Typography variant="h5" component="h2">
                                                    {row.name}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    Created At: {this.parseISOString(row.createdAt).toString()}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <div className={classes.box}>
                                                    <Button size="small" type="submit" variant="contained" color="primary" onClick={() => this.handleClick(row)}>View Results</Button>
                                                    <Tooltip title="Delete">
                                                        <IconButton aria-label="delete" onClick={() => this.onDelete(row)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </CardActions>
                                        </Card>
                                    </GridListTile>
                                ))}
                            </GridList>
                    </div>
                    :
                    <CircularProgress />                
                }
            </div>
        )
    }
}

SavedResults.propTypes = {
    //multiples: PropTypes.object.isRequired,
    //callBackForPeerData: PropTypes.func.isRequired,
    //ticker: PropTypes.string.isRequired
    callBackOfResults: PropTypes.func.isRequired
}

export default withStyles(styles)(SavedResults);
