import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import 'typeface-roboto';
import App from './App';
import Book from './Book';

const routing = (
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/book" component={Book} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>
);
ReactDOM.render(routing, document.getElementById('root'));