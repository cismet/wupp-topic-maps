import React from 'react';
import ColorHash from 'color-hash';
import Color from 'color';
import L from 'leaflet';
import createSVGPie from 'create-svg-pie';
import createElement from 'svg-create-element';
import { veranstaltungsorteColors } from '../constants/colors.js';
import store from '../redux/store';
import queryString from 'query-string';
import { Icon } from 'react-fa';
import SVGInline from 'react-svg-inline';

export const getColorForProperties = (properties) => {
	let { mainlocationtype } = properties;
	let ll = mainlocationtype.lebenslagen;

	//console.log(colorHash.hex("" + JSON.stringify({ll})));
	return getColorFromMainlocationTypeName(mainlocationtype.name);
};

export const getHeaderTextForProperties = (properties) => {
	let mltName = properties.mainlocationtype.name;
	let colorCandidate;
	let lookup = getLookup();
	colorCandidate = lookup[mltName];
	if (colorCandidate) {
		return mltName;
	} else {
		return lookup.default + ' (' + mltName + ')';
	}
};

const textConversionDictionary = [
	{ from: 'Milongas', to: 'Milongas (Tango Argentino)' },
	{ from: 'Veranstaltungsorte', to: 'Sonstige Veranstaltungsorte' }
];

export const getAllEinrichtungen = () => {
	let lookup = getLookup();
	let einrichtungen = [];
	Object.entries(lookup).map((entry) => {
		if (entry[0] != 'default') {
			einrichtungen.push(entry[0]);
		}
	});
	return einrichtungen;
};

export const textConversion = (input, direction = 'FORWARD') => {
	if (direction === 'FORWARD') {
		for (let rule of textConversionDictionary) {
			if (rule.from === input) {
				return rule.to;
			}
		}
	} else {
		for (let rule of textConversionDictionary) {
			if (rule.to === input) {
				return rule.from;
			}
		}
	}
	return input;
};

export const classifyMainlocationTypeName = (mltName) => {
	let lookup = getLookup();
	// console.log('search for ' + mltName + ' in', lookup);
	// console.log('lookup[mltName]', lookup[mltName]);

	if (lookup[mltName] !== undefined) {
		return mltName;
	} else {
		return lookup.default;
	}
};

export const getColorFromMainlocationTypeName = (mltName) => {
	let colorCandidate;
	let lookup = getLookup();

	colorCandidate = lookup[mltName];

	if (colorCandidate) {
		return colorCandidate;
	}
	if (lookup.default && lookup[lookup.default]) {
		colorCandidate = lookup[lookup.default];
		if (colorCandidate) {
			return colorCandidate;
		}
	}

	// Dieser Fall tritt nur ein wenn die ColorRule falsch definiert ist, d.h. wenn ein lookup[lookup.default] nichts zurückliefert
	let colorHash = new ColorHash({ saturation: 0.3 });
	const c = colorHash.hex(mltName);
	console.debug(
		"Keine vordefinierte Farbe für '" +
			mltName +
			"' vorhanden. (Ersatz wird automatisch erstellt) --> " +
			c
	);
	return c;

	//return "#A83F6A";
};

const getLookup = () => {
	let lookup = null;
	try {
		let qColorRules = queryString.parse(store.getState().routing.location.search).colorRules;
		if (qColorRules) {
			try {
				lookup = JSON.parse(qColorRules);
			} catch (error) {
				console.error(error);
			}
		}
	} catch (error) {
		//problem dduring colorRules override
	}
	if (lookup === null) {
		lookup = veranstaltungsorteColors;
	}
	return lookup;
};
