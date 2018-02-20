import React, { Component } from 'react';
import {Link} from "react-router";

import './../Grid/Grid.css';
import './Item.css';

import * as SWAPI from './../../services/api';
import * as localStorageService from '../../services/localStorage';
import * as stringUtil from '../../util/stringUtil';

//TODOs - to persist character trivia content data in localstorage in various scenarios when user interacts with this UI screen 

class Item extends Component {
	constructor(props) {
		super(props);
		//TODOS - set up another child component for trivial content
		this.state = {
			homePlanet: {},
			films: [],
			loaded: false
		};
		//Not sure if this is good practice
		this.upVote = 0;
		this.downVote = 0;
	}

	setStateAsync(state) {
		return new Promise((resolve, reject) => {
			this.setState(state, resolve);
		});
	}

	componentDidUpdate() {
		const {loaded} = this.state;

		//return if data has been found and loaded
		if (loaded) {
			return;
		}

		const { item_id, pathname } = this.props;
		
		//fetch the character trivia data from localstorage
		let prevArrayObj = localStorageService.loadClientData(pathname);

		//set to empty array if there's not stored data ib localstorage
		if(prevArrayObj === undefined) {
			prevArrayObj = [];
		}

		prevArrayObj.push({item_id: item_id, homePlanet: this.state.homePlanet, films: this.state.films });
		
		// save it to localstorage with a unique key
		localStorageService.saveClientData(pathname, prevArrayObj);

		console.log("adding items to the localstorage");
  }

	async componentDidMount() {
		const { item_id, pathname } = this.props;

		const data = await localStorageService.loadClientData(pathname);
		
		//load found trivia
		if(data !== undefined) {
			// console.log("Found item_id: ", data.find((item) => item.item_id === item_id));

			const item_data = await data.find((item) => item.item_id === item_id);
			await this.setStateAsync({homePlanet: item_data.homePlanet, films: item_data.films, loaded: true});

		} else { //otherwise fetch character trivia
		

		const { characterData } = this.props,
					homePlanetURL = characterData.homeworld,
					allFilmsURLs = characterData.films;
		
		const result = await SWAPI.requestURL(homePlanetURL);

		// console.log("homePlanetURL result", result);

		const results = await Promise.all(SWAPI.requestURLs(allFilmsURLs));

		// console.log("filmsURL and homePlanetURL results",result, results);

		await this.setStateAsync({homePlanet: result, films: results});

		// console.log("results: this.setStateAsync({homePlanet: result, films: results})");

		}
	}

	upVoteCharacter(e) {
		e.preventDefault();

		this.upVote = this.props.characterData.up_vote;
		this.upVote++;

		this.calcOverallPopularity();
	}

	downVoteCharacter(e) {
		e.preventDefault();

		this.downVote = this.props.characterData.down_vote;
		this.downVote++;

		this.calcOverallPopularity();

	}

	calcOverallPopularity() {
		
		let overallPopularity = Math.max(this.upVote - this.downVote, 0);
		this.props.reorderItemsByOverallPopularity(this.props.item_id, this.upVote, this.downVote, overallPopularity)
		
	}

	render() {

		const { characterData } = this.props,
					upVote = characterData.up_vote,
					downVote = characterData.down_vote,
					overallPopularity = characterData.overall_vote;

		const { homePlanet, films } = this.state;
		const planetEndPointURL = "https://swapi.co/api/planets/",
					filmEndPointURL = "https://swapi.co/api/film/";

		//TODO - maybe to have its own components
		const loadingState = (
				<div className="loadingState">
					<h4 className="title">Loading</h4>
					<i className="fa fa-refresh fa-spin"></i>
				</div>
		);

		let triviaContent = null;

		if (homePlanet !== {} && films.length !== 0) {
			let id_suffix = stringUtil.fetchIDSuffix(homePlanet.url, planetEndPointURL);
			let planet_id = stringUtil.trimSpecialChars(id_suffix);

			// Loop through the films array
			let filmsURL = films.map( (film) => {
				let id_suffix = stringUtil.fetchIDSuffix(film.url, filmEndPointURL);
				let film_id = stringUtil.trimSpecialChars(id_suffix);
				film.id = film_id;
				return film;
			});

			triviaContent = (
				<div className="triviaContent">
					<div className="planetLink">
						<span>Planet of Origin</span><br />
						<Link to={"/planet/"+planet_id} key={planet_id}>{homePlanet.name}</Link>
					</div>
					<div className="filmsList">
						<span>Films played in</span><br/>
						<ul>
							{
								filmsURL.map((filmURL, index) => {
									return <li key={index}><Link to={"/film/"+filmURL.id} key={filmURL.id}>{filmURL.title}</Link></li>
								})
							}
						</ul>
					</div>
				</div>
			);
		} else {
			triviaContent = loadingState;
		}
		
		return (
			<div className="gridContainer--col">
				<div className="characterBox">
					<div className="characterBox--media">
						<img src="" alt="" />
						<Link 
							to={"/people/"+this.props.item_id}
							className="characterLink"
							key={this.props.item_i}>{characterData.name}</Link>
						{triviaContent}						
					</div>
					<div className="voteContainer">
						<div className="voteContainer--upVote" onClick={this.upVoteCharacter.bind(this)}><i className="em em---1"></i><span className="voteCount">{upVote}</span> </div>
						<div className="voteContainer--downVote" onClick={this.downVoteCharacter.bind(this)}><i className="em em--1"></i><span className="voteCount">{downVote}</span> </div>
					</div>
					<div className="overAllVoteContainer"><i className="em em-heart"></i><span className="voteCount">{overallPopularity}</span></div>
				</div>
			</div>
		);
	}
}

export default Item;