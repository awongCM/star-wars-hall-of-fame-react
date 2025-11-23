import React from "react";
import useDetailPage from "../../hooks/useDetailPage";
import DetailView from "../DetailView/DetailView";
import "./Detail.css";

const Detail = (props) => {
  const { data, comments, saveComment } = useDetailPage({
    resourceType: "people",
    id: props.params.id,
    pathname: props.location.pathname,
    dataKey: "characterData",
    commentsKey: "characterComments",
  });

  const renderCharacterDetails = (characterData) => (
    <React.Fragment>
      <h1 className="title">{characterData.name || ""}</h1>
      <p>Height: {characterData.height || ""}</p>
      <p>Mass: {characterData.mass || ""}</p>
      <p>Hair Color: {characterData.hair_color || ""}</p>
      <p>Skin Color: {characterData.skin_color || ""}</p>
      <p>Eye Color: {characterData.eye_color || ""}</p>
      <p>YOB: {characterData.birth_year || ""}</p>
      <p>Gender: {characterData.gender || ""}</p>
    </React.Fragment>
  );

  return (
    <DetailView
      data={data}
      comments={comments}
      onSaveComment={saveComment}
      renderDetails={renderCharacterDetails}
      placeholderText="Enter your comments for this hero/villain! :)"
    />
  );
};

export default Detail;
