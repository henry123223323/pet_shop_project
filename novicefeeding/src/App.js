import React, { Component } from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';



import dogguide from './components/dogguide';

class App extends Component {
  state = {}
  render() {
    return (
      // <p>我成功自己建立一個react專案了!我好棒!</p>
      <BrowserRouter>
        <Switch>
          <Route path="/novicefeeding/dogguide" component={dogguide} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
