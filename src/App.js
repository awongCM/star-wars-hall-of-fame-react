import React, { Component } from 'react';
import {Router, Route, browserHistory } from "react-router";
import MainApp from "./component/MainApp/MainApp";
import Home from "./component/Home/Home";
import Detail from "./component/Detail/Detail";
import DetailPlanet from './component/DetailPlanet/DetailPlanet';
import DetailFilm from './component/DetailFilm/DetailFilm';

class App extends Component {

  render() {

    return (
      <Router history={browserHistory}>
        <Route component={MainApp} >
          <Route path="/" component={Home} />
          <Route path="/people/:id" component={Detail}  />
          <Route path="/planet/:id" component={DetailPlanet}/>
          <Route path="/film/:id" component={DetailFilm} />
        </Route>
      </Router>
    );
  }
}


export default App;
