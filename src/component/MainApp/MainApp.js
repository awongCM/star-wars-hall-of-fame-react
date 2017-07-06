import React, { Component } from 'react';

class MainApp extends Component {

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}


export default MainApp;
