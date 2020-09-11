import React from 'react';
import { FormGroup, Checkbox, Radio, ControlLabel } from 'react-bootstrap';
import { removeQueryPart } from '../../utils/routingHelper';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import { constants as kitasConstants } from '../../redux/modules/kitas';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { Map } from 'react-leaflet';
import { MappingConstants, FeatureCollectionDisplay, getLayersByName } from 'react-cismap';
import previewFeatureCollection from './PreviewFeatureCollection';
import {
	getFeatureStyler,
	getChildSVG,
	getKitaClusterIconCreatorFunction
} from '../../utils/kitasHelper';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import queryString from 'query-string';

// Since this component is simple and static, there's no parent container for it.
const KitasSettingsPanel = ({
	uiState,
	uiStateActions,
	urlPathname,
	urlSearch,
	pushNewRoute,
	currentMarkerSize,
	topicMapRef,
	setLayerByKey,
	activeLayerKey,
	changeMarkerSymbolSize,
	featureRendering,
	setFeatureRendering,
	refreshFeatureCollection,
	setFeatureCollectionKeyPostfix,
	featureCollectionKeyPostfix
}) => {
	let clusteredMarkers = queryString.parse(urlSearch).unclustered !== null;
	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';
	let customTitle = queryString.parse(urlSearch).title;
	let titleDisplay = customTitle !== undefined;

	let zoom = 8;
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
							<b>Mein Kita-Finder: </b> alle Kitas | unter 2 + ab 2 Jahre | 35h pro
							Woche
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
					'clustered:' +
					clusteredMarkers +
					'.customPostfix:' +
					featureCollectionKeyPostfix
				}
				featureCollection={previewFeatureCollection}
				clusteringEnabled={clusteredMarkers}
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
					iconCreateFunction: getKitaClusterIconCreatorFunction(
						currentMarkerSize,
						featureRendering
					)
				}}
				style={getFeatureStyler(currentMarkerSize, featureRendering)}
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
			sectionBsStyle='success'
			sectionContent={
				<SettingsPanelWithPreviewSection
					width={uiState.width}
					preview={preview}
					settingsSections={[
						<FormGroup>
							<ControlLabel>Kita-Einstellungen:</ControlLabel>
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
								Titel bei individueller Kita-Filterung anzeigen
							</Checkbox>
							<br />
							<Checkbox
								readOnly={true}
								key={'clustered.checkbox' + clusteredMarkers}
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
									refreshFeatureCollection();
									setFeatureCollectionKeyPostfix('clustered:' + e.target.checked);
								}}
								checked={clusteredMarkers}
								inline
							>
								Kitas ma&szlig;stabsabh&auml;ngig zusammenfassen
							</Checkbox>
						</FormGroup>,
						<FormGroup key={'featureRenderingCombos.' + featureRendering}>
							<ControlLabel>Zeichenvorschrift:</ControlLabel>
							<br />
							<Radio
								readOnly={true}
								onClick={(e) => {
									if (e.target.checked === true) {
										setFeatureRendering(
											kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP
										);
										setFeatureCollectionKeyPostfix(
											'rendering:' +
												kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP
										);
									}
								}}
								checked={
									featureRendering ===
									kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP
								}
								name='featureRendering'
								inline
							>
								nach Trägertyp
							</Radio>{' '}
							<br />
							<Radio
								readOnly={true}
								onClick={(e) => {
									if (e.target.checked === true) {
										setFeatureRendering(
											kitasConstants.FEATURE_RENDERING_BY_PROFIL
										);
										setFeatureCollectionKeyPostfix(
											'rendering:' +
												kitasConstants.FEATURE_RENDERING_BY_PROFIL
										);
									}
								}}
								name='featureRendering'
								checked={
									featureRendering === kitasConstants.FEATURE_RENDERING_BY_PROFIL
								}
								inline
							>
								nach Profil (Inklusionsschwerpunkt j/n)
							</Radio>{' '}
						</FormGroup>,
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
							getSymbolSVG={getChildSVG}
							symbolColor='#2BA1AF'
						/>
					]}
				/>
			}
		/>
	);
};

export default KitasSettingsPanel;
