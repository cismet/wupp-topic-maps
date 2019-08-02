import React from 'react';
import ColorHash from 'color-hash';
import Color from 'color';
import L from 'leaflet';
import createSVGPie from 'create-svg-pie';
import createElement from 'svg-create-element';
import { poiColors } from '../constants/colors.js';
import store from '../redux/store';
import queryString from 'query-string';
import { Icon } from 'react-fa';
import SVGInline from 'react-svg-inline';

const fallbackSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="311.668" height="311.668">
        <path class="bg-fill" fill="#C32D6A"  d="M0-.661h313.631v313.63H0z"/>
        <path class="fg-fill" fill="#FFF"  d="M292.827 156.794c0 18.76-3.584 36.451-10.733 53.095-7.187 16.681-16.929 31.17-29.302 43.523-12.354 12.392-26.88 22.152-43.523 29.302s-34.335 10.733-53.094 10.733c-18.74 0-36.432-3.584-53.104-10.733-16.653-7.149-31.17-16.91-43.533-29.302-12.354-12.354-22.125-26.843-29.273-43.523-7.159-16.644-10.743-34.335-10.743-53.095 0-18.74 3.584-36.432 10.743-53.084 7.149-16.653 16.919-31.17 29.273-43.533 12.363-12.354 26.88-22.144 43.533-29.293 16.671-7.148 34.363-10.742 53.104-10.742 18.759 0 36.45 3.594 53.094 10.742 16.644 7.149 31.17 16.939 43.523 29.293 12.373 12.363 22.115 26.88 29.302 43.533 7.149 16.652 10.733 34.344 10.733 53.084zm-24.612 0c0-15.347-2.936-29.854-8.77-43.523-5.853-13.66-13.859-25.575-24.021-35.746-10.143-10.132-22.058-18.14-35.727-23.983-13.649-5.881-28.177-8.808-43.523-8.808-15.356 0-29.855 2.926-43.543 8.808-13.66 5.843-25.556 13.851-35.708 23.983-10.152 10.171-18.159 22.086-24.021 35.746-5.853 13.669-8.789 28.177-8.789 43.523 0 15.385 2.936 29.874 8.789 43.524 5.862 13.669 13.869 25.584 24.021 35.745 10.152 10.142 22.048 18.149 35.708 24.002 13.688 5.872 28.187 8.788 43.543 8.788 15.347 0 29.874-2.916 43.523-8.788 13.669-5.853 25.584-13.86 35.727-24.002 10.161-10.161 18.168-22.076 24.021-35.745 5.834-13.65 8.77-28.139 8.77-43.524zm-32.79 0c0 10.943-2.078 21.237-6.234 30.865-4.155 9.608-9.855 17.997-17.005 25.184-7.149 7.149-15.537 12.812-25.146 16.968-9.628 4.156-19.923 6.253-30.865 6.253-10.943 0-21.219-2.097-30.846-6.253s-18.035-9.818-25.184-16.968c-7.158-7.187-12.811-15.575-16.977-25.184-4.166-9.628-6.244-19.922-6.244-30.865 0-10.924 2.078-21.18 6.244-30.846 4.166-9.627 9.818-18.016 16.977-25.165 7.149-7.178 15.557-12.83 25.184-16.996s19.903-6.263 30.846-6.263c10.942 0 21.237 2.097 30.865 6.263 9.608 4.166 17.996 9.818 25.146 16.996 7.149 7.149 12.85 15.538 17.005 25.165 4.156 9.666 6.234 19.922 6.234 30.846z"/>
    </svg>
`;

const pferdeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20.0" height="20.0">
                      <path class="bg-fill" fill="#C32D6A"  d="M0 0h20.008v20.945H0z"/>\r\n    
                      <path class="fg-fill" fill="#FFF"  stroke-width="0" d="M1.00009e-005 5.53813l9.47799 -5.26555 0.484426 -0.269115 0.484426 0.269115 9.55504 5.30835 0 2.28059 -10.0395 -5.57747 -9.96242 5.53468 0 -2.28059zm8.87015 1.8069l-4.63299 8.47917 0.177307 0.177307 1.2306 0 2.719 -2.26583 0.375775 -0.313149 0.471964 0.10219c0.588385,0.127382 1.26169,0.0379336 1.83716,-0.177867 0.524949,-0.196859 0.926587,-0.462193 1.02639,-0.712847l1.85173 0.734449c-0.312619,0.785134 -1.1592,1.46193 -2.18274,1.84575 -0.750381,0.281386 -1.62234,0.42249 -2.45319,0.341572l-2.65382 2.21152 -0.281276 0.234402 -0.355503 0 -2.00019 0 -0.414099 0 -0.292998 -0.292998 -1.00009 -1.00009 -0.52978 -0.52979 0.361794 -0.657822 6.04839 -10.907 0.696565 2.73108zm-4.09236 0.683064c3.87973,-0.895314 6.85179,-0.990423 9.02785,-0.503307 1.82873,0.409368 3.12734,1.22612 3.95509,2.33342 0.838819,1.12211 1.17199,2.50553 1.06573,4.03896 -0.120111,1.7334 -0.810226,3.66563 -1.96549,5.61248l-1.71892 -1.01572c0.999724,-1.68473 1.59397,-3.31426 1.69205,-4.72959 0.0734969,-1.06067 -0.137153,-1.99112 -0.675073,-2.71069 -0.548962,-0.734349 -1.46003,-1.28718 -2.7831,-1.58335 -1.89794,-0.42486 -4.57412,-0.32253 -8.15277,0.503307l-0.445362 -1.9455zm4.22306 1.96284c0.278876,0 0.53142,0.113091 0.714207,0.295888 0.182797,0.182787 0.295888,0.435331 0.295888,0.714207 0,0.278886 -0.113091,0.53142 -0.295888,0.714207 -0.182787,0.182797 -0.435331,0.295888 -0.714207,0.295888 -0.278886,0 -0.53142,-0.113091 -0.714207,-0.295888 -0.182797,-0.182787 -0.295888,-0.435321 -0.295888,-0.714207 0,-0.278876 0.113091,-0.53142 0.295888,-0.714207 0.182787,-0.182797 0.435321,-0.295888 0.714207,-0.295888zm0.700066 0.310029c-0.179167,-0.179177 -0.4267,-0.290027 -0.700066,-0.290027 -0.273366,0 -0.520899,0.11085 -0.700066,0.290027 -0.179177,0.179167 -0.290027,0.4267 -0.290027,0.700066 0,0.273366 0.11085,0.520899 0.290027,0.700066 0.179167,0.179177 0.4267,0.290027 0.700066,0.290027 0.273366,0 0.520899,-0.11085 0.700066,-0.290027 0.179177,-0.179167 0.290027,-0.4267 0.290027,-0.700066 0,-0.273366 -0.11085,-0.520899 -0.290027,-0.700066zm-0.700066 -0.300028c0.552252,0 1.00009,0.447842 1.00009,1.00009 0,0.552252 -0.447842,1.00009 -1.00009,1.00009 -0.552252,0 -1.00009,-0.447842 -1.00009,-1.00009 0,-0.552252 0.447842,-1.00009 1.00009,-1.00009z"/>
                  </svg>`;

export const getFeatureStyler = (svgSize = 24, colorizer = getColorForProperties) => {
	return (feature) => {
		var color = Color(colorizer(feature.properties));
		let radius = svgSize / 2; //needed for the Tooltip Positioning
		let canvasSize = svgSize;
		if (feature.selected) {
			canvasSize = svgSize + 12;
		}

		let selectionBox = canvasSize - 6;
		let badge = feature.properties.svgBadge || fallbackSVG; //|| `<image x="${(svgSize - 20) / 2}" y="${(svgSize - 20) / 2}" width="20" height="20" xlink:href="/pois/signaturen/`+getSignatur(feature.properties)+`" />`;

		let svg = `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / 12}" y="${svgSize / 12}"  width="${svgSize -
			2 * svgSize / 12}" height="${svgSize - 2 * svgSize / 12}" viewBox="0 0 ${feature
			.properties.svgBadgeDimension.width} ${feature.properties.svgBadgeDimension
			.height}">       
                    ${badge}
                </svg>
                </svg>  `;

		if (feature.selected) {
			let selectionOffset = (canvasSize - selectionBox) / 2;

			let badgeDimension = svgSize - 2 * svgSize / 12;
			let innerBadgeOffset = (selectionBox - badgeDimension) / 2;

			svg =
				`<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}">
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <rect x="${selectionOffset}" y="${selectionOffset}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
                <svg x="${selectionOffset + innerBadgeOffset}" y="${selectionOffset +
					innerBadgeOffset}" width="${badgeDimension}" height="${badgeDimension}" viewBox="0 0 ` +
				feature.properties.svgBadgeDimension.width +
				` ` +
				feature.properties.svgBadgeDimension.height +
				`">
                ${badge}

                </svg>
                </svg>`;
		}

		const style = {
			radius,
			fillColor: color,
			color: color.darken(0.5),
			opacity: 1,
			fillOpacity: 0.8,
			svg,
			svgSize: canvasSize
		};
		return style;
	};
};
export const getPoiClusterIconCreatorFunction = (
	svgSize = 24,
	colorizer = getColorForProperties
) => {
	//return a function because the functionCall of the iconCreateFunction cannot be manipulated
	return (cluster) => {
		var childCount = cluster.getChildCount();
		const values = [];
		const colors = [];

		const r = svgSize / 1.5;
		// Pie with default colors
		let childMarkers = cluster.getAllChildMarkers();

		let containsSelection = false;
		let inCart = false;
		for (let marker of childMarkers) {
			values.push(1);
			colors.push(Color(colorizer(marker.feature.properties)));
			if (marker.feature.selected === true) {
				containsSelection = true;
			}
			if (marker.feature.inCart) {
				inCart = true;
			}
		}
		const pie = createSVGPie(values, r, colors);

		let canvasSize = svgSize / 3.0 * 5.0;
		let background = createElement('svg', {
			width: canvasSize,
			height: canvasSize,
			viewBox: `0 0 ${canvasSize} ${canvasSize}`
		});

		//Kleiner Kreis in der Mitte
		// (blau wenn selektion)
		let innerCircleColor = '#ffffff';
		if (containsSelection) {
			innerCircleColor = 'rgb(67, 149, 254)';
		}

		//inner circle
		pie.appendChild(
			createElement('circle', {
				cx: r,
				cy: r,
				r: svgSize / 3.0,
				'stroke-width': 0,
				opacity: '0.5',
				fill: innerCircleColor
			})
		);

		// //Debug Rectangle -should be commnented out
		// background.appendChild(createElement('rect', {
		//     x:0,
		//     y:0,
		//     width: canvasSize,
		//     height: canvasSize,
		//     "stroke-width":1,
		//     stroke: "#000000",
		//     opacity: "1",
		//     fill: "#ff0000"

		// }));

		background.appendChild(pie);

		// Umrandung
		background.appendChild(
			createElement('circle', {
				cx: canvasSize / 2.0,
				cy: canvasSize / 2.0,
				r: r,
				'stroke-width': 2,
				stroke: '#000000',
				opacity: '0.5',
				fill: 'none'
			})
		);

		if (inCart) {
			background
				.appendChild(
					createElement('text', {
						x: '50%',
						y: '50%',
						'text-anchor': 'middle',
						'font-family': 'FontAwesome',
						fill: '#fff',
						'font-size': '26',
						dy: '.4em',
						opacity: '0.5'
					})
				)
				.appendChild(document.createTextNode('\uf005'));
		}

		background
			.appendChild(
				createElement('text', {
					x: '50%',
					y: '50%',
					'text-anchor': 'middle',
					dy: '.3em'
				})
			)
			.appendChild(document.createTextNode(childCount));

		pie.setAttribute('x', (canvasSize - r * 2) / 2.0);
		pie.setAttribute('y', (canvasSize - r * 2) / 2.0);

		var divIcon = L.divIcon({
			className: 'leaflet-data-marker',
			html: background.outerHTML || new XMLSerializer().serializeToString(background), //IE11 Compatibility
			iconAnchor: [ canvasSize / 2.0, canvasSize / 2.0 ],
			iconSize: [ canvasSize, canvasSize ]
		});
		//console.log(background.outerHtml)
		return divIcon;
	};
};

export const getColorForProperties = (properties) => {
	let { mainlocationtype } = properties;
	let ll = mainlocationtype.lebenslagen;
	//console.log(colorHash.hex("" + JSON.stringify({ll})));
	return getColorFromLebenslagenCombination(ll.join(', '));
	//return "#A83F6A";
};
export const getColorFromLebenslagenCombination = (combination) => {
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
		//problem dduring colorRulesn override
	}
	if (lookup === null) {
		lookup = poiColors;
	}

	colorCandidate = lookup[combination];
	if (colorCandidate) {
		return colorCandidate;
	} else {
		let colorHash = new ColorHash({ saturation: 0.3 });
		const c = colorHash.hex(combination);
		console.debug(
			"Keine vordefinierte Farbe für '" +
				combination +
				"' vorhanden. (Ersatz wird automatisch erstellt) --> " +
				c
		);
		return c;
	}
	//return "#A83F6A";
};

export const featureHoverer = (feature) => {
	return '<div>' + feature.text + '</div>';
};

const getSignatur = (properties) => {
	if (properties.signatur) {
		return properties.signatur;
	} else if (properties.mainlocationtype.signatur) {
		return properties.mainlocationtype.signatur;
	}
	return 'Platz.svg'; //TODO sinnvoller default
};

export const addSVGToPOI = (poi, manualReloadRequested) => {
	return new Promise(function(fulfilled, rejected) {
		let cacheHeaders = new Headers();
		if (manualReloadRequested) {
			cacheHeaders.append('pragma', 'no-cache');
			cacheHeaders.append('cache-control', 'no-cache');
		}
		fetch('/poi-signaturen/' + getSignatur(poi), { method: 'get', headers: cacheHeaders })
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error("Server svg response wasn't OK");
				}
			})
			.then((svgText) => {
				const svgDocument = new DOMParser().parseFromString(svgText, 'application/xml');
				const svgObject = svgDocument.documentElement;
				if (svgObject.tagName === 'svg') {
					poi.svgBadge = svgText;
					poi.svgBadgeDimension = {
						width: svgObject.getAttribute('width'),
						height: svgObject.getAttribute('height')
					};
					fulfilled(poi);
				} else {
					throw new Error("Server svg response wasn't a SVG");
				}
			})
			.catch(function(error) {
				console.error('Problem bei /pois/signaturen/' + getSignatur(poi));
				console.error(error);

				//fallback SVG
				console.log('Will use fallbackSVG for ' + getSignatur(poi));

				poi.svgBadge = fallbackSVG;
				poi.svgBadgeDimension = {
					width: '311.668',
					height: '311.668'
				};
				fulfilled(poi);
			});
	});
};

export const triggerLightBoxForPOI = (currentFeature, uiStateActions) => {
	if (
		currentFeature.properties.fotostrecke === undefined ||
		currentFeature.properties.fotostrecke === null ||
		currentFeature.properties.fotostrecke.indexOf('&noparse') !== -1
	) {
		uiStateActions.setLightboxUrls([
			currentFeature.properties.foto.replace(
				/http:\/\/.*fotokraemer-wuppertal\.de/,
				'https://wunda-geoportal-fotos.cismet.de/'
			)
		]);
		uiStateActions.setLightboxTitle(currentFeature.text);
		let linkUrl;
		if (currentFeature.properties.fotostrecke) {
			linkUrl = currentFeature.properties.fotostrecke;
		} else {
			linkUrl = 'http://www.fotokraemer-wuppertal.de/';
		}
		uiStateActions.setLightboxCaption(
			<a href={linkUrl} target='_fotos'>
				<Icon name='copyright' /> Peter Kr&auml;mer - Fotografie
			</a>
		);
		uiStateActions.setLightboxIndex(0);
		uiStateActions.setLightboxVisible(true);
	} else {
		fetch(
			currentFeature.properties.fotostrecke.replace(
				/http:\/\/.*fotokraemer-wuppertal\.de/,
				'https://wunda-geoportal-fotos.cismet.de/'
			),
			{
				method: 'get'
			}
		)
			.then(function(response) {
				return response.text();
			})
			.then(function(data) {
				var tmp = document.implementation.createHTMLDocument();
				tmp.body.innerHTML = data;
				let urls = [];
				let counter = 0;
				let mainfotoname = decodeURIComponent(currentFeature.properties.foto)
					.split('/')
					.pop()
					.trim();
				let selectionWish = 0;
				for (let el of tmp.getElementsByClassName('bilderrahmen')) {
					let query = queryString.parse(
						el.getElementsByTagName('a')[0].getAttribute('href')
					);
					urls.push(
						'https://wunda-geoportal-fotos.cismet.de/images/' + query.dateiname_bild
					);
					if (mainfotoname === query.dateiname_bild) {
						selectionWish = counter;
					}
					counter += 1;
				}
				uiStateActions.setLightboxUrls(urls);
				uiStateActions.setLightboxTitle(currentFeature.text);
				uiStateActions.setLightboxCaption(
					<a href={currentFeature.properties.fotostrecke} target='_fotos'>
						<Icon name='copyright' /> Peter Kr&auml;mer - Fotografie
					</a>
				);
				uiStateActions.setLightboxIndex(selectionWish);
				uiStateActions.setLightboxVisible(true);
			})
			.catch(function(err) {
				console.log(err);
			});
	}
};
export const getPOISVG = (
	svgSize = 30,
	bg = '#FF0000',
	kind = '-',
	svgStyleRelatedId = 'default',
	svg = pferdeSVG
) => {
	console.log('getPOISVG', {
		svgSize,
		bg,
		kind,
		svgStyleRelatedId
	});

	let bdim = {
		width: 20,
		height: 20
	};

	let svgCode = `<svg  id="${svgStyleRelatedId}" height="${svgSize}" width="${svgSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #${svgStyleRelatedId} .bg-fill  {
                            fill: ${bg};
                        }
                        #${svgStyleRelatedId} .bg-stroke  {
                            stroke: ${bg};
                        }
                        #${svgStyleRelatedId} .fg-fill  {
                            fill: white;
                        }
                        #${svgStyleRelatedId} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / bdim.width / 2}" y="${svgSize /
		bdim.height /
		2}"  width="${svgSize - 2 * svgSize / bdim.width / 2}" height="${svgSize -
		2 * svgSize / bdim.height / 2}" viewBox="0 0 ${bdim.width} ${bdim.height || 24}">       
                    ${svg}
                </svg>
                </svg>  `;

	return <SVGInline svg={svgCode} />;
};
