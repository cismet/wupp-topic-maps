import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { getColorForProperties } from '../../utils/ebikesHelper';
import IconLink from '../commons/IconLink';
import InfoBox from '../commons/InfoBox';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const Info = ({
	featureCollection,
	items,
	selectedIndex,
	next,
	previous,
	fitAll,
	loadingIndicator,
	showModalMenu,
	uiState,
	uiStateActions,
	linksAndActions,
	panelClick,
	pixelwidth,
	minified,
	minify,
	setVisibleStateOfSecondaryInfo,
	zoomToFeature = () => {}
}) => {
	const currentFeature = featureCollection[selectedIndex];

	let header, links, headerColor;
	if (items && items.length === 0) {
		return null;
	}
	let web, tel, email, primary, secondary, address, subject, contactSubject;
	if (currentFeature) {
		address = (currentFeature.properties.strasse +
			' ' +
			(currentFeature.properties.hausnummer || '')).trim();
		secondary = currentFeature.properties.zusatzinfo;
		if (currentFeature.properties.typ === 'Verleihstation') {
			header = 'Verleihstationen von E-Fahrrädern';
			subject = 'Verleihstation';
			contactSubject = 'Verleihstation';
			primary = currentFeature.properties.standort;

			web = currentFeature.properties.homepage;
			tel = currentFeature.properties.telefon;
			email = currentFeature.properties.email;
		} else {
			// typ==='Ladestation'
			if (currentFeature.properties.online === false) {
				header = 'Ladestationen für E-Fahrräder (offline)';
			} else {
				header = 'Ladestationen für E-Fahrräder (online) ';
			}
			subject = 'Ladestation';
			contactSubject = 'Betreiber';
			primary = currentFeature.properties.standort;
			web = currentFeature.properties.betreiber.web;
			tel = currentFeature.properties.betreiber.telefon;
			email = currentFeature.properties.betreiber.email;
		}

		links = [];
		links.push(
			<IconLink
				key={`zoom`}
				tooltip={'Auf ' + subject + 'zoomen'}
				onClick={() => {
					zoomToFeature(currentFeature);
				}}
				iconname={'search-location'}
			/>
		);
		// links.push(
		// 	<IconLink
		// 		key={`IconLink.secondaryInfo`}
		// 		tooltip='Datenblatt anzeigen'
		// 		onClick={() => {
		// 			setVisibleStateOfSecondaryInfo(true);
		// 		}}
		// 		iconname='info'
		// 	/>
		// );
		if (tel) {
			links.push(
				<IconLink
					key={`IconLink.tel`}
					tooltip={contactSubject + ' anrufen'}
					href={'tel:' + tel}
					iconname='phone'
				/>
			);
		}
		if (email) {
			links.push(
				<IconLink
					key={`IconLink.email`}
					tooltip={'E-Mail an ' + contactSubject + ' schreiben'}
					href={'mailto:' + email}
					iconname='envelope-square'
				/>
			);
		}
		if (web) {
			links.push(
				<IconLink
					key={`IconLink.web`}
					tooltip={contactSubject + 'webseite'}
					href={web}
					target='_blank'
					iconname='external-link-square'
				/>
			);
		}
		headerColor = getColorForProperties(currentFeature.properties);
		primary = currentFeature.text;
	}
	return (
		<InfoBox
			isCollapsible={currentFeature !== undefined}
			featureCollection={featureCollection}
			items={items}
			selectedIndex={selectedIndex}
			next={next}
			previous={previous}
			fitAll={fitAll}
			loadingIndicator={loadingIndicator}
			showModalMenu={showModalMenu}
			uiState={uiState}
			uiStateActions={uiStateActions}
			linksAndActions={linksAndActions}
			panelClick={panelClick}
			colorize={getColorForProperties}
			pixelwidth={pixelwidth}
			header={header}
			headerColor={headerColor}
			links={links}
			title={primary}
			subtitle={address}
			additionalInfo={secondary}
			zoomToAllLabel={`${items.length} ${items.length === 1
				? 'Ladestation'
				: 'Ladestationen'} in Wuppertal`}
			currentlyShownCountLabel={`${featureCollection.length} ${featureCollection.length === 1
				? 'Ladestation'
				: 'Ladestationen'} angezeigt`}
			collapsedInfoBox={minified}
			setCollapsedInfoBox={minify}
			noCurrentFeatureTitle={<h5>Keine Ladestationen gefunden!</h5>}
			noCurrentFeatureContent={
				<div style={{ marginRight: 9 }}>
					<p>
						Für mehr Ladestationen Ansicht mit <Icon name='minus-square' /> verkleinern
						oder mit dem untenstehenden Link auf das komplette Stadtgebiet zoomen.
					</p>
					<div align='center'>
						<a onClick={fitAll}>{items.length} Ladestationen in Wuppertal</a>
					</div>
				</div>
			}
		/>
	);
};

export default Info;
Info.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	filteredPOIs: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,
	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired,
	showModalMenu: PropTypes.func.isRequired,
	panelClick: PropTypes.func.isRequired
};

Info.defaultProps = {
	featureCollection: [],
	filteredPOIs: [],
	selectedIndex: 0,
	next: () => {},
	previous: () => {},
	fitAll: () => {},
	showModalMenu: () => {}
};
