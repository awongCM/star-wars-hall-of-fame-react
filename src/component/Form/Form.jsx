import React, { Component } from "react";
import "./Form.css";

class Form extends Component {
  handleCharacterFilter(e) {
    this.props.onHandleCharacterFilter(e.target.value);
  }

  handleDropdownQueryType(e) {
    this.props.onHandleDropdownQueryType(e.target.value);
  }

  render() {
    return (
      <div className="formContainer">
        <form action="" id="form" className="formContainer--formControl">
          <label htmlFor="inputControl" className="formContainer--searchLabel">
            Filter By:
          </label>
          <select
            className="formContainer--selectControl"
            onChange={this.handleDropdownQueryType.bind(this)}
          >
            <option value="people" selected>
              Character
            </option>
            <option value="planets">Planet</option>
            <option value="films">Movie</option>
            <option value="starships">Starship</option>
          </select>
          <input
            type="text"
            id="inputControl"
            className="formContainer--textControl"
            onChange={this.handleCharacterFilter.bind(this)}
          />
        </form>
      </div>
    );
  }
}

export default Form;
