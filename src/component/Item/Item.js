import React, { Component } from 'react';
import {Link} from "react-router";

import './../Grid/Grid.css';
import './Item.css';

class Item extends Component {
	constructor(props) {
		super(props);
		//TODO
		this.state = {
			homePlanet: ""
		}
		//Not sure if this is good practice
		this.upVote = 0;
		this.downVote = 0;
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
			  overallPopularity = itemInfo.overall_vote;
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
							<a href={itemInfo.homeworld}>{itemInfo.homeworld}</a>
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