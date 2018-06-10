import React, { Component } from 'react';
import Form from "./../Form/Form";
import Grid from "./../Grid/Grid";
import * as SWAPI from "./../../services/api";

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
       data: [],
       characterFilter: ""
    };
  }

  componentDidMount() {
     this.fetchData();    
  }
  
  fetchData() {
    let self = this;

    fetch(SWAPI.url, SWAPI.initHeaders()
      ).then((response) => {
        return response.json();
      }).then((myJSON) => {
        return this.refineData(myJSON.results);
      }).then((refinedData) => {
        self.setState({data: refinedData});
      });
  }

  refineData(parsedData) {
    let newProps = [];

    newProps = parsedData.map((item, i) => {
        item.id = i;
        item.up_vote = 0;
        item.down_vote = 0;
        item.overall_vote = 0;
        return item;
    });

    //console.log("Home newprops", newProps);
    return newProps;
  }

  handleCharacterFilter(characterFilter) {
    this.setState({characterFilter: characterFilter});
  }

  render() {
    const { pathname } = this.props.location;
    return (
      <div>
        <Form data={this.state.data} characterFilter={this.state.characterFilter} 
                                    onHandleCharacterFilter={this.handleCharacterFilter.bind(this)} />
        <Grid pathname={pathname} data={this.state.data} characterFilter={this.state.characterFilter} />
        {/* TODO - make this into react component */}
        {/* <nav aria-label="Page navigation">
          <ul className="pagination flex-center">
            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a className="page-link" href="#">Next</a></li>
          </ul>
        </nav> */}
      </div>
    );
  }
}


export default Home;
