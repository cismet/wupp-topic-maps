import { faClock, faInfoCircle, faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Icon } from 'react-fa';

const nameMap = {
	clock: faClock,
	phone: undefined, // faPhone,
	search: undefined,
	info: faInfoCircle,
	file: undefined,
	home: undefined,
	road: undefined,
	tags: undefined,
	tag: undefined,
	times: undefined,
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
	circle: undefined,
	'pie-chart': undefined,
	child: undefined,
	'map-marker': undefined,
	'battery-quarter': undefined,
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

	const icon = nameMap[props.name];
	if (icon !== undefined) {
		return <FontAwesomeIcon {...props} icon={icon} />;
	} else {
		return <Icon {...props} />;
	}
};

export default IconComp;
