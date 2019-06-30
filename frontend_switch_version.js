// /client/App.js
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import axios from "axios";
import Map from './Map';
import Query from './Query.js';
import AddUpdate from './Add.js';
import Delete from './Delete.js';
import './bootstrap.css';
import './style.css'


class MainApp extends React.Component {
  constructor(props, context) {
  super(props, context);
    this.state = {
      modalShow: false,
      modalMessage: "",
      gtin: null,
      mlocation: null,
      prodName: null,
      editorName: null,
      brandName: null,
      data: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.DeleteComponent = () => {
      return (
        <Delete parentChange={(e)=>this.handleChange(e)} parentClick={(e)=>this.deleteFromDB(e)} />
      );
    };
    this.AddUpdateComponent = () => {
      return (
        <AddUpdate parentChange={(e)=>this.handleChange(e)} parentClickAdd={(e)=>this.putDataToDB(e)} parentClickUpdate={(e)=>this.updateDB(e)} />
      );
    };
    this.QueryComponent = () => {
      return (
        <Query parentChange={(e)=>this.handleChange(e)} parentClick={(e)=>this.handleSubmit(e)} />
      );
    };
  }
  handleSubmit(e){
    e.preventDefault();
    let mongoQuery = "?id=" + this.state.gtin.toString();
    this.getDataFromDb(mongoQuery);
    console.log("submited: ", mongoQuery)
  }
  handleChange(e){
    let field = e.target.name;
    let value = e.target.value;
    console.log(field + " changed");
    if (field === "Universal Product Code"){this.setState({gtin: value})};
    if (field === "Manufacturing Location"){this.setState({mlocation: value})};
    if (field === "Product Name"){this.setState({prodName: value})};
    if (field === "Editor Name"){this.setState({editorName: value})};
    if (field === "Brand Name"){this.setState({brandName: value})};
  }

  componentDidMount() {
  }
  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
  }

  // our first get method that uses our backend api to
  // fetch data from our database
  getDataFromDb = (query) => {
    let url = "http://localhost:27017/api/getData" + query
    console.log("getDataFromDb Fired with URL: ", url)
    fetch(url) //  Query format here: fetch("http://localhost:27017/api/getData" + "?id=234234324342&brands=Taste%20Adventure")"?id=0000000035590&brands=Taste%20Adventure"
    //.then(data => data.text()).then(data => console.log(data))
    .then(data => data.json())
    .then(answer => this.setState({ data: answer },
      this.state.data.length == 0 ? this.showModal("query", null, "There is no record matching the ID you entered.") : console.log("Queried record: ", this.state.data[0])
    ));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  // update page after or just modal?
  putDataToDB = () => {
    let id = this.state.gtin;
    let brand = this.state.brandName;
    let manu = this.state.mlocation;
    let prod = this.state.prodName;
    let editor = this.state.editorName;
    let url = "http://localhost:27017/api/putData"
    axios.post(url, {
      id: id,
      brands: brand,
      manufacturing_places: manu,
      product_name: prod,
      last_editor: editor
    }).then(res => {
       res.data.errmsg ?  this.showModal("add", null, res.data.errmsg) : this.showModal("add", JSON.parse(res.config.data).product_name)
     });
  };
  //config.data
  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = () => {
    let id = this.state.gtin;
    let brand = this.state.brandName;
    let manu = this.state.mlocation;
    let prod = this.state.prodName;
    let editor = this.state.editorName;
    let url = "http://localhost:27017/api/updateData";
    axios.post(url, {
      id: id,
      brands: brand,
      manufacturing_places: manu,
      product_name: prod,
      last_editor: editor
    }).then(res => {
      console.log(res)
       res.data.errmsg ? this.showModal("update", null, res.data.errmsg) : this.showModal("update", res.data.value.product_name + " Updated existing: " + res.data.lastErrorObject.updatedExisting)
       //res.data.lastErrorObject.updatedExisting
     });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = () => {
    console.log("Try to delete: ", this.state.gtin)
    let url = "http://localhost:27017/api/deleteData";
    let idToDelete = this.state.gtin;
    axios.delete(url, {
      data: {
        id: idToDelete
      }
    }).then(res => {
      res.data.value == null ? this.showModal("delete", null, "Possible non-existent ID") : this.showModal("delete", res.data.value.product_name) })
  };
  //operation, product_name
  //catch the ret as well
  showModal = (operation, product_name, err) => {
    console.log(err)
    let message;
    if (typeof product_name !== 'undefined' && product_name !== null){
      switch(operation){
        case "add":
          message = "Succesfully Added Product: " + product_name
          break;
        case "update":
          message = "Succesfully Updated Product: " + product_name
          break;
        case "delete":
          message = "Succesfully Deleted Product: " + product_name
          break;
      }
    } else {
      switch(operation){
        case "add":
          message = "There was an issue adding the product. " + err
          break;
        case "update":
          message = "There was an issue updating the product. " + err
          break;
        case "delete":
          message = "There was an issue deleting the product. " + err
          break;
        case "query":
          message = "There was an issue querying the product. " + err
          break;
      }
    }
    this.setState({ modalMessage: message });
    this.setState({ modalShow: true });
  }

  hideModal = () =>{
    this.setState({ modalShow: false });
  }
  render() {
   return (
      <div>
      <Modal show={this.state.modalShow} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nosh</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.modalMessage}</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" id="ok" name="ok" onClick={this.hideModal}>Ok</button>
        </Modal.Footer>
      </Modal>
      <Router>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <div className="container-fluid">
        <Link to={'/'}>Query Existing</Link>
        <Link to={'/addUpdate'}>Add/Update Data</Link>
        <Link to={'/delete'}>Delete Data</Link>
          <div className="row">
              <Switch>
                  <Route exact path='/' component={this.QueryComponent} />
                  <Route exact path='/addUpdate' component={this.AddUpdateComponent} />
                  <Route exact path='/delete' component={this.DeleteComponent} />
              </Switch>
            <div className="col-md-8">
                <Map markerPosition={this.state.data[0] ? this.state.data[0].manufacturing_places: "places here"} test ={this.state.data} />
            </div>
          </div>
        </div>

      </Router>
      </div>
    );
  }
};

export default MainApp;
