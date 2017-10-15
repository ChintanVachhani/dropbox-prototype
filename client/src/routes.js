import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import User from './components/User';
import Board from './components/Board';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Board}/>
    <Route path="login" component={User}/>
  </Route>
);
