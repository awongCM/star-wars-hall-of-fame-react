import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router";

import "./../Grid/Grid.css";
import "./Item.css";

import * as SWAPI from "./../../services/api";
import * as localStorageService from "../../services/localStorage";
import * as stringUtil from "../../util/stringUtil";

//TODOs - to persist character trivia content data in localstorage in various scenarios when user interacts with this UI screen

const LoadingIcon = () => (
  <div className="loadingState">
    <h4 className="title">Loading</h4>
    <i className="fa fa-refresh fa-spin"></i>
  </div>
);

//TODOS - to complete the dynamic creation of trivia content
const TriviaContent = ({
  title,
  description,
  planet_id,
  homePlanet,
  filmsURL,
}) => (
  <div className="triviaContent">
    <div className="planetLink">
      <span>{title}</span>
      <br />
      <Link to={"/planet/" + planet_id} key={planet_id}>
        {homePlanet.name}
      </Link>
    </div>
    <div className="filmsList">
      <span>{description}</span>
      <br />
      <ul>
        {filmsURL.map((filmURL, index) => {
          return (
            <li key={index}>
              <Link to={"/film/" + filmURL.id} key={filmURL.id}>
                {filmURL.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);

// HOOKS
const Item = (props) => {
  const [itemsPage, setItemsPage] = useState({
    homePlanet: {},
    films: [],
    loaded: false,
    // todos for other dropdown types
    /*
    **PLANETS**
    residents, films
    **FILMS**
    characters, planets, starships
    **STARSHIPS**
    pilots, films
    */
  });

  // NB: this is actually not the latest best practiced to combine didMount and didUpdate conditional check logic here
  // have to check on the community what they say later on this useeffect design..
  const [didMount, setDidMount] = useState(false);

  //Not sure if this is good practice
  let upVote = 0 || props.characterData.up_vote;
  let downVote = 0 || props.characterData.down_vote;

  // for componentDidMount logic
  useEffect(() => {
    const { item_id, pathname } = props;
    console.log("item_id to find", item_id);

    const fetchHomePlanetAllFilms = async () => {
      const data = await localStorageService.loadClientData(pathname);
      console.log("data", data);

      //load found trivia
      if (data !== undefined) {
        console.log(
          "Found item_id: ",
          data.find((item) => item.item_id === item_id)
        );

        const item_data = await data.find((item) => item.item_id === item_id);
        console.log("about to set loaded to true...");
        setItemsPage({
          homePlanet: item_data.homePlanet,
          films: item_data.films,
          loaded: true,
        });
      } else {
        //otherwise fetch character trivia

        const { characterData } = props,
          homePlanetURL = characterData.homeworld,
          allFilmsURLs = characterData.films;

        const result = await SWAPI.requestURL(homePlanetURL);

        console.log("homePlanetURL result", result);

        const results = await Promise.all(SWAPI.requestURLs(allFilmsURLs));

        console.log("filmsURL and homePlanetURL results", result, results);

        setItemsPage({ homePlanet: result, films: results });

        // console.log("results: this.setStateAsync({homePlanet: result, films: results})");
      }
      setDidMount(true);
      console.log("didMount logic");
    };

    fetchHomePlanetAllFilms();
  }, []);

  // for componentDidUpdate
  // this code has a bug with paginating character data after item page is already mounted once!
  useEffect(() => {
    if (!didMount) {
      return;
    }

    const { loaded } = itemsPage;

    console.log("itemsPage.loaded", loaded);

    // //return if data has been found and loaded
    if (loaded) {
      return;
    }

    const { item_id, pathname } = props;

    //fetch the character trivia data from localstorage
    let prevArrayObj = localStorageService.loadClientData(pathname);

    //set to empty array if there's not stored data ib localstorage
    if (prevArrayObj === undefined) {
      prevArrayObj = [];
    }

    prevArrayObj.push({
      item_id: item_id,
      homePlanet: itemsPage.homePlanet,
      films: itemsPage.films,
    });

    // save it to localstorage with a unique key
    localStorageService.saveClientData(pathname, prevArrayObj);

    console.log("didUpdate logic for Item", item_id);
    console.log("adding items to the localstorage");
  }, [itemsPage.homePlanet, itemsPage.films, itemsPage.loaded]);

  const upVoteCharacter = (e) => {
    e.preventDefault();

    upVote++;

    calcOverallPopularity();
  };

  const downVoteCharacter = (e) => {
    e.preventDefault();

    downVote++;

    calcOverallPopularity();
  };

  const calcOverallPopularity = () => {
    let overallPopularity = Math.max(upVote - downVote, 0);
    props.reorderItemsByOverallPopularity(
      props.item_id,
      upVote,
      downVote,
      overallPopularity
    );
  };

  const { characterData } = props,
    characterUpVote = characterData.up_vote,
    characterDownVote = characterData.down_vote,
    overallPopularity = characterData.overall_vote;

  const { homePlanet, films } = itemsPage;
  const planetEndPointURL = SWAPI.planetsURL,
    filmEndPointURL = SWAPI.filmsURL;

  let planet_id = 0,
    filmsURL = [];
  const hasTriviaData = homePlanet !== {} && films.length !== 0;

  if (hasTriviaData) {
    let id_suffix = stringUtil.fetchIDSuffix(homePlanet.url, planetEndPointURL);
    planet_id = stringUtil.trimSpecialChars(id_suffix);

    // Loop through the films array
    filmsURL = films.map((film) => {
      let id_suffix = stringUtil.fetchIDSuffix(film.url, filmEndPointURL);
      let film_id = stringUtil.trimSpecialChars(id_suffix);
      film.id = film_id;
      return film;
    });
  }

  return (
    <div className="gridContainer--col flex-center">
      <div className="characterBox">
        <div className="characterBox--media flex-center">
          <img src="" alt="" />
          <Link
            to={"/people/" + props.item_id}
            className="characterLink"
            key={props.item_i}
          >
            {characterData.name}
          </Link>
          {hasTriviaData ? (
            <TriviaContent
              title={"Planet of Origin"}
              description={"Films played in"}
              planet_id={planet_id}
              homePlanet={homePlanet}
              filmsURL={filmsURL}
            />
          ) : (
            <LoadingIcon />
          )}
        </div>
        <div className="voteContainer flex-center">
          <div
            className="voteContainer--upVote flex-center"
            onClick={(e) => upVoteCharacter(e)}
          >
            <i className="em em---1"></i>
            <span className="voteCount">{characterUpVote}</span>{" "}
          </div>
          <div
            className="voteContainer--downVote flex-center"
            onClick={(e) => downVoteCharacter(e)}
          >
            <i className="em em--1"></i>
            <span className="voteCount">{characterDownVote}</span>{" "}
          </div>
        </div>
        <div className="overAllVoteContainer flex-center">
          <i className="em em-heart"></i>
          <span className="voteCount">{overallPopularity}</span>
        </div>
      </div>
    </div>
  );
};

export default Item;
