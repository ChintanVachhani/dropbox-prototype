import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import User from './components/User';
import Home from './components/Home';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="login" component={User}/>
  </Route>
);
