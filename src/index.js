import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Main from './components/main';

injectTapEventPlugin();

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
    </Route>
  </Router>
);

render(routes, document.querySelector('main'));
