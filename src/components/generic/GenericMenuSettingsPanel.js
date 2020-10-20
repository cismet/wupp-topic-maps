import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';

import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import 'url-search-params-polyfill';
import { getColorForProperties } from '../../containers/GenericTopMap';
import { MappingConstants, FeatureCollectionDisplay, getLayersByName } from 'react-cismap';

import { Map } from 'react-leaflet';

import { getFeatureStyler } from '../../utils/stadtplanHelper';

const GenericModalMenuSettingsSection = ({
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
	getSymbolSVG,
	previewMapPosition = 'lat=51.25606840617622&lng=7.188449776870144&zoom=7',
	previewFeatureCollection = []
}) => {
	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';

	let previewMapPositionParams = new URLSearchParams(previewMapPosition);
	let previewMapLng = previewMapPositionParams.get('lng') || '7.188449776870144';
	let previewMapLat = previewMapPositionParams.get('lat') || '51.25606840617622';
	let previewMapZoom = previewMapPositionParams.get('zoom') || '7';
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
				lat: previewMapLat,
				lng: previewMapLng
			}}
			zoomControl={false}
			attributionControl={false}
			dragging={false}
			keyboard={false}
			zoom={previewMapZoom}
			minZoom={previewMapZoom}
			maxZoom={previewMapZoom}
		>
			{getLayersByName(layers, namedMapStyle)}
			<FeatureCollectionDisplay
				key={
					'FeatureCollectionDisplayPreview.' + currentMarkerSize
					// +
					//   this.props.featureKeySuffixCreator() +
					//   "clustered:" +
					//   this.props.clustered +
					//   ".customPostfix:" +
					//   this.props.featureCollectionKeyPostfix
				}
				featureCollection={previewFeatureCollection}
				clusteringEnabled={false}
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
			sectionBsStyle='primary'
			sectionContent={
				<SettingsPanelWithPreviewSection
					width={width}
					preview={preview}
					settingsSections={[
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
							symbolColor={getColorForProperties(
								previewFeatureCollection[0].properties
							)}
						/>
					]}
				/>
			}
		/>
	);
};

export default GenericModalMenuSettingsSection;
