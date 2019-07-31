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
	let qColorRules;
	let colorCandidate;
	let lookup = null;
	try {
		qColorRules = queryString.parse(store.getState().routing.location.search).colorRules;
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
	colorCandidate = lookup[mltName];
	if (colorCandidate) {
		return mltName;
	} else {
		return lookup.default + ' (' + mltName + ')';
	}
};
export const getColorFromMainlocationTypeName = (mltName) => {
	let qColorRules;
	let colorCandidate;
	let lookup = null;
	try {
		qColorRules = queryString.parse(store.getState().routing.location.search).colorRules;
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
