import React from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';

import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import 'url-search-params-polyfill';

import { getPOISVG, getPoiClusterIconCreatorFunction } from '../../utils/stadtplanHelper';

import { getColorForProperties } from '../../utils/kulturstadtplanHelper';

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
							<b>Mein Kulturstadtplan:</b> alle Museen, Galerien und Theater
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
					iconCreateFunction: getPoiClusterIconCreatorFunction(
						currentMarkerSize,
						getColorForProperties
					)
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
							getSymbolSVG={(
								svgSize = 30,
								bg = '#FF0000',
								kind = '-',
								svgStyleRelatedId = 'default',
								svg
							) => {
								const museum = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20" height="20" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
								viewBox="0 0 200.019 200.019"
								 xmlns:xlink="http://www.w3.org/1999/xlink">
								 <g id="Ebene_x0020_1">
								  <metadata id="CorelCorpID_0Corel-Layer"/>
								  <polygon class="bg-fill" fill="#C32D6A" points="-0,0 200.019,0 200.019,200.019 -0,200.014 "/>
								  <path class="fg-fill" fill="#FFF" d="M11.7584 186.017l176.156 0 -12.8982 -25.0024 -0.000100009 0 -9.39908 0 0 -102.496 -41.1769 0 -24.3707 70.9875 -24.6554 -70.9875 -41.0821 0 0 102.496 -9.32988 0 -13.244 25.0024zm128.38 -25.0024l-26.4826 0 26.4826 -80.3522 0 80.3522zm-53.9385 0l-26.3896 0 0 -80.3522 26.3896 80.3522z"/>
								  <polygon fill="white" points="100.01,11.001 187.841,50.0047 12.8502,50.0047 "/>
								 </g>
								</svg>
								`;
								return getPOISVG(svgSize, bg, kind, svgStyleRelatedId, museum);
							}}
							symbolColor={'#A6AD3C'}
						/>
					]}
				/>
			}
		/>
	);
};

export default ModalMenuSettingsSection;
