import React, { Component } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Panel, DropdownButton, MenuItem } from 'react-bootstrap';

import Axios from 'axios';
import * as d3 from 'd3';
import {LineChart} from 'react-d3-basic';

import Spinner from '../misc/Spinner';

const apiKey = 'demo';


class Chart extends Component {
    constructor() {
        super();

        this.values = [
            {id: '1. open', name: 'Open'},
            {id: '2. high', name: 'High'},
            {id: '3. low', name: 'Low'},
            {id: '4. close', name: 'Close'},
            {id: '5. volume', name: 'Volume'},
        ];

        this.state = {
            stockData: null,
            stockDataFiltered: null,
            startDate: d3.timeDay.offset(new Date(), -7),
            selectedFilter: 'WEEK',
            selectedValue: this.values[0],
            error: null,
        };

        this.getStockData = this.getStockData.bind(this);
        this.setTimeFilter = this.setTimeFilter.bind(this);
        this.filterStockData = this.filterStockData.bind(this);

        this.getStockData();
    }

    getStockData(symbol='MSFT') {
        const response = Axios.get(
            'http://www.alphavantage.co/query',
            {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: symbol,
                    outputsize: 'full',
                    apikey: apiKey,
                },
            }
        );
        response
            .then((response) => {
                let formatted = Array.from(Object.entries(response.data['Time Series (Daily)']), (value, key) => {
                    let item = value[1];
                    item.time = value[0];
                    return item;
                });
                this.setState({
                    stockData: formatted,
                });
                this.filterStockData(this.state.startDate);
            })
            .catch((error) => {
                this.setState({error: 'Data Server Error'});
            });
    }

    setTimeFilter(time) {
        let startDate = null;
        switch (time) {
            case 'WEEK':
                startDate = d3.timeWeek.offset(new Date(), -1);
                this.setState({
                    startDate: startDate,
                    selectedFilter: time,
                });
                this.filterStockData(startDate);
                break;
            case 'MONTH':
                startDate = d3.timeMonth.offset(new Date(), -1);
                this.setState({
                    startDate: startDate,
                    selectedFilter: time,
                });
                this.filterStockData(startDate);
                break;
            case 'YEAR':
                startDate = d3.timeYear.offset(new Date(), -1);
                this.setState({
                    startDate: startDate,
                    selectedFilter: time,
                });
                this.filterStockData(startDate);
                break;
            case 'MAX':
                startDate = null;
                this.setState({
                    startDate: startDate,
                    selectedFilter: null,
                });
                this.filterStockData(startDate);
                break;
            default:
                break;
        }
    }

    filterStockData(startDate) {
        if (startDate) {
            this.setState((prevState) => ({
                stockDataFiltered: prevState.stockData.filter((item) => {
                    return d3.timeParse('%Y-%m-%d')(item.time) >= startDate;
                })
            }));
        } else {
            this.setState({
                stockDataFiltered: this.state.stockData,
            });
        }
    }

    render() {
        const data = this.state.stockDataFiltered;
        let chart;
        if (data) {
            const yDomain = d3.extent(data.slice(), (d) => {
                return parseInt(d[this.state.selectedValue.id], 10);
            });
            yDomain[0] = Math.floor(yDomain[0] * 0.9);
            yDomain[1] = Math.ceil(yDomain[1] * 1.1);
            chart = (
                <LineChart
                    width={1000} height={500}
                    margins={{left: 100, right: 100, top: 0, bottom: 50}}
                    data={data}
                    chartSeries={[
                        {
                            field: this.state.selectedValue.id,
                            name: this.state.selectedValue.name,
                            color: '#2DA0BC'
                        }
                    ]}
                    x={(d) => {
                        return d3.timeParse('%Y-%m-%d')(d.time)
                    }}
                    xScale="time"
                    yDomain={yDomain}
                    showLegend={false}
                />
            );
        }

        const header = <h3>Stock Chart</h3>;

        const timeFilterControls = (
            <div className="pull-left">
                <ButtonGroup>
                    <Button
                        onClick={() => this.setTimeFilter('WEEK')}
                        active={this.state.selectedFilter === 'WEEK'}
                    >
                        Week
                    </Button>
                    <Button
                        onClick={() => this.setTimeFilter('MONTH')}
                        active={this.state.selectedFilter === 'MONTH'}
                    >
                        Month
                    </Button>
                    <Button
                        onClick={() => this.setTimeFilter('YEAR')}
                        active={this.state.selectedFilter === 'YEAR'}
                    >
                        Year
                    </Button>
                    <Button
                        onClick={() => this.setTimeFilter('MAX')}
                        active={!this.state.selectedFilter}
                    >
                        Max
                    </Button>
                </ButtonGroup>
            </div>
        );

        const valueControls = (
            <div className="pull-right">
                <DropdownButton title={this.state.selectedValue.name} id='values-control-dropdown'
                                dropup={true} pullRight={true}>
                    {this.values.map((v, k) => {
                        return (
                            <MenuItem
                                key={v.id}
                                active={this.state.selectedValue.id === v.id}
                                eventKey={k}
                                onSelect={(eventKey) => {
                                    this.setState({selectedValue: this.values[eventKey]});
                                }}
                            >
                                {v.name}
                            </MenuItem>
                        );
                    })}
                </DropdownButton>
            </div>
        );

        const footer = (
            <ButtonToolbar>
                {timeFilterControls}
                {valueControls}
            </ButtonToolbar>
        );

        const errorUi = (
            <div>
                <p>{this.state.error}</p>
                <Button
                    bsStyle="primary"
                    onClick={() => {
                        this.getStockData();
                        this.setState({error: null});
                    }}
                >
                    Retry
                </Button>
            </div>
        );

        let content;
        if (this.state.error) {
            content = errorUi;
        } else {
            if (chart) {
                content = chart;
            } else {
                content = <Spinner />;
            }
        }

        return (
            <div className="Chart">
                <Panel
                    header={header}
                    footer={chart ? footer : null}
                >
                    {content}

                </Panel>
            </div>
        );
    }
}

export default Chart