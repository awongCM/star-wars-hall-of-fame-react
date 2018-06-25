import React, { Component } from 'react';

import './Pagination.css';

export class Pagination extends Component {
  constructor(props){
    super(props);

    const { total_pages, next, previous, total_count, max_per_page } = this.props.paginationData;

    this.state = {
      total_pages: total_pages,
      next: next,
      previous: previous,
      total_count: total_count,
      max_per_page: max_per_page,
      allowPrevious: (previous !== null),
      allowNext: (next !== null)
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        total_pages: nextProps.paginationData.total_pages,
        next: nextProps.paginationData.next,
        previous: nextProps.paginationData.previous,
        total_count: nextProps.paginationData.total_count,
        max_per_page: nextProps.paginationData.max_per_page,
        allowPrevious: (nextProps.paginationData.previous !== null),
        allowNext: (nextProps.paginationData.next !== null)
      });
    }
  }

  // TODO - for parent props to handle event clicks
  handlePreviousReq() {
    
    console.log('go previous for the parent props');
  }

  // TODO - for parent props to handle event clicks
  handleNextReq() {
   
    console.log('go next for the parent props');
  }

  render() {

    const { total_pages, next, previous, total_count, max_per_page, allowNext, allowPrevious } = this.state;
    
    const renderPagination = (total_pages !== null) ? (
      <div>
       <nav aria-label="Page navigation">
          <ul className="pagination flex-center">
            <li className={"page-item " + (allowPrevious ? '': 'disabled')} onClick={this.handlePreviousReq.bind(this)}>
              <a className="page-link"> &larr; Prev</a>  
            </li>
            {/* <li className="page-item">
              <a className="page-link">{currentPage}</a>
            </li> */}
            <li className={"page-item " + (allowNext ? '': 'disabled')}  onClick={this.handleNextReq.bind(this)}>
                <a className="page-link">Next &rarr;</a>
            </li>
          </ul>
        </nav>
        <strong className="pagination-counter"> Total Characters: {total_count}</strong>
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

export default Pagination;
