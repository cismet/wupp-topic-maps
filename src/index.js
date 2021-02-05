import 'babel-polyfill';
import 'es6-symbol/implement';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './redux/store';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

import './index.css';

const target = document.querySelector('#root');

render(
	<ErrorBoundary>
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<div>
					<App />
				</div>
			</ConnectedRouter>
		</Provider>
	</ErrorBoundary>,
	target
);
