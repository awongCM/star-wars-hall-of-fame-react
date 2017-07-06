import React, { Component } from 'react';
import Form from "./../Form/Form";
import Grid from "./../Grid/Grid";

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
       data: [],
       characterFilter: ""
    }
  }

  componentDidMount() {
     this.fetchData();    
  }

  fetchData() {
    let initHeaders = {
          method: 'GET',
          cache: 'default',
          accept: 'application/json'
    };
    let self = this;

    fetch(`http://swapi.co/api/people/`, initHeaders
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
    })

    // console.log(newProps);
    return newProps;
  }

  handleCharacterFilter(characterFilter) {
    this.setState({characterFilter: characterFilter});
  }

  render() {
    return (
      <div>
        <Form data={this.state.data} characterFilter={this.state.characterFilter} 
                                    onHandleCharacterFilter={this.handleCharacterFilter.bind(this)} />
        <Grid data={this.state.data} characterFilter={this.state.characterFilter} />
      </div>
    );
  }
}


export default Home;
