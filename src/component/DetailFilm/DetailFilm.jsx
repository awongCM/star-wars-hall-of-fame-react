// TODO - to DRY up our detail component for other pages
import React, { Component, useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import "./DetailFilm.css";
import * as localStorageService from "../../services/localStorage";

const DetailFilm = (props) => {
  const [detailFilmPage, setDetailFilmPage] = useState({
    filmData: {},
    filmComments: [],
  });

  const commentInput = useRef(null);

  const loadPersistedClientData = () => {
    //our key value to fetch and store locals
    const { pathname } = props.location;

    console.log("loadClientData", localStorageService.loadClientData(pathname));
    return localStorageService.loadClientData(pathname);
  };

  const refineData = (parsedData) => {
    parsedData.comments = [];
    return parsedData;
  };
  const fetchData = () => {
    //there's not zero-based index search for character api
    let param_index = parseInt(props.params.id) + 1;

    //For some reason - you have to explicitly pass query params instead of using headers
    fetch(`https://swapi.dev/api/films/${param_index}?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((myJSON) => {
        return refineData(myJSON);
      })
      .then((refinedCharData) => {
        setDetailFilmPage({ ...detailFilmPage, filmData: refinedCharData });

        console.log(refinedCharData);
      });
  };

  useEffect(() => {
    const availableClientData = loadPersistedClientData();

    if (availableClientData !== undefined) {
      setDetailFilmPage({
        filmData: availableClientData.filmData,
        filmComments: availableClientData.filmComments,
      });
    } else {
      // we have nothing to begin with
      fetchData();
    }
  }, []);

  const saveComment = (e) => {
    let comment = commentInput.current.value;

    //we don't want any empty comments to save
    if (comment === "") {
      return;
    }

    const { filmComments } = detailFilmPage;

    commentInput.current.value = "";

    const newFilmComments = [...filmComments];
    newFilmComments.push(comment);

    setDetailFilmPage({ ...detailFilmPage, filmComments: newFilmComments });
  };

  useEffect(() => {
    persistsClientData();
  }, [detailFilmPage.filmComments]);

  const persistsClientData = () => {
    const { pathname } = props.location;

    const mergedData = Object.assign(
      {},
      { filmData: detailFilmPage.filmData },
      { filmComments: detailFilmPage.filmComments }
    );

    localStorageService.saveClientData(pathname, mergedData);
  };

  const { filmData, filmComments } = detailFilmPage;

  const comments = (filmComments || []).map((item, i) => {
    return (
      <div key={i} className="comment">
        {item}
      </div>
    );
  });

  const heading = comments.length ? <h4 className="heading">Comments</h4> : "";

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
          <button onClick={() => saveComment()}>Save</button>
        </div>
        <div className="commentSection">
          {heading}
          {comments}
        </div>
      </div>
    </div>
  );
};

export default DetailFilm;
