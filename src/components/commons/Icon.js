import {
	faClock,
	faInfoCircle,
	faSquareFull,
	faSearch,
	faFile,
	faSearchLocation,
	faChargingStation,
<<<<<<< HEAD
	faNumber
=======
	faCircle,
	faChartPie,
	faHome,
	faRoad,
	faTag,
	faTags,
	faChild,
	faTimes
>>>>>>> feature/041-fnp-dev-sprint
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Icon } from 'react-fa';

const nameMap = {
	clock: faClock,
	phone: undefined, // faPhone,
	search: faSearch,
	lupe: faSearch,
	'search-location': faSearchLocation,
	info: faInfoCircle,
	file: faFile,
<<<<<<< HEAD
	home: undefined,
	road: undefined,
	tags: undefined,
	tag: undefined,
	times: undefined,
=======
	home: faHome,
	adresse: faHome,
	road: faRoad,
	strasse: faRoad,
	tags: faTags,
	altpoi: faTags,
	tag: faTag,
	poi: faTag,
	times: faTimes,
	x: faTimes,
>>>>>>> feature/041-fnp-dev-sprint
	'external-link-square': undefined,
	'chevron-circle-down': undefined,
	user: undefined,
	calendar: undefined,
	bars: undefined,
	'minus-square': undefined,
	car: undefined,
	'chevron-circle-up': undefined,
	'arrow-circle-up': undefined,
	bicycle: undefined,
	circle: faCircle,
	stadtbezirk: faCircle,
	'pie-chart': faChartPie,
	quartier: faChartPie,
	child: faChild,
	kita: faChild,
	'map-marker': undefined,
	'battery-quarter': faChargingStation,
	'charging-station': faChargingStation,
	'square-full': faSquareFull
};

const IconComp = (props) => {
	// if (window.iconnames === undefined) {
	// 	window.iconnames = [ props.name ];
	// } else {
	// 	if (window.iconnames.indexOf(props.name) === -1) {
	// 		window.iconnames.push(props.name);
	// 	}
	// }
	// console.log('Icon.names', window.iconnames);

	let overlay = props.overlay;
	let lookupName = props.name;
	let icon = nameMap[lookupName];
<<<<<<< HEAD
=======
	let marginRight = props.marginRight || '1px';
	let width = props.width || '18px';
>>>>>>> feature/041-fnp-dev-sprint

	if (icon !== undefined) {
		if (overlay !== undefined) {
			return (
<<<<<<< HEAD
				<span
					className='fa-layers fa-w12 fa-lg'
					style={{ marginRight: '10px', width: '18px' }}
				>
=======
				<span className='fa-layers fa-w12 fa-lg' style={{ marginRight, width }}>
>>>>>>> feature/041-fnp-dev-sprint
					<FontAwesomeIcon icon={icon} />
					<span
						style={{ fontSize: '1.0rem', paddingRight: '2px', paddingTop: '3px' }}
						className='fa-layers-text fa-inverse'
						data-fa-transform='rotate-90'
					>
						{overlay}
					</span>
				</span>
			);
		} else {
			return <FontAwesomeIcon {...props} icon={icon} />;
		}
	} else {
		return <Icon {...props} />;
	}
};

export default IconComp;
