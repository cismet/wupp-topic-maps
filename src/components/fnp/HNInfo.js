import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { OverlayTrigger, Tooltip, Well } from 'react-bootstrap';
import Color from 'color';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';
import InfoBoxHeader from 'components/commons/InfoBoxHeader';
import { getColorForHauptnutzung, aevFeatureStyler } from '../../utils/fnpHelper';
/* eslint-disable jsx-a11y/anchor-is-valid */

//printf 'const validFNPIcons=['; for file  in *.svg; printf '"'$file'"',; printf ']'
const validFNPIcons = [
	'0200.svg',
	'0410.svg',
	'0420.svg',
	'0431.svg',
	'0432.svg',
	'0433.svg',
	'0434.svg',
	'0435.svg',
	'0436.svg',
	'0437.svg',
	'0439.svg',
	'0440.svg',
	'0441.svg',
	'0442.svg',
	'1100.svg',
	'1200.svg',
	'1300.svg',
	'1400.svg',
	'1500.svg',
	'1600.svg',
	'1800.svg',
	'1840.svg',
	'1860.svg',
	'2120.svg',
	'3110.svg',
	'3115.svg',
	'3120.svg',
	'3140.svg',
	'3210.svg',
	'3220.svg',
	'3221.svg',
	'3222.svg',
	'3223.svg',
	'3230.svg',
	'3310.svg',
	'3320.svg',
	'3330.svg',
	'3341.svg',
	'3342.svg',
	'3343.svg',
	'3344.svg',
	'3345.svg',
	'3346.svg',
	'3360.svg',
	'3370.svg',
	'3382.svg',
	'3390.svg',
	'4101.svg'
];
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ selectedFeature, collapsed, setCollapsed }) => {
	const currentFeature = selectedFeature;
	let headerBackgroundColor = Color(getColorForHauptnutzung(selectedFeature));

	let logCurrentFeature = function() {
		//console.log(JSON.stringify(currentFeature));
	};

	let name = selectedFeature.text;
	const collapsedTitleRef = useRef(null);
	const iconRef = useRef(null);
	const datetimeParts = (selectedFeature.properties.rechtswirksam || '').split(' ');
	const dateParts = datetimeParts[0].split('-');
	const date = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];

	const nameParts = name.split('-');
	let infoText;
	let oberbegriff;

	if (nameParts.length === 1) {
		infoText = name;
		oberbegriff = name;
	} else if (nameParts.length === 2) {
		oberbegriff = nameParts[0];
		infoText = nameParts[1];
	} else {
		//>2
		oberbegriff = nameParts[0] + ' - ' + nameParts[1];
		nameParts.shift(); //erstes Element Weg
		nameParts.shift(); //zweites Element Weg
		infoText = nameParts.join('-');
	}

	const headerText = oberbegriff;
	const os = selectedFeature.properties.os;

	let header = <InfoBoxHeader headerColor={headerBackgroundColor} content={headerText} />;

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

	const festgelegt = getLinkFromAEV({
		aevs: selectedFeature.properties.fnp_aender,
		defaultEl: <span>FNP vom 17.01.2005</span>
	});
	let sieheAuchLinks = undefined;
	if (selectedFeature.properties.siehe_auch_aev !== undefined) {
		sieheAuchLinks = getLinkFromAEV({
			aevs: selectedFeature.properties.siehe_auch_aev,
			skipStatus: true
		});
	}

	if (selectedFeature.properties.area > 0) {
		infoText = (
			<div>
				<span>{infoText + ' '}</span>
				<span style={{ whiteSpace: 'nowrap' }}>
					{'(' + (selectedFeature.properties.area + '').replace('.', ',') + ' ha)'}
				</span>
			</div>
		);
	} else if (selectedFeature.properties.area === 0) {
		infoText = (
			<div>
				<span>{infoText + ' '}</span>
				<span style={{ whiteSpace: 'nowrap' }}>({'<'} 0,1 ha)</span>
			</div>
		);
	}

	let iconStyle = {
		borderColor: 'black',
		padding: 4,
		float: 'right',

		maxWidth: '80px'
	};

	if (collapsed === true) {
		iconStyle.height = '63px';
	} else {
	}

	let icon;
	if (validFNPIcons.indexOf(os + '.svg') !== -1) {
		icon = (
			<img
				ref={iconRef}
				alt=''
				style={iconStyle}
				src={'/images/fnp/' + os + '.svg'}
				onError={"this.style.display='none'"}
			/>
		);
	}

	let divWhenLarge = (
		<div style={{ padding: 9 }}>
			{icon}
			<h4 style={{ wordWrap: 'break-word' }}>{infoText}</h4>
			<p>
				<b>rechtswirksam seit: </b>
				{date}
			</p>

			<p>
				<b>festgelegt durch:</b> {festgelegt}
			</p>
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
					{sieheAuchLinks.length == 1 &&
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

	let paddingTop = 9;
	let margin = 9;
	if (collapsed === true && iconRef.current !== null) {
		console.log('iconRef', iconRef.current.clientHeight);
		const iconHeightWithoutPadding = iconRef.current.clientHeight;
		if (collapsedTitleRef.current !== null) {
			console.log('collapsedTitleRef', collapsedTitleRef.current.clientHeight);
			if (collapsedTitleRef.current.clientHeight < iconHeightWithoutPadding) {
				paddingTop =
					(iconHeightWithoutPadding - collapsedTitleRef.current.clientHeight) / 2;
				margin = 0;
			}
		}
	}
	let divWhenCollapsed = (
		<div style={{ paddingLeft: 9, paddingRight: 9 }}>
			{icon}
			<div style={{ paddingTop, paddingBottom: paddingTop }}>
				<h4 ref={collapsedTitleRef} style={{ verticalAlign: 'middle', margin }}>
					{infoText}
				</h4>
			</div>
		</div>
		// <div>
		// 	<table border={0} style={{ width: '100%' }}>
		// 		<tbody>
		// 			<tr>
		// 				<td
		// 					style={{
		// 						textAlign: 'left',
		// 						verticalAlign: 'middle',
		// 						padding: '5px',
		// 						maxWidth: '260px',
		// 						overflowWrap: 'break-word'
		// 					}}
		// 				>
		// 					<h4>{infoText}</h4>
		// 				</td>
		// 				<td
		// 					style={{
		// 						textAlign: 'center',
		// 						verticalAlign: 'center',
		// 						padding: '5px',
		// 						paddingTop: '1px'
		// 					}}
		// 				>
		// 					{icon}
		// 				</td>
		// 			</tr>
		// 		</tbody>
		// 	</table>
		// </div>
	);

	return (
		<div>
			{header}
			<CollapsibleABWell
				collapsed={collapsed}
				divWhenLarge={divWhenLarge}
				divWhenCollapsed={divWhenCollapsed}
				setCollapsed={setCollapsed}
				noPadding={true}
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
