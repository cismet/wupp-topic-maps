import React from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';

import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import 'url-search-params-polyfill';
import { getColorForProperties, getSymbolSVG } from '../../utils/emobHelper';
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
	let clusteredObjects = queryString.parse(urlSearch).unclustered !== null;
	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';
	let customTitle = queryString.parse(urlSearch).title;
	let titleDisplay = customTitle !== undefined;

	let zoom = 7;
	let layers = '';
	if (topicMapRef) {
		layers = topicMapRef.wrappedInstance.props.backgroundlayers;
	}

	let titlePreview = (
		<div
			style={{
				align: 'center',
				width: '100%'
			}}
		>
			<div
				style={{
					height: '10px'
				}}
			/>
			<table
				style={{
					width: '96%',
					height: '30px',
					margin: '0 auto',
					zIndex: 999655
				}}
			>
				<tbody>
					<tr>
						<td
							style={{
								textAlign: 'center',
								verticalAlign: 'middle',
								background: '#ffffff',
								color: 'black',
								opacity: '0.9',
								paddingleft: '10px'
							}}
						>
							<b>Meine Ladestationen: </b> passender Stecker | Ökostrom
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);

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
	let marginBottomCorrection = 0;
	if (titleDisplay) {
		marginBottomCorrection = -40;
	}
	const preview = (
		<div>
			<FormGroup>
				<ControlLabel>Vorschau:</ControlLabel>
				<div style={{ marginBottom: marginBottomCorrection }}>
					<div>{mapPreview}</div>
					{titleDisplay === true && (
						<div
							style={{
								position: 'relative',
								top: -300,
								zIndex: 100000,
								webkitTransform: 'translate3d(0,0,0)'
							}}
						>
							{titlePreview}
						</div>
					)}
				</div>
			</FormGroup>
		</div>
	);
	let backgroundModes;
	if (getInternetExplorerVersion() === -1) {
		backgroundModes = [
			{
				title: 'Stadtplan (Tag)',
				mode: 'default',
				layerKey: 'stadtplan'
			},
			{
				title: 'Stadtplan (Nacht)',
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
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='settings'
			sectionTitle='Einstellungen'
			sectionBsStyle='warning'
			sectionContent={
				<SettingsPanelWithPreviewSection
					width={width}
					preview={preview}
					settingsSections={[
						<div>
							<ControlLabel>Ladestationen-Einstellungen:</ControlLabel>
							<br />
							<Checkbox
								readOnly={true}
								key={'title.checkbox' + titleDisplay}
								checked={titleDisplay}
								onClick={(e) => {
									if (e.target.checked === false) {
										pushNewRoute(
											urlPathname + removeQueryPart(urlSearch, 'title')
										);
									} else {
										pushNewRoute(
											urlPathname +
												(urlSearch !== '' ? urlSearch : '?') +
												'&title'
										);
									}
								}}
								inline
							>
								Titel bei individueller Filterung anzeigen
							</Checkbox>
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
								Ladestationen ma&szlig;stabsabh&auml;ngig zusammenfassen
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
							getSymbolSVG={getSymbolSVG}
							symbolColor={getColorForProperties({
								online: true
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
