import React from 'react';
import {
	Tabs,
	Tab,
	FormGroup,
	ControlLabel,
	Button,
	Label,
	Checkbox,
	Radio
} from 'react-bootstrap';
import { Icon } from 'react-fa';

import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import 'url-search-params-polyfill';
import { getColorForProperties, getBadSVG } from '../../utils/baederHelper';
import { getColorFromLebenslagenCombination } from '../../utils/stadtplanHelper';
import {
	textConversion,
	getColorFromMainlocationTypeName,
	classifyMainlocationTypeName,
	getAllEinrichtungen
} from '../../utils/kulturstadtplanHelper';
import { MappingConstants, FeatureCollectionDisplay, getLayersByName } from 'react-cismap';
import MultiToggleButton from '../MultiToggleButton';
import queryString from 'query-string';

// import { Map } from 'react-leaflet';

import { getFeatureStyler } from '../../utils/stadtplanHelper';
// import {veranstaltungsorteColors} from '../../utils/kulturstadtplanHelper';

import Chart from 'chart.js';
import ReactChartkick, { PieChart } from 'react-chartkick';
ReactChartkick.addAdapter(Chart);

const ModalMenuFilteringSection = ({
	uiState,
	uiStateActions,
	width,
	height,
	urlPathname,
	urlSearch,
	pushNewRoute,
	changeMarkerSymbolSize,
	currentMarkerSize,
	topicMapRef,
	filteredPOIs,
	featureCollectionCount,
	veranstaltungsarten,
	apps,
	filter,
	filtermode = 'einrichtungen',
	filterchanged,
	offersMD5,
	stadtplanActions
}) => {
	console.log('filter', filter);

	let altOverviewRows = (
		<div>
			<h4> Filtern nach</h4>
			<Tabs
				id='controlled-tab-example'
				activeKey={filtermode}
				onSelect={(key) => {
					stadtplanActions.setFilterMode(key);
				}}
			>
				<Tab eventKey='einrichtungen' title='Einrichtungen'>
					<table style={{ width: '100%', margin: 8 }}>
						<tbody>
							<td align='center'>
								<a
									style={{
										margin: 4
									}}
									bsSize='small'
									onClick={() => {
										stadtplanActions.setAllToFilter('einrichtungen');
									}}
								>
									alle
								</a>
							</td>
							<td align='center'>
								<a
									style={{
										margin: 4
									}}
									bsSize='small'
									onClick={() => {
										stadtplanActions.clearFilter('einrichtungen');
									}}
								>
									keine
								</a>
							</td>
						</tbody>
					</table>

					{getAllEinrichtungen().map((einrichtung) => {
						return (
							<div key={'filter.kulturstadtplan.kategorien.div.' + einrichtung}>
								<Checkbox
									readOnly={true}
									key={'filter.kulturstadtplan.kategorie.' + einrichtung}
									onClick={(e) => {
										stadtplanActions.setFilterValueFor(
											'einrichtungen',
											einrichtung,
											e.target.checked
										);
									}}
									checked={filter.einrichtungen.indexOf(einrichtung) !== -1}
									inline
								>
									{textConversion(einrichtung)}{' '}
									<Icon
										style={{
											color: getColorFromMainlocationTypeName(einrichtung),
											width: '30px',
											textAlign: 'center'
										}}
										name={'circle'}
									/>
								</Checkbox>
							</div>
						);
					})}
				</Tab>
				<Tab eventKey='veranstaltungen' title='Veranstaltungen'>
					<table style={{ width: '100%', margin: 8 }}>
						<tbody>
							<td align='center'>
								<a
									style={{
										margin: 4
									}}
									bsSize='small'
									onClick={() => {
										stadtplanActions.setAllToFilter('veranstaltungen');
									}}
								>
									alle
								</a>
							</td>
							<td align='center'>
								<a
									style={{
										margin: 4
									}}
									bsSize='small'
									onClick={() => {
										stadtplanActions.clearFilter('veranstaltungen');
									}}
								>
									keine
								</a>
							</td>
						</tbody>
					</table>
					{veranstaltungsarten.map((art) => {
						return (
							<div>
								<Checkbox
									readOnly={true}
									key={'filter.kulturstadtplan.veranstaltungsart.' + art}
									onClick={(e) => {
										stadtplanActions.setFilterValueFor(
											'veranstaltungen',
											art,
											e.target.checked
										);
									}}
									checked={filter.veranstaltungen.indexOf(art) !== -1}
									inline
								>
									{textConversion(art)}
								</Checkbox>
							</div>
						);
					})}
				</Tab>
			</Tabs>
		</div>
	);

	let overviewRows = (
		<div>
			<FormGroup>
				<ControlLabel>
					Einrichtungen
					{'  '}
					{/* <Icon
						style={{
							color: 'grey',
							width: '30px',
							textAlign: 'center'
						}}
						size='2x'
						name={'pie-chart'}
					/> */}
				</ControlLabel>
				<br />
				{getAllEinrichtungen().map((einrichtung) => {
					return (
						<div key={'filter.kulturstadtplan.kategorien.div.' + einrichtung}>
							<Checkbox
								readOnly={true}
								key={'filter.kulturstadtplan.kategorie.' + einrichtung}
								onClick={(e) => {
									stadtplanActions.setFilterValueFor(
										'einrichtungen',
										einrichtung,
										e.target.checked
									);
								}}
								checked={filter.einrichtungen.indexOf(einrichtung) !== -1}
								inline
							>
								{textConversion(einrichtung)}{' '}
								<Icon
									style={{
										color: getColorFromMainlocationTypeName(einrichtung),
										width: '30px',
										textAlign: 'center'
									}}
									name={'circle'}
								/>
							</Checkbox>
						</div>
					);
				})}
				<br />
			</FormGroup>
			<FormGroup>
				<ControlLabel>
					Veranstaltungen
					{'  '}
					{/* <Icon
						style={{
							color: 'grey',
							width: '30px',
							textAlign: 'center'
						}}
						size='2x'
						name={'signal'}
					/> */}
				</ControlLabel>
				{veranstaltungsarten.map((art) => {
					return (
						<div>
							<Checkbox
								readOnly={true}
								key={'filter.kulturstadtplan.veranstaltungsart.' + art}
								onClick={(e) => {
									stadtplanActions.setFilterValueFor(
										'veranstaltungen',
										art,
										e.target.checked
									);
								}}
								checked={filter.veranstaltungen.indexOf(art) !== -1}
								inline
							>
								{textConversion(art)}
							</Checkbox>
						</div>
					);
				})}
				<br />
			</FormGroup>
		</div>
	);

	let zoom = 7;
	let layers = '';
	if (topicMapRef) {
		layers = topicMapRef.wrappedInstance.props.backgroundlayers;
	}

	let appsMap = new Map();

	let widePieChartPlaceholder = null;
	let narrowPieChartPlaceholder = null;
	let widePreviewPlaceholder = null;
	let narrowPreviewPlaceholder = null;

	let modalBodyStyle = {
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: height - 200
	};

	let clusteredPOIs = queryString.parse(urlSearch).unclustered !== null;
	let customTitle = queryString.parse(urlSearch).title;
	let titleDisplay = customTitle !== undefined;
	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';

	let llOptions = [];

	let stats = {};
	for (let poi of filteredPOIs) {
		const mltn = classifyMainlocationTypeName(poi.mainlocationtype.name);
		const mltnGUI = textConversion(mltn);

		if (stats[mltnGUI] === undefined) {
			stats[mltnGUI] = 1;
		} else {
			stats[mltnGUI] = stats[mltnGUI] + 1;
		}
	}

	//console.log(JSON.stringify(colormodel, null, 2));
	let piechartData = [];
	let piechartColor = [];

	for (let key in stats) {
		piechartData.push([ key, stats[key] ]);
		piechartColor.push(getColorFromMainlocationTypeName(key));
	}

	console.log('piechartData', piechartData);

	let pieChart = (
		<PieChart
			key={JSON.stringify(piechartData)}
			data={piechartData}
			donut={true}
			title='Verteilung'
			legend={false}
			colors={piechartColor}
		/>
		// <div style={{ width: 400 }} />
	);

	let titlePreview = null;
	if (titleDisplay) {
		titlePreview = (
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
								<b>Mein Kulturstadtplan:</b> Kultur ohne Gesellschaft
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
	let filterAlignment = 'left';
	if (width < 995) {
		narrowPieChartPlaceholder = (
			<div>
				<br /> {pieChart}
			</div>
		);
		filterAlignment = 'center';
	} else {
		widePieChartPlaceholder = <td>{pieChart}</td>;
	}

	let additionalApps;
	let additionalAppArray = [];
	let usedApps = [];

	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='filter'
			sectionTitle={
				'Mein Kulturstadtplan (' +
				filteredPOIs.length +
				' POI gefunden, davon ' +
				featureCollectionCount +
				' in der Karte)'
			}
			sectionBsStyle='primary'
			sectionContent={
				<div>
					{/* <div align='center'>
						<Button
							style={{
								margin: 4,
								marginLeft: 0
							}}
							bsSize='small'
							onClick={() => {
								stadtplanActions.setAllToFilter('einrichtungen');
							}}
						>
							alle Einrichtungen ausw&auml;hlen
						</Button>
						<Button
							style={{
								margin: 4
							}}
							bsSize='small'
							onClick={() => {
								stadtplanActions.clearFilter('einrichtungen');
							}}
						>
							keine Einrichtungen ausw&auml;hlen
						</Button>
						<Button
							style={{
								margin: 4
							}}
							bsSize='small'
							onClick={() => {
								stadtplanActions.setAllToFilter('veranstaltungen');
							}}
						>
							alle Veranstaltungen ausw&auml;hlen
						</Button>
						<Button
							style={{
								margin: 4
							}}
							bsSize='small'
							onClick={() => {
								stadtplanActions.clearFilter('veranstaltungen');
							}}
						>
							keine Veranstaltungen ausw&auml;hlen
						</Button>
					</div>
					<br /> */}
					<table border={0} width='100%'>
						<tbody>
							<tr>
								<td align={filterAlignment} valign='top'>
									<table border={0}>
										<tbody valign='top'>{altOverviewRows}</tbody>
									</table>
								</td>
								<td>{widePieChartPlaceholder}</td>
							</tr>
						</tbody>
					</table>
					{narrowPieChartPlaceholder}
					{additionalApps}
				</div>
			}
		/>
	);
};
export default ModalMenuFilteringSection;
