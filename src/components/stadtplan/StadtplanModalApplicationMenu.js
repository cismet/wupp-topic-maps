import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Modal,
	Button,
	Accordion,
	Panel,
	FormGroup,
	Checkbox,
	Radio,
	ControlLabel,
	Label
} from 'react-bootstrap';
import { actions as UiStateActions } from '../../redux/modules/uiState';

import { getColorFromLebenslagenCombination } from '../../utils/stadtplanHelper';

import { Icon } from 'react-fa';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import queryString from 'query-string';

import MultiToggleButton from '../MultiToggleButton';

import { Link } from 'react-scroll';

import Chart from 'chart.js';

import { removeQueryPart, modifyQueryPart } from '../../utils/routingHelper';
import { getInternetExplorerVersion } from '../../utils/browserHelper';

import { routerActions } from 'react-router-redux';

import ReactChartkick, { PieChart } from 'react-chartkick';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';

/* eslint-disable jsx-a11y/anchor-is-valid */

ReactChartkick.addAdapter(Chart);

function mapStateToProps(state) {
	return { uiState: state.uiState, routing: state.routing };
}
function mapDispatchToProps(dispatch) {
	return {
		uiActions: bindActionCreators(UiStateActions, dispatch),
		routingActions: bindActionCreators(routerActions, dispatch)
	};
}

export class StadtplanModalApplicationMenu_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.close = this.close.bind(this);
		this.changePoiSymbolSize = this.changePoiSymbolSize.bind(this);
	}

	close() {
		this.props.uiActions.showApplicationMenu(false);
	}

	createOverviewRows(apps) {
		let rows = [];
		for (let item of this.props.lebenslagen) {
			let buttonValue = 'two'; // neutral state

			if (this.props.filter.positiv.indexOf(item) !== -1) {
				buttonValue = 'one';
			} else if (this.props.filter.negativ.indexOf(item) !== -1) {
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
									this.props.stadtplanActions.toggleFilter('positiv', item);
								} else if (selectedValue === 'three') {
									this.props.stadtplanActions.toggleFilter('negativ', item);
								} else {
									//deselect existing selection
									if (buttonValue === 'one') {
										this.props.stadtplanActions.toggleFilter('positiv', item);
									} else if (buttonValue === 'three') {
										this.props.stadtplanActions.toggleFilter('negativ', item);
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
	}

	changePoiSymbolSize(size) {
		this.props.stadtplanActions.setPoiSvgSize(size);
		this.props.mappingActions.setFeatureCollectionKeyPostfix('PoiSvgSize:' + size);
	}

	render() {
		let modalBodyStyle = {
			overflowY: 'auto',
			overflowX: 'hidden',
			maxHeight: this.props.uiState.height - 200
		};

		let clusteredPOIs =
			queryString.parse(this.props.routing.location.search).unclustered !== null;
		let customTitle = queryString.parse(this.props.routing.location.search).title;
		let titleDisplay = customTitle !== undefined;
		let namedMapStyle =
			queryString.parse(this.props.routing.location.search).mapStyle || 'default';

		let llOptions = [];
		let apps = new Map();

		for (let ll of this.props.lebenslagen) {
			llOptions.push({ label: ll, cat: 'lebenslage', value: ll });
			for (const app of this.props.apps) {
				if (app.on.indexOf(ll) !== -1) {
					apps.set(ll, app);
				}
			}
		}

		let overviewRows = this.createOverviewRows(apps);
		let stats = {};
		let colormodel = {};
		for (let poi of this.props.filteredPois) {
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

		let width = this.props.uiState.width;

		let widePieChartPlaceholder = null;
		let narrowPieChartPlaceholder = null;
		let widePreviewPlaceholder = null;
		let narrowPreviewPlaceholder = null;

		let pieChart = (
			<PieChart
				data={piechartData}
				donut={true}
				title='Verteilung'
				legend={false}
				colors={piechartColor}
			/>
		);

		let poiPreviewName;
		if (clusteredPOIs) {
			if (this.props.poiSvgSize === 45) {
				poiPreviewName = 'poi.preview.clustered.l.png';
			} else if (this.props.poiSvgSize === 35) {
				poiPreviewName = 'poi.preview.clustered.m.png';
			} else {
				poiPreviewName = 'poi.preview.clustered.s.png';
			}
		} else {
			if (this.props.poiSvgSize === 45) {
				poiPreviewName = 'poi.preview.unclustered.l.png';
			} else if (this.props.poiSvgSize === 35) {
				poiPreviewName = 'poi.preview.unclustered.m.png';
			} else {
				poiPreviewName = 'poi.preview.unclustered.s.png';
			}
		}

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
									<b>Mein Themenstadtplan:</b>
									{' '}Kultur ohne Gesellschaft
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
		}

		let preview = (
			<div>
				<FormGroup>
					<ControlLabel>Vorschau:</ControlLabel>
					<br />
					<div
						style={{
							backgroundImage:
								"url('/images/" +
								poiPreviewName +
								"')" +
								",url('/images/map.preview." +
								namedMapStyle +
								".png')",
							width: '100%',
							height: '250px',
							backgroundPosition: 'center'
						}}
					>
						{titlePreview}
					</div>
				</FormGroup>
			</div>
		);

		if (width < 995) {
			narrowPieChartPlaceholder = (
				<div>
					<br /> {pieChart}
				</div>
			);
			narrowPreviewPlaceholder = (
				<div>
					<br /> {preview}
				</div>
			);
		} else {
			widePieChartPlaceholder = <td>{pieChart}</td>;
			widePreviewPlaceholder = <td>{preview}</td>;
		}

		//additional Apps
		let additionalApps;
		let additionalAppArray = [];
		let usedApps = [];

		for (const app of this.props.apps) {
			for (const appLebenslage of app.on) {
				if (
					this.props.filter.positiv.indexOf(appLebenslage) !== -1 &&
					usedApps.indexOf(app.name) === -1
				) {
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

		return (
			<Modal
				style={{
					zIndex: 3000000000
				}}
				height='100%'
				bsSize='large'
				show={this.props.uiState.applicationMenuVisible}
				onHide={this.close}
				keyboard={false}
			>
				<Modal.Header>
					<Modal.Title>
						<Icon name='bars' />
						&nbsp;&nbsp;&nbsp;Mein Themenstadtplan, Einstellungen und Kompaktanleitung
					</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={modalBodyStyle}
					id='myMenu'
					key={this.props.uiState.applicationMenuActiveKey}
				>
					<span>
						Verwandeln Sie den Wuppertaler Online-Stadtplan in Ihren persönlichen
						Themenstadtplan.
						<br />
						W&auml;hlen Sie dazu unter{' '}
						<Link
							to='filter'
							containerId='myMenu'
							smooth={true}
							delay={100}
							onClick={() =>
								this.props.uiActions.setApplicationMenuActiveKey('filter')}
						>
							Mein Themenstadtplan
						</Link>{' '}
						die Themenfelder aus, zu denen Sie die Points Of Interest (POI) anzeigen
						oder ausblenden möchten. Über{' '}
						<Link
							to='settings'
							containerId='myMenu'
							smooth={true}
							delay={100}
							onClick={() =>
								this.props.uiActions.setApplicationMenuActiveKey('settings')}
						>
							Einstellungen
						</Link>{' '}
						können Sie die Karten- und POI-Darstellung an Ihre Vorlieben anpassen.
						W&auml;hlen Sie{' '}
						<Link
							to='help'
							containerId='myMenu'
							smooth={true}
							delay={100}
							onClick={() => this.props.uiActions.setApplicationMenuActiveKey('help')}
						>
							Kompaktanleitung
						</Link>{' '}
						für detailliertere Bedienungsinformationen.
					</span>
					<br />
					<br />

					<Accordion
						key={'filter'}
						defaultActiveKey={this.props.uiState.applicationMenuActiveKey || 'filter'}
						onSelect={() => {
							if (this.props.uiState.applicationMenuActiveKey === 'filter') {
								this.props.uiActions.setApplicationMenuActiveKey('none');
							} else {
								this.props.uiActions.setApplicationMenuActiveKey('filter');
							}
						}}
					>
						<Panel
							header={
								'Mein Themenstadtplan (' +
								this.props.filteredPois.length +
								' POI gefunden, davon ' +
								this.props.featureCollectionCount +
								' in der Karte)'
							}
							eventKey='filter'
							bsStyle='primary'
						>
							<div align='center'>
								<Button
									style={{
										margin: 4,
										marginLeft: 0
									}}
									bsSize='small'
									onClick={() => {
										this.props.stadtplanActions.clearFilter('negativ');
										this.props.stadtplanActions.setAllLebenslagenToFilter(
											'positiv'
										);
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
										this.props.stadtplanActions.clearFilter('positiv');
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
										this.props.stadtplanActions.clearFilter('negativ');
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
						</Panel>
					</Accordion>

					<Accordion
						key={'settings'}
						defaultActiveKey={this.props.uiState.applicationMenuActiveKey}
						onSelect={() => {
							if (this.props.uiState.applicationMenuActiveKey === 'settings') {
								this.props.uiActions.setApplicationMenuActiveKey('none');
							} else {
								this.props.uiActions.setApplicationMenuActiveKey('settings');
							}
						}}
					>
						<Panel header='Einstellungen' eventKey='settings' bsStyle='success'>
							<table border={0} width='100%'>
								<tbody>
									<tr>
										<td
											valign='top'
											style={{
												width: '330px'
											}}
										>
											<FormGroup>
												<ControlLabel>POI-Einstellungen:</ControlLabel>
												<br />
												<Checkbox
													readOnly={true}
													key={'title.checkbox' + titleDisplay}
													checked={titleDisplay}
													onClick={(e) => {
														if (e.target.checked === false) {
															this.props.routingActions.push(
																this.props.routing.location
																	.pathname +
																	removeQueryPart(
																		this.props.routing.location
																			.search,
																		'title'
																	)
															);
														} else {
															this.props.routingActions.push(
																this.props.routing.location
																	.pathname +
																	(this.props.routing.location
																		.search !== ''
																		? this.props.routing
																				.location.search
																		: '?') +
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
															this.props.routingActions.push(
																this.props.routing.location
																	.pathname +
																	removeQueryPart(
																		this.props.routing.location
																			.search,
																		'unclustered'
																	)
															);
														} else {
															this.props.routingActions.push(
																this.props.routing.location
																	.pathname +
																	(this.props.routing.location
																		.search !== ''
																		? this.props.routing
																				.location.search
																		: '?') +
																	'&unclustered'
															);
														}
														this.props.stadtplanActions.createFeatureCollectionFromPOIs();
													}}
													checked={clusteredPOIs}
													inline
												>
													POI ma&szlig;stabsabh&auml;ngig zusammenfassen
												</Checkbox>
												<br />
											</FormGroup>
											{getInternetExplorerVersion() === -1 && (
												<FormGroup>
													<br />
													<ControlLabel>Kartendarstellung:</ControlLabel>
													<br />
													<Radio
														readOnly={true}
														onClick={(e) => {
															if (e.target.checked === true) {
																this.props.routingActions.push(
																	this.props.routing.location
																		.pathname +
																		removeQueryPart(
																			this.props.routing
																				.location.search,
																			'mapStyle'
																		)
																);
															}
														}}
														checked={namedMapStyle === 'default'}
														name='mapBackground'
														inline
													>
														Tag
													</Radio>{' '}
													<Radio
														readOnly={true}
														onClick={(e) => {
															if (e.target.checked === true) {
																this.props.routingActions.push(
																	this.props.routing.location
																		.pathname +
																		modifyQueryPart(
																			this.props.routing
																				.location.search,
																			{ mapStyle: 'night' }
																		)
																);
															}
														}}
														name='mapBackground'
														checked={namedMapStyle === 'night'}
														inline
													>
														Nacht
													</Radio>{' '}
												</FormGroup>
											)}
											<FormGroup>
												<br />
												<ControlLabel>Symbolgr&ouml;&szlig;e:</ControlLabel>
												<br />

												<table border={0}>
													<tbody>
														<tr>
															<td
																style={{
																	paddingLeft: '6px',
																	paddingRight: '15px'
																}}
															>
																<a
																	onClick={() =>
																		this.changePoiSymbolSize(
																			25
																		)}
																>
																	<img
																		alt='minimal'
																		src='images/poi.25.png'
																	/>
																</a>
															</td>
															<td
																style={{
																	paddingLeft: '3px',
																	paddingRight: '15px'
																}}
															>
																<a
																	onClick={() =>
																		this.changePoiSymbolSize(
																			35
																		)}
																>
																	<img
																		alt='minimal'
																		src='images/poi.35.png'
																	/>
																</a>
															</td>
															<td>
																<a
																	onClick={() =>
																		this.changePoiSymbolSize(
																			45
																		)}
																>
																	<img
																		alt='minimal'
																		src='images/poi.45.png'
																	/>
																</a>
															</td>
														</tr>
														<tr
															border={1}
															style={{
																verticalAlign: 'top'
															}}
														>
															<td
																style={{
																	textAlign: 'center'
																}}
															>
																<Radio
																	style={{
																		marginTop: '0px'
																	}}
																	readOnly={true}
																	onClick={() =>
																		this.changePoiSymbolSize(
																			25
																		)}
																	name='poiSize25'
																	checked={
																		this.props.poiSvgSize === 25
																	}
																/>
															</td>
															<td
																style={{
																	textAlign: 'center'
																}}
															>
																<Radio
																	style={{
																		marginTop: '0px',
																		marginLeft: '0px'
																	}}
																	readOnly={true}
																	onClick={() =>
																		this.changePoiSymbolSize(
																			35
																		)}
																	name='poiSize35'
																	checked={
																		this.props.poiSvgSize === 35
																	}
																/>
															</td>
															<td
																style={{
																	textAlign: 'center'
																}}
															>
																<Radio
																	style={{
																		marginTop: '0px',
																		marginLeft: '7px'
																	}}
																	readOnly={true}
																	onClick={() =>
																		this.changePoiSymbolSize(
																			45
																		)}
																	name='poiSize45'
																	checked={
																		this.props.poiSvgSize === 45
																	}
																/>
															</td>
														</tr>
													</tbody>
												</table>
											</FormGroup>
										</td>
										{widePreviewPlaceholder}
									</tr>
								</tbody>
							</table>
							{narrowPreviewPlaceholder}
						</Panel>
					</Accordion>
					<Accordion
						name='help'
						key={'helptext' + this.props.uiState.applicationMenuActiveKey}
						defaultActiveKey={this.props.uiState.applicationMenuActiveKey}
						onSelect={() => {
							if (this.props.uiState.applicationMenuActiveKey === 'help') {
								this.props.uiActions.setApplicationMenuActiveKey('none');
							} else {
								this.props.uiActions.setApplicationMenuActiveKey('help');
							}
						}}
					>
						<Panel header='Kompaktanleitung' eventKey='help' bsStyle='default'>
							<div>
								<Link
									to='Datengrundlage'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='warning'>Datengrundlage</Label>{' '}
								</Link>
								<Link
									to='KartendarstellungPOI'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='warning'>Kartendarstellung der POI</Label>{' '}
								</Link>
								<Link
									to='POIauswahluabfragen'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='default'>POI auswählen und abfragen</Label>{' '}
								</Link>
								<Link
									to='InKartePositionieren'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='default'>In Karte positionieren</Label>{' '}
								</Link>
								<Link
									to='MeinStandort'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='default'>Mein Standort</Label>{' '}
								</Link>
								<Link
									to='MeinThemenstadtplan'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='primary'>Mein Themenstadtplan</Label>{' '}
								</Link>
								<Link
									to='Einstellungen'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='success'>Einstellungen</Label>{' '}
								</Link>
								<Link
									to='Personalisierung'
									containerId='myMenu'
									style={{
										textDecoration: 'none'
									}}
								>
									{' '}
									<Label bsStyle='success'>Personalisierung</Label>{' '}
								</Link>
							</div>

							<div name='Datengrundlage'>
								<br />
							</div>
							<h4>
								Datengrundlage{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Der Online-Stadtplan der Stadt Wuppertal basiert auf dem
								Stadtplanwerk 2.0 des Regionalverbandes Ruhrgebiet. Dieses
								innovative Kartenwerk kombiniert das Straßennetz der OpenStreetMap
								mit den Gebäuden und Flächennutzungen aus dem Fachverfahren ALKIS
								des Liegenschaftskatasters. Das Stadtplanwerk 2.0 wird wöchentlich
								in einem automatischen Prozess aktualisiert. Zusätzlich nutzt der
								Online-Stadtplan den Datensatz{' '}
								<a
									href='https://offenedaten-wuppertal.de/dataset/interessante-orte-wuppertal-poi'
									target='_opendata'
								>
									Interessante Orte Wuppertal (POI)
								</a>{' '}
								aus dem Open-Data-Angebot der Stadt Wuppertal.
							</p>

							<div name='KartendarstellungPOI'>
								<br />
							</div>
							<h4>
								Kartendarstellung der POI{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Jeder POI (Point of Interest, 'Interessanter Ort') ist einem oder
								mehreren übergeordneten Themenfeldern wie z. B. "<em>Freizeit</em>"
								oder "<em>Erholung</em>" zugeordnet. Die Hintergrundfarben der
								POI-Symbole stehen jeweils für eine eindeutige Kombination dieser
								Themenfelder, z. B. Hellgrün für "<em>Freizeit, Erholung</em>
								".
							</p>
							<p>
								Räumlich nah beieinander liegende Angebote werden standardmäßig
								maßstabsabhängig zu größeren Punkten zusammengefasst, mit der Anzahl
								der repräsentierten POI im Zentrum{' '}
								<img alt='Cluster' src='images/poi_zusammen.png' />. Vergrößern Sie
								ein paar Mal durch direktes Anklicken eines solchen Punktes oder mit{' '}
								<Icon name='plus' />
								die Darstellung, so werden die zusammengefassten POI Schritt für
								Schritt in die kleineren Symbole für die konkreten Einzel-POI
								zerlegt. Ab einer bestimmten Maßstabsstufe (Zoomstufe 12) führt ein
								weiterer Klick dazu, dass eine Explosionsgraphik der
								zusammengefassten POI angezeigt wird.
							</p>

							<div name='POIauswahluabfragen'>
								<br />
							</div>
							<h4>
								POI auswählen und abfragen{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Bewegen Sie den Mauszeiger im Kartenfenster auf einen konkreten
								Einzel-POI, um sich seine Bezeichnung anzeigen zu lassen. Ein Klick
								auf das zugehörige POI-Symbol setzt den Fokus auf diesen POI. Er
								wird dann blau hinterlegt und die zugehörigen Informationen
								(Bezeichnung, Info-Text und ggf. Adresse) werden in der Info-Box
								(unten rechts) angezeigt. (Auf einem Tablet-PC wird der Fokus durch
								das erste Antippen des Angebots gesetzt, das zweite Antippen blendet
								die Bezeichnung ein.) Außerdem werden Ihnen in der Info-Box
								weiterführende (Kommunikations-) Links zum POI angezeigt:{' '}
								<Icon name='external-link-square' />
								Internet, <Icon name='envelope-square' />
								E-Mail und
								<Icon name='phone' /> Telefon.
							</p>
							<p>
								Wenn Sie noch nicht aktiv einen bestimmten POI im aktuellen
								Kartenausschnitt selektiert haben, wird der Fokus automatisch auf
								den nördlichsten POI gesetzt. Mit den Funktionen{' '}
								<img alt='Cluster' src='images/vorher_treffer.png' />
								vorheriger Treffer und
								<img alt='Cluster' src='images/nachher_treffer.png' /> nächster
								Treffer können Sie in nördlicher bzw. südlicher Richtung alle
								aktuell im Kartenfenster angezeigten POI durchmustern.
							</p>
							<p>
								Zu einigen POI bieten wir Ihnen Fotos oder Fotoserien des bekannten
								Wuppertaler Fotographen Peter Krämer an. Sie finden dann ein
								Vorschaubild direkt über der Info-Box. Klicken Sie auf das
								Vorschaubild, um einen Bildbetrachter ("Leuchtkasten") mit dem
								Foto&nbsp;/&nbsp;der Fotoserie zu öffnen. Aus dem Bildbetrachter
								gelangen Sie über einen Link im Fußbereich auch zur Foto-Anwendung
								von Peter Krämer.
							</p>

							<div name='InKartePositionieren'>
								<br />
							</div>
							<h4>
								In Karte positionieren{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Um eine bestimmte Stelle des Stadtgebietes zu erkunden, geben Sie
								den Anfang eines Stadtteils (Stadtbezirk oder Quartier), einer
								Adresse, eines Straßennamens oder eines POI im Eingabefeld links
								unten ein (mindestens 2 Zeichen). In der inkrementellen Auswahlliste
								werden Ihnen passende Treffer angeboten. (Wenn Sie weitere Zeichen
								eingeben, wird der Inhalt der Auswahlliste angepasst.) Durch das
								vorangestellte Symbol erkennen Sie, ob es sich dabei um einen{' '}
								<Icon name='circle' />
								Stadtbezirk, ein
								<Icon name='pie-chart' /> Quartier, eine
								<Icon name='home' />
								Adresse, eine <Icon name='road' />
								Straße ohne zugeordnete Hausnummern, einen <Icon name='tag' />
								POI oder die
								<Icon name='tags' />
								alternative Bezeichnung eines POI handelt.
							</p>
							<p>
								Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die
								zugehörige Position zentriert. Bei Suchbegriffen mit Punktgeometrie
								(Adresse, Straße, POI) wird außerdem ein großer Maßstab (Zoomstufe
								14) eingestellt und ein Marker{' '}
								<img alt='Cluster' src='images/AdressMarker.jpg' />
								auf der Zielposition platziert. Bei Suchbegriffen mit
								Flächengeometrie (Stadtbezirk, Quartier) wird der Maßstab so
								eingestellt, dass die Fläche vollständig dargestellt werden kann.
								Zusätzlich wird der Bereich außerhalb dieser Fläche abgedunkelt
								(Spotlight-Effekt).
							</p>
							<p>
								Durch Anklicken des Werkzeugs
								<Icon name='times' />
								links neben dem Eingabefeld können Sie die Suche zurücksetzen
								(Entfernung von Marker bzw. Abdunklung, Löschen des Textes im
								Eingabefeld).
							</p>

							<div name='MeinStandort'>
								<br />
							</div>
							<h4>
								Mein Standort{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Mit der Funktion 'Mein Standort'
								<Icon name='map-marker' />
								können Sie ihren aktuellen Standort mit einem blauen Kreissymbol{' '}
								<img alt='Cluster' src='images/MeinStandpunktMarker.jpg' />
								in der Karte anzeigen. Das Standortsymbol ist umgeben von einem
								zweiten Kreis mit transparenter, blauer Füllung, dessen Radius die
								Unsicherheit der Positionsbestimmung angibt{' '}
								<img alt='Cluster' src='images/MeinStandpunktMarkerDoppel.jpg' />.
								Die Richtigkeit der Positionsanzeige ist dabei nicht garantiert,
								ihre Genauigkeit hängt davon ab, mit welcher Methode Ihr Endgerät
								und der von Ihnen verwendete Browser die Position bestimmen.
								Smartphones und Tablet-PC's sind i. d. R. mit einer GPS-Antenne
								ausgestattet, sodass Sie bei diesen Geräten eine
								Positionsgenauigkeit in der Größenordnung von 10 Metern erwarten
								können. Die Markierung Ihrer Position wird laufend automatisch
								aktualisiert. Ein weiterer Klick auf 'Mein Standort' schaltet die
								Anzeige Ihrer Position wieder ab.
							</p>

							<div name='MeinThemenstadtplan'>
								<br />
							</div>
							<h4>
								Mein Themenstadtplan{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Unter "<strong>Mein Themenstadtplan</strong>" können Sie im
								Anwendungsmenü
								<Icon name='bars' />
								auswählen, welche POI-Kategorien in der Karte dargestellt werden.
								Über die Schaltfläche{' '}
								<img alt='Cluster' src='images/sf_keinethemenausw.png' />
								können Sie die POI vollständig ausblenden - auch die Info-Box wird
								dann nicht mehr angezeigt.
							</p>
							<p>
								Zur Filterung der POI-Kategorien bieten wir Ihnen die oben
								beschriebenen Themenfelder an. Wählen Sie z. B. mit{' '}
								<Icon name='thumbs-up' />
								ausschließlich das Thema "<em>Kultur</em>" aus. Als Vorschau wird
								Ihnen ein Tortendiagramm angezeigt, das die Anzahl der zugehörigen
								POI und deren Verteilung auf die Themen-Kombinationen (hier "<em>Kultur, Gesellschaft</em>"
								und "<em>Kultur, Freizeit</em>
								") anzeigt. Bewegen Sie dazu den Mauszeiger auf eines der farbigen
								Segmente des Tortendiagramms. (Bei einem Gerät mit Touchscreen
								tippen Sie auf eines der farbigen Segmente.)
							</p>
							<p>
								Mit
								<Icon name='thumbs-down' />
								können Sie die POI, die dem entsprechenden Thema zugeordnet sind,
								ausblenden und dadurch die Treffermenge reduzieren. Schließen Sie
								jetzt z. B. das Thema "<em>Gesellschaft</em>" aus. Im Tortendiagramm
								werden Ihnen dann nur noch die POI mit der Themen-Kombination "<em>Kultur, Freizeit</em>"
								angezeigt (Theater, Museen etc.). Die POI mit der Kombination "
								<em>Kultur, Gesellschaft</em>" (Standorte von Verlagen und anderen
								Medienunternehmungen) wurden dagegen entfernt.
							</p>

							<div name='Einstellungen'>
								<br />
							</div>
							<h4>
								Einstellungen{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Unter "<strong>Einstellungen</strong>" können Sie im Anwendungsmenü{' '}
								<Icon name='bars' />
								festlegen, wie die POI und die Hintergrundkarte angezeigt werden
								sollen. Zu den POI können Sie auswählen, ob Ihre unter "
								<strong>Mein Themenstadtplan</strong>" festgelegte
								Lebenslagen-Filterung in einer Titelzeile ausgeprägt wird oder
								nicht. Weiter können Sie festlegen, ob räumlich nah beieinander
								liegende POI maßstabsabhängig zu einem Punktsymbol zusammengefasst
								werden oder nicht. Unter "
								<em>
									<strong>Symbolgröße</strong>
								</em>
								" können Sie in Abhängigkeit von Ihrer Bildschirmauflösung und Ihrem
								Sehvermögen auswählen, ob die POI mit kleinen (25 Pixel), mittleren
								(35 Pixel) oder großen (45 Pixel) Symbolen angezeigt werden.
							</p>
							<p>
								Unter "
								<em>
									<strong>Kartendarstellung</strong>
								</em>
								" können Sie auswählen, ob Sie die standardmäßig aktivierte farbige
								Hintergrundkarte verwenden möchten ("
								<em>Tag</em>
								") oder lieber eine invertierte Graustufenkarte ("
								<em>Nacht</em>
								"), zu der uns die von vielen PKW-Navis bei Dunkelheit eingesetzte
								Darstellungsweise inspiriert hat.
								<strong>Hinweis:</strong>
								Diese Auswahl wird Ihnen nur angeboten, wenn Ihr Browser
								CSS3-Filtereffekte unterstützt, also z. B. nicht beim Microsoft
								Internet Explorer. Die Nacht-Karte erzeugt einen deutlicheren
								Kontrast mit den farbigen Kita-Symbolen, die unterschiedlichen
								Flächennutzungen in der Hintergrundkarte lassen sich aber nicht mehr
								so gut unterscheiden wie in der Tag-Karte.
							</p>
							<p>
								Im Vorschaubild sehen Sie direkt die prinzipielle Wirkung ihrer
								Einstellungen.
							</p>

							<div name='Personalisierung'>
								<br />
							</div>
							<h4>
								Personalisierung{' '}
								<Link
									to='help'
									containerId='myMenu'
									style={{
										color: '#00000044'
									}}
								>
									<Icon name='arrow-circle-up' />
								</Link>
							</h4>
							<p>
								Ihre Themenauswahl und Einstellungen bleiben auch nach einem
								Neustart der Anwendung erhalten. (Es sei denn, Sie löschen den
								Browser-Verlauf einschließlich der gehosteten App-Daten.) Damit
								können Sie mit wenigen Klicks aus unserem Online-Stadtplan einen
								dauerhaft für Sie optimierten Themenstadtplan machen.
							</p>
						</Panel>
					</Accordion>
				</Modal.Body>

				<Modal.Footer>
					<table
						style={{
							width: '100%'
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'left',
										verticalAlign: 'top',
										paddingRight: '30px'
									}}
								>
									<GenericRVRStadtplanwerkMenuFooter />
								</td>
								<td>
									<Button bsStyle='primary' type='submit' onClick={this.close}>
										Ok
									</Button>
								</td>
							</tr>
						</tbody>
					</table>
				</Modal.Footer>
			</Modal>
		);
	}
}
const StadtplanModalApplicationMenu = connect(mapStateToProps, mapDispatchToProps)(
	StadtplanModalApplicationMenu_
);
export default StadtplanModalApplicationMenu;
StadtplanModalApplicationMenu.propTypes = {
	uiActions: PropTypes.object,
	uiState: PropTypes.object,
	ehrenamtState: PropTypes.object,
	stadtplanActions: PropTypes.object
};
