import React, { Component } from 'react';

import './Pagination.css';

export class Pagination extends Component {
  constructor(props){
    super(props);

    const { total_pages, next, previous, total_count, max_per_page } = this.props.paginationData;

    const currentPage = getCurrentPageNo(next, previous);

    this.state = {
      total_pages: total_pages,
      next: next,
      previous: previous,
      total_count: total_count,
      max_per_page: max_per_page,
      allowPrevious: (previous !== null),
      allowNext: (next !== null),
      currentPage: currentPage
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props !== nextProps) {

      const currentPage = getCurrentPageNo(nextProps.paginationData.next, nextProps.paginationData.previous);

      this.setState({
        total_pages: nextProps.paginationData.total_pages,
        next: nextProps.paginationData.next,
        previous: nextProps.paginationData.previous,
        total_count: nextProps.paginationData.total_count,
        max_per_page: nextProps.paginationData.max_per_page,
        allowPrevious: (nextProps.paginationData.previous !== null),
        allowNext: (nextProps.paginationData.next !== null),
        currentPage: currentPage
      });
    }
  }

  handlePreviousNextReq(previous, next) {
    if (previous !== null) {
      this.props.onHandlePreviousPage(previous);  
    }
    if (next !== null) {
      this.props.onHandleNextPage(next); 
    }
  }

  render() {

    const { total_pages, next, previous, total_count, max_per_page, allowNext, allowPrevious, currentPage } = this.state;
    
    const renderPagination = (total_pages !== null) ? (
      <div>
       <nav aria-label="Page navigation">
          <ul className="pagination flex-center">
            <li className={"page-item " + (allowPrevious ? '': 'disabled')} onClick={this.handlePreviousNextReq.bind(this, previous, null)}>
              <a className="page-link"> Prev</a>  
            </li>
            <li className="page-item">
              <a className="page-link">{currentPage}</a>
            </li>
            <li className={"page-item " + (allowNext ? '': 'disabled')}  onClick={this.handlePreviousNextReq.bind(this, null, next)}>
                <a className="page-link">Next</a>
            </li>
          </ul>
        </nav>
        <strong className="pagination-counter"> Total Characters: {total_count}. Currently only {max_per_page} items are displayed.</strong>
      </div>
       
    ) : (
      <div>
        <span className="pagination-message"></span>
      </div>
    );

    return (
      <div className="pagination-container">
        {renderPagination}
      </div>
    )
  }
}

const getCurrentPageNo = (next_str, previous_str) => {
  const page_no_substr = /\?page\=\d/g;
  let nextPageNo = null, 
      prevPageNo = null;

  if(next_str !== null) {
    nextPageNo = parseInt(next_str.match(page_no_substr)
                  .join('').split('=').pop());
  }

  if(previous_str !== null) {
    prevPageNo = parseInt(previous_str.match(page_no_substr)
                  .join('').split('=').pop());
  }

  // console.log('nextPageNo', nextPageNo);
  // console.log('prevPageNo', prevPageNo);

  if(nextPageNo === null && prevPageNo === null){
    return 1;
  }
  else { //assume that previous page is always provided from API
    return prevPageNo + 1;
  }
  
};


export default Pagination;
