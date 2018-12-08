import React, { Component } from 'react';
import './Form.css';

class Form extends Component {
	
	handleCharacterFilter(e) {
		this.props.onHandleCharacterFilter(e.target.value);
	}

	render() {
		return (
			<div className="formContainer">
	          <form action="" id="form" className="formContainer--formControl">
	            <label htmlFor="inputControl" className="formContainer--searchLabel">Filter By Character Name:</label>
							{/* TODO - select dropdown */}
							<select className="formContainer--selectControl">
								<option>Character</option> 
								<option>Planet</option> 
								<option>Movie</option>
							</select>
	            <input type="text" id="inputControl" className="formContainer--textControl" onChange={this.handleCharacterFilter.bind(this)} />
	          </form>
	        </div>
		);
	}
}

export default Form;