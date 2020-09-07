import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import axios from 'axios';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';

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

/*
const token = localStorage.FBIdToken;
if(!token){
    //const decodedToken = jwtDecode(token);
    this.props.history.push('/login');
    alert('Please log in');
}
*/

class Results extends Component {
    constructor(props, context) {
        super(props, context);
        this.EVTOSALESROWS = [];
        this.EVTOEBITDAROWS = [];
        this.PTOEROWS = [];
        this.PTOBROWS = [];
        this.PTOCFROWS = [];
        this.state = {
            columns: [
                { key: "data", name: "" }
            ],
            rows: [],
            /*
            rows: [
                { data: "Current Price", targetCompany: this.props.ticker, Peer1: "GOOGL", Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "Shares Outstanding", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "Total Debt", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "Cash and Cash Equivalents", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "Sales", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "EBITDA", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "Net Income", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "Book Value", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
                { data: "Operating Cash Flow", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'}
            ],
            */
            rowCount: 0,
            EVTOSALES: false,
            //EVTOSALESROWS: null,
            EVTOEBITDA: false,
            //EVTOEBITDAROWS: null,
            PTOE: false,
            //PTOEROWS: null,
            PTOB: false,
            //PTOBROWS: [],
            PTOCF: false,
            loading: false
            //PTOCFROWS: null
            /*
            rows2: [
                { data: "EV", targetCompany: this.props.ticker, Peer1: 'GOOGL', Peer2: 'BB', Peer3: 'HPQ', Peer4: 'IBM'},
            ]
            */
        }
        this.setStateColsAsync = this.setStateColsAsync.bind(this);
        this.setStateRowsAsync = this.setStateRowsAsync.bind(this);
        this.setStateLoadingAsync = this.setStateLoadingAsync(this);
        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
        //this.getEVTOSALESROWS = this.getEVTOSALESROWS.bind(this);
        //this.getEVTOEBITDAROWS = this.getEVTOEBITDAROWS.bind(this);
        //this.getPTOEROWS = this.getPTOEROWS.bind(this);
        //this.getPTOBROWS = this.getPTOBROWS.bind(this);
        //this.getPTOCFROWS = this.getPTOCFROWS.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePostRequest = this.handlePostRequest.bind(this);
    }

    setStateColsAsync(updatedCols) {
        new Promise((resolve) => this.setState({columns : updatedCols}, () => resolve()));
    }

    setStateRowsAsync(updatedRows) {
        new Promise((resolve) => this.setState({rows : updatedRows}, () => resolve()));
    }

    setStateLoadingAsync(newload) {
        new Promise((resolve) => this.setState({loading : newload}, () => resolve()));
    }

    async componentDidMount() {
        //console.log(this.props.data);
        //console.log(this.props.ticker);
        const token = localStorage.FBIdToken;
        if (token === undefined) {
            this.props.history.push('/login');
            alert('Please log in.');
        } else if (this.props.data === null || this.props.ticker === null) {
            this.props.history.push('/');
            alert('Please select multiples and peers before performing an analysis');
        } else {
            let newCols = this.state.columns.slice();
            newCols.push({key: "targetCompany", name: `${this.props.ticker}`, editable: true})
            for (let i = 0; i < this.props.data.length; i++) {
                newCols.push({key: `Peer${i + 1}`, name: `Peer ${i + 1}`, editable: true});
            }
            await this.setStateColsAsync(newCols);
            /* Add tables for each individual multiple 
            for (let i = 0; i < this.props.data.length; i++) {
                if (this.props.data[i].hasOwnProperty('eVSales')) {
                    this.setState({EVTOSALES: true});
                }
                if (this.props.data[i].hasOwnProperty('eVEBITDA')) {
                    this.setState({EVTOEBITDA: true});
                }
                if (this.props.data[i].hasOwnProperty('pE')) {
                    this.setState({PTOE: true});
                }
                if (this.props.data[i].hasOwnProperty('pB')) {
                    this.setState({PTOB: true});
                }
                if (this.props.data[i].hasOwnProperty('pCF')) {
                    this.setState({PTOCF: true});
                }
            }
            */

            let tickerData = {};
            const price = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.ticker + '/price?token=mytoken');
            const priceData = await price.json();
            const sharesOutstanding = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.ticker + '/stats/sharesOutstanding?token=mytoken');
            const sharesOutstandingData = await sharesOutstanding.json();
            const totalDebt = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.ticker + '/financials?period=annual&token=mytoken');
            const one = await totalDebt.json();
            const totalDebtData = one.financials[0].totalDebt;
            const totalCashData = one.financials[0].totalCash;
            const totalRevenueData = one.financials[0].totalRevenue;
            const ebitda = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.ticker + '/advanced-stats?token=mytoken');
            const two = await ebitda.json();
            const ebitdaData = two.EBITDA;
            const netIncome = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.ticker + '/income?token=mytoken');
            const three = await netIncome.json();
            const netIncomeData = three.income.netIncomeBasic;
            const bookValue = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.ticker + '/balance-sheet?token=mytoken');
            const four = await bookValue.json()
            const bookValueData = four.balancesheet[0].netTangibleAssets;
            const cashFlow = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.ticker + '/cash-flow?token=mytoken');
            const five = await cashFlow.json();
            const cashFlowData = five.cashflow[0].cashFlow;
            tickerData.currentPrice = priceData;
            tickerData.sharesOutstanding = sharesOutstandingData;
            tickerData.totalDebt = totalDebtData;
            tickerData.totalCash = totalCashData;
            tickerData.Sales = totalRevenueData;
            tickerData.EBITDA = ebitdaData;
            tickerData.netIncome = netIncomeData;
            tickerData.bookValue = bookValueData;
            tickerData.cashFlow = cashFlowData;
            
            let peerData = []
            for (let i = 0; i < this.props.data.length; i++) {
                let stockData = {};
                const price = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.data[i].name + '/price?token=mytoken');
                const priceData = await price.json();
                const sharesOutstanding = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.data[i].name + '/stats/sharesOutstanding?token=mytoken');
                const sharesOutstandingData = await sharesOutstanding.json();
                const totalDebt = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.data[i].name + '/financials?period=annual&token=mytoken');
                const one = await totalDebt.json();
                const totalDebtData = one.financials[0].totalDebt;
                const totalCashData = one.financials[0].totalCash;
                const totalRevenueData = one.financials[0].totalRevenue;
                const ebitda = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.data[i].name + '/advanced-stats?token=mytoken');
                const two = await ebitda.json();
                const ebitdaData = two.EBITDA;
                const netIncome = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.data[i].name + '/income?token=mytoken');
                const three = await netIncome.json();
                const netIncomeData = three.income.netIncomeBasic;
                const bookValue = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.data[i].name + '/balance-sheet?token=mytoken');
                const four = await bookValue.json()
                const bookValueData = four.balancesheet[0].netTangibleAssets;
                const cashFlow = await fetch('https://cloud.iexapis.com/stable/stock/' + this.props.data[i].name + '/cash-flow?token=mytoken');
                const five = await cashFlow.json();
                const cashFlowData = five.cashflow[0].cashFlow;
                stockData.currentPrice = priceData;
                stockData.sharesOutstanding = sharesOutstandingData;
                stockData.totalDebt = totalDebtData;
                stockData.totalCash = totalCashData;
                stockData.Sales = totalRevenueData;
                stockData.EBITDA = ebitdaData;
                stockData.netIncome = netIncomeData;
                stockData.bookValue = bookValueData;
                stockData.cashFlow = cashFlowData;
                peerData.push(stockData);
            }
            let rowlist = [];
            let pricerow = {data: "Current Price", targetCompany: tickerData.currentPrice ? tickerData.currentPrice : 0};
            let sharesoutstandingrow = { data: "Shares Outstanding", targetCompany: tickerData.sharesOutstanding ? tickerData.sharesOutstanding : 0};
            let debtrow = { data: "Total Debt", targetCompany: tickerData.totalDebt ? tickerData.totalDebt : 0};
            let cashrow = { data: "Cash and Cash Equivalents", targetCompany: tickerData.totalCash ? tickerData.totalCash : 0};
            let salesrow = { data: "Sales", targetCompany: tickerData.Sales ? tickerData.Sales : 0};
            let ebitdarow = { data: "EBITDA", targetCompany: tickerData.EBITDA ? tickerData.EBITDA : 0};
            let netincomerow = { data: "Net Income", targetCompany: tickerData.netIncome ? tickerData.netIncome : 0};
            let bookvaluerow = { data: "Book Value", targetCompany: tickerData.bookValue ? tickerData.bookValue : 0};
            let cashflowrow = { data: "Operating Cash Flow", targetCompany: tickerData.cashFlow ? tickerData.cashFlow : 0};
            for (let i = 0; i < this.props.data.length; i++) {
                let key = `Peer${i + 1}`;
                pricerow[`${key}`] = peerData[i].currentPrice ? peerData[i].currentPrice : 0;
                sharesoutstandingrow[`${key}`] = peerData[i].sharesOutstanding ? peerData[i].sharesOutstanding : 0;
                debtrow[`${key}`] = peerData[i].totalDebt ? peerData[i].totalDebt : 0;
                cashrow[`${key}`] = peerData[i].totalCash ? peerData[i].totalCash : 0;
                salesrow[`${key}`] = peerData[i].Sales ? peerData[i].Sales : 0;
                ebitdarow[`${key}`] = peerData[i].EBITDA ? peerData[i].EBITDA : 0;
                netincomerow[`${key}`] = peerData[i].netIncome ? peerData[i].netIncome : 0;
                bookvaluerow[`${key}`] = peerData[i].bookValue ? peerData[i].bookValue : 0;
                cashflowrow[`${key}`] = peerData[i].cashFlow ? peerData[i].cashFlow : 0;
            }
            rowlist.push(pricerow);
            rowlist.push(sharesoutstandingrow);
            rowlist.push(debtrow);
            rowlist.push(cashrow);
            rowlist.push(salesrow);
            rowlist.push(ebitdarow);
            rowlist.push(netincomerow);
            rowlist.push(bookvaluerow);
            rowlist.push(cashflowrow);
            await this.setStateRowsAsync(rowlist);
        }
        /* Add code to update rows of datagrid */
    }

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState((prevState, props) => {
          const rows = prevState.rows.slice();
          for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
          }
          return { rows: rows };
        });
    };

    getEVTOSALESROWS = () => {
        const { classes } = this.props;
        let totalEVSales = 0.0;
        let avgEVSales, targetCurrentPrice, targetSales, targetDebt, targetCash, targetSharesOutstanding, targetEV, targetPrice, expectedReturn;
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].eVSales !== 0.0) {
                totalEVSales = totalEVSales + this.props.data[i].eVSales;
            }
        }
        avgEVSales = totalEVSales/this.props.data.length;
        for (let r = 0; r < this.state.rows.length; r++) {
            if (this.state.rows[r].data === "Current Price") {
                targetCurrentPrice = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Shares Outstanding") {
                targetSharesOutstanding = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Total Debt") {
                targetDebt = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Cash and Cash Equivalents") {
                targetCash = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Sales") {
                targetSales = this.state.rows[r].targetCompany*1.0;
            }
        }
        targetEV = avgEVSales*targetSales;
        targetPrice = (targetEV + targetCash - targetDebt)/targetSharesOutstanding;
        expectedReturn = ((targetPrice - targetCurrentPrice)*100.0)/targetCurrentPrice;
        this.EVTOSALESROWS = [targetEV, targetPrice, expectedReturn];
        if (expectedReturn < 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell> Estimated Enterprise Value (from Average of peers)</TableCell>
                        <TableCell align="right">{targetEV}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Target Price (from Estimated EV)</TableCell>
                        <TableCell align="right" className={classes.over}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.over}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        } else {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell> Estimated Enterprise Value (from Average of peers)</TableCell>
                        <TableCell align="right">{targetEV}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Target Price (from Estimated EV)</TableCell>
                        <TableCell align="right" className={classes.under}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.under}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }
        
        // set global variable for EVSALESROWS
    }

    getEVTOEBITDAROWS = () => {
        const { classes } = this.props;
        let totalEVEBITDA = 0.0;
        let avgEVEBITDA, targetCurrentPrice, targetEBITDA, targetDebt, targetCash, targetSharesOutstanding, targetEV, targetPrice, expectedReturn;
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].eVEBITDA !== 0.0) {
                totalEVEBITDA = totalEVEBITDA + this.props.data[i].eVEBITDA;
            }
        }
        avgEVEBITDA = totalEVEBITDA/this.props.data.length;
        for (let r = 0; r < this.state.rows.length; r++) {
            if (this.state.rows[r].data === "Current Price") {
                targetCurrentPrice = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Shares Outstanding") {
                targetSharesOutstanding = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Total Debt") {
                targetDebt = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Cash and Cash Equivalents") {
                targetCash = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "EBITDA") {
                targetEBITDA = this.state.rows[r].targetCompany*1.0;
            }
        }
        targetEV = avgEVEBITDA*targetEBITDA;
        targetPrice = (targetEV + targetCash - targetDebt)/targetSharesOutstanding;
        expectedReturn = ((targetPrice - targetCurrentPrice)*100.0)/targetCurrentPrice;
        this.EVTOEBITDAROWS = [targetEV, targetPrice, expectedReturn];
        if (expectedReturn < 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Estimated Enterprise Value (from Average of peers)</TableCell>
                        <TableCell align="right">{targetEV}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Target Price (from Estimated EV)</TableCell>
                        <TableCell align="right" className={classes.over}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.over}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        } else {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Estimated Enterprise Value (from Average of peers)</TableCell>
                        <TableCell align="right">{targetEV}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Target Price (from Estimated EV)</TableCell>
                        <TableCell align="right" className={classes.under}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.under}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }
        //set global variable EVEBITDAROWS
    }

    getPTOEROWS = () => {
        const { classes } = this.props;
        let totalPE = 0.0;
        let avgPE, targetCurrentPrice, targetNetIncome, targetSharesOutstanding, targetEPS, targetPrice, expectedReturn;
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].pE !== 0.0) {
                totalPE = totalPE + this.props.data[i].pE;
            }
        }
        avgPE = totalPE/this.props.data.length;
        for (let r = 0; r < this.state.rows.length; r++) {
            if (this.state.rows[r].data === "Current Price") {
                targetCurrentPrice = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Shares Outstanding") {
                targetSharesOutstanding = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Net Income") {
                targetNetIncome = this.state.rows[r].targetCompany*1.0;
            }
        }
        targetEPS = targetNetIncome/targetSharesOutstanding;
        targetPrice = avgPE*targetEPS;
        expectedReturn = ((targetPrice - targetCurrentPrice)*100.0)/targetCurrentPrice
        this.PTOEROWS = [targetPrice, expectedReturn];
        if (expectedReturn < 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Target Price (from Average of peers)</TableCell>
                        <TableCell align="right" className={classes.over}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.over}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        } else {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Target Price (from Average of peers)</TableCell>
                        <TableCell align="right" className={classes.under}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.under}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }
        //set global variable for PTOEROWS
    }

    getPTOBROWS = () => {
        const { classes } = this.props;
        let totalPB = 0.0;
        let avgPB, targetCurrentPrice, targetBookValue, targetSharesOutstanding, targetBookValuePerShare, targetPrice, expectedReturn;
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].pB !== 0.0) {
                totalPB = totalPB + this.props.data[i].pB;
            }
        }
        avgPB = totalPB/this.props.data.length;
        for (let r = 0; r < this.state.rows.length; r++) {
            if (this.state.rows[r].data === "Current Price") {
                targetCurrentPrice = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Shares Outstanding") {
                targetSharesOutstanding = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Book Value") {
                targetBookValue = this.state.rows[r].targetCompany*1.0;
            }
        }
        targetBookValuePerShare = targetBookValue/targetSharesOutstanding;
        targetPrice = avgPB*targetBookValuePerShare;
        expectedReturn = ((targetPrice - targetCurrentPrice)*100.0)/targetCurrentPrice;
        this.PTOBROWS = [targetPrice, expectedReturn];
        if (expectedReturn < 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Target Price (from Average of peers)</TableCell>
                        <TableCell align="right" className={classes.over}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.over}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        } else {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Target Price (from Average of peers)</TableCell>
                        <TableCell align="right" className={classes.under}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.under}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }
        //set global variable for PTOBROWS
    }

    getPTOCFROWS = () => {
        const { classes } = this.props;
        let totalPCF = 0.0;
        let avgPCF, targetCurrentPrice, targetOperatingCashFlow, targetSharesOutstanding, targetOperatingCashFlowPerShare, targetPrice, expectedReturn;
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].pCF !== 0.0) {
                totalPCF = totalPCF + this.props.data[i].pCF;
            }
        }
        avgPCF = totalPCF/this.props.data.length;
        for (let r = 0; r < this.state.rows.length; r++) {
            if (this.state.rows[r].data === "Current Price") {
                targetCurrentPrice = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Shares Outstanding") {
                targetSharesOutstanding = this.state.rows[r].targetCompany*1.0;
            }
            if (this.state.rows[r].data === "Operating Cash Flow") {
                targetOperatingCashFlow = this.state.rows[r].targetCompany*1.0;
            }
        }
        targetOperatingCashFlowPerShare = targetOperatingCashFlow/targetSharesOutstanding;
        targetPrice = avgPCF*targetOperatingCashFlowPerShare;
        expectedReturn = ((targetPrice - targetCurrentPrice)*100.0)/targetCurrentPrice;
        this.PTOCFROWS = [targetPrice, expectedReturn];
        if (expectedReturn < 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Target Price (from Average of peers)</TableCell>
                        <TableCell align="right" className={classes.over}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.over}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        } else {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell>Target Price (from Average of peers)</TableCell>
                        <TableCell align="right" className={classes.under}>{targetPrice}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Expected Return (% based on current price)</TableCell>
                        <TableCell align="right" className={classes.under}>{expectedReturn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.head} align="center" colSpan={2}>
                        {expectedReturn < 0 ? `${this.props.ticker} is currently overvalued` : `${this.props.ticker} is currently undervalued`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }
        //set global variable for PTOCFROWS
    }

    handleSubmit() {
        //save table data
        console.log()
        if (this.props.data[0].hasOwnProperty('eVSales')) {
            this.setState({EVTOSALES: true});
        }
        if (this.props.data[0].hasOwnProperty('eVEBITDA')) {
            this.setState({EVTOEBITDA: true});
        }
        if (this.props.data[0].hasOwnProperty('pE')) {
            this.setState({PTOE: true});
        }
        if (this.props.data[0].hasOwnProperty('pB')) {
            this.setState({PTOB: true});
        }
        if (this.props.data[0].hasOwnProperty('pCF')) {
            this.setState({PTOCF: true});
        }
    }

    handlePostRequest() {
        this.setState({loading: true});
        if (document.getElementsByName("saveResults")[0] && document.getElementsByName("saveResults")[0].value) {
            let stockanalysis = {};
            stockanalysis.columns = this.state.columns;
            stockanalysis.rows = this.state.rows;
            if (this.EVTOSALESROWS.length > 0) {
                stockanalysis.EVTOSALESROWS = this.EVTOSALESROWS;
            }
            if (this.EVTOEBITDAROWS.length > 0) {
                stockanalysis.EVTOEBITDAROWS = this.EVTOEBITDAROWS;
            }
            if (this.PTOEROWS.length > 0) {
                stockanalysis.PTOEROWS = this.PTOEROWS;
            }
            if (this.PTOBROWS.length > 0) {
                stockanalysis.PTOBROWS = this.PTOBROWS;
            }
            if (this.PTOCFROWS.length > 0) {
                stockanalysis.PTOCFROWS = this.PTOCFROWS;
            }
            let payload = {
                name: document.getElementsByName("saveResults")[0].value,
                analysis: stockanalysis
            }
            axios.post('/result', payload)
                .then(res => {
                    console.log(res.data);
                    //localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
                    //this.props.history.push('/login');
                    this.setState({loading: false});
                    alert('Result has been saved. Return to home to view results');
                    document.getElementsByName("saveResults")[0].value = "";
                })
                .catch(err => {
                    console.error(err);
                    this.setState({loading: false});
                    alert('Session has timed out. Please sign out and login again');
                })
        } else {
            this.setState({loading: false});
            alert('Please enter a name to be used for saving the results of the analysis');
        }
    }

    render() {
        const { classes } = this.props;
        const { loading } = this.state;
        return (
            <div>
                {this.state.rows.length > 0 ? 
                    <div>
                        <ReactDataGrid
                            columns={this.state.columns}
                            rowGetter={i => this.state.rows[i]}
                            rowsCount={this.state.rows.length}
                            onGridRowsUpdated={this.onGridRowsUpdated}
                            enableCellSelect={true}
                        />
                        <Button type="submit" variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
                            Proceed With results of analysis
                        </Button>
                    </div>
                    :
                    <CircularProgress />
                }
                
                {/* Table with denominators of selected multiples in data prop */} 
                { this.state.EVTOSALES &&
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
                            {this.getEVTOSALESROWS()}
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.EVTOEBITDA &&
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
                            {this.getEVTOEBITDAROWS()}
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.PTOE &&
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
                            {this.getPTOEROWS()}
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.PTOB &&
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
                            {this.getPTOBROWS()}
                        </Table>
                        <br/>
                    </TableContainer>
                }
                { this.state.PTOCF &&
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
                            {this.getPTOCFROWS()}
                        </Table>
                        <br/>
                    </TableContainer>
                }
                {/* set state from global variables then post request from handlePostRequest */}
                {this.state.EVTOSALES || this.state.EVTOEBITDA || this.state.PTOE || this.state.PTOB || this.state.PTOCF ?
                    <div>
                        <Card className={classes.root}>
                            <div>
                                <CardHeader
                                    title="Saving results of analysis:"
                                    subheader="Enter name to be used for saving these results:"
                                />
                                
                                <div className={classes.space}>
                                    <Input type="text" name="saveResults" id="outlined-secondary" label="Outlined secondary" variant="outlined" color="secondary"/>
                                    {/*<TextField
                                        id="outlined-name"
                                        name="saveResults"
                                        className={classes.space}
                                        margin="normal"
                                        variant="outlined"
                                    />*/}
                                </div>
                                <div className={classes.space}>
                                    <Button type="submit" variant="contained" color="primary" className={classes.button} onClick={this.handlePostRequest} disabled={loading}>
                                        Save Results of Analysis
                                        {loading && (
                                            <CircularProgress size={30} className={classes.progress}/>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

Results.propTypes = {
    data: PropTypes.array,
    ticker: PropTypes.string
}

export default withStyles(styles)(Results);
