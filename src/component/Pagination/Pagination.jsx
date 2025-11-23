import React, { useEffect, useState } from "react";

import "./Pagination.css";

const getCurrentPageNo = (next_str, previous_str) => {
  const page_no_substr = /\?page=(\d+)/;
  let nextPageNo = null,
    prevPageNo = null;

  if (next_str !== null) {
    const match = next_str.match(page_no_substr);
    if (match) {
      nextPageNo = parseInt(match[1], 10);
    }
  }

  if (previous_str !== null) {
    const match = previous_str.match(page_no_substr);
    if (match) {
      prevPageNo = parseInt(match[1], 10);
    }
  }

  console.log("nextPageNo", nextPageNo);
  console.log("prevPageNo", prevPageNo);

  if (nextPageNo === null && prevPageNo === null) {
    return 1;
  } else {
    //assume that previous page is always provided from API
    return prevPageNo + 1;
  }
};

const Pagination = (props) => {
  const [paginationPage, setPaginationPage] = useState({
    total_pages: 0,
    next: null,
    previous: null,
    total_count: 0,
    max_per_page: 0,
    allowPrevious: false,
    allowNext: false,
    currentPage: 0,
  });

  // Get display label based on resource type
  const getResourceLabel = (resourceType) => {
    const labels = {
      people: "Characters",
      planets: "Planets",
      films: "Films",
      starships: "Starships",
    };
    return labels[resourceType] || "Items";
  };

  useEffect(() => {
    const { paginationData } = props;
    if (!paginationData) return;

    const currentPage = getCurrentPageNo(
      paginationData.next,
      paginationData.previous
    );

    setPaginationPage((prevState) => ({
      ...prevState,
      total_pages: paginationData.total_pages,
      next: paginationData.next,
      previous: paginationData.previous,
      total_count: paginationData.total_count,
      max_per_page: paginationData.max_per_page,
      allowPrevious: paginationData.previous !== null,
      allowNext: paginationData.next !== null,
      currentPage: currentPage,
    }));
  }, [
    props.paginationData && props.paginationData.next,
    props.paginationData && props.paginationData.previous,
    props.paginationData && props.paginationData.total_pages,
    props.paginationData && props.paginationData.total_count,
    props.paginationData && props.paginationData.max_per_page,
  ]);

  const handlePreviousNextReq = (previous, next) => {
    if (previous !== null) {
      props.onHandlePreviousPage(previous);
    }
    if (next !== null) {
      props.onHandleNextPage(next);
    }
  };

  const renderPagination = () => {
    const {
      total_pages,
      next,
      previous,
      total_count,
      max_per_page,
      allowNext,
      allowPrevious,
      currentPage,
    } = paginationPage;

    return total_pages !== null ? (
      <div>
        <nav aria-label="Page navigation">
          <ul className="pagination flex-center">
            <li
              className={"page-item " + (allowPrevious ? "" : "disabled")}
              onClick={() => handlePreviousNextReq(previous, null)}
            >
              <a className="page-link"> Prev</a>
            </li>
            <li className="page-item">
              <a className="page-link">{currentPage}</a>
            </li>
            <li
              className={"page-item " + (allowNext ? "" : "disabled")}
              onClick={() => handlePreviousNextReq(null, next)}
            >
              <a className="page-link">Next</a>
            </li>
          </ul>
        </nav>
        <strong className="pagination-counter">
          {" "}
          Total {getResourceLabel(props.resourceType)}: {total_count}. Currently only {max_per_page} items
          are displayed.
        </strong>
      </div>
    ) : (
      <div>
        <span className="pagination-message"></span>
      </div>
    );
  };

  const renderedPagination = renderPagination();

  return <div className="pagination-container">{renderedPagination}</div>;
};

export default Pagination;
