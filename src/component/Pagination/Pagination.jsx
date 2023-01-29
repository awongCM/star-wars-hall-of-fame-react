import React, { Component, useEffect, useState } from "react";

import "./Pagination.css";

const getCurrentPageNo = (next_str, previous_str) => {
  const page_no_substr = /\?page\=\d/g;
  let nextPageNo = null,
    prevPageNo = null;

  if (next_str !== null) {
    nextPageNo = parseInt(
      next_str.match(page_no_substr).join("").split("=").pop()
    );
  }

  if (previous_str !== null) {
    prevPageNo = parseInt(
      previous_str.match(page_no_substr).join("").split("=").pop()
    );
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

  useEffect(() => {
    const currentPage = getCurrentPageNo(
      props.paginationData.next,
      props.paginationData.previous
    );

    setPaginationPage((paginationPage) => ({
      ...paginationPage,
      total_pages: props.paginationData.total_pages,
      next: props.paginationData.next,
      previous: props.paginationData.previous,
      total_count: props.paginationData.total_count,
      max_per_page: props.paginationData.max_per_page,
      allowPrevious: props.paginationData.previous !== null,
      allowNext: props.paginationData.next !== null,
      currentPage: currentPage,
    }));
  }, [props && props.paginationData]);

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
          Total Characters: {total_count}. Currently only {max_per_page} items
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
