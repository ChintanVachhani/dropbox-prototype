import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import User from './components/User';
import Header from './components/Header';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Header}/>
    <Route path="login" component={User}/>
    <Route path="header" component={Header}/>
  </Route>
);
