import React from 'react';
import IconLink from 'components/commons/IconLink';
export const getActionLinksForFeature = (
	feature,
	{
		displayZoomToFeature = false,
		zoomToFeature = () => {
			console.warn('no action cause zoomToFeature was not set in config object');
		},
		displaySecondaryInfoAction = false,
		setVisibleStateOfSecondaryInfo = () => {
			console.warn(
				'no action cause setVisibleStateOfSecondaryInfo was not set in config object'
			);
		}
	}
) => {
	const links = [];
	if (displayZoomToFeature === true) {
		links.push(
			<IconLink
				key={`zoom`}
				tooltip='Auf Ladestation zoomen'
				onClick={() => {
					zoomToFeature(feature);
				}}
				iconname={'search-location'}
			/>
		);
	}
	if (displaySecondaryInfoAction === true) {
		links.push(
			<IconLink
				key={`IconLink.secondaryInfo`}
				tooltip='Datenblatt anzeigen'
				onClick={() => {
					setVisibleStateOfSecondaryInfo(true);
				}}
				iconname='info'
			/>
		);
	}
	if (feature.properties.tel !== undefined) {
		links.push(
			<IconLink
				key={`IconLink.tel`}
				tooltip='Anrufen'
				href={'tel:' + feature.properties.tel}
				iconname='phone'
			/>
		);
	}
	if (feature.properties.email !== undefined) {
		links.push(
			<IconLink
				key={`IconLink.email`}
				tooltip='E-Mail schreiben'
				href={'mailto:' + feature.properties.email}
				iconname='envelope-square'
			/>
		);
	}
	if (feature.properties.url !== undefined) {
		links.push(
			<IconLink
				key={`IconLink.web`}
				tooltip='Zur Homepage'
				href={feature.properties.url}
				target='_blank'
				iconname='external-link-square'
			/>
		);
	}
	return links;
};
