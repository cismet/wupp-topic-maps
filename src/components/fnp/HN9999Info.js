import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip, Well } from 'react-bootstrap';
import Color from 'color';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';
import InfoBoxHeader from 'components/commons/InfoBoxHeader';
import { getColorForHauptnutzung } from '../../utils/fnpHelper';
/* eslint-disable jsx-a11y/anchor-is-valid */

//printf 'const validFNPIcons=['; for file  in *.svg; printf '"'$file'"',; printf ']'

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ selectedFeature, collapsed, setCollapsed }) => {
	const currentFeature = selectedFeature;
	let headerBackgroundColor = Color(getColorForHauptnutzung(selectedFeature));

	let logCurrentFeature = function() {
		//console.log(JSON.stringify(currentFeature));
	};

	// let name = selectedFeature.text;

	// const nameParts = name.split('-');
	// const datetimeParts = (selectedFeature.properties.rechtswirksam || '').split(' ');
	// const dateParts = datetimeParts[0].split('-');
	// const date = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
	// const oberbegriff = nameParts[0];
	// const headerText = oberbegriff;
	// const os = selectedFeature.properties.os;
	// console.log('selectedFeature.properties.fnp_aender', selectedFeature.properties.fnp_aender);

	let header = (
		<InfoBoxHeader headerColor={headerBackgroundColor} content={'nicht genehmigte Fläche'} />
	);

	const getLinkFromAEV = (aev, defaultEl) => {
		if (aev !== undefined) {
			let statusText;
			let status = aev.properties.status;
			if (status === 'r') {
				statusText = '';
			} else if (status === 'n') {
				statusText = ' (nicht rechtswirksam)';
			} else {
				statusText = ' (nicht rechtswirksame Teile9';
			}
			return (
				<b>
					<a href={'/#/docs/aenderungsv/' + aev.text + '/'} target='_aenderungsv'>
						{aev.text +
							(aev.properties.verfahren === ''
								? '. FNP-Änderung' + statusText
								: '. FNP-Berichtigung' + statusText)}
					</a>
				</b>
			);
		} else {
			return defaultEl;
		}
	};

	const festgelegt = getLinkFromAEV(
		selectedFeature.properties.fnp_aender,
		<span>FNP vom 17.01.2005</span>
	);
	const intersectAEV = getLinkFromAEV(selectedFeature.properties.intersect_fnp_aender);

	const bemArr = selectedFeature.properties.bem.split('+');
	console.log('selectedFeature.properties', selectedFeature.properties);
	let infoText = bemArr[2].trim();
	const vorgeschlHN = bemArr[3].trim();
	const ursprLegende = (
		<div>
			Gemäß den Verfügungen der Bezirksregierung Düsseldorf vom 14.10.2004 und 02.12.2004
			(Az.35.2-11.14 (Wup neu)) von der Genehmigung nach § 6 BauGB ausgenommene Darstellungen
			(<b> Nr. {bemArr[1].trim()} </b>
			)
		</div>
	);

	let infoTextDiv;

	if (selectedFeature.properties.area > 0) {
		infoText = (
			<div>
				<span>{infoText} </span>
				<span style={{ whiteSpace: 'nowrap' }}>
					{'(' + (selectedFeature.properties.area + '').replace('.', ',') + ' ha)'}
				</span>
			</div>
		);
	} else if (selectedFeature.properties.area === 0) {
		infoText = (
			<div>
				<span>{infoText} </span>
				<span style={{ whiteSpace: 'nowrap' }}>({'<'} 0,1 ha)</span>
			</div>
		);
	}

	let divWhenLarge = (
		<div>
			<h4>{infoText}</h4>
			<p>
				<b>vorgeschlagene Hauptnutzung: </b>
				{vorgeschlHN}
			</p>

			<p>{ursprLegende}</p>
			{intersectAEV !== undefined && (
				<p>
					<b>siehe auch:</b> {intersectAEV}
				</p>
			)}
			{selectedFeature.properties.bplan_nr !== undefined && (
				<p>
					<b>Anlass: </b>{' '}
					<b>
						<a
							href={'/#/docs/bplaene/' + selectedFeature.properties.bplan_nr}
							target='_bplaene'
						>
							B-Plan {selectedFeature.properties.bplan_nr}
						</a>
					</b>
				</p>
			)}
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
								verticalAlign: 'middle',
								maxWidth: '160px',
								overflowWrap: 'break-word'
							}}
						>
							<h4>{infoText}</h4>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);

	return (
		<div>
			{header}
			<CollapsibleABWell
				collapsed={collapsed}
				divWhenLarge={divWhenLarge}
				divWhenCollapsed={divWhenCollapsed}
				setCollapsed={setCollapsed}
			/>
		</div>
	);
};

export default Comp;
Comp.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,

	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired
};
