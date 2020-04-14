// TODO - to DRY up our detail component for other pages
import React, { Component } from "react";
import { Link } from "react-router";

import "./DetailFilm.css";
import * as localStorageService from "../../services/localStorage";

class DetailFilm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filmData: {},
      filmComments: [],
    };
  }

  componentDidMount() {
    const availableClientData = this.loadPersistedClientData();

    if (availableClientData !== undefined) {
      this.setState({
        filmData: availableClientData.filmData,
        filmComments: availableClientData.filmComments,
      });
    } else {
      // we have nothing to begin with
      this.fetchData();
    }
  }

  loadPersistedClientData() {
    //our key value to fetch and store locals
    const { pathname } = this.props.location;

    console.log("loadClientData", localStorageService.loadClientData(pathname));
    return localStorageService.loadClientData(pathname);
  }

  fetchData() {
    let self = this;

    //there's not zero-based index search for character api
    let param_index = parseInt(this.props.params.id);

    //For some reason - you have to explicitly pass query params instead of using headers
    fetch(`https://swapi.dev/api/films/${param_index}?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((myJSON) => {
        return this.refineData(myJSON);
      })
      .then((refinedCharData) => {
        self.setState({ filmData: refinedCharData });
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
    if (comment === "") {
      return;
    }

    this.state.filmComments.push(comment);
    this.setState({ filmComments: this.state.filmComments }, () =>
      this.persistsClientData()
    );

    this.refs.commentInput.value = "";
  }

  // TODO - persist client data regardless whether comments are provided.
  persistsClientData() {
    const { pathname } = this.props.location;

    const mergedData = Object.assign(
      {},
      { filmData: this.state.filmData },
      { filmComments: this.state.filmComments }
    );

    localStorageService.saveClientData(pathname, mergedData);
  }

  render() {
    const filmData = this.state.filmData;
    const comments = this.state.filmComments.map((item, i) => {
      return (
        <div key={i} className="comment">
          {item}
        </div>
      );
    });

    const heading = comments.length ? (
      <h4 className="heading">Comments</h4>
    ) : (
      ""
    );

    return (
      <div>
        <Link to={"/"} className="returnHomePage">
          <i className="em em-back"></i>
        </Link>

        <div className="detailContainer">
          <div className="detailContainer--media flex-center">
            <img src="" alt="" />
          </div>
          <div className="detailContainer--description">
            <h1 className="title">{filmData.title}</h1>
            <p>Director: {filmData.director}</p>
            <p>Producer: {filmData.producer}</p>
            <p>Episode Number: {filmData.episode_id}</p>
            <p>Opening Crawl: {filmData.opening_crawl}</p>
            <p>Release Date: {filmData.release_date}</p>
          </div>

          <div className="commentInputContainer">
            <textarea
              ref="commentInput"
              placeholder="Enter your comments for this film! :)"
              cols="30"
              rows="5"
            ></textarea>
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

export default DetailFilm;
