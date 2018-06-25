import React, { Component } from 'react';

import './Pagination.css';

export class Pagination extends Component {
  constructor(props){
    super(props);

    // TODO - for props data
    this.state = {
      allowPrevious: this.props.paginationData.current_page !== 1,
      allowNext: this.props.paginationData.current_page !== this.props.paginationData.total_pages,
      previousPage: this.props.paginationData.current_page - 1,
      nextPage: this.props.paginationData.current_page + 1,
      currentPage: this.props.paginationData.current_page
    };
  }

  handlePreviousReq() {
    if(this.state.allowPrevious && this.state.previousPage > 0){
      console.log('go previous page');
      const newCurrentPage = --this.state.currentPage;
      const newPreviousPage = newCurrentPage - 1;
      const newNextPage = newCurrentPage +1;
      this.setState({
        currentPage: newCurrentPage, 
        previousPage: newPreviousPage, 
        nextPage: newNextPage,
        allowPrevious: (newCurrentPage !== 1),
        allowNext: (newCurrentPage !== this.props.paginationData.total_pages)
      });
    }
  }

  handleNextReq() {
    if (this.state.allowNext && this.state.nextPage < this.props.paginationData.total_count) {
      console.log('go next page');
      const newCurrentPage = ++this.state.currentPage;
      const newPreviousPage = newCurrentPage - 1;
      const newNextPage = newCurrentPage +1;
      this.setState({
        currentPage: newCurrentPage, 
        previousPage: newPreviousPage, 
        nextPage: newNextPage,
        allowPrevious: (newCurrentPage !== 1),
        allowNext: (newCurrentPage !== this.props.paginationData.total_pages)
      });
    }
  }

  render() {
    return (
      <div className="pagination-container">
        <nav aria-label="Page navigation">
          <ul className="pagination flex-center">
            <li className={"page-item " + (this.state.allowPrevious ? '': 'disabled')}   onClick={this.handlePreviousReq.bind(this)}>
              <a className="page-link"> &larr; Prev</a>  
            </li>
            <li className="page-item">
              <a className="page-link">{this.state.currentPage}</a>
            </li>
            <li className={"page-item " + (this.state.allowNext ? '': 'disabled')}  onClick={this.handleNextReq.bind(this)}>
                <a className="page-link">Next &rarr;</a>
            </li>
          </ul>
        </nav>
        <strong className="pagination-counter"> Total Characters: {this.props.paginationData.total_count}</strong>
      </div> 
    )
  }
}

export default Pagination;
