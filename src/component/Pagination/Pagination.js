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
      firstPage: (this.props.paginationData.current_page === 1),
      nextPage: this.props.paginationData.current_page + 1,
      finalPage: this.props.paginationData.current_page === this.props.paginationData.total_pages - 1,
    };
  }

  handlePreviousReq() {
    if(this.state.allowPrevious && this.state.previousPage > 0){
      console.log('go previous page');
    }
  }

  handleNextReq() {
    if (this.state.allowNext && this.state.nextPage < this.props.paginationData.total_count) {
      console.log('go next page');
    }
  }

  render() {
    return (
      <nav aria-label="Page navigation">
        <ul className="pagination flex-center">
          <li className="page-item" onClick={this.handleNextReq.bind(this)}>
            <a className="page-link" href="#"> &larr; Prev</a>  
          </li>
          <li className="page-item">
            <div className="inline-pagination">
              Displaying Results
              { this.state.firstPage ?
                1 :
                this.state.previousPage * this.props.paginationData.max_per_page
              }
              to 
              { this.props.paginationData.finalPage ?
                this.props.paginationData.total_count :
                this.props.paginationData.current_page *  this.props.paginationData.max_per_page
              }
              <strong>Total Results: {this.props.paginationData.total_count}</strong>
            </div>
          </li>
          <li className="page-item" onClick={this.handleNextReq.bind(this)}>
              <a className="page-link" href="#">Next &rarr;</a>
          </li>
        </ul>
      </nav>
    )
  }
}

export default Pagination;
