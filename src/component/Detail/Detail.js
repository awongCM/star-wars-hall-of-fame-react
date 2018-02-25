import React, { Component } from 'react';
import {Link} from "react-router";

import './Detail.css';
import * as localStorageService from '../../services/localStorage';

class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			characterData: {},
			characterComments: []
		};
	}

	componentDidMount() {

		const availableClientData = this.loadPersistedClientData();

		if (availableClientData !== undefined) {
			this.setState({
				characterData: availableClientData.characterData, 
				characterComments: availableClientData.characterComments
			});
		}
		else { // we have nothing to begin with
			this.fetchData();
		}
	}

	loadPersistedClientData() {
		 //our key value to fetch and store locals
		const { pathname } = this.props.location;
		
		console.log('loadClientData', localStorageService.loadClientData(pathname));
		return localStorageService.loadClientData(pathname);
	}

	fetchData() {
	    let self = this;

	    //there's not zero-based index search for character api
			let param_index = parseInt(this.props.params.id) + 1;
			
			//For some reason - you have to explicitly pass query params instead of using headers
	    fetch(`https://swapi.co/api/people/${param_index}?format=json`
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
		this.setState({characterComments: this.state.characterComments}, () => this.persistsClientData());

		this.refs.commentInput.value = "";
	}

	persistsClientData() {
		const {pathname} = this.props.location;
		
		const mergedData = Object.assign({}, 
			{characterData: this.state.characterData}, 
			{characterComments: this.state.characterComments}
		);

		localStorageService.saveClientData(pathname, mergedData);
	}

	render() {

		const characterData = this.state.characterData;
		const comments = this.state.characterComments.map((item, i) => {
			return (<div key={i} className="comment">{item}</div>)
		});

		const heading = (comments.length) ? <h4 className="heading">Comments</h4> : '';

		return (
			<div>
				<Link 
					to={"/"}
					className="returnHomePage"><i className="em em-back"></i></Link>

				<div className="detailContainer">
					<div className="detailContainer--media flex-center"><img src="" alt="" /></div>
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