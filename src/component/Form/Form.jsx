import React from "react";
import "./Form.css";

const Form = ({ onHandleCharacterFilter, onHandleDropdownQueryType }) => {
  const handleCharacterFilter = (e) => {
    onHandleCharacterFilter(e.target.value);
  };

  const handleDropdownQueryType = (e) => {
    onHandleDropdownQueryType(e.target.value);
  };

  return (
    <div className="formContainer">
      <form action="" id="form" className="formContainer--formControl">
        <label htmlFor="inputControl" className="formContainer--searchLabel">
          Filter By:
        </label>
        {/* TODO - hide for now until the other url routes are getting to work */}
        {/* <select
        className="formContainer--selectControl"
        onChange={this.handleDropdownQueryType.bind(this)}
      >
        <option value="people" selected>
          Character
        </option>
        <option value="planets">Planet</option>
        <option value="films">Movie</option>
        <option value="starships">Starship</option>
      </select> */}
        <input
          type="text"
          id="inputControl"
          className="formContainer--textControl"
          onChange={handleCharacterFilter}
        />
      </form>
    </div>
  );
};

export default Form;
