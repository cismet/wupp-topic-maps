import React from 'react';
import { Button, Label } from 'react-bootstrap';

import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import 'url-search-params-polyfill';
import { getColorFromLebenslagenCombination } from '../../utils/stadtplanHelper';

import MultiToggleButton from '../MultiToggleButton';
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
	lebenslagen,
	apps,
	filter,
	filterchanged,
	offersMD5,
	stadtplanActions
}) => {
	const createOverviewRows = (apps) => {
		let rows = [];
		for (let item of lebenslagen) {
			let buttonValue = 'two'; // neutral state

			if (filter.positiv.indexOf(item) !== -1) {
				buttonValue = 'one';
			} else if (filter.negativ.indexOf(item) !== -1) {
				buttonValue = 'three';
			}

			let footnote;
			if (apps.has(item)) {
				footnote = ' *'; //(<div title="Themenspezifische Karte verfügbar"> *</div>);
			}
			let cb = (
				<tr key={'tr.for.mtbutton.lebenslagen.' + item}>
					<td
						key={'td1.for.mtbutton.lebenslagen.' + item}
						style={{
							textAlign: 'left',
							verticalAlign: 'top',
							padding: '5px'
						}}
					>
						<span
							style={{
								whiteSpace: 'nowrap'
							}}
						>
							{item}
							{footnote}
						</span>
					</td>
					<td
						key={'td2.for.mtbutton.lebenslagen.' + item}
						style={{
							textAlign: 'left',
							verticalAlign: 'top',
							padding: '5px'
						}}
					>
						<MultiToggleButton
							key={'mtbutton.lebenslagen.' + item}
							value={buttonValue}
							valueChanged={(selectedValue) => {
								if (selectedValue === 'one') {
									stadtplanActions.toggleFilter('positiv', item);
								} else if (selectedValue === 'three') {
									stadtplanActions.toggleFilter('negativ', item);
								} else {
									//deselect existing selection
									if (buttonValue === 'one') {
										stadtplanActions.toggleFilter('positiv', item);
									} else if (buttonValue === 'three') {
										stadtplanActions.toggleFilter('negativ', item);
									}
								}
							}}
						/>
					</td>
				</tr>
			);
			rows.push(cb);
		}
		return rows;
	};

	let appsMap = new Map();

	let widePieChartPlaceholder;
	let narrowPieChartPlaceholder;

	let llOptions = [];

	for (let ll of lebenslagen) {
		llOptions.push({ label: ll, cat: 'lebenslage', value: ll });
		for (const app of apps) {
			if (app.on.indexOf(ll) !== -1) {
				appsMap.set(ll, app);
			}
		}
	}

	let stats = {};
	let colormodel = {};
	for (let poi of filteredPOIs) {
		if (stats[poi.mainlocationtype.lebenslagen.join(', ')] === undefined) {
			const key = poi.mainlocationtype.lebenslagen.join(', ');
			stats[key] = 1;
			colormodel[key] = getColorFromLebenslagenCombination(key);
		} else {
			stats[poi.mainlocationtype.lebenslagen.join(', ')] =
				stats[poi.mainlocationtype.lebenslagen.join(', ')] + 1;
		}
	}

	//console.log(JSON.stringify(colormodel, null, 2));
	let piechartData = [];
	let piechartColor = [];

	for (let key in stats) {
		piechartData.push([ key, stats[key] ]);
		piechartColor.push(getColorFromLebenslagenCombination(key));
	}

	let pieChart = (
		<PieChart
			data={piechartData}
			donut={true}
			title='Verteilung'
			legend={false}
			colors={piechartColor}
		/>
	);

	if (width < 995) {
		narrowPieChartPlaceholder = (
			<div>
				<br /> {pieChart}
			</div>
		);
	} else {
		widePieChartPlaceholder = <td>{pieChart}</td>;
	}

	let additionalApps;
	let additionalAppArray = [];
	let usedApps = [];

	for (const app of apps) {
		for (const appLebenslage of app.on) {
			if (filter.positiv.indexOf(appLebenslage) !== -1 && usedApps.indexOf(app.name) === -1) {
				usedApps.push(app.name);
				additionalAppArray.push(
					<a
						key={'appLink_' + app.name}
						style={{
							textDecoration: 'none'
						}}
						href={app.link}
						target={app.target}
						rel='noopener noreferrer'
					>
						<Label
							bsStyle={app.bsStyle}
							style={{
								backgroundColor: app.backgroundColor,
								marginRight: '5px'
							}}
						>
							{app.name}
						</Label>
					</a>
				);
			}
		}
	}

	if (usedApps.length > 0) {
		additionalApps = (
			<div>
				<hr />
				<strong>* Themenspezifische Karten:</strong>
				{'  '}
				<h4>{additionalAppArray}</h4>
			</div>
		);
	}
	let overviewRows = createOverviewRows(appsMap);

	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='filter'
			sectionTitle={
				'Mein Themenstadtplan (' +
				filteredPOIs.length +
				' POI gefunden, davon ' +
				featureCollectionCount +
				' in der Karte)'
			}
			sectionBsStyle='primary'
			sectionContent={
				<div>
					<div align='center'>
						<Button
							style={{
								margin: 4,
								marginLeft: 0
							}}
							bsSize='small'
							onClick={() => {
								stadtplanActions.clearFilter('negativ');
								stadtplanActions.setAllLebenslagenToFilter('positiv');
							}}
						>
							alle Themen ausw&auml;hlen
						</Button>
						<Button
							style={{
								margin: 4
							}}
							bsSize='small'
							onClick={() => {
								stadtplanActions.clearFilter('positiv');
							}}
						>
							keine Themen ausw&auml;hlen
						</Button>
						<Button
							style={{
								margin: 4
							}}
							bsSize='small'
							onClick={() => {
								stadtplanActions.clearFilter('negativ');
							}}
						>
							keine Themen ausschlie&szlig;en
						</Button>
					</div>
					<br />
					<table border={0} width='100%'>
						<tbody>
							<tr>
								<td align='center'>
									<table border={0}>
										<tbody>{overviewRows}</tbody>
									</table>
								</td>
								{widePieChartPlaceholder}
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
