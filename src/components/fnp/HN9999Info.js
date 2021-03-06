import PropTypes from 'prop-types';
import React from 'react';
import Color from 'color';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';
import InfoBoxHeader from 'components/commons/InfoBoxHeader';
import { getColorForHauptnutzung } from '../../utils/fnpHelper';
/* eslint-disable jsx-a11y/anchor-is-valid */

//printf 'const validFNPIcons=['; for file  in *.svg; printf '"'$file'"',; printf ']'

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ selectedFeature, collapsed, setCollapsed }) => {
	let headerBackgroundColor = Color(getColorForHauptnutzung(selectedFeature));

	let header = (
		<InfoBoxHeader
			headerColor={headerBackgroundColor}
			content={'nicht genehmigte Darstellung'}
		/>
	);

	const getLinkFromAEV = ({ aevs, defaultEl = <div />, skipStatus = false }) => {
		if (aevs !== undefined && aevs.length > 0) {
			let ret = [];
			for (const aev of aevs) {
				console.log('aev', aev);

				let statusText;
				let status = aev.properties.status;
				if (skipStatus === false) {
					if (status === 'r') {
						statusText = '';
					} else if (status === 'n') {
						statusText = ' (nicht rechtswirksam)';
					} else {
						statusText = ' (nicht rechtswirksame Teile)';
					}
				} else {
					statusText = '';
				}
				ret.push(
					<b>
						<a href={'/#/docs/aenderungsv/' + aev.text + '/'} target='_aenderungsv'>
							{aev.text +
								(aev.properties.verfahren === ''
									? '. FNP-Änderung' + statusText
									: '. FNP-Berichtigung' + statusText)}
						</a>
					</b>
				);
			}
			return ret;
		} else {
			return defaultEl;
		}
	};

	let sieheAuchLinks = undefined;
	if (selectedFeature.properties.siehe_auch_aev !== undefined) {
		sieheAuchLinks = getLinkFromAEV({
			aevs: selectedFeature.properties.siehe_auch_aev,
			skipStatus: true
		});
	}
	const bemArr = selectedFeature.properties.bem.split('+');
	console.log('selectedFeature.properties', selectedFeature.properties);
	let infoText = bemArr[2].trim();
	// const vorgeschlHN = bemArr[3].trim();
	const ursprLegende = (
		<div>
			Gemäß den Verfügungen der Bezirksregierung Düsseldorf vom 14.10. und 02.12.2004 von der
			Genehmigung nach § 6 BauGB ausgenommene Darstellungen (<b> Nr. {bemArr[1].trim()} </b>
			)
		</div>
	);

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
			{/* <p>
				<b>vorgeschlagene Hauptnutzung: </b>
				{vorgeschlHN}
			</p> */}

			<p>{ursprLegende}</p>
			{sieheAuchLinks !== undefined && (
				<p>
					<b>s. auch:</b>{' '}
					{sieheAuchLinks.length > 1 &&
						sieheAuchLinks.map((comp, index) => {
							if (index < sieheAuchLinks.length - 1) {
								return <span>{comp}, </span>;
							} else {
								return <span>{comp} (jeweils nicht rechtswirksam)</span>;
							}
						})}
					{sieheAuchLinks.length === 1 &&
						sieheAuchLinks.map((comp, index) => {
							return <span>{comp} (nicht rechtswirksam)</span>;
						})}
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
							<h4 style={{ margin: 9 }}>{infoText}</h4>
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
				noPadding={false}
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
