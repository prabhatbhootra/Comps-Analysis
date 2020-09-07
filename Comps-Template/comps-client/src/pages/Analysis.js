import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactDataGrid from 'react-data-grid';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red } from '@material-ui/core/colors';


const styles = (theme) => ({
    ...theme.spreadIt,
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
});

/* Custom Editor to check for numeric values 

class CustomEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { number: props.value };
        this.handleChange = this.handleChange.bind(this);
    }

    getValue() {
        return { [this.props.column.key]: this.state.number };
    }
    
    getInputNode() {
        return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
    }

    handleChange(val) {
        if (val && Number.isNaN(val)) {
          return;
        } else {
            this.setState({ number: val.target.value }, () => this.props.onCommit());
        }
     
        // it is a number, so just parse it from the string if you are storing it as a number, otherwise do nothing in here.
     
        // update the state/dispatch with the new value.
    }

    render() {
        return (
            <input type="text" value={this.state.number} onChange={this.handleChange} />
        )
    }
}
*/
//let authenticated;
//if (window.location.href==='/analysis') {
    
//}

class Analysis extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            param: null,
            peers: [],
            columns: [
                { key: "name", name: "Name" }
            ],
            /*
            columns: [
                { key: "name", name: "Name", editable: true },
                { key: "eVSales", name: "EV/Sales", editable: false },
                { key: "eVEBITDA", name: "EV/EBITDA", editable: false },
                { key: "pE", name: "P/E", editable: false },
                { key: "pB", name: "P/B", editable: false },
                { key: "pCF", name: "P/Cash Flow", editable: false },
                { key: "action", name: "Action" }
            ],
            */
            rowCount: 0
        }
        this.getCellActions = this.getCellActions.bind(this);
        //this.renderTableData = this.renderTableData.bind(this);
        this.addRow = this.addRow.bind(this);
        this.setStateColsAsync = this.setStateColsAsync.bind(this);
        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isNumber = this.isNumber.bind(this);
    }

    setStateColsAsync(updatedCols) {
        new Promise((resolve) => this.setState({columns : updatedCols}, () => resolve()));
    }

    async componentDidMount() {
        const token = localStorage.FBIdToken;
        if (token === undefined) {
            this.props.history.push('/login');
            alert('Please log in.');
        }
        else if (this.props.multiples === null) {
            this.props.history.push('/');
            alert('Please select multiples before performing an analysis');
        } else {
            this.setState({param: this.props.ticker.toUpperCase()}); //Check if needs to be async
            let newCols = this.state.columns.slice();
            for (let key in this.props.multiples) {
                if (this.props.multiples[key]) {
                    if (key === "checkedEVToSales") {
                        newCols.push({key: "eVSales", name: "EV/Sales", editable: true});
                    }
                    if (key === "checkedEVToEBITDA") {
                        newCols.push({key: "eVEBITDA", name: "EV/EBITDA", editable: true});
                    }
                    if (key === "checkedPToE") {
                        newCols.push({key: "pE", name: "P/E", editable: true});
                    }
                    if (key === "checkedPToB") {
                        newCols.push({key: "pB", name: "P/B", editable: true});
                    }
                    if (key === "checkedPToCF") {
                        newCols.push({key: "pCF", name: "P/Cash Flow", editable: true});
                    }
                }
            }
            newCols.push({ key: "action", name: "Action" });
            await this.setStateColsAsync(newCols);
            let param = this.state.param;
            let stats;
            let evToSales, evToEbitda, pToE, pToB, pToCF;
            let peerlist = [];
            const response = await fetch('https://cloud.iexapis.com/stable/stock/' + param + '/peers?token=mytoken');
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                if (this.props.multiples.checkedEVToSales || this.props.multiples.checkedEVToEBITDA || this.props.multiples.checkedPToB) {
                    const multiples = await fetch('https://cloud.iexapis.com/stable/stock/' + data[i] + '/advanced-stats?token=mytoken');
                    stats = await multiples.json();
                    evToSales = stats.enterpriseValueToRevenue;
                    evToEbitda = stats.enterpriseValue/stats.EBITDA;
                    pToB = stats.priceToBook;
                }
                if (this.props.multiples.checkedPToE || this.props.multiples.checkedPToCF) {
                    const finData = await fetch('https://financialmodelingprep.com/api/v3/financial-ratios/' + data[i]);
                    const ratios = await finData.json();
                    pToE = Number(ratios.ratios[0].investmentValuationRatios.priceEarningsRatio);
                    pToCF = Number(ratios.ratios[0].investmentValuationRatios.priceCashFlowRatio);
                }
                let entry = {name: data[i]}
                for (let i = 0; i < this.state.columns.length; i++) {
                    if (this.state.columns[i].key === "eVSales") {
                        entry.eVSales = evToSales;
                    }
                    if (this.state.columns[i].key === "eVEBITDA") {
                        entry.eVEBITDA = evToEbitda;
                    }
                    if (this.state.columns[i].key === "pE") {
                        entry.pE = pToE;
                    }
                    if (this.state.columns[i].key === "pB") {
                        entry.pB = pToB;
                    }
                    if (this.state.columns[i].key === "pCF") {
                        entry.pCF = pToCF;
                    }
                }
                peerlist.push(entry);
            }
            this.setState({peers: peerlist, rowCount: peerlist.length});
        }
    }

    /*
    renderTableData() {
        return this.state.peers.map((peer, index) => {
            const { pid, name, EVSales, EVEBITDA, PE, PB, PLeveredCashFlow} = peer; //destructuring
            return (
                <tr key={pid}>
                    <td>{pid}</td>
                    <td>{name}</td>
                    <td>{EVSales}</td>
                    <td>{EVEBITDA}</td>
                    <td>{PE}</td>
                    <td>{PB}</td>
                    <td>{PLeveredCashFlow}</td>
                </tr>
            )
        });
    }
    */
    getCellActions(column, row) {
        const cellActions = [
            {
                icon: <span>Delete</span>,
                callback: () => {
                    //const rows = [...this.state.peers];
                    let arr = []
                    for (let i = 0; i < this.state.peers.length; i++) {
                        if (this.state.peers[i].name !== row.name) {
                            arr.push(this.state.peers[i])
                        }
                    }
                    this.setState({ peers: arr, rowCount: arr.length });
                }
            }
        ];
        return column.key === "action" ? cellActions : null;
    };

    isNumber(str) {
        if (typeof(str) != "string") {
            return false; // we only process strings!
        // could also coerce to string: str = ""+str
        }
        return !isNaN(str) && !isNaN(parseFloat(str))
    }
    
    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        for (let key in updated) {
            if (!this.isNumber(updated[key])) {
                return;
            }
            else {
                updated[key] = Number(updated[key])
            }
        }
        this.setState((prevState, props) => {
          const rows = prevState.peers.slice();
          for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
          }
          return { peers: rows };
        });
    };

    async addRow() {
        const validTicker = await fetch('https://cloud.iexapis.com/stable/stock/' + document.getElementsByName("addTicker")[0].value + '/quote?token=mytoken');
        if (!validTicker.ok) {
            alert('Please enter a valid ticker to be added to the peers');
            document.getElementsByName("addTicker")[0].value = "";
            return;
        }
        const multiples = await fetch('https://cloud.iexapis.com/stable/stock/' + document.getElementsByName("addTicker")[0].value + '/advanced-stats?token=mytoken');
        const stats = await multiples.json();
        let evToEbitda = stats.enterpriseValue/stats.EBITDA;
        const finData = await fetch('https://financialmodelingprep.com/api/v3/financial-ratios/' + document.getElementsByName("addTicker")[0].value);
        const ratios = await finData.json();
        let pe = Number(ratios.ratios[0].investmentValuationRatios.priceEarningsRatio);
        let pcf = Number(ratios.ratios[0].investmentValuationRatios.priceCashFlowRatio);
        let data = this.state.peers;
        data.push({ name: document.getElementsByName("addTicker")[0].value.toUpperCase(), eVSales: stats.enterpriseValueToRevenue, eVEBITDA: evToEbitda, pE: pe, pB: stats.priceToBook, pCF: pcf });
        this.setState({peers: data, rowCount: data.length});
        document.getElementsByName("addTicker")[0].value = "";
    }

    handleSubmit() {
        /*
        for (let i = 0; i < this.state.peers.length; i++) {
            for (let key in this.state.peers[i]) {
                if (key !== 'name') {
                    if (typeof(this.state.peers[i][key]) !== "number") {
                        alert('Please make sure the data in the grid has no alphanumeric strings');
                        return;
                    }
                }
            }
        }
        */
        this.props.callBackForPeerData(this.state.peers);
        this.props.history.push('/results');
        //console.log(this.state.peers);  //
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="PeersList">
                <Card className={classes.root}>
                    <div className={classes.details}>
                        <CardHeader
                            title="Steps to perform a new analysis:"
                            subheader="To add a new company to the data grid of peers enter a valid ticker and click on the add row button.
                            To remove a company from the data grid click on the delete icon in the last column of the data grid. Data values can
                            be edited with new values as needed. Once you are satisfied with the list of peer companies in the data grid you can
                            click on the button to proceed to the results of the analysis."
                        />
                    </div>
                    <div>
                        <br/>
                        <div><span>Enter Stock Ticker to be added to peers for analysis:</span></div>
                        <div><Input type="text" name="addTicker"/></div>
                        <div><Button variant="contained" color="primary" className={classes.button} onClick ={this.addRow}>Add row</Button></div>
                        <br/>
                    </div>
                </Card>
                <br/>
                { this.state.peers.length > 0 ?
                    <ReactDataGrid
                        columns={this.state.columns}
                        rowGetter={i => this.state.peers[i]}
                        rowsCount={this.state.rowCount}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true} 
                        getCellActions = {this.getCellActions}
                    />
                    :
                    <CircularProgress />
                }
                <br/>
                { this.state.peers.length > 0 ?
                    <Button type="submit" variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
                        Proceed to Results page 
                    </Button>
                    :
                    null
                }
            </div>
        );
    }
}

Analysis.propTypes = {
    multiples: PropTypes.object.isRequired,
    callBackForPeerData: PropTypes.func.isRequired,
    ticker: PropTypes.string.isRequired
}

export default withStyles(styles)(Analysis);
