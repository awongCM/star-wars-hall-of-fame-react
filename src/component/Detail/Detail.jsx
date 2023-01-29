// TODO - to DRY up our detail component for other pages

import React, { Component, useState, useEffect, useRef } from "react";
import { Link } from "react-router";

import "./Detail.css";
import * as localStorageService from "../../services/localStorage";

const Detail = (props) => {
  const [detailPage, setDetailPage] = useState({
    characterData: {},
    characterComments: [],
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
    fetch(`https://swapi.dev/api/people/${param_index}?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((myJSON) => {
        return refineData(myJSON);
      })
      .then((refinedCharData) => {
        setDetailPage({ ...detailPage, characterData: refinedCharData });
        console.log(refinedCharData);
      });
  };

  useEffect(() => {
    const availableClientData = loadPersistedClientData();

    if (availableClientData !== undefined) {
      setDetailPage({
        characterData: availableClientData.characterData,
        characterComments: availableClientData.characterComments,
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

    const { characterComments } = detailPage;

    commentInput.current.value = "";

    const newCharacterComments = [...characterComments];
    newCharacterComments.push(comment);

    setDetailPage({ ...detailPage, characterComments: newCharacterComments });
  };

  useEffect(() => {
    persistsClientData();
  }, [detailPage.characterComments]);

  const persistsClientData = () => {
    const { pathname } = props.location;

    const mergedData = Object.assign(
      {},
      { characterData: detailPage.characterData },
      { characterComments: detailPage.characterComments }
    );

    localStorageService.saveClientData(pathname, mergedData);
  };

  const { characterData, characterComments } = detailPage;

  const comments = (characterComments || []).map((item, i) => {
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
          <h1 className="title">{(characterData || {}).name}</h1>
          <p>Height: {(characterData || {}).height}</p>
          <p>Mass: {(characterData || {}).mass}</p>
          <p>Hair Color: {(characterData || {}).hair_color}</p>
          <p>Skin Color: {(characterData || {}).skin_color}</p>
          <p>Eye Color: {(characterData || {}).eye_color}</p>
          <p>YOB: {(characterData || {}).birth_year}</p>
          <p>Gender: {(characterData || {}).gender}</p>
        </div>

        <div className="commentInputContainer">
          <textarea
            ref={commentInput}
            placeholder="Enter your comments for this hero/villian! :)"
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

export default Detail;
