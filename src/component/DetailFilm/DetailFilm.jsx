import React from "react";
import useDetailPage from "../../hooks/useDetailPage";
import DetailView from "../DetailView/DetailView";
import "./DetailFilm.css";

const DetailFilm = (props) => {
  const { data, comments, saveComment } = useDetailPage({
    resourceType: "films",
    id: props.params.id,
    pathname: props.location.pathname,
    dataKey: "filmData",
    commentsKey: "filmComments",
  });

  const renderFilmDetails = (filmData) => (
    <React.Fragment>
      <h1 className="title">{filmData.title || ""}</h1>
      <p>Director: {filmData.director || ""}</p>
      <p>Producer: {filmData.producer || ""}</p>
      <p>Episode Number: {filmData.episode_id || ""}</p>
      <p>Opening Crawl: {filmData.opening_crawl || ""}</p>
      <p>Release Date: {filmData.release_date || ""}</p>
    </React.Fragment>
  );

  return (
    <DetailView
      data={data}
      comments={comments}
      onSaveComment={saveComment}
      renderDetails={renderFilmDetails}
      placeholderText="Enter your comments for this film! :)"
    />
  );
};

export default DetailFilm;
