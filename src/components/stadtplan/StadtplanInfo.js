import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';
import { Icon } from 'react-fa';
import queryString from 'query-string';
import { getColorForProperties } from '../../utils/stadtplanHelper';
import Color from 'color';
import IconLink from '../commons/IconLink';
import CollapsibleWell from '../commons/CollapsibleWell';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for
// it.
const StadtplanInfo = ({
	featureCollection,
	filteredPOIs,
	selectedIndex,
	next,
	previous,
	fitAll,
	loadingIndicator,
	showModalMenu,
	uiState,
	uiStateActions,
	panelClick
}) => {
	const [ collapsedInfoBox, setCollapsedInfoBox ] = useState(false);
	const currentFeature = featureCollection[selectedIndex];

	let info = '';

	let maillink = null;
	let urllink = null;
	let phonelink = null;
	let eventlink = null;
	if (currentFeature) {
		if (currentFeature.properties.info) {
			info = currentFeature.properties.info;
		}

		if (currentFeature.properties.tel) {
			phonelink = (
				<a
					title='Anrufen'
					key={'stadtplan.poi.phone.action.'}
					href={'tel:' + currentFeature.properties.tel}
				>
					<Icon
						style={{
							color: 'grey',
							width: '26px',
							textAlign: 'center'
						}}
						size='2x'
						name={'phone'}
					/>
				</a>
			);
		}
		if (currentFeature.properties.email) {
			maillink = (
				<a
					title='E-Mail schreiben'
					key={'stadtplan.poi.mail.action.'}
					href={'mailto:' + currentFeature.properties.email}
				>
					<Icon
						style={{
							color: 'grey',
							width: '26px',
							textAlign: 'center'
						}}
						size='2x'
						name={'envelope-square'}
					/>
				</a>
			);
		}
		if (currentFeature.properties.url) {
			urllink = (
				<a
					title='Zur Homepage'
					key={'stadtplan.poi.url.action.'}
					href={currentFeature.properties.url}
					target='_blank'
					rel='noopener noreferrer'
				>
					<Icon
						style={{
							color: 'grey',
							width: '26px',
							textAlign: 'center'
						}}
						size='2x'
						name={'external-link-square'}
					/>
				</a>
			);
		}

		if (currentFeature.properties.wup_live_url) {
			eventlink = (
				<IconLink
					key={`IconLink.wupplive`}
					tooltip='Programm anzeigen'
					href={currentFeature.properties.wup_live_url}
					target='wupplive'
					iconname='calendar'
				/>
			);
		}
	}

	if (currentFeature) {
		let poiColor = Color(getColorForProperties(currentFeature.properties));

		let textColor = 'black';
		if (poiColor.isDark()) {
			textColor = 'white';
		}
		let llVis = (
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
								background: poiColor,
								color: textColor,
								opacity: '0.9',
								paddingLeft: '3px',
								paddingTop: '0px',
								paddingBottom: '0px'
							}}
						>
							{currentFeature.properties.mainlocationtype.lebenslagen.join(', ')}
						</td>
					</tr>
				</tbody>
			</table>
		);

		let openlightbox = (e) => {
			if (
				currentFeature.properties.fotostrecke === undefined ||
				currentFeature.properties.fotostrecke === null ||
				currentFeature.properties.fotostrecke.indexOf('&noparse') !== -1
			) {
				uiStateActions.setLightboxUrls([
					currentFeature.properties.foto.replace(
						/http:\/\/.*fotokraemer-wuppertal\.de/,
						'https://wunda-geoportal-fotos.cismet.de/'
					)
				]);
				uiStateActions.setLightboxTitle(currentFeature.text);
				let linkUrl;
				if (currentFeature.properties.fotostrecke) {
					linkUrl = currentFeature.properties.fotostrecke;
				} else {
					linkUrl = 'http://www.fotokraemer-wuppertal.de/';
				}
				uiStateActions.setLightboxCaption(
					<a href={linkUrl} target='_fotos'>
						<Icon name='copyright' />
						Peter Kr&auml;mer - Fotografie
					</a>
				);
				uiStateActions.setLightboxIndex(0);
				uiStateActions.setLightboxVisible(true);
			} else {
				fetch(
					currentFeature.properties.fotostrecke.replace(
						/http:\/\/.*fotokraemer-wuppertal\.de/,
						'https://wunda-geoportal-fotos.cismet.de/'
					),
					{ method: 'get' }
				)
					.then(function(response) {
						return response.text();
					})
					.then(function(data) {
						var tmp = document.implementation.createHTMLDocument();
						tmp.body.innerHTML = data;
						let urls = [];
						let counter = 0;
						let mainfotoname = decodeURIComponent(currentFeature.properties.foto)
							.split('/')
							.pop()
							.trim();
						let selectionWish = 0;
						for (let el of tmp.getElementsByClassName('bilderrahmen')) {
							let query = queryString.parse(
								el.getElementsByTagName('a')[0].getAttribute('href')
							);
							urls.push(
								'https://wunda-geoportal-fotos.cismet.de/images/' +
									query.dateiname_bild
							);
							if (mainfotoname === query.dateiname_bild) {
								selectionWish = counter;
							}
							counter += 1;
						}
						uiStateActions.setLightboxUrls(urls);
						uiStateActions.setLightboxTitle(currentFeature.text);
						uiStateActions.setLightboxCaption(
							<a href={currentFeature.properties.fotostrecke} target='_fotos'>
								<Icon name='copyright' />
								Peter Kr&auml;mer - Fotografie
							</a>
						);
						uiStateActions.setLightboxIndex(selectionWish);
						uiStateActions.setLightboxVisible(true);
					})
					.catch(function(err) {
						console.log(err);
					});
			}
		};

		let fotoDiv;
		if (currentFeature.properties.foto) {
			fotoDiv = (
				<table
					style={{
						width: '100%'
					}}
				>
					<tbody>
						<tr>
							<td
								style={{
									textAlign: 'right',
									verticalAlign: 'top'
								}}
							>
								<a
									onClick={openlightbox}
									hrefx={
										currentFeature.properties.fotostrecke ||
										currentFeature.properties.foto
									}
									target='_fotos'
								>
									<img
										alt='Bild'
										style={{
											paddingBottom: '5px'
										}}
										src={currentFeature.properties.foto.replace(
											/http:\/\/.*fotokraemer-wuppertal\.de/,
											'https://wunda-geoportal-fotos.cismet.de/'
										)}
										width='150'
									/>
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			);
		}

		let adresse = currentFeature.properties.adresse;

		if (currentFeature.properties.stadt !== 'Wuppertal') {
			adresse += ', ' + currentFeature.properties.stadt;
		}

		return (
			<div>
				{fotoDiv}
				{llVis}
				<CollapsibleWell
					collapsed={collapsedInfoBox}
					setCollapsed={setCollapsedInfoBox}
					style={{
						pointerEvents: 'auto',
						padding: 0,
						paddingLeft: 9
					}}
					debugBorder={0}
					tableStyle={{ margin: 0 }}
					fixedRow={true}
					alwaysVisibleDiv={
						<table
							style={{
								width: '100%'
							}}
						>
							<tbody>
								<tr>
									<td
										style={{
											textAlign: 'left'
										}}
									>
										<h5>
											<b>{currentFeature.text}</b>
										</h5>
									</td>
									<td
										style={{
											textAlign: 'right'
										}}
									>
										{urllink}
										{maillink}
										{phonelink}
										{eventlink}
									</td>
								</tr>
							</tbody>
						</table>
					}
					collapsibleDiv={
						<div style={{ marginBottom: 9, marginRight: 9 }}>
							<table
								style={{
									width: '100%'
								}}
							>
								<tbody>
									<tr>
										<td
											style={{
												textAlign: 'left'
											}}
										>
											<h6>
												{info.split('\n').map((item, key) => {
													return (
														<span key={key}>
															{item}
															<br />
														</span>
													);
												})}
											</h6>
											<p>{adresse}</p>
										</td>
									</tr>
								</tbody>
							</table>
							<table
								style={{
									width: '100%'
								}}
							>
								<tbody>
									<tr>
										<td />
										<td
											style={{
												textAlign: 'center',
												verticalAlign: 'center'
											}}
										>
											<a onClick={fitAll}>
												{filteredPOIs.length + ' '}POI in Wuppertal
											</a>
										</td>
										<td />
									</tr>
								</tbody>
							</table>
							<table
								style={{
									width: '100%'
								}}
							>
								<tbody>
									<tr>
										<td
											title='vorheriger Treffer'
											style={{
												textAlign: 'left',
												verticalAlign: 'center'
											}}
										>
											<a onClick={previous}>&lt;&lt;</a>
										</td>
										<td
											style={{
												textAlign: 'center',
												verticalAlign: 'center'
											}}
										>
											{featureCollection.length + ' '}POI angezeigt
										</td>

										<td
											title='nächster Treffer'
											style={{
												textAlign: 'right',
												verticalAlign: 'center'
											}}
										>
											<a onClick={next}>&gt;&gt;</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					}
					collapseButtonAreaStyle={{ background: '#cccccc', opacity: '0.9' }}
					onClick={panelClick}
					keyToUse='Wupp.TopicMaps.Stadtplan.mainInfoBox.CollapsibleWell'
				/>
			</div>
		);
	} else if (filteredPOIs.length > 0) {
		return (
			<CollapsibleWell
				collapsed={collapsedInfoBox}
				setCollapsed={setCollapsedInfoBox}
				pixelwidth={250}
				style={{
					pointerEvents: 'auto'
					// padding: 0,
					// paddingLeft: 9,
					// paddingTop: 9,
					// paddingBottom: 9
				}}
				debugBorder={0}
				tableStyle={{ margin: 0 }}
				fixedRow={false}
				alwaysVisibleDiv={<h5>Keine POI gefunden!</h5>}
				collapsibleDiv={
					<div>
						<p>
							Für mehr POI Ansicht mit <Icon name='minus-square' /> verkleinern. Um
							nach Themenfeldern zu filtern, das
							<a onClick={() => showModalMenu('filter')}>
								{' '}
								Men&uuml;&nbsp;
								<Icon
									name='bars'
									style={{
										color: 'black'
									}}
								/>{' '}
								&ouml;ffnen.
							</a>
						</p>
						<div align='center'>
							<a onClick={fitAll}>{filteredPOIs.length + ' '}POI in Wuppertal</a>
						</div>
					</div>
				}
				onClick={(e) => e.stopPropagation()}
				keyToUse='Wupp.TopicMaps.Stadtplan.mainInfoBox.CollapsibleWell'
			/>
		);
	} else {
		return null;
	}
};

export default StadtplanInfo;
StadtplanInfo.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	filteredPOIs: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,
	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired,
	showModalMenu: PropTypes.func.isRequired,
	panelClick: PropTypes.func.isRequired
};

StadtplanInfo.defaultProps = {
	featureCollection: [],
	filteredPOIs: [],
	selectedIndex: 0,
	next: () => {},
	previous: () => {},
	fitAll: () => {},
	showModalMenu: () => {}
};
