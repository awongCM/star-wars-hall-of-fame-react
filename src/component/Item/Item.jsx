import React, { useState } from "react";
import { Link } from "react-router";
import useTrivia from "../../hooks/useTrivia";
import TriviaDisplay from "../TriviaDisplay/TriviaDisplay";
import "./../Grid/Grid.css";
import "./Item.css";

/**
 * TEACHING NOTE - Component Refactoring:
 * 
 * This component was refactored from a people-specific component to a
 * resource-agnostic component that works with any SWAPI resource type.
 * 
 * Key Changes:
 * 1. Removed hardcoded "people" logic
 * 2. Extracted trivia fetching to custom hook (useTrivia)
 * 3. Created flexible TriviaDisplay component for rendering
 * 4. Added resourceType prop to determine behavior
 * 
 * This is an example of the Open/Closed Principle:
 * - Open for extension (new resource types)
 * - Closed for modification (don't need to change existing code)
 */

const LoadingIcon = () => (
  <div className="loadingState">
    <h4 className="title">Loading</h4>
    <i className="fa fa-refresh fa-spin"></i>
  </div>
);

/**
 * TEACHING NOTE - Component Props:
 * 
 * This component now accepts:
 * - item_id: The item's ID
 * - pathname: For localStorage caching
 * - itemData: The actual data (person, planet, film, starship)
 * - resourceType: What kind of resource (people, planets, films, starships)
 * - reorderItemsByOverallPopularity: Callback for voting
 * 
 * By accepting resourceType, one component handles all types!
 */
const Item = (props) => {
  const { item_id, pathname, itemData, resourceType, reorderItemsByOverallPopularity } = props;

  /**
   * TEACHING NOTE - Custom Hook Usage:
   * 
   * Instead of managing trivia fetching logic here, we delegate it to useTrivia hook.
   * This is the "separation of concerns" principle:
   * - useTrivia: Handles data fetching and caching
   * - Item: Handles display and user interaction
   * 
   * Benefits:
   * - Cleaner component code
   * - Reusable logic
   * - Easier testing
   */
  const { triviaData, loaded } = useTrivia({
    itemId: item_id,
    pathname,
    itemData,
    resourceType,
  });

  /**
   * TEACHING NOTE - State Management:
   * 
   * We keep voting state here because it's specific to the Item component.
   * Vote counts are UI-only state (not persisted to backend/localStorage).
   */
  const [upVote, setUpVote] = useState(itemData.up_vote || 0);
  const [downVote, setDownVote] = useState(itemData.down_vote || 0);

  const upVoteCharacter = (e) => {
    e.preventDefault();

    const newUpVote = upVote + 1;
    setUpVote(newUpVote);

    calcOverallPopularity(newUpVote, downVote);
  };

  const downVoteCharacter = (e) => {
    e.preventDefault();

    const newDownVote = downVote + 1;
    setDownVote(newDownVote);

    calcOverallPopularity(upVote, newDownVote);
  };

  const calcOverallPopularity = (currentUpVote, currentDownVote) => {
    let overallPopularity = Math.max(currentUpVote - currentDownVote, 0);
    reorderItemsByOverallPopularity(
      item_id,
      currentUpVote,
      currentDownVote,
      overallPopularity
    );
  };

  /**
   * TEACHING NOTE - Dynamic Routing:
   * 
   * We build the detail page link dynamically based on resourceType.
   * For example:
   * - people -> /people/1
   * - planets -> /planet/1
   * - films -> /film/1
   * - starships -> /starship/1
   * 
   * Note: planet/film/starship are singular (legacy routing convention)
   */
  const getItemLink = () => {
    const routeMap = {
      people: `/people/${item_id}`,
      planets: `/planet/${item_id}`,
      films: `/film/${item_id}`,
      starships: `/starship/${item_id}`,
    };
    return routeMap[resourceType] || `/people/${item_id}`;
  };

  /**
   * TEACHING NOTE - Dynamic Display Name:
   * 
   * Different resources have different property names:
   * - People/Planets/Starships: "name"
   * - Films: "title"
   * 
   * We use the "in" operator to check which property exists.
   */
  const displayName = itemData.name || itemData.title || "Unknown";
  const itemVotes = itemData.up_vote || 0;
  const itemDownVotes = itemData.down_vote || 0;
  const overallPopularity = itemData.overall_vote || 0;

  /**
   * TEACHING NOTE - Loading State Logic:
   * 
   * Show loading spinner ONLY while data is being fetched (loaded === false).
   * Once loaded === true, always show TriviaDisplay (even if data is empty).
   * 
   * Why? TriviaDisplay handles empty data gracefully by returning null.
   * This prevents infinite loading spinners when data exists but is empty.
   */

  return (
    <div className="gridContainer--col flex-center">
      <div className="characterBox">
        <div className="characterBox--media flex-center">
          <img src="" alt="" />
          <Link
            to={getItemLink()}
            className="characterLink"
            key={item_id}
          >
            {displayName}
          </Link>
          {loaded ? (
            <TriviaDisplay resourceType={resourceType} triviaData={triviaData} />
          ) : (
            <LoadingIcon />
          )}
        </div>
        <div className="voteContainer flex-center">
          <div
            className="voteContainer--upVote flex-center"
            onClick={(e) => upVoteCharacter(e)}
          >
            <i className="em em-thumbsup"></i>
            <span className="voteCount">{itemVotes}</span>{" "}
          </div>
          <div
            className="voteContainer--downVote flex-center"
            onClick={(e) => downVoteCharacter(e)}
          >
            <i className="em em-thumbsdown"></i>
            <span className="voteCount">{itemDownVotes}</span>{" "}
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
