import React, { Component } from 'react';
import {Link} from "react-router";

import './Detail.css';

class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			characterData: {},
			characterComments: []
		}
	}

	componentDidMount() {
	    this.fetchData();    
	}

	fetchData() {
	    let initHeaders = {
	          method: 'GET',
	          cache: 'default',
	          accept: 'application/json'
	    };
	    let self = this;

	    //there's not zero-based index search for character api
	    let param_index = parseInt(this.props.params.id) + 1;

	    fetch(`http://swapi.co/api/people/${param_index}`, initHeaders
	      ).then((response) => {
	        return response.json();
	      }).then((myJSON) => {
	      	return this.refineData(myJSON);
	      }).then((refinedCharData) => {
	        self.setState({characterData: refinedCharData});
	        console.log(refinedCharData);
	      });
	}

	refineData(parsedData) {
	    
	   parsedData.comments = [];
	   return parsedData;
	}

	saveComment(e) {
		let comment = this.refs.commentInput.value;

		//we don't want any empty comments to save
		if(comment === "") {
			return;
		}

		this.state.characterComments.push(comment);
		this.setState({characterComments: this.state.characterComments});
		this.refs.commentInput.value = "";
	}

	render() {

		const characterData = this.state.characterData;
		const comments = this.state.characterComments.map((item, i) => {
			return (<div key={i} className="comment">{item}</div>)
		});

		const heading = (comments.length) ? <h4 class="heading">Comments</h4> : '';

		return (
			<div>
				<Link 
					to={"/"}
					className="returnHomePage">Go Back</Link>

				<div className="detailContainer">
					<div className="detailContainer--media"><img src="" alt="" /></div>
					<div className="detailContainer--description">
						<h1 className="title">{characterData.name}</h1>
						<p>Height: {characterData.height}</p>
						<p>Mass: {characterData.mass}</p>
						<p>Hair Color: {characterData.hair_color}</p>
						<p>Skin Color: {characterData.skin_color}</p>
						<p>Eye Color: {characterData.eye_color}</p>
						<p>YOB: {characterData.birth_year}</p>
						<p>Gender: {characterData.gender}</p>
					</div>
					
					<div className="commentInputContainer">
						<textarea ref="commentInput" placeholder="Enter your comments for this hero/villian! :)" cols="30" rows="5" ></textarea>
						<button onClick={this.saveComment.bind(this)}>Save</button>
					</div>
					<div className="commentSection">
						{heading}
						{comments}
					</div>
				</div>
			</div>
			
		);
	}
}

export default Detail;