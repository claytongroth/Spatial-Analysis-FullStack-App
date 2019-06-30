// /client/App.js
import React, { Component } from "react";
import axios from "axios";
import Frontend from "./frontend";

class OldApp extends Component {
  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  // There will be a query form. On submit, we will fire the get data function and populate the state.

  // there will be a button which will launch get data and set variables to query
  render() {
    return (
      <div className="col">
        <h1 style={{textAlign:"center", fontSize: "300%", marginBottom: "30px"}}>Cancer-Nitrate Spatial Analysis</h1>
        <Frontend/>
      </div>
    );
  }
}

export default OldApp;
