import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
    ...theme.spreadIt,
    root: {
        display: 'flex',
    },
    table: {
        minWidth: 700,
    },
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    under: {
        backgroundColor: 'green',
        color: theme.palette.common.white,
    },
    over: {
        backgroundColor: 'red',
        color: theme.palette.common.white,
    },
    save: {
        padding: 70,
    },
    button: {
        marginTop: 20,
        position: 'relative',
        marginBottom: 20,
        left: 30
    },
    space: {
        left: 30
    }
});

class ViewResults extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            columns: [],
            rows: [],
            EVTOSALESROWS: [],
            EVTOEBITDAROWS: [],
            PTOEROWS: [],
            PTOBROWS: [],
            PTOCFROWS: []
        }
        //this.getEVTOSALESROWS = this.getEVTOSALESROWS.bind(this);
    }

    setStateColsAsync(updatedCols) {
        new Promise((resolve) => this.setState({columns : updatedCols}, () => resolve()));
    }

    setStateRowsAsync(updatedRows) {
        new Promise((resolve) => this.setState({rows : updatedRows}, () => resolve()));
    }

    setStateEVSales(newEVSales) {
        new Promise((resolve) => this.setState({EVTOSALESROWS : newEVSales}, () => resolve()));
    }

    setStateEVEBITDA(newEVEBITDA) {
        new Promise((resolve) => this.setState({EVTOEBITDAROWS : newEVEBITDA}, () => resolve()));
    }

    setStatePTOE(newPE) {
        new Promise((resolve) => this.setState({PTOEROWS : newPE}, () => resolve()));
    }

    setStatePTOB(newPB) {
        new Promise((resolve) => this.setState({PTOBROWS : newPB}, () => resolve()));
    }

    setStatePTOCF(newPCF) {
        new Promise((resolve) => this.setState({PTOCFROWS : newPCF}, () => resolve()));
    }

    async componentDidMount() {
        const token = localStorage.FBIdToken;
        if (token === undefined) {
            this.props.history.push('/login');
            alert('Please log in.');
        } else if (this.props.result === null) {
            this.props.history.push('/');
            alert('Please select a result to be viewed');
        } else {
            let newCols = this.props.result.analysis.columns;
            for (let c in newCols) {
                if (c.hasOwnProperty('editable')) {
                    c.editable = false;
                }
            }
            await this.setStateColsAsync(newCols);
            await this.setStateRowsAsync(this.props.result.analysis.rows);
            if (this.props.result.analysis.hasOwnProperty('EVTOSALESROWS')) {
                await this.setStateEVSales(this.props.result.analysis.EVTOSALESROWS);
            }
            if (this.props.result.analysis.hasOwnProperty('EVTOEBITDAROWS')) {
                await this.setStateEVEBITDA(this.props.result.analysis.EVTOEBITDAROWS);
            }
            if (this.props.result.analysis.hasOwnProperty('PTOEROWS')) {
                await this.setStatePTOE(this.props.result.analysis.PTOEROWS);
            }
            if (this.props.result.analysis.hasOwnProperty('PTOBROWS')) {
                await this.setStatePTOB(this.props.result.analysis.PTOBROWS);
            }
            if (this.props.result.analysis.hasOwnProperty('PTOCFROWS')) {
                await this.setStatePTOCF(this.props.result.analysis.PTOCFROWS);
            }
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.state.rows.length > 0 ? 
                    <div>
                        <ReactDataGrid
                            columns={this.state.columns}
                            rowGetter={i => this.state.rows[i]}
                            rowsCount={this.state.rows.length}
                            //onGridRowsUpdated={this.onGridRowsUpdated}
                            //enableCellSelect={true}
                        />
                    </div>
                    :
                    <CircularProgress />
                }
                { this.state.EVTOSALESROWS.length > 0 &&
                    <TableContainer className={classes.table}>
                        <br/>
                        <Table aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    EV/Sales
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell> Estimated Enterprise Value (from Average of peers)</TableCell>
                                    <TableCell align="right">{this.state.EVTOSALESROWS[0]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Target Price (from Estimated EV)</TableCell>
                                    <TableCell align="right" className={this.state.EVTOSALESROWS[2] < 0 ? classes.over : classes.under}>{this.state.EVTOSALESROWS[1]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Expected Return (% based on current price)</TableCell>
                                    <TableCell align="right" className={this.state.EVTOSALESROWS[2] < 0 ? classes.over : classes.under}>{this.state.EVTOSALESROWS[2]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    {this.state.EVTOSALESROWS[2] < 0 ? `${this.state.columns[1].name} is currently overvalued` : `${this.state.columns[1].name} is currently undervalued`}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.EVTOEBITDAROWS.length > 0 &&
                    <TableContainer className={classes.table}>
                        <br/>
                        <Table aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    EV/EBITDA
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Estimated Enterprise Value (from Average of peers)</TableCell>
                                    <TableCell align="right">{this.state.EVTOEBITDAROWS[0]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Target Price (from Estimated EV)</TableCell>
                                    <TableCell align="right" className={this.state.EVTOEBITDAROWS[2] < 0 ? classes.over : classes.under}>{this.state.EVTOEBITDAROWS[1]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Expected Return (% based on current price)</TableCell>
                                    <TableCell align="right" className={this.state.EVTOEBITDAROWS[2] < 0 ? classes.over : classes.under}>{this.state.EVTOEBITDAROWS[2]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    {this.state.EVTOEBITDAROWS[2] < 0 ? `${this.state.columns[1].name} is currently overvalued` : `${this.state.columns[1].name} is currently undervalued`}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.PTOEROWS.length > 0 &&
                    <TableContainer className={classes.table}>
                        <br/>
                        <Table aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    P/E
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Target Price (from Average of peers)</TableCell>
                                    <TableCell align="right" className={this.state.PTOEROWS[1] < 0 ? classes.over : classes.under}>{this.state.PTOEROWS[0]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Expected Return (% based on current price)</TableCell>
                                    <TableCell align="right" className={this.state.PTOEROWS[1] < 0 ? classes.over : classes.under}>{this.state.PTOEROWS[1]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    {this.state.PTOEROWS[1] < 0 ? `${this.state.columns[1].name} is currently overvalued` : `${this.state.columns[1].name} is currently undervalued`}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.PTOBROWS.length > 0 &&
                    <TableContainer className={classes.table}>
                        <br/>
                        <Table aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    P/B
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Target Price (from Average of peers)</TableCell>
                                    <TableCell align="right" className={this.state.PTOBROWS[1] < 0 ? classes.over : classes.under}>{this.state.PTOBROWS[0]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Expected Return (% based on current price)</TableCell>
                                    <TableCell align="right" className={this.state.PTOBROWS[1] < 0 ? classes.over : classes.under}>{this.state.PTOBROWS[1]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    {this.state.PTOBROWS[1] < 0 ? `${this.state.columns[1].name} is currently overvalued` : `${this.state.columns[1].name} is currently undervalued`}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.PTOCFROWS.length > 0 &&
                    <TableContainer className={classes.table}>
                        <br/>
                        <Table aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    P/CF
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Target Price (from Average of peers)</TableCell>
                                    <TableCell align="right" className={this.state.PTOCFROWS[1] < 0 ? classes.over : classes.under}>{this.state.PTOCFROWS[0]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Expected Return (% based on current price)</TableCell>
                                    <TableCell align="right" className={this.state.PTOCFROWS[1] < 0 ? classes.over : classes.under}>{this.state.PTOCFROWS[1]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.head} align="center" colSpan={2}>
                                    {this.state.PTOCFROWS[1] < 0 ? `${this.state.columns[1].name} is currently overvalued` : `${this.state.columns[1].name} is currently undervalued`}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <br/>
                    </TableContainer>
                }
            </div>
        )
    }
}

ViewResults.propTypes = {
    result: PropTypes.object.isRequired
}

export default withStyles(styles)(ViewResults);
