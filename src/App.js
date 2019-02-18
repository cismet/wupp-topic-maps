import React from 'react';
import { persistStore } from 'redux-persist';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage';
import Layout from './components/Layout';
import DefaultPage from './containers/DefaultPage';
import BPlaene from './containers/BPlaene';
import Ehrenamt from './containers/Ehrenamt';
import Stadtplan from './containers/Stadtplan';
import Baeder from './containers/Baeder';
import Starkregen from './containers/Starkregen';
import Kitas from './containers/Kitas';
import Experiments from './containers/Experiments';
import Reset from './containers/Reset';
import DocViewer from './containers/DocViewer';

import store from './redux/store';
import ReactLoading from 'react-loading';
import { getTopicMapVersion, getTopicMapHash } from './constants/versions';

export default class App extends React.Component {
	constructor() {
		super();
		this.state = { rehydrated: false };
	}

	componentWillMount() {
		console.log('............................................................................................');
		console.log('....................... TopicMaps Wuppertal (' + getTopicMapVersion() + ')');
		console.log('....................... BuildNumber: ' + getTopicMapHash());
		console.log('............................................................................................');

		persistStore(store, null, () => {
			let thisHere = this;
			setTimeout(() => {
				thisHere.setState({ rehydrated: true });
			}, 1);
		});
	}

	render() {
		if (!this.state.rehydrated) {
			return (
				<div>
					<main>
						<ReactLoading
							style={{ margin: 'auto', width: '30%', height: '60%', padding: '50px' }}
							type="spin"
							color="#444"
						/>
					</main>
				</div>
			);
		} else {
			return (
				<div>
					<main>
						<Route component={Layout} />
						<Switch>
							<Route exact path="/" component={DefaultPage} />
							<Route exact path="/ehrenamt/:layers?/:offerid?" component={Ehrenamt} />
							<Route exact path="/bplaene/:layers?/:bplannummer?" component={BPlaene} />
							<Route exact path="/stadtplan/:layers?/" component={Stadtplan} />
							<Route exact path="/baeder/:layers?/" component={Baeder} />
							<Route exact path="/starkregen/:layers?/" component={Starkregen} />
							<Route exact path="/kitas/:layers?/" component={Kitas} />
							<Route exact path="/experiments" component={Experiments} />
							<Route exact path="/default(/:layers)(/:bplannummer)" component={DefaultPage} />
							<Route exact path="/reset" component={Reset} />
							<Route exact path="/docs/:topic?/:docPackageId?/:file?/:page?" component={DocViewer} />
							<Route component={NotFoundPage} />
						</Switch>
					</main>
				</div>
			);
		}
	}
}
