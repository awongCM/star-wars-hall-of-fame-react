import React, { Component } from 'react';
import {Link} from "react-router";

import './../Grid/Grid.css';
import './Item.css';

import * as SWAPI from './../../services/api';

class Item extends Component {
	constructor(props) {
		super(props);
		//TODO
		this.state = {
			homePlanet: {},
			films: []
		}
		//Not sure if this is good practice
		this.upVote = 0;
		this.downVote = 0;
	}

	setStateAsync(state) {
		return new Promise((resolve, reject) => {
			this.setState(state, resolve);
		});
	}

	async componentDidMount() {
		console.log("sure did mount before render()");

		const { characterData } = this.props,
					homePlanetURL = characterData.homeworld,
					allFilmsURLs = characterData.films;
		
		const result = await SWAPI.requestURL(homePlanetURL);

		console.log("homePlanetURL result", result);

		await this.setStateAsync({homePlanet: result });
		
		const results = await Promise.all(SWAPI.requestURLs(allFilmsURLs));

		console.log("filmsURL results", results);

		await this.setStateAsync({films: results});
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

		const itemInfo = this.props.characterData,
			  upVote = itemInfo.up_vote,
			  downVote = itemInfo.down_vote,
			  overallPopularity = itemInfo.overall_vote,
				totalFilms = itemInfo.films;

		const { homePlanet, films } = this.state;
		
		return (
			<div className="gridContainer--col">
				<div className="characterBox">
					<div className="characterBox--media">
						<img src="" alt="" />
						<Link 
							to={"/people/"+this.props.item_id}
							className="characterLink"
							key={this.props.item_i}>{itemInfo.name}</Link>
						<div className="planetLink">
							<span>Planet of Origin</span><br />
							<a href={homePlanet.url}>{homePlanet.name}</a>
						</div>
						<div className="filmsList">
							<span>Films played in</span><br/>
							<ul>
								{
									films.map( (film, index) => {
										return <li key={index}><a href={film.url}>{film.title}</a></li>
									})
								}
							</ul>
						</div>						
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