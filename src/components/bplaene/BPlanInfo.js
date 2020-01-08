import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Well, Tooltip } from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import Icon from 'components/commons/Icon';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';
import Color from 'color';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const BPlanInfo = ({
	featureCollection,
	selectedIndex,
	next,
	previous,
	fitAll,
	loadingIndicator,
	loadingError,
	downloadPlan,
	downloadEverything,
	preparedDownload,
	resetPreparedDownload,
	collapsed,
	setCollapsed
}) => {
	const currentFeature = featureCollection[selectedIndex];
	let headertext;
	let headerColor;

	let logCurrentFeature = function() {
		//console.log(JSON.stringify(currentFeature));
	};

	let planOrPlanteile_rk;
	let planOrPlanteile_nrk;
	let dokumentArt = '';

	if (
		currentFeature.properties.plaene_rk.length + currentFeature.properties.plaene_nrk.length >
		1
	) {
		dokumentArt = 'PDF Dokumente';
	} else {
		dokumentArt = 'PDF Dokument';
	}

	if (
		currentFeature.properties.plaene_rk.length > 1 ||
		currentFeature.properties.plaene_rk.length === 0
	) {
		planOrPlanteile_rk = 'rechtskräftigen Planteilen';
	} else {
		planOrPlanteile_rk = 'rechtskräftigem Plan';
	}
	if (
		currentFeature.properties.plaene_nrk.length > 1 ||
		currentFeature.properties.plaene_nrk.length === 0
	) {
		planOrPlanteile_nrk = 'nicht rechtskräftigen Planteilen';
	} else {
		planOrPlanteile_nrk = 'nicht rechtskräftigem Plan';
	}

	let nichtRK = '';
	if (currentFeature.properties.plaene_nrk.length > 0) {
		nichtRK = ' und ' + currentFeature.properties.plaene_nrk.length + ' ' + planOrPlanteile_nrk;
	}

	let docOrDocs;
	if (currentFeature.properties.docs.length === 0) {
		docOrDocs = 'Dokumente';
	} else if (currentFeature.properties.docs.length > 0) {
		docOrDocs = 'Zusatzdokumenten';
	} else {
		docOrDocs = 'Zusatzdokument';
	}

	let zusatzdokumente = '';
	if (currentFeature.properties.docs.length > 0) {
		zusatzdokumente = ' und ' + currentFeature.properties.docs.length + ' ' + docOrDocs;
	}

	const planTooltip = (
		<Tooltip style={{ zIndex: 3000000000 }} id='planTooltip'>
			{dokumentArt} mit{' '}
			{currentFeature.properties.plaene_rk.length +
				' ' +
				planOrPlanteile_rk +
				nichtRK +
				zusatzdokumente}
		</Tooltip>
	);

	let statusGlyphs = null;
	let status = currentFeature.properties.status;
	//let rk=(<FontAwesome name='check-circle-o' />);
	let rktt = (
		<Tooltip style={{ zIndex: 3000000000 }} id='rktt'>
			rechtswirksam
		</Tooltip>
	);
	let nrktt = (
		<Tooltip style={{ zIndex: 3000000000 }} id='nrktt'>
			laufendes Verfahren
		</Tooltip>
	);

	let rk = (
		<OverlayTrigger placement='top' overlay={rktt}>
			<Icon style={{ color: 'green', opacity: 0.5 }} name='check-circle-o' />
		</OverlayTrigger>
	);
	let nrk = (
		<OverlayTrigger placement='top' overlay={nrktt}>
			<Icon style={{ color: 'red', opacity: 0.5 }} name='times-circle-o' />
		</OverlayTrigger>
	);
	if (status === 'rechtskräftig') {
		statusGlyphs = (
			<span>
				&nbsp;
				{rk}
			</span>
		);
		headertext = 'rechtswirksam';
		headerColor = '#82BB8F'; //'#2AFF00';
	} else if (status === 'nicht rechtskräftig') {
		statusGlyphs = (
			<span>
				&nbsp;
				{nrk}
			</span>
		);
		headertext = 'nicht rechtswirksam';

		headerColor = '#F48286'; //'#FC0000'
	} else {
		statusGlyphs = (
			<span>
				&nbsp;
				{rk}
				&nbsp;
				{nrk}
			</span>
		);
		headertext = (
			<div>
				<Icon style={{ color: '#F48286' }} name='square-full' /> rechtswirksam | laufende
				Änderung
			</div>
		);
		headerColor = '#82BB8F'; //'#2AFF00';
	}

	let downloaderOverlay = <div />;
	if (preparedDownload) {
		downloaderOverlay = (
			<div
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					height: '100%',
					verticalAlign: 'center',
					width: '100%',
					position: 'absolute',
					zIndex: 999,
					top: 0,
					left: 0
				}}
			>
				<div
					style={{
						paddingTop: 5,
						color: 'rgba(255, 255, 255, 0.8)',
						textAlign: 'center',
						verticalAlign: 'center'
					}}
				/>
				<div style={{ position: 'absolute', top: 5, right: 5 }}>
					{' '}
					<a
						onClick={() => resetPreparedDownload()}
						style={{ color: 'rgba(255, 255, 255, 0.8)' }}
					>
						<Icon name='close' />
					</a>
				</div>
				<a
					style={{
						textAlign: 'center',
						verticalAlign: 'center',
						height: '100%',
						width: '100%'
					}}
					onClick={() => {
						//downloadSingleFile(preparedDownload);
						resetPreparedDownload();
					}}
					href={preparedDownload.url}
					download={preparedDownload.file}
					target='_blank'
					rel='noopener noreferrer'
				>
					<h1>
						<Icon name='arrow-circle-o-down' />
						<Icon name='check' />
					</h1>
				</a>

				<div
					style={{
						color: 'rgba(255, 255, 255, 0.8)',
						textAlign: 'center',
						height: '100%',
						width: '100%'
					}}
				>
					<p style={{ paddingLeft: '8px', paddingRight: '8px', paddingBottom: '4px' }}>
						Die Zusammenstellung Ihrer Dokumente kann jetzt abgeholt werden. Dazu
						einfach auf das Downloadsymbol klicken oder alternativ den Prozess mit{' '}
						<Icon name='close' /> abbrechen.
					</p>
				</div>
			</div>
		);
	}
	let LoadableBackground = 'rgba(0, 0, 0, 0.7)';
	let loadableText = 'Zusammenstellen der Dokumente ...';
	let loadableSpinner = true;
	if (loadingError === true) {
		LoadableBackground = 'rgba(164, 10, 0, 0.7)';
		loadableText = 'Fehler beim Laden';
		loadableSpinner = false;
	}

	let divWhenLarge = (
		<div>
			<table border={0} style={{ width: '100%' }}>
				<tbody>
					<tr>
						<td
							style={{
								textAlign: 'left',
								verticalAlign: 'top',
								padding: '5px',
								maxWidth: '160px',
								overflowWrap: 'break-word'
							}}
						>
							<h4>
								B-Plan {currentFeature.properties.nummer}
								{/* {statusGlyphs} */}
							</h4>
							<h6>{currentFeature.properties.name}</h6>
						</td>
						<td
							style={{
								textAlign: 'center',
								verticalAlign: 'top',
								padding: '5px',
								paddingTop: '1px'
							}}
						>
							<a style={{ color: '#333' }} onClick={downloadPlan}>
								<h4 style={{ marginLeft: 5, marginRight: 5 }}>
									<font size='30'>
										<OverlayTrigger placement='left' overlay={planTooltip}>
											<Icon
												style={{ textDecoration: 'none' }}
												name='file-pdf-o'
											/>
										</OverlayTrigger>
									</font>
								</h4>
								<OverlayTrigger placement='left' overlay={planTooltip}>
									<div>Dokumente</div>
								</OverlayTrigger>
							</a>
						</td>
					</tr>
				</tbody>
			</table>
			<br />
			<table style={{ width: '100%' }}>
				<tbody>
					<tr>
						<td style={{ textAlign: 'left', verticalAlign: 'center' }}>
							<a title='vorheriger Treffer' onClick={previous}>
								&lt;&lt;
							</a>
						</td>

						<td style={{ textAlign: 'center', verticalAlign: 'center' }}>
							<a onClick={fitAll}>alle {featureCollection.length} Treffer anzeigen</a>
						</td>
						<td style={{ textAlign: 'right', verticalAlign: 'center' }}>
							<a title='nächster Treffer' onClick={next}>
								&gt;&gt;
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);

	let divWhenCollapsed = (
		<div>
			<table border={0} style={{ width: '100%' }}>
				<tbody>
					<tr>
						<td
							style={{
								textAlign: 'left',
								verticalAlign: 'top',
								padding: '5px',
								maxWidth: '160px',
								overflowWrap: 'break-word'
							}}
						>
							<h4>
								B-Plan {currentFeature.properties.nummer}
								{/* {statusGlyphs} */}
							</h4>
						</td>
						<td
							style={{
								textAlign: 'center',
								verticalAlign: 'center',
								padding: '5px',
								paddingTop: '1px'
							}}
						>
							<a style={{ color: '#333' }} onClick={downloadPlan}>
								<h4 style={{ marginLeft: 5, marginRight: 5 }}>
									<OverlayTrigger placement='left' overlay={planTooltip}>
										<Icon
											style={{ textDecoration: 'none', fontSize: 26 }}
											name='file-pdf-o'
										/>
									</OverlayTrigger>
								</h4>
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
	let headerBackgroundColor = Color(headerColor);

	let textColor = 'black';
	if (headerBackgroundColor.isDark()) {
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
							background: headerColor,
							color: textColor,
							opacity: '0.9',
							paddingLeft: '3px',
							paddingTop: '0px',
							paddingBottom: '0px'
						}}
					>
						{headertext}
					</td>
				</tr>
			</tbody>
		</table>
	);
	return (
		<Loadable
			active={loadingIndicator}
			spinner={loadableSpinner}
			text={loadableText}
			background={LoadableBackground}
		>
			{llVis}
			<CollapsibleABWell
				collapsed={collapsed}
				divWhenLarge={divWhenLarge}
				divWhenCollapsed={divWhenCollapsed}
				setCollapsed={setCollapsed}
			/>
		</Loadable>
	);
};

export default BPlanInfo;
BPlanInfo.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,
	loadingIndicator: PropTypes.bool.isRequired,
	loadingError: PropTypes.bool.isRequired,
	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired,
	downloadPlan: PropTypes.func.isRequired,
	downloadEverything: PropTypes.func.isRequired
};
