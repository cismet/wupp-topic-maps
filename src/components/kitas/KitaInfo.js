import React from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';
import { Icon } from 'react-fa';
import {
	getColorForProperties,
	getAgeString,
	getHoursString,
	getDescription
} from '../../utils/kitasHelper';
import Color from 'color';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const KitaInfo = ({
	featureCollection,
	filteredKitas,
	selectedIndex,
	next,
	previous,
	fitAll,
	loadingIndicator,
	showModalMenu,
	uiState,
	uiStateActions,
	panelClick,
	featureRendering
}) => {
	const currentFeature = featureCollection[selectedIndex];

	let urllink = null;
	let phonelink = null;

	if (currentFeature) {
		if (currentFeature.properties.tel) {
			phonelink = (
				<a
					title='Anrufen'
					key={'kitas.phone.action.'}
					href={'tel:' + currentFeature.properties.tel}
				>
					<Icon
						style={{ color: 'grey', width: '26px', textAlign: 'center' }}
						size='2x'
						name={'phone'}
					/>
				</a>
			);
		}

		if (currentFeature.properties.url) {
			urllink = (
				<a
					title='Zur Homepage'
					key={'kitas.url.action.'}
					href={currentFeature.properties.url}
					target='_blank'
				>
					<Icon
						style={{ color: 'grey', width: '26px', textAlign: 'center' }}
						size='2x'
						name={'external-link-square'}
					/>
				</a>
			);
		}
	}

	if (currentFeature) {
		let poiColor = Color(getColorForProperties(currentFeature.properties, featureRendering));

		let category;
		if (currentFeature.properties.plaetze_fuer_behinderte === true) {
			category = 'Kita mit Schwerpunkt Inklusion';
		} else {
			category = 'Kita';
		}

		let description = getDescription(currentFeature.properties);
		let alter = getAgeString(currentFeature.properties);

		let stunden = getHoursString(currentFeature.properties);

		let textColor = 'black';
		if (poiColor.isDark()) {
			textColor = 'white';
		}
		let llVis = (
			<table style={{ width: '100%' }}>
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
							{category}
						</td>
					</tr>
				</tbody>
			</table>
		);
		let adresse;
		if (currentFeature.properties.adresse) {
			adresse = ', ' + currentFeature.properties.adresse;
		} else {
			adresse = '';
		}

		return (
			<div>
				{llVis}
				<Well bsSize='small' onClick={panelClick}>
					<div>
						<table border={0} style={{ width: '100%' }}>
							<tbody>
								<tr>
									<td style={{ textAlign: 'left', verticalAlign: 'top' }}>
										<table border={0} style={{ width: '100%' }}>
											<tbody>
												<tr>
													<td
														style={{
															textAlign: 'left',
															padding: '5px',
															maxWidth: '190px',
															overflowWrap: 'break-word'
														}}
													>
														<h5>
															<b>
																{currentFeature.properties.name +
																	adresse}
															</b>
														</h5>
													</td>
													<td style={{ textAlign: 'right' }}>
														{urllink}
														{phonelink}
													</td>
												</tr>
											</tbody>
										</table>
										<table style={{ width: '100%' }}>
											<tbody>
												<tr>
													<td style={{ textAlign: 'left' }}>
														{/* <h5>{currentFeature.properties.adresse}</h5> */}
														<p>{description}</p>
														<p>
															<Icon
																style={{
																	color: 'grey',
																	width: '30px',
																	textAlign: 'center'
																}}
																size='2x'
																name={'user'}
															/>
															{alter}
															<Icon
																style={{
																	color: 'grey',
																	width: '40px',
																	textAlign: 'center'
																}}
																size='2x'
																name={'calendar'}
															/>
															{stunden}
														</p>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>

						<table style={{ width: '100%' }}>
							<tbody>
								<tr>
									<td />
									<td style={{ textAlign: 'center', verticalAlign: 'center' }}>
										<a onClick={fitAll}>
											{filteredKitas.length} Kitas in Wuppertal
										</a>
									</td>
									<td />
								</tr>
							</tbody>
						</table>
						<table style={{ width: '100%' }}>
							<tbody>
								<tr>
									<td
										title='vorheriger Treffer'
										style={{ textAlign: 'left', verticalAlign: 'center' }}
									>
										<a onClick={previous}>&lt;&lt;</a>
									</td>

									<td style={{ textAlign: 'center', verticalAlign: 'center' }}>
										{featureCollection.length} Kitas angezeigt
									</td>

									<td
										title='nächster Treffer'
										style={{ textAlign: 'right', verticalAlign: 'center' }}
									>
										<a onClick={next}>&gt;&gt;</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Well>
			</div>
		);
	} else if (filteredKitas.length > 0) {
		return (
			<Well bsSize='small' pixelwidth={250}>
				<h5>Keine Kitas gefunden!</h5>
				<p>
					Für mehr Kitas Ansicht mit <Icon name='minus-square' /> verkleinern. Um nach
					Themenfeldern zu filtern, das
					<a onClick={() => showModalMenu('filter')}>
						{' '}
						Men&uuml;&nbsp;
						<Icon name='bars' style={{ color: 'black' }} /> &ouml;ffnen.
					</a>
				</p>
				<div align='center'>
					<a onClick={fitAll}>{filteredKitas.length} Kitas in Wuppertal</a>
				</div>
			</Well>
		);
	} else {
		return null;
	}
};

export default KitaInfo;
KitaInfo.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	filteredKitas: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,
	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired,
	showModalMenu: PropTypes.func.isRequired,
	panelClick: PropTypes.func.isRequired
};

KitaInfo.defaultProps = {
	featureCollection: [],
	filteredKitas: [],
	selectedIndex: 0,
	next: () => {},
	previous: () => {},
	fitAll: () => {},
	showModalMenu: () => {}
};
