import React from "react";
//model the other ones like this one.
// on submit they will fire the function and then a modal window will pop up.
// https://react-bootstrap.github.io/components/modal/

//intergrate the functionality of the Delete Data button with the handleSubmit
class Delete extends React.Component {
  click = (e) => {
    e.preventDefault();
    this.props.parentClick(e);
  }
  change = (e) => {
    this.props.parentChange(e);
  }
  componentDidMount(){
    console.log("rendered Delete")
  }
  render(){
  return (
    <div className="col-md-12">
      <h3 className="text-center">
        Delete a Product
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
            <label className="col-md-12 control-label" htmlFor="Submit" />
            <div className="col-md-12">
              <button className="btn btn-primary" id="Submit" name="Submit" onClick={(e) => this.click(e)}>Submit for Deletion</button> <button className="btn btn-warning" id="Clear" name="Clear">Clear</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
}

export default Delete;
