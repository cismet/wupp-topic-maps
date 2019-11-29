import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-fa';
import queryString from 'query-string';

export const triggerLightBoxForFeature = ({
	currentFeature,
	getPhotoUrl,
	getPhotoSeriesUrl,
	urlManipulation = (input) => input,
	uiStateActions,
	captionFactory = (linkUrl) => (
		<a href='https://www.wuppertal.de/service/impressum.php' target='_impressum'>
			<Icon name='copyright' /> Stadt Wuppertal
		</a>
	),
	fallbackLinkUrl = 'http://www.fotokraemer-wuppertal.de/',
	harvester = (data) => {
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
			let query = queryString.parse(el.getElementsByTagName('a')[0].getAttribute('href'));
			urls.push('https://wunda-geoportal-fotos.cismet.de/images/' + query.dateiname_bild);
			if (mainfotoname === query.dateiname_bild) {
				selectionWish = counter;
			}
			counter += 1;
		}
		return { urls, selectionWish };
	}
}) => {
	const photoUrl = urlManipulation(getPhotoUrl(currentFeature));
	const photoSeriesUrl = urlManipulation(getPhotoSeriesUrl(currentFeature));

	if (
		photoSeriesUrl === undefined ||
		photoSeriesUrl === null ||
		photoSeriesUrl.indexOf('&noparse') !== -1
	) {
		uiStateActions.setLightboxUrls([ photoUrl ]);
		uiStateActions.setLightboxTitle(currentFeature.text);
		let linkUrl;
		if (photoSeriesUrl) {
			linkUrl = photoSeriesUrl;
		} else {
			linkUrl = fallbackLinkUrl;
		}
		uiStateActions.setLightboxCaption(captionFactory(linkUrl));
		uiStateActions.setLightboxIndex(0);
		uiStateActions.setLightboxVisible(true);
	} else {
		fetch(photoSeriesUrl, {
			method: 'get'
		})
			.then(function(response) {
				return response.text();
			})
			.then(function(data) {
				const { urls, selectionWish } = harvester(data);
				uiStateActions.setLightboxUrls(urls);
				uiStateActions.setLightboxTitle(currentFeature.text);
				uiStateActions.setLightboxCaption(captionFactory(photoSeriesUrl));
				uiStateActions.setLightboxIndex(selectionWish);
				uiStateActions.setLightboxVisible(true);
			})
			.catch(function(err) {
				console.log(err);
			});
	}
};

export const fotoKraemerUrlManipulation = (input) => {
	console.log('fotoKraemerUrlManipulation input ', 'X' + input + 'X');

	if (input !== undefined || input === '') {
		return input.replace(
			/http:\/\/.*fotokraemer-wuppertal\.de/,
			'https://wunda-geoportal-fotos.cismet.de/'
		);
	} else {
		return undefined;
	}
};

export const fotoKraemerCaptionFactory = (linkUrl) => (
	<a href={linkUrl} target='_fotos'>
		<Icon name='copyright' /> Peter Kr&auml;mer - Fotografie
	</a>
);
