import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import DefaultPage from './containers/DefaultPage.jsx';
import BPlaene from './containers/BPlaene.jsx';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DefaultPage}/>
    <Route path="bplaene(/:layers)(/:bplannummer)" component={BPlaene}/>
    <Route path="default(/:layers)(/:bplannummer)" component={DefaultPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
