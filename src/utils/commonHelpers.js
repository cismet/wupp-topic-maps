import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-fa';
import queryString from 'query-string';

export const triggerLightBoxForPOI = (
	currentFeature,
	uiStateActions,
	caption = (
		<a href='https://www.wuppertal.de/service/impressum.php' target='_impressum'>
			<Icon name='copyright' /> Stadt Wuppertal
		</a>
	)
) => {
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
		uiStateActions.setLightboxCaption(caption);
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
				uiStateActions.setLightboxCaption();
				uiStateActions.setLightboxIndex(selectionWish);
				uiStateActions.setLightboxVisible(true);
			})
			.catch(function(err) {
				console.log(err);
			});
	}
};
