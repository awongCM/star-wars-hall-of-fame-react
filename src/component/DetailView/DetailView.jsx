import React, { useRef } from "react";
import { Link } from "react-router";

/**
 * Shared DetailView component for displaying Star Wars resource details
 * 
 * @param {Object} props
 * @param {Object} props.data - Resource data to display
 * @param {Array} props.comments - Array of comment strings
 * @param {Function} props.onSaveComment - Callback when saving a comment
 * @param {Function} props.renderDetails - Function to render resource-specific details
 * @param {string} props.placeholderText - Placeholder text for comment textarea
 * @param {string} props.cssClass - Optional CSS class for styling
 */
const DetailView = ({ 
  data, 
  comments, 
  onSaveComment, 
  renderDetails, 
  placeholderText = "Enter your comments! :)",
  cssClass = ""
}) => {
  const commentInput = useRef(null);

  const handleSaveComment = () => {
    const comment = commentInput.current.value;
    
    if (comment === "") {
      return;
    }

    onSaveComment(comment);
    commentInput.current.value = "";
  };

  const commentsList = (comments || []).map((item, i) => (
    <div key={i} className="comment">
      {item}
    </div>
  ));

  const heading = comments.length ? <h4 className="heading">Comments</h4> : "";

  return (
    <div className={cssClass}>
      <Link to={"/"} className="returnHomePage">
        <i className="em em-back"></i>
      </Link>

      <div className="detailContainer">
        <div className="detailContainer--media flex-center">
          <img src="" alt="" />
        </div>
        <div className="detailContainer--description">
          {renderDetails(data)}
        </div>

        <div className="commentInputContainer">
          <textarea
            ref={commentInput}
            placeholder={placeholderText}
            cols="30"
            rows="5"
          ></textarea>
          <button onClick={handleSaveComment}>Save</button>
        </div>
        <div className="commentSection">
          {heading}
          {commentsList}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
