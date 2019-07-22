import React, { Component } from "react";
import Form from "./../Form/Form";
import Grid from "./../Grid/Grid";
import Pagination from "./../Pagination/Pagination";
import * as SWAPI from "./../../services/api";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      characterFilter: "",
      pagination: null,
      queryType: ""
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData(url = SWAPI.url) {
    let self = this;

    fetch(url, SWAPI.initHeaders())
      .then(response => {
        return response.json();
      })
      .then(myJSON => {
        return this.refineData(myJSON);
      })
      .then(refinedData => {
        self.setState({
          data: refinedData.newList,
          pagination: refinedData.pagination
        });
      });
  }

  refineData(rawJSONData) {
    // assuming this are the correct SWAPI raw data
    const { count, next, previous, results } = rawJSONData;

    // TODO - will probably scrape for the SWAPI resources and generate the unique ids for navigating individual resources as a workaround
    const newList = results.map((item, i) => {
      item.id = i;
      item.up_vote = 0;
      item.down_vote = 0;
      item.overall_vote = 0;
      return item;
    });

    const pagination = {
      count: count,
      next: next,
      previous: previous
    };

    console.log("Home newList", newList);
    console.log("Home pagination", pagination);
    return {
      newList: newList,
      pagination: pagination
    };
  }

  handleCharacterFilter(characterFilter) {
    this.setState({ characterFilter: characterFilter });
  }

  handleNextPage(page_url) {
    console.log("next page", page_url);
    this.fetchData(page_url);
  }

  handlePreviousPage(page_url) {
    console.log("prev page", page_url);
    this.fetchData(page_url);
  }

  handleDropdownQueryType(queryType) {
    this.setState({ queryType: queryType });
  }

  render() {
    const { pathname } = this.props.location;

    const { data, characterFilter, pagination } = this.state;

    const paginationData = {
      total_pages:
        pagination !== null ? Math.ceil(pagination.count / data.length) : null,
      next: pagination !== null ? pagination.next : null,
      previous: pagination !== null ? pagination.previous : null,
      total_count: pagination !== null ? pagination.count : null,
      max_per_page: pagination !== null ? data.length : null
    };

    return (
      <div>
        <Form
          data={data}
          characterFilter={characterFilter}
          onHandleCharacterFilter={this.handleCharacterFilter.bind(this)}
          onHandleDropdownQueryType={this.handleDropdownQueryType.bind(this)}
        />
        <Grid
          pathname={pathname}
          data={data}
          characterFilter={characterFilter}
        />
        <Pagination
          paginationData={paginationData}
          onHandleNextPage={this.handleNextPage.bind(this)}
          onHandlePreviousPage={this.handlePreviousPage.bind(this)}
        />
      </div>
    );
  }
}

export default Home;
