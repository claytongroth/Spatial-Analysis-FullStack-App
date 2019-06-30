import React from "react";


class Query extends React.Component {
  click = (e) => {
    e.preventDefault();
    this.props.parentClick(e);
  }
  change = (e) => {
    this.props.parentChange(e);
  }
  selectChange = (e) => {
    this.props.parentSelect(e);
  }
  interpolateMe = (e) => {
    this.props.parentInterpolate(e);
  }
  regressionMe = (e) => {
    this.props.parentRegression(e);
  }
  componentDidMount(){
    console.log("rendered Add")
  }
  render(){
    return (
    <div className="col-md-12">

      <h3 id="tabtitle" className="text-center">
        Perform Spatial Analyis
      </h3>
      <form className="form-horizontal">
        <fieldset>
          {/* Text input*/}
          <div className="form-group">
          {
            //<label  className="col-md-12 control-label" htmlFor="Universal Product Code">Parameter:</label>
          }
            <div className="col-md-12">
            {
              //<input onChange={(e)=>this.change(e)} className="form-control input-md" id="Universal Product Code" name="Universal Product Code" placeholder="Enter Spatial Analysis Parameter Here" type="text" />
            }
            </div>
          </div>{/* Search input*/}
          <div className="form-group">
            <label className="col-md-12 control-label" htmlFor="Submit" />
            <hr/>
            <div className="row">
              <div className="col-md-6">
                <p>Step 1: Interpolate the well Nitrate Data</p>
                  <input onChange={(e) => this.change(e)} className="form-control input-md" id="KM" name="KM" placeholder="Interpolation Dist. (20)" type="search" />
                  <input onChange={(e) => this.change(e)} className="form-control input-md" id="IDW" name="IDW" placeholder="IDW Dist. (1)" type="search" />
                  <select id="selectInt" onChange={(e) => this.selectChange(e)}>
                    <option>hex</option>
                    <option>square</option>
                    <option>triangle</option>
                  </select>
                {
                this.props.wellData.length > 0 ?
                  <button className="btn btn-primary" id="Submit" name="interpolate" onClick={(e)=>this.interpolateMe(e)}>Interpolate Well Data<br/> And Aggregate Cancer Data</button>
                :
                  <button className="btn btn-warning" id="NotAvail" name="NotAvail">Not Available</button>
                }
                <p>Step 2: Aggregate & perform regression analyis</p>
                {
                this.props.rready === true ?
                  <button className="btn btn-primary" id="Submit" name="regression" onClick={(e)=>this.regressionMe(e)}>Aggregate & Run Regression</button>
                :
                  <button className="btn btn-warning" id="NotAvail" name="NotAvail">Not Available</button>
                }
              </div>
              <div className="col-md-6">
                <div id="statsheader"> Regression Result (r2 value):
                  <hr id="hrs"/>
                  Interpolated Polygons: <div id="r2">{this.props.regression}</div>
                  <hr id="hrs"/>
                  Tracts Polygons: <div id="r2">{this.props.regression_straight}</div>
                </div>
              </div>

            </div>
            <hr id="hrs"/>
            <div className="row">
              <div className="col-md-12">
                <a className="btn btn-primary" target="_blank" id="Submit" href={this.props.interpolate} download="interpolate.geojson">Download GeoJSON</a>
                <button className="btn btn-warning" id="Clear" name="Clear">Clear</button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
}

export default Query;
