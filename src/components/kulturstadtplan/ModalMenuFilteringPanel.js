import React from 'react';
import { Tabs, Tab, Checkbox } from 'react-bootstrap';
import { Icon } from 'react-fa';

import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import 'url-search-params-polyfill';
import {
	textConversion,
	getColorFromMainlocationTypeName,
	classifyMainlocationTypeName,
	getAllEinrichtungen
} from '../../utils/kulturstadtplanHelper';

import Chart from 'chart.js';
import ReactChartkick, { PieChart } from 'react-chartkick';
ReactChartkick.addAdapter(Chart);

/* eslint-disable jsx-a11y/anchor-is-valid */

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
	let filterUI = (
		<td>
			<div style={{ width: '100%' }}>
				<h4> Filtern nach</h4>
				<Tabs
					style={{ width: '100%' }}
					id='controlled-tab-example'
					activeKey={filtermode}
					onSelect={(key) => {
						stadtplanActions.setFilterMode(key);
					}}
				>
					<Tab eventKey='einrichtungen' title='Einrichtungen'>
						<table style={{ width: '100%', margin: 8 }}>
							<tbody>
								<tr>
									<td align='center'>
										<a
											style={{
												margin: 4
											}}
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
											onClick={() => {
												stadtplanActions.clearFilter('einrichtungen');
											}}
										>
											keine
										</a>
									</td>
								</tr>
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
												color: getColorFromMainlocationTypeName(
													einrichtung
												),
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
								<tr>
									<td align='center'>
										<a
											style={{
												margin: 4
											}}
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
											onClick={() => {
												stadtplanActions.clearFilter('veranstaltungen');
											}}
										>
											keine
										</a>
									</td>
								</tr>
							</tbody>
						</table>
						{veranstaltungsarten.map((art) => {
							return (
								<div key={'div.filter.kulturstadtplan.veranstaltungsart.' + art}>
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
		</td>
	);

	let narrowPieChartPlaceholder = null;
	let widePieChartPlaceholder = null;

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

	let filterAlignment = 'left';
	if (width < 995) {
		narrowPieChartPlaceholder = (
			<div>
				<br /> {pieChart}
			</div>
		);
		filterAlignment = 'center';
	} else {
		widePieChartPlaceholder = (
			<table>
				<tbody>
					<tr>
						<td>{pieChart}</td>
					</tr>
				</tbody>
			</table>
		);
	}

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
					<table border={0} width='100%'>
						<tbody>
							<tr>
								<td align={filterAlignment} valign='top'>
									<table width='100%' border={0}>
										<tbody style={{ width: '100%' }} valign='top'>
											<tr>{filterUI}</tr>
										</tbody>
									</table>
								</td>
								<td>{widePieChartPlaceholder}</td>
							</tr>
						</tbody>
					</table>
					{narrowPieChartPlaceholder}
				</div>
			}
		/>
	);
};
export default ModalMenuFilteringSection;
