import React from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';

import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import 'url-search-params-polyfill';

import {
	getColorForProperties,
	getPOISVG,
	getPoiClusterIconCreatorFunction
} from '../../utils/stadtplanHelper';

import { MappingConstants, FeatureCollectionDisplay, getLayersByName } from 'react-cismap';

import { Map } from 'react-leaflet';
import previewFeatureCollection from './POIPreviewFeatureCollection';
import { removeQueryPart, modifyQueryPart } from '../../utils/routingHelper';
import queryString from 'query-string';

import { getFeatureStyler } from '../../utils/stadtplanHelper';

const ModalMenuSettingsSection = ({
	uiState,
	uiStateActions,
	width,
	urlPathname,
	urlSearch,
	pushNewRoute,
	changeMarkerSymbolSize,
	currentMarkerSize,
	topicMapRef,
	setLayerByKey,
	activeLayerKey,
	stadtplanActions,
	setFeatureCollectionKeyPostfix
}) => {
	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';
	let zoom = 7;
	let layers = '';
	let customTitle = queryString.parse(urlSearch).title;
	let clusteredPOIs = queryString.parse(urlSearch).unclustered !== null;
	let titleDisplay = customTitle !== undefined;
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
							<b>Mein Themenstadtplan:</b> Kultur ohne Gesellschaft
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
					'FeatureCollectionDisplayPreview.' +
					currentMarkerSize +
					'.clustering' +
					clusteredPOIs
				}
				featureCollection={previewFeatureCollection}
				clusteringEnabled={clusteredPOIs}
				style={getFeatureStyler(currentMarkerSize, getColorForProperties)}
				featureStylerScalableImageSize={currentMarkerSize}
				showMarkerCollection={false}
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
					iconCreateFunction: getPoiClusterIconCreatorFunction(currentMarkerSize)
				}}
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
				<br />
				<div style={{ marginBottom: marginBottomCorrection }}>
					<div>{mapPreview}</div>
					{titleDisplay === true && (
						<div
							style={{
								position: 'relative',
								top: -300,
								zIndex: 100000
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
			sectionBsStyle='success'
			sectionContent={
				<SettingsPanelWithPreviewSection
					width={width}
					preview={preview}
					settingsSections={[
						<div>
							<ControlLabel>POI-Einstellungen:</ControlLabel>
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
								Titel bei individueller Themenauswahl anzeigen
							</Checkbox>
							<br />
							<Checkbox
								readOnly={true}
								key={'clustered.checkbox' + clusteredPOIs}
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
									stadtplanActions.createFeatureCollectionFromPOIs();
									setFeatureCollectionKeyPostfix('clustered:' + e.target.checked);
								}}
								checked={clusteredPOIs}
								inline
							>
								POI ma&szlig;stabsabh&auml;ngig zusammenfassen
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
							getSymbolSVG={getPOISVG}
							symbolColor={'#1F4761'}
						/>
					]}
				/>
			}
		/>
	);
};

export default ModalMenuSettingsSection;
