// TODO - to DRY up our detail component for other pages
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";

import "./DetailPlanet.css";
import * as localStorageService from "../../services/localStorage";

// hooks
const DetailPlanet = (props) => {
  const [detailPlanetPage, setDetailPlanetPage] = useState({
    homePlanetData: {},
    homePlanetComments: [],
  });

  const commentInput = useRef(null);

  const loadPersistedClientData = useCallback(() => {
    //our key value to fetch and store locals
    const { pathname } = props.location;

    console.log("loadClientData", localStorageService.loadClientData(pathname));
    return localStorageService.loadClientData(pathname);
  }, [props.location]);

  const refineData = useCallback((parsedData) => {
    parsedData.comments = [];
    return parsedData;
  }, []);

  const fetchData = useCallback(() => {
    //there's not zero-based index search for character api
    let param_index = parseInt(props.params.id, 10) + 1;

    //For some reason - you have to explicitly pass query params instead of using headers
    fetch(`https://swapi.dev/api/planets/${param_index}?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((myJSON) => {
        return refineData(myJSON);
      })
      .then((refinedCharData) => {
        setDetailPlanetPage((prevState) => ({
          ...prevState,
          homePlanetData: refinedCharData,
        }));

        console.log(refinedCharData);
      });
  }, [props.params.id, refineData]);

  useEffect(() => {
    const availableClientData = loadPersistedClientData();

    if (availableClientData !== undefined) {
      setDetailPlanetPage({
        homePlanetData: availableClientData.homePlanetData,
        homePlanetComments: availableClientData.homePlanetComments,
      });
    } else {
      // we have nothing to begin with
      fetchData();
    }
  }, [loadPersistedClientData, fetchData]);

  const saveComment = (e) => {
    let comment = commentInput.current.value;

    //we don't want any empty comments to save
    if (comment === "") {
      return;
    }

    const { homePlanetComments } = detailPlanetPage;

    commentInput.current.value = "";

    const newHomePlanetComments = [...homePlanetComments];
    newHomePlanetComments.push(comment);

    setDetailPlanetPage({
      ...detailPlanetPage,
      homePlanetComments: newHomePlanetComments,
    });
  };

  const persistsClientData = useCallback(() => {
    const { pathname } = props.location;

    const mergedData = Object.assign(
      {},
      { homePlanetData: detailPlanetPage.homePlanetData },
      { homePlanetComments: detailPlanetPage.homePlanetComments }
    );

    localStorageService.saveClientData(pathname, mergedData);
  }, [props.location, detailPlanetPage.homePlanetData, detailPlanetPage.homePlanetComments]);

  useEffect(() => {
    persistsClientData();
  }, [persistsClientData]);

  const { homePlanetData, homePlanetComments } = detailPlanetPage;

  const comments = (homePlanetComments || []).map((item, i) => {
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
          <h1 className="title">{homePlanetData.title}</h1>
          <p>Director: {homePlanetData.director}</p>
          <p>Producer: {homePlanetData.producer}</p>
          <p>Episode Number: {homePlanetData.episode_id}</p>
          <p>Opening Crawl: {homePlanetData.opening_crawl}</p>
          <p>Release Date: {homePlanetData.release_date}</p>
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

export default DetailPlanet;
