import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import CollapsibleWell from '../commons/CollapsibleWell';
import Legend from './Legend';

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

	let alwaysVisibleDiv = (
		<h4 style={{ margin: 0 }}>
			<Icon name={selectedSimulation.icon} /> {selectedSimulation.title} {'   '}
		</h4>
	);

	const collapsibleDiv = (
		<div>
			<p style={{ marginBottom: 5 }}>
				{selectedSimulation.subtitle}{' '}
				<a onClick={() => showModalMenu('szenarien')}>(mehr)</a>
			</p>
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
										<img alt='' style={style} width='36px' src={item.src} />
									</a>
								);
							})}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);

	return (
		<div
			id='giveittoleaflet'
			// onClick={(e) => {
			// 	if (mapRef) {
			// 		let point = L.point(e.clientX, e.clientY); // x=0,y=0
			// 		let latlng = mapRef.containerPointToLatLng(point);
			// 		mapClickListener({ latlng });
			// 	}
			// }}
			style={{ cursor: mapCursor }}
		>
			{legendTable}
			<CollapsibleWell
				collapsed={minified}
				setCollapsed={minify}
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
				alwaysVisibleDiv={alwaysVisibleDiv}
				collapsibleDiv={collapsibleDiv}
				onClick={(e) => e.stopPropagation()}
			/>
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
