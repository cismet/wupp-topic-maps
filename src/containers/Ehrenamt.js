import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import EhrenamtInfo from '../components/ehrenamt/EhrenamtInfo';
import EhrenamtModalApplicationMenu from '../components/ehrenamt/EhrenamtModalApplicationMenu';
import TopicMap from '../containers/TopicMap';
import {
	actions as ehrenamtActions,
	constants as ehrenamtConstants
} from '../redux/modules/ehrenamt';
import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { ehrenAmtClusterIconCreator, featureHoverer, featureStyler } from '../utils/ehrenamtHelper';
import { modifyQueryPart } from '../utils/routingHelper';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		ehrenamt: state.ehrenamt
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(mappingActions, dispatch),
		uiStateActions: bindActionCreators(uiStateActions, dispatch),
		ehrenamtActions: bindActionCreators(ehrenamtActions, dispatch),
		routingActions: bindActionCreators(routerActions, dispatch)
	};
}

export class Ehrenamt_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gazeteerhHit = this.gazeteerhHit.bind(this);
		this.searchButtonHit = this.searchButtonHit.bind(this);
		this.featureClick = this.featureClick.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.doubleMapClick = this.doubleMapClick.bind(this);
		this.searchTooltip = this.searchTooltip.bind(this);
		this.selectNextIndex = this.selectNextIndex.bind(this);
		this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
		this.createfeatureCollectionByBoundingBox = this.createfeatureCollectionByBoundingBox.bind(
			this
		);
		this.filterChanged = this.filterChanged.bind(this);
		this.resetFilter = this.resetFilter.bind(this);
		this.centerOnPoint = this.centerOnPoint.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger(
			this.createfeatureCollectionByBoundingBox
		);
	}

	componentDidMount() {
		document.title = 'Ehrenamtskarte Wuppertal';
	}
	componentWillUnmount() {
		// console.log("Ehrenamt unmount")
	}

	componentWillMount() {
		// console.log("Ehrenamt mount")
		this.dataLoaded = false;
		this.loadTheOffers().then((data) => {
			this.dataLoaded = true;
		});
		this.props.uiStateActions.setApplicationMenuActiveKey('filtertab');
	}
	componentWillUpdate() {
		if (this.props.ehrenamt.offers.length === 0) {
			return;
		}
		let urlCart = queryString.parse(this.props.routing.location.search).cart;
		let urlCartIds = new Set();
		if (urlCart) {
			urlCartIds = new Set(
				urlCart.split(',').sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
			);
		}
		let cartIds = new Set(
			this.props.ehrenamt.cart
				.map((x) => x.id)
				.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
		);

		//        let missingIdsInUrl=new Set([...cartIds].filter(x => !urlCartIds.has(x)));
		let missingIdsInCart = new Set([ ...urlCartIds ].filter((x) => !cartIds.has(x)));

		if (missingIdsInCart.size > 0) {
			this.props.ehrenamtActions.addToCartByIds(Array.from(missingIdsInCart));
		}

		let newUrlCartArr = Array.from(cartIds).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

		let newUrlCart = newUrlCartArr.join();

		if (urlCart !== newUrlCart && newUrlCart.length > 0) {
			let pn = this.props.routing.location.pathname;
			if (pn.indexOf('ehrenamt') === -1) {
				pn = '/ehrenamt'; //in certain conditions the pathname does not contain ehrenamt. fix that.
			}
			let newRoute =
				pn +
				modifyQueryPart(this.props.routing.location.search, {
					cart: newUrlCart
				});
			console.log('push new route:' + newRoute);
			this.props.routingActions.push(newRoute);
		}
	}

	loadTheOffers() {
		var promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				this.props.ehrenamtActions.loadOffers();
				resolve('ok');
			}, 100);
		});
		return promise;
	}
	createfeatureCollectionByBoundingBox(bbox) {
		this.props.ehrenamtActions.createFeatureCollectionFromOffers(bbox);
	}

	gazeteerhHit(selectedObject) {}

	searchButtonHit(event) {}

	featureClick(event) {
		if (event.target.feature) {
			this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.index);
		}
	}

	doubleMapClick(event) {}

	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	centerOnPoint(x, y, z) {
		this.cismapRef.wrappedInstance.centerOnPoint(x, y, z);
	}

	selectNextIndex() {
		let potIndex = this.props.mapping.selectedIndex + 1;
		if (potIndex >= this.props.mapping.featureCollection.length) {
			potIndex = 0;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
		//this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
	}

	selectPreviousIndex() {
		let potIndex = this.props.mapping.selectedIndex - 1;
		if (potIndex < 0) {
			potIndex = this.props.mapping.featureCollection.length - 1;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
	}
	filterChanged(filtergroup, filter) {
		this.props.ehrenamtActions.toggleFilter(filtergroup, filter);
	}

	resetFilter() {
		if (this.props.ehrenamt.mode === ehrenamtConstants.FILTER_FILTER) {
			this.props.ehrenamtActions.resetFilter();
		} else {
			this.props.ehrenamtActions.setMode(ehrenamtConstants.FILTER_FILTER);
		}
	}
	searchTooltip() {
		return <div />;
	}

	render() {
		let info = null;
		info = (
			<EhrenamtInfo
				key={
					'ehrenamtInfo.' +
					(this.props.mapping.selectedIndex || 0) +
					'.cart:+JSON.stringify(this.props.ehrenamt.cart'
				}
				pixelwidth={250}
				featureCollection={this.props.mapping.featureCollection}
				filteredOffers={this.props.ehrenamt.filteredOffers}
				selectedIndex={this.props.mapping.selectedIndex || 0}
				next={this.selectNextIndex}
				previous={this.selectPreviousIndex}
				fitAll={this.gotoHome}
				downloadPlan={this.downloadPlan}
				downloadEverything={this.downloadEverything}
				filter={this.props.ehrenamt.filterX}
				resetFilter={this.resetFilter}
				showModalMenu={(section) =>
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section)}
				cart={this.props.ehrenamt.cart}
				toggleCartFromFeature={this.props.ehrenamtActions.toggleCartFromFeature}
				filterMode={this.props.ehrenamt.mode}
			/>
		);

		return (
			<div>
				<TopicMap
					ref={(cismap) => {
						this.cismapRef = cismap;
						this.topicMap = cismap;
					}}
					initialLoadingText='Laden der Angebote ...'
					home={{
						center: [ 51.24929, 7.180562 ],
						zoom: 8
					}}
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					gazetteerTopicsList={[ 'pois', 'bezirke', 'quartiere', 'adressen' ]}
					gazetteerSearchBoxPlaceholdertext='Stadtteil | Adresse | POI'
					infoBox={info}
					backgroundlayers={this.props.match.params.layers || 'wupp-plan-live@75'}
					dataLoader={this.props.ehrenamtActions.loadOffers}
					getFeatureCollectionForData={() => {
						return this.props.mapping.featureCollection;
					}}
					featureStyler={featureStyler}
					refreshFeatureCollection={() =>
						this.props.ehrenamtActions.createFeatureCollectionFromOffers(
							this.props.mapping.boundingBox
						)}
					setSelectedFeatureIndex={this.props.mappingActions.setSelectedFeatureIndex}
					featureHoverer={featureHoverer}
					clusteringEnabled={true}
					clusterOptions={{
						spiderfyOnMaxZoom: false,
						showCoverageOnHover: false,
						zoomToBoundsOnClick: false,
						maxClusterRadius: 40,
						disableClusteringAtZoom: 19,
						animate: false,
						cismapZoomTillSpiderfy: 12,
						selectionSpiderfyMinZoom: 12,
						iconCreateFunction: ehrenAmtClusterIconCreator
					}}
					applicationMenuTooltipString='Filter | Merkliste | Anleitung'
					modalMenu={
						<EhrenamtModalApplicationMenu
							key={
								'EhrenamtModalApplicationMenu.visible:' +
								this.props.uiState.applicationMenuVisible
							}
							zielgruppen={this.props.ehrenamt.zielgruppen}
							kenntnisse={this.props.ehrenamt.kenntnisse}
							globalbereiche={this.props.ehrenamt.globalbereiche}
							filterX={this.props.ehrenamt.filterX}
							filterChanged={this.filterChanged}
							filteredOffersCount={this.props.ehrenamt.filteredOffers.length}
							featureCollectionCount={this.props.mapping.featureCollection.length}
							offersMD5={this.props.ehrenamt.offersMD5}
							centerOnPoint={this.centerOnPoint}
						/>
					}
					// featureKeySuffixCreator={()=>{
					//     console.log("featureKeySuffixCreator called");
					//     return ".cart:"+JSON.stringify(this.props.ehrenamt.cart)
					// }}
				/>
			</div>
		);
	}
}

const Ehrenamt = connect(mapStateToProps, mapDispatchToProps)(Ehrenamt_);

export default Ehrenamt;

Ehrenamt.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
