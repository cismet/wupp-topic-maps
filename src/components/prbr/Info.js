import React from 'react';
import PropTypes from 'prop-types';
import InfoBox from '../commons/InfoBox';
import { getColorForProperties } from '../../utils/prbrHelper';
import { triggerLightBoxForFeature } from '../../utils/commonHelpers';
import { Icon } from 'react-fa';
import IconLink from '../commons/IconLink';
import IconLinkFA from '../commons/IconLinkFA';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSearchLocation } from '@fortawesome/free-solid-svg-icons';
/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const Info = ({
	featureCollection,
	items,
	unfilteredItems,
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

	let header, links, anzahl_plaetze, info, fotoPreview, headerColor, title;
	if (items && items.length === 0) {
		return null;
	}

	if (currentFeature) {
		if (currentFeature.properties.schluessel === 'P') {
			header = 'Park + Ride';
		} else {
			header = 'Bike + Ride';
		}

		anzahl_plaetze = 'Plätze: ' + currentFeature.properties.plaetze;

		info = currentFeature.properties.beschreibung;

		links = [];

		links.push(
			<IconLinkFA
				key={`zoom`}
				tooltip='Auf Anlage zoomen'
				onClick={() => {
					zoomToFeature(currentFeature);
				}}
				icon={faSearchLocation}
			/>
		);

		links.push(
			<IconLinkFA
				key={`IconLink.secondaryInfo`}
				tooltip='Datenblatt anzeigen'
				onClick={() => {
					setVisibleStateOfSecondaryInfo(true);
				}}
				icon={faInfoCircle}
			/>
		);

		if (currentFeature.properties.tel) {
			links.push(
				<IconLinkFA
					key={`IconLink.tel`}
					tooltip='Anrufen'
					href={'tel:' + currentFeature.properties.tel}
					iconname='phone'
				/>
			);
		}
		if (currentFeature.properties.email) {
			links.push(
				<IconLink
					key={`IconLink.email`}
					tooltip='E-Mail schreiben'
					href={'mailto:' + currentFeature.properties.email}
					iconname='envelope-square'
				/>
			);
		}
		if (currentFeature.properties.url) {
			links.push(
				<IconLink
					key={`IconLink.web`}
					tooltip='Zur Homepage'
					href={currentFeature.properties.url}
					target='_blank'
					iconname='external-link-square'
				/>
			);
		}

		headerColor = getColorForProperties(currentFeature.properties);
		title = currentFeature.text;
	}

	let countOfAnlagen = '' + unfilteredItems.length;

	if (unfilteredItems.length !== items.length) {
		countOfAnlagen = items.length + ' von ' + unfilteredItems.length;
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
			title={title}
			subtitle={anzahl_plaetze}
			additionalInfo={info}
			zoomToAllLabel={`${countOfAnlagen} Anlagen in Wuppertal`}
			currentlyShownCountLabel={`${featureCollection.length} ${featureCollection.length === 1
				? 'Anlage'
				: 'Anlagen'} angezeigt`}
			collapsedInfoBox={minified}
			setCollapsedInfoBox={minify}
			noCurrentFeatureTitle={<h5>Keine Anlagen gefunden!</h5>}
			noCurrentFeatureContent={
				<div style={{ marginRight: 9 }}>
					<p>
						Für mehr Anlagen Ansicht mit <Icon name='minus-square' /> verkleinern oder
						mit untenstehendem Link alle Treffer der aktuellen Filterung anzeigen. Ggf.
						Filtereinstellungen im
						<span style={{ whiteSpace: 'nowrap' }}>
							<a onClick={() => showModalMenu('filter')}>
								{' '}
								Anwendungsmenü{' '}
								<Icon
									name='bars'
									style={{
										color: 'black'
									}}
								/>{' '}
							</a>
						</span>{' '}
						zurücksetzen.
					</p>
					<div align='center'>
						<a onClick={fitAll}>{countOfAnlagen} Anlagen in Wuppertal</a>
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
