import React, { Component } from 'react';
import { Grid, Row, Col, Label } from 'react-bootstrap';

import logo from './logo.png';
import './App.css';

import Chart from './chart/Chart'


class App extends Component {
    render() {
        return (
            <div className="App">
                <Grid fluid={true}>
                    <Row>
                        <Col>
                            <div className="App-header">
                                <img src={logo} className="App-logo" alt="logo" />
                                <h2>Stock Chart</h2>
                                <p className="Sub-header"><Label>test assignment</Label></p>
                            </div>
                            <Grid>
                                <Row>
                                    <Col>
                                        <Chart/>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default App;
