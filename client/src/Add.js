import React from "react";

class AddUpdate extends React.Component {
  clickAdd = (e) => {
    e.preventDefault();
    this.props.parentClickAdd(e);
  }
  clickUpdate = (e) => {
    e.preventDefault();
    this.props.parentClickUpdate(e);
  }
  change = (e) => {
    this.props.parentChange(e);
  }
  componentDidMount(){
    //console.log("rendered Add")
  }
  render(){
    return (
    <div className="col-md-12">
      <h3 className="text-center">
        Add or Update a Product
      </h3>
      <form className="form-horizontal">
        <fieldset>
          {/* Text input*/}
          <div className="form-group">
            <label className="col-md-12 control-label" htmlFor="Universal Product Code">Universal Product Code</label>
            <div className="col-md-12">
              <input onChange={(e) => this.change(e)} className="form-control input-md" id="Universal Product Code" name="Universal Product Code" placeholder="(GTIN-12)" type="text" />
            </div>
          </div>{/* Search input*/}
          <div className="form-group">
            <label className="col-md-12 control-label" htmlFor="Manufacturing Location">Manufacturing Location</label>
            <div className="col-md-12">
              <input onChange={(e) => this.change(e)} className="form-control input-md" id="Manufacturing Location" name="Manufacturing Location" placeholder="Address" type="search" />
            </div>
          </div>{/* Select Multiple */}
          <div className="form-group">
            <label className="col-md-12 control-label" htmlFor="Ingredients">Product Name</label>
            <div className="col-md-12">
              <input onChange={(e) => this.change(e)} className="form-control input-md" id="Manufacturing Location" name="Product Name" placeholder="Hershey's Kiss" type="search" />
            </div>
          </div>{/* Multiple Checkboxes */}
          <div className="form-group">
            <label className="col-md-12 control-label" htmlFor="Ingredients">Brand Name</label>
            <div className="col-md-12">
              <input onChange={(e) => this.change(e)} className="form-control input-md" id="Manufacturing Location" name="Brand Name" placeholder="Hershey" type="search" />
            </div>
          </div>{/* Multiple Checkboxes */}
          <div className="form-group">
            <label className="col-md-12 control-label" htmlFor="Universal Product Code">Editor Name</label>
            <div className="col-md-12">
              <input onChange={(e) => this.change(e)} className="form-control input-md" id="Universal Product Code" name="Editor Name" placeholder="Joe Schmoe" type="text" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-12 control-label" htmlFor="Submit" />
            <div className="col-md-12">
              <button className="btn btn-primary" id="Submit" name="Submit" onClick={(e) => this.clickAdd(e)}>Add Data</button> <button className="btn btn-primary" id="Submit" name="Submit" onClick={(e) => this.clickUpdate(e)}>Update Data</button> <button className="btn btn-warning" id="Clear" name="Clear">Clear</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
  }
}

export default AddUpdate;
