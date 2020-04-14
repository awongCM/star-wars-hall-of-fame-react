// TODO - to DRY up our detail component for other pages
import React, { Component } from "react";
import { Link } from "react-router";

import "./DetailPlanet.css";
import * as localStorageService from "../../services/localStorage";

class DetailPlanet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homePlanetData: {},
      homePlanetComments: [],
    };
  }

  componentDidMount() {
    const availableClientData = this.loadPersistedClientData();

    if (availableClientData !== undefined) {
      this.setState({
        homePlanetData: availableClientData.homePlanetData,
        homePlanetComments: availableClientData.homePlanetComments,
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
    fetch(`https://swapi.dev/api/planets/${param_index}?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((myJSON) => {
        return this.refineData(myJSON);
      })
      .then((refinedCharData) => {
        self.setState({ homePlanetData: refinedCharData });
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

    this.state.homePlanetComments.push(comment);
    this.setState({ homePlanetComments: this.state.homePlanetComments }, () =>
      this.persistsClientData()
    );

    this.refs.commentInput.value = "";
  }

  persistsClientData() {
    const { pathname } = this.props.location;

    const mergedData = Object.assign(
      {},
      { homePlanetData: this.state.homePlanetData },
      { homePlanetComments: this.state.homePlanetComments }
    );

    localStorageService.saveClientData(pathname, mergedData);
  }

  render() {
    const homePlanetData = this.state.homePlanetData;
    const comments = this.state.homePlanetComments.map((item, i) => {
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
            <h1 className="title">{homePlanetData.name}</h1>
            <p>Rotation Period: {homePlanetData.rotation_period}</p>
            <p>Orbital Period: {homePlanetData.mass}</p>
            <p>Diameter: {homePlanetData.diameter}</p>
            <p>Climate: {homePlanetData.climate}</p>
            <p>Gravity: {homePlanetData.gravity}</p>
            <p>Surface water: {homePlanetData.surface_water}</p>
            <p>Population: {homePlanetData.population}</p>
          </div>

          <div className="commentInputContainer">
            <textarea
              ref="commentInput"
              placeholder="Enter your comments for this planet! :)"
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

export default DetailPlanet;
