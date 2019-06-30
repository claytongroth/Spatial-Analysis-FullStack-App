// /client/App.js
import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import axios from "axios";
import MyMap from './Map';
import Spinner from './spinner.js';
import { Map, Marker, TileLayer, GeoJSON, Circle, Popup, FeatureGroup, CircleMarker, Polygon, LayersControl } from 'react-leaflet';
import Query from './Query.js';
import AddUpdate from './Add.js';
import Delete from './Delete.js';
import regression from 'regression';
import * as turf from '@turf/turf'
//import {booleanTouches} from "@turf/turf"
import './bootstrap.css';
import './style.css'


class MainApp extends React.Component {
  constructor(props, context) {
  super(props, context);
    this.state = {
      loading: false,
      modalShow: false,
      modalMessage: "",
      data: [],
      well:[],
      tracts: [],
      county: [],
      km: 20,
      IDW: 1,
      shape: "hex",
      interpolate: false,
      regressionResults: [],
      regressionResults_straight: [],
      interpolationResults: [],
      regressionReady: false
    };
  }
  handleSubmit(e){
    e.preventDefault();
  }
  makeInterpolation(){
    this.setState({loading: true})
    const wells = turf.featureCollection(this.state.well)
    const tracts = turf.featureCollection(this.state.tracts)
    const centroids = [];
    turf.featureEach(tracts, function (currentFeature, featureIndex) {
      const featureToPush = turf.centroid(currentFeature)
      featureToPush.properties = {cancer: currentFeature.properties.canrate}
      centroids.push(featureToPush)
      //=featureIndex
    });
    //console.log(wells)
    const options = {gridType: this.state.shape, property: 'nitr_ran', weight: this.state.IDW};
    const grid = turf.interpolate(wells, this.state.km, options);
    const pointsFC = turf.featureCollection(centroids)
    const polyFC = turf.featureCollection(grid.features)
    const collected = turf.collect(polyFC, pointsFC, 'cancer', 'cancerVals');

    //console.log(grid)
    const interpolation = collected.features.map(
      x => {
        const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length
        const filteredVals = x.properties.cancerVals.filter(x => !isNaN(x))
        x.properties.canceravg = average(filteredVals)
        if (isNaN(x.properties.canceravg)){
          x.properties.canceravg = 0
        }
        const pos = x.geometry.coordinates[0].map(x => {return [x[1],x[0]]})
        //console.log(x)
        return <Polygon
                positions={pos}
                fillColor= "#F4E9BD"
                color= "#FFA500"
                opacity= {.8}
                weight= {1}
                attribution={x.properties}
              >
              <Popup>Nitrate: {x.properties.nitr_ran} <br/> Aggregate Cancer Rate: {x.properties.canceravg}</Popup>
              </Polygon>
          //poly.addTo(Window.map)
      }
    )
    this.setState({loading: false})
    return [interpolation, grid, collected]
  }

  handleChange(e){
    let field = e.target.name;
    let value = e.target.value;
    if (field === "KM"){
      this.setState({km: value})
    }
    if (field === "IDW"){
      this.setState({IDW: value})
    }

  }
  handleSelect(e){
    e.preventDefault();
    console.log(e.target.value);
    this.setState({shape: e.target.value});
  }
  handleInterpolate(e){
    e.preventDefault();
    this.setState({
      interpolate: true,
      regressionReady: true
    });
  }
  handleAggregate(e){
    e.preventDefault();
    this.setState({aggregate: true});
    //make aggregate array from honeycomb data and tracts
    //iterate through tracts, if touches
  }
  handleRegression(e){
    e.preventDefault();
    const tracts = this.state.tracts
    const interPolygons = this.makeInterpolation()[2].features
    //console.log(interPolygons)
    const regressionArray =[];
    const regressionArray2 =[];
    const length = tracts.length < interPolygons.length ? tracts.length : interPolygons.length
    for(let i=0; i<length; i++){
      if (!isNaN(interPolygons[i].properties.canceravg) && interPolygons[i].properties.canceravg !== 0){
        regressionArray.push([interPolygons[i].properties.canceravg, interPolygons[i].properties.nitr_ran])
      }
    }
    for(let i=0; i<length; i++){
      regressionArray2.push([tracts[i].properties.canrate, tracts[i].properties.nitrate])
    }
    console.log(regressionArray)
    const result = regression.linear(regressionArray);
    const result_straight = regression.linear(regressionArray2);
    //console.log(result)
    this.setState({
      regressionResults: result.r2,
      regressionResults_straight:  result_straight.r2
    })
  }


  componentDidMount() {
    this.getData();
  }
  getData = () => {
    //this.setState([{loading: true}])
    this.getWellDataFromDb();
    this.getTractsDataFromDb();
    this.getCountyDataFromDb()
  }
  done = () => {
    this.setState({loading: false})
  }
  notDone = () =>{
    this.setState({loading: true})
  }
  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
  }

  // our first get method that uses our backend api to
  // fetch data from our database
  getWellDataFromDb = () => {
    this.setState({loading: true})
    let url = "http://localhost:27017/api/getWellData"
    console.log("getWellDataFromDb Fired with URL: ", url)
    fetch(url) //  Query format here: fetch("http://localhost:27017/api/getData" + "?id=234234324342&brands=Taste%20Adventure")"?id=0000000035590&brands=Taste%20Adventure"
    //.then(data => data.text()).then(data => console.log(data))
    .then(data => data.json())
    .then(answer => this.setState({
          well: answer,
          loading:false
    },
      //console.log("getWellDataFromDb answer here :",answer),
      answer.length == 0 ? this.showModal("query", null, "There is no record matching the ID you entered.") : console.log("getWellDataFromDb Queried record: ", answer)//,
      //this.makeGeoJSON(answer)
    ));
  };
  getTractsDataFromDb = () => {
    this.setState({loading: true})
    let url = "http://localhost:27017/api/getTractsData"
    console.log("getTractsDataFromDb Fired with URL: ", url)
    fetch(url) //  Query format here: fetch("http://localhost:27017/api/getData" + "?id=234234324342&brands=Taste%20Adventure")"?id=0000000035590&brands=Taste%20Adventure"
    //.then(data => data.text()).then(data => console.log(data))
    .then(data => data.json())
    .then(answer => this.setState({
        tracts: answer,
        loading: false
     },
      //console.log("getTractsDataFromDb answer here :",answer),
      answer.length == 0 ? this.showModal("query", null, "There is no record matching the ID you entered.") : console.log("getTractsDataFromDb Queried record: ", answer)
    ));
  };
  getCountyDataFromDb = () => {
    this.setState({loading: true})
    let url = "http://localhost:27017/api/getCountyData"
    console.log("getCountyDataFromDb Fired with URL: ", url)
    fetch(url) //  Query format here: fetch("http://localhost:27017/api/getData" + "?id=234234324342&brands=Taste%20Adventure")"?id=0000000035590&brands=Taste%20Adventure"
    //.then(data => data.text()).then(data => console.log(data))
    .then(data => data.json())
    .then(answer => this.setState({
        county: answer,
        loading: false
    },
      //console.log("getCountyDataFromDb answer here :",answer),
      answer.length == 0 ? this.showModal("query", null, "There is no record matching the ID you entered.") : console.log("getCountyDataFromDb Queried record: ", answer)
    ));
  };
  render() {
   return (
      <div>
      <Modal show={this.state.modalShow} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.modalMessage}</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" id="ok" name="ok" onClick={this.hideModal}>Ok</button>
        </Modal.Footer>
      </Modal>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <div className="container-fluid">
          <div className="row">
          <div className="col-md-4">
          <Tabs defaultActiveKey="query" id="uncontrolled-tab-example">
            <Tab eventKey="query" title="Spatial Analyis">
            { this.state.loading? <div id="mspinner"><Spinner/></div>:
              <Query
                loading = {this.state.loading}
                wellData={this.state.well}
                parentChange={(e)=>this.handleChange(e)}
                parentClick={(e)=>this.handleSubmit(e)}
                parentSelect={(e)=>this.handleSelect(e)}
                parentInterpolate={(e)=>this.handleInterpolate(e)}
                parentRegression={(e)=>this.handleRegression(e)}
                regression = {this.state.regressionResults}
                regression_straight = {this.state.regressionResults_straight}
                rready={this.state.regressionReady}
              />
            }
            </Tab>
          </Tabs>
          </div>
            <div className="col-md-8">
                {this.state.loading ? <div id="mspinner"><Spinner/></div> : null}
                {this.state.well && this.state.county && this.state.tracts &&
                <MyMap
                  notDone={()=>this.notDone()}
                  done={()=>this.done()}
                  well={this.state.well}
                  km = {this.state.km}
                  IDW = {this.state.IDW}
                  county ={this.state.county}
                  tracts={this.state.tracts}
                  interpolate = {this.state.interpolate}
                  interpolatefunction = {()=>this.makeInterpolation()[0]}
                />}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MainApp;
