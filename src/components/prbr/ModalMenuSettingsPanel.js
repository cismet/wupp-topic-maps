import React from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';

import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import 'url-search-params-polyfill';
import { getColorForProperties, getPRSVG } from '../../utils/prbrHelper';
import { MappingConstants, FeatureCollectionDisplay, getLayersByName } from 'react-cismap';
import SVGInline from 'react-svg-inline';
import queryString from 'query-string';
import { removeQueryPart } from '../../utils/routingHelper';

import { Map } from 'react-leaflet';
import {
	getFeatureStyler,
	featureHoverer,
	getPoiClusterIconCreatorFunction
} from '../../utils/stadtplanHelper';

import previewFeatureCollection from './PreviewFeatureCollection';

const ModalMenuSettingsSection = ({
	uiState,
	uiStateActions,
	width,
	urlPathname,
	urlSearch,
	pushNewRoute,
	changeMarkerSymbolSize,
	currentMarkerSize = 45,
	topicMapRef,
	setLayerByKey,
	activeLayerKey,
	refreshFeatureCollection,
	setFeatureCollectionKeyPostfix
}) => {
	console.log('activeLayerKey', activeLayerKey);
	let clusteredObjects = queryString.parse(urlSearch).unclustered !== null;

	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';
	let zoom = 7;
	let layers = '';
	if (topicMapRef) {
		layers = topicMapRef.wrappedInstance.props.backgroundlayers;
	}
	const mapPreview = (
		<Map
			// ref={leafletMap => {
			//   this.leafletMap = leafletMap;
			// }}
			crs={MappingConstants.crs25832}
			style={{ height: 300 }}
			center={{
				lat: 51.26357182763206,
				lng: 7.176242149341344
			}}
			zoomControl={false}
			attributionControl={false}
			dragging={false}
			keyboard={false}
			zoom={zoom}
			minZoom={zoom}
			maxZoom={zoom}
		>
			{getLayersByName(layers, namedMapStyle)}
			<FeatureCollectionDisplay
				key={
					'FeatureCollectionDisplayPreview.' + currentMarkerSize + '.' + clusteredObjects
					// +
					//   this.props.featureKeySuffixCreator() +
					//   "clustered:" +
					//   this.props.clustered +
					//   ".customPostfix:" +
					//   this.props.featureCollectionKeyPostfix
				}
				clusteringEnabled={clusteredObjects}
				clusterOptions={{
					spiderfyOnMaxZoom: false,
					spiderfyDistanceMultiplier: currentMarkerSize / 24,
					showCoverageOnHover: false,
					zoomToBoundsOnClick: false,
					maxClusterRadius: 40,
					disableClusteringAtZoom: 19,
					animate: false,
					cismapZoomTillSpiderfy: 12,
					selectionSpiderfyMinZoom: 12,
					iconCreateFunction: getPoiClusterIconCreatorFunction(
						currentMarkerSize - 10,
						getColorForProperties
					)
				}}
				featureCollection={previewFeatureCollection}
				style={getFeatureStyler(currentMarkerSize, getColorForProperties)}
				featureStylerScalableImageSize={currentMarkerSize}
				//mapRef={topicMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
				showMarkerCollection={false}
			/>
		</Map>
	);
	const preview = (
		<div>
			<FormGroup>
				<ControlLabel>Vorschau:</ControlLabel>
				<br />
				{/* <div
					style={{
						backgroundImage:
							"url('/images/map.preview.default" +
							".png')",
						width: '100%',
						height: '250px',
						filter: filter,
						backgroundPosition: 'center'
					}}
				>
				</div> */}
				{mapPreview}
			</FormGroup>
		</div>
	);
	let backgroundModes;
	if (getInternetExplorerVersion() === -1) {
		backgroundModes = [
			{
				title: 'Stadtplan (mehrfarbig)',
				mode: 'default',
				layerKey: 'stadtplan'
			},
			{
				title: 'Stadtplan (Nachtmodus)',
				mode: 'night',
				layerKey: 'stadtplan'
			},
			{ title: 'Luftbildkarte', mode: 'default', layerKey: 'lbk' }
		];
	} else {
		backgroundModes = [
			{
				title: 'Stadtplan',
				mode: 'default',
				layerKey: 'stadtplan'
			},
			{ title: 'Luftbildkarte', mode: 'default', layerKey: 'lbk' }
		];
	}
	console.log('setLayerByKey', setLayerByKey);

	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='settings'
			sectionTitle='Einstellungen'
			sectionBsStyle='primary'
			sectionContent={
				<SettingsPanelWithPreviewSection
					width={width}
					preview={preview}
					settingsSections={[
						<div>
							<ControlLabel>P+R / B+R -Einstellungen:</ControlLabel>
							<br />

							<Checkbox
								readOnly={true}
								key={'clustered.checkbox' + clusteredObjects}
								onClick={(e) => {
									if (e.target.checked === true) {
										pushNewRoute(
											urlPathname + removeQueryPart(urlSearch, 'unclustered')
										);
									} else {
										pushNewRoute(
											urlPathname +
												(urlSearch !== '' ? urlSearch : '?') +
												'&unclustered'
										);
									}
									//stadtplanActions.createFeatureCollectionFromPOIs();
									setFeatureCollectionKeyPostfix('clustered:' + e.target.checked);
								}}
								checked={clusteredObjects}
								inline
							>
								Anlagen ma&szlig;stabsabh&auml;ngig zusammenfassen
							</Checkbox>
							<br />
						</div>,
						<NamedMapStyleChooser
							currentNamedMapStyle={namedMapStyle}
							pathname={urlPathname}
							search={urlSearch}
							pushNewRoute={pushNewRoute}
							vertical
							setLayerByKey={setLayerByKey}
							activeLayerKey={activeLayerKey}
							modes={backgroundModes}
						/>,
						<SymbolSizeChooser
							changeMarkerSymbolSize={changeMarkerSymbolSize}
							currentMarkerSize={currentMarkerSize}
							getSymbolSVG={getPRSVG}
							symbolColor={getColorForProperties({
								more: { zugang: 'öffentlich', betreiber: 'Verein' }
							})}
							additionalConfig={{
								smallSize: 35,
								midSize: 45,
								largeSize: 55
							}}
						/>
					]}
				/>
			}
		/>
	);
};

export default ModalMenuSettingsSection;
