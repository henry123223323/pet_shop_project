import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import MemberCenter from './component/MemberCenter/MyAccount'
import Homepage from './component/Homepage/Homepage';

function App() {
  return (
    <BrowserRouter>
    <h1 className='bg-danger'>Header</h1>
      <Switch>
        <Route path="/" component={ Homepage } exact/>
        <Route path="/MemberCenter" component={ MemberCenter } exact/>
      </Switch>
      <h1 className='bg-primary'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
