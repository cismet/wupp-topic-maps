import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { Icon } from 'react-fa';
import { Well, Button } from 'react-bootstrap';
import Legend from './Legend';
import { Map, Control, DomUtil, DomEvent } from 'leaflet';
import L from 'leaflet';
/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const InfoBox = ({
	pixelwidth,
	selectedSimulation,
	simulationLabels,
	backgrounds,
	selectedBackgroundIndex,
	setBackgroundIndex,
	minified,
	minify,
	legendObject,
	featureInfoModeActivated = false,
	setFeatureInfoModeActivation,
	featureInfoValue,
	showModalMenu,
	mapClickListener,
	mapRef,
	mapCursor
}) => {
	const legend = <Legend legendObjects={legendObject} />;
	let headerColor = '#7e7e7e';
	if (featureInfoValue) {
		for (const item of legendObject) {
			if (featureInfoValue > item.lt) {
				headerColor = item.bg;
			}
		}
	}
	if (featureInfoValue <= 0) {
		featureInfoValue = 0;
	}

	const featureInfoModeButton = (
		<div
			key='featureInfoModeButton'
			style={{ marginBottom: 5, textAlign: 'right', pointerEvents: 'auto' }}
		>
			<Button
				id='cmdShowGetFeatureInfo'
				title='Maximalen Wasserstand abfragen'
				onClick={(e) => {
					e.stopPropagation();
					setFeatureInfoModeActivation(true);
				}}
			>
				<Icon name='crosshairs' />
			</Button>
		</div>
	);

	const featureInfoModeBox = (
		<div
			onClick={(e) => e.stopPropagation()}
			key='featureInfoModeBox'
			style={{
				pointerEvents: 'auto',
				marginBottom: 5,
				float: 'right',
				width: '60%',
				height_: '145px'
			}}
		>
			<table style={{ width: '100%' }}>
				<tbody>
					<tr>
						<td
							style={{
								opacity: '0.9',
								paddingLeft: '2px',
								paddingRight: '15px',
								paddingTop: '0px',
								paddingBottom: '0px',
								background: headerColor,
								textAlign: 'left'
							}}
						>
							Maximaler Wasserstand
						</td>
						<td
							style={{
								opacity: '0.9',
								paddingLeft: '0px',
								paddingTop: '0px',
								paddingRight: '2px',
								paddingBottom: '0px',
								background: headerColor,
								textAlign: 'right'
							}}
						>
							<a
								onClick={() => {
									setFeatureInfoModeActivation(false);
								}}
								style={{ color: 'black' }}
							>
								<Icon name='close' />{' '}
							</a>
						</td>
					</tr>
				</tbody>
			</table>
			<Well
				bsSize='small'
				style={{
					opacity: '0.9',
					paddingBottom: '0px'
				}}
			>
				<table style={{ width: '100%', paddingBottom: '0px' }}>
					<tbody>
						<tr>
							<td
								style={{
									opacity: '0.9',
									paddingLeft: '0px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								{featureInfoValue !== undefined && (
									<h2
										style={{
											marginTop: 0,
											marginBottom: 0,
											textAlign: 'center'
										}}
									>
										{getRoundedValueStringForValue(featureInfoValue)}
									</h2>
								)}
								{featureInfoValue === undefined && (
									<p>
										Klick in die Karte zur Abfrage des simulierten max.
										Wasserstandes
									</p>
								)}
							</td>
						</tr>
						{featureInfoValue !== undefined && (
							<tr>
								<td
									style={{
										opacity: '0.9',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '2px',
										textAlign: 'center'
									}}
								>
									<a onClick={() => showModalMenu('aussagekraft')}>
										Information zur Aussagekraft
									</a>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</Well>
		</div>
	);

	const legendTable = (
		<table onClick={(e) => e.stopPropagation()} key='legendTable' style={{ width: '100%' }}>
			<tbody>
				<tr>
					<td
						style={{
							opacity: '0.9',
							paddingLeft: '0px',
							paddingTop: '0px',
							paddingBottom: '0px'
						}}
					>
						{legend}
					</td>
				</tr>
			</tbody>
		</table>
	);

	const mainInfoBox = (
		<Well
			onClick={(e) => e.stopPropagation()}
			key='mainInfoBox'
			bsSize='small'
			style={{ pointerEvents: 'auto' }}
		>
			<table border={0} style={{ width: '100%' }}>
				<tbody>
					<tr>
						<td
							style={{
								opacity: '0.9',
								paddingLeft: '0px',
								paddingTop: '0px',
								paddingBottom: '0px',
								textAlign: 'left'
							}}
						>
							<h4 style={{ margin: 0, paddingBottom: '10px' }}>
								<Icon name={selectedSimulation.icon} /> {selectedSimulation.title}{' '}
								{'   '}
							</h4>
						</td>
						<td
							style={{
								textAlign: 'right',
								opacity: '0.9',
								paddingLeft: '0px',
								paddingTop: '0px',
								paddingBottom: '0px'
							}}
						>
							<h4 style={{ margin: 0 }}>
								<a style={{ textDecoration: 'none' }}>
									<Icon
										onClick={() => minify(!minified)}
										style={{ color: '#7e7e7e' }}
										name={
											minified ? 'chevron-circle-up' : 'chevron-circle-down'
										}
									/>
								</a>
							</h4>
						</td>
					</tr>
				</tbody>
			</table>
			{!minified && (
				<p style={{ marginBottom: 5 }}>
					{selectedSimulation.subtitle}{' '}
					<a onClick={() => showModalMenu('szenarien')}>(mehr)</a>
					{/* <a>
			<Icon style={{ paddingLeft: 3, fontSize: 16 }} name="info-circle" />
		</a> */}
				</p>
			)}
			{!minified && (
				<table border={0} style={{ width: '100%' }}>
					<tbody>
						<tr>
							<td
								style={{
									textAlign: 'center',
									paddingLeft: '0px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								<h5
									style={{
										textAlign: 'center',
										margin: '4px'
									}}
								>
									<b>Simulation</b>
								</h5>
							</td>
							<td
								style={{
									textAlign: 'center',
									paddingLeft: '0px',
									paddingTop: '0px',
									paddingBottom: '5px'
								}}
							>
								<h5
									style={{
										textAlign: 'center',
										margin: '4px'
									}}
								>
									<b>Karte</b>
								</h5>
							</td>
						</tr>
						<tr>
							<td
								style={{
									textAlign: 'center',
									paddingLeft: '0px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								<table
									border={0}
									style={{
										width: '100%'
									}}
								>
									<tbody>
										<tr>
											<td
												style={{
													textAlign: 'center',
													verticalAlign: 'center'
												}}
											>
												{simulationLabels[0]} {simulationLabels[1]}
											</td>
											<td
												style={{
													textAlign: 'center',
													verticalAlign: 'center'
												}}
											/>
										</tr>
										<tr>
											<td>
												{simulationLabels[2]} {simulationLabels[3]}
											</td>
										</tr>
									</tbody>
								</table>
							</td>
							<td
								key={'bgprev' + selectedBackgroundIndex}
								style={{
									textAlign: 'center',
									paddingLeft: '0px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								{backgrounds.map((item, index) => {
									let style;
									if (selectedBackgroundIndex === index) {
										style = {
											border: '3px solid #5f83b8',
											marginLeft: 7
										};
									} else {
										style = {
											//border: '3px solid #818180',
											marginLeft: 7
										};
									}
									return (
										<a
											key={'backgroundChanger.' + index}
											title={item.title}
											onClick={() => {
												setBackgroundIndex(index);
											}}
										>
											<img style={style} width='36px' src={item.src} />
										</a>
									);
								})}
							</td>
						</tr>
					</tbody>
				</table>
			)}
		</Well>
	);

	let infoComps = [];
	if (!featureInfoModeActivated) {
		infoComps.push(featureInfoModeButton);
	} else {
		infoComps.push(featureInfoModeBox);
	}
	infoComps.push(legendTable);
	infoComps.push(mainInfoBox);

	return (
		<div
			id='giveittoleaflet'
			onClick={(e) => {
				if (mapRef) {
					let point = L.point(e.clientX, e.clientY); // x=0,y=0
					let latlng = mapRef.containerPointToLatLng(point);
					mapClickListener({ latlng });
				}
			}}
			style={{ cursor: mapCursor }}
		>
			{infoComps}
		</div>
	);
};

export default InfoBox;
InfoBox.propTypes = {
	pixelwidth: PropTypes.number,
	selectedSimulation: PropTypes.object,
	simulationLabels: PropTypes.array,
	backgrounds: PropTypes.array,
	selectedBackgroundIndex: PropTypes.number,
	setBackgroundIndexv: PropTypes.func,
	minified: PropTypes.bool,
	minify: PropTypes.func,
	legend: PropTypes.object,
	featureInfoModeActivated: PropTypes.bool,
	showModalMenu: PropTypes.func
};

InfoBox.defaultProps = {
	showModalMenu: () => {}
};

const getRoundedValueStringForValue = (featureValue) => {
	if (featureValue > 1.5) {
		return `> 150 cm`;
	} else {
		return `ca. ${Math.round(featureValue * 10.0) * 10.0} cm`;
	}
};
