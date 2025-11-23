import React from "react";
import useDetailPage from "../../hooks/useDetailPage";
import DetailView from "../DetailView/DetailView";
import "./DetailPlanet.css";

const DetailPlanet = (props) => {
  const { data, comments, saveComment } = useDetailPage({
    resourceType: "planets",
    id: props.params.id,
    pathname: props.location.pathname,
    dataKey: "homePlanetData",
    commentsKey: "homePlanetComments",
  });

  const renderPlanetDetails = (planetData) => (
    <React.Fragment>
      <h1 className="title">{planetData.name || ""}</h1>
      <p>Climate: {planetData.climate || ""}</p>
      <p>Terrain: {planetData.terrain || ""}</p>
      <p>Population: {planetData.population || ""}</p>
      <p>Diameter: {planetData.diameter || ""}</p>
      <p>Rotation Period: {planetData.rotation_period || ""}</p>
      <p>Orbital Period: {planetData.orbital_period || ""}</p>
      <p>Gravity: {planetData.gravity || ""}</p>
      <p>Surface Water: {planetData.surface_water || ""}</p>
    </React.Fragment>
  );

  return (
    <DetailView
      data={data}
      comments={comments}
      onSaveComment={saveComment}
      renderDetails={renderPlanetDetails}
      placeholderText="Enter your comments for this planet! :)"
    />
  );
};

export default DetailPlanet;
