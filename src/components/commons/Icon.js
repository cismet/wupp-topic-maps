import {
	faClock,
	faInfoCircle,
	faSquareFull,
	faSearch,
	faFile,
	faSearchLocation,
	faChargingStation,
	faNumber
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Icon } from 'react-fa';

const nameMap = {
	clock: faClock,
	phone: undefined, // faPhone,
	search: faSearch,
	'search-location': faSearchLocation,
	info: faInfoCircle,
	file: faFile,
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

	let overlay;
	let icon;
	let lookupName;
	if (props.name.indexOf('!') !== -1) {
		const tmp = props.name.split('!');
		lookupName = tmp[0];
		overlay = tmp[1];
	} else {
		lookupName = nameMap[props.name];
	}

	icon = nameMap[lookupName];
	if (icon !== undefined) {
		if (overlay !== undefined) {
			return (
				<span
					className='fa-layers fa-w12 fa-lg'
					style={{ marginRight: '10px', width: '18px' }}
				>
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
