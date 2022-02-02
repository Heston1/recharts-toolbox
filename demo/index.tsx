import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Demo from './component/Demo';
import App from './container/App';

ReactDOM.render((
  // <BrowserRouter>
  //   <Route path="/" component={App} />
  // </BrowserRouter>
  <Demo />
), document.getElementById('root'));
