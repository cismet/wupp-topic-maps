import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip, Well } from 'react-bootstrap';
/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const Comp = ({
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
	resetPreparedDownload
}) => {
	const currentFeature = featureCollection[selectedIndex];

	let logCurrentFeature = function() {
		//console.log(JSON.stringify(currentFeature));
	};

	let docOrDocs;
	let mainDocOrDocs;
	if (currentFeature.properties.docUrls.length > 0) {
		mainDocOrDocs = 'Dokumente';
		if (currentFeature.properties.docUrls.length > 1) {
			docOrDocs = 'Zusatzdokumenten';
		} else {
			docOrDocs = 'Zusatzdokument';
		}
	} else {
		mainDocOrDocs = 'Dokument';
	}

	let zusatzdokumente = '';
	if (currentFeature.properties.docUrls.length > 0) {
		zusatzdokumente = ' mit ' + currentFeature.properties.docUrls.length + ' ' + docOrDocs;
	}

	const planTooltip = (
		<Tooltip style={{ zIndex: 3000000000 }} id='planTooltip'>
			PDF-Dokument {zusatzdokumente}
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
	if (status === 'r') {
		statusGlyphs = (
			<span>
				&nbsp;
				{rk}
			</span>
		);
	} else if (status === 'n') {
		statusGlyphs = (
			<span>
				&nbsp;
				{nrk}
			</span>
		);
	} else {
		statusGlyphs = (
			<span>
				&nbsp;
				{rk}
				&nbsp;
				{nrk}
			</span>
		);
	}

	let rechtswirksam_seit;

	if (currentFeature.properties.rechtswirk !== undefined) {
		const [ y, m, d ] = currentFeature.properties.rechtswirk.split('-');

		rechtswirksam_seit = d + '.' + m + '.' + y;
	}
	console.log('currentFeature', currentFeature);

	const bpl = currentFeature.properties.bplan_nr;
	const bplArr = bpl.split('+');
	const linkArr = [];
	bplArr.forEach((nr, index) => {
		linkArr.push(
			<span>
				<a
					href={`/#/docs/bplaene/${currentFeature.properties.bplan_nr}/1`}
					target='_bplaene'
				>
					B-Plan {nr}
				</a>
				{index < bplArr.length - 1 ? ', ' : ''}
			</span>
		);
	});
	return (
		<Well bsSize='small' onClick={logCurrentFeature}>
			<div>
				<table border={0} style={{ width: '100%' }}>
					<tbody>
						<tr>
							<td
								style={{
									textAlign: 'left',
									verticalAlign: 'top',
									padding: '5px',
									maxWidth: '180px',
									overflowWrap: 'break-word'
								}}
							>
								<h4>
									{currentFeature.properties.verfahren === '' ? (
										'FNP-Änderung'
									) : (
										'FNP-Berichtigung'
									)}{' '}
									{currentFeature.text}
									{statusGlyphs}
								</h4>
								{currentFeature.properties.bplan_nr !== undefined && (
									<h6>
										<b>Anlass: {linkArr} </b>
									</h6>
								)}
								{rechtswirksam_seit !== undefined && (
									<h6>
										<b>rechtswirksam seit:</b> {rechtswirksam_seit}
									</h6>
								)}
							</td>
							<td
								style={{
									textAlign: 'center',
									verticalAlign: 'top',
									padding: '5px',
									paddingTop: '1px'
								}}
							>
								<a
									style={{ color: '#333' }}
									href={currentFeature.properties.url}
									target='_aenderungsverfahren'
									onClick_={downloadPlan}
								>
									<h4 style={{ marginLeft: 5, marginRight: 5 }}>
										<font size='30'>
											<Icon
												style={{ textDecoration: 'none' }}
												name='file-pdf-o'
											/>
										</font>
									</h4>
									<OverlayTrigger placement='left' overlay={planTooltip}>
										<div>{mainDocOrDocs}</div>
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
								<a onClick={fitAll}>
									alle {featureCollection.length} Treffer anzeigen
								</a>
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
		</Well>
	);
};

export default Comp;
Comp.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,

	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired,
	downloadPlan: PropTypes.func.isRequired,
	downloadEverything: PropTypes.func.isRequired
};
