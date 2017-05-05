import React from 'react';
import { Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import DefaultPage from './containers/DefaultPage';
import BPlaene from './containers/BPlaene';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DefaultPage}/>
    <Route path="bplaene(/:layers)(/:bplannummer)" component={BPlaene}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
