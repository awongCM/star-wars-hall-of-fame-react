import React from "react";
import "./Form.css";

const Form = ({ onHandleCharacterFilter, onHandleDropdownQueryType }) => {
  const handleCharacterFilter = (e) => {
    onHandleCharacterFilter(e.target.value);
  };

  const handleDropdownQueryType = (e) => {
    onHandleDropdownQueryType(e.target.value);
  };

  /**
   * TEACHING NOTE - Controlled Components:
   * 
   * The dropdown is now a "controlled component":
   * - Its value is tied to React state (in Home component)
   * - onChange events update that state
   * - State changes trigger re-renders and new data fetches
   * 
   * This is React's declarative approach vs imperative DOM manipulation.
   */

  return (
    <div className="formContainer">
      <form action="" id="form" className="formContainer--formControl">
        <label htmlFor="selectControl" className="formContainer--searchLabel">
          Resource Type:
        </label>
        <select
          id="selectControl"
          className="formContainer--selectControl"
          onChange={handleDropdownQueryType}
          defaultValue="people"
        >
          <option value="people">Characters</option>
          <option value="planets">Planets</option>
          <option value="films">Films</option>
          <option value="starships">Starships</option>
        </select>
        
        <label htmlFor="inputControl" className="formContainer--searchLabel">
          Filter By Name:
        </label>
        <input
          type="text"
          id="inputControl"
          className="formContainer--textControl"
          onChange={handleCharacterFilter}
          placeholder="Search..."
        />
      </form>
    </div>
  );
};

export default Form;
