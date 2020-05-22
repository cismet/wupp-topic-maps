import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { getColorForProperties, getLinksForStation } from '../../utils/ebikesHelper';
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
	let primary, secondary, address;
	if (currentFeature) {
		address = (currentFeature.properties.strasse +
			' ' +
			(currentFeature.properties.hausnummer || '')).trim();
		secondary = currentFeature.properties.zusatzinfo;
		if (currentFeature.properties.typ === 'Verleihstation') {
			header = 'Verleihstationen von E-Fahrrädern';
			primary = currentFeature.properties.standort;
		} else {
			// typ==='Ladestation'
			if (currentFeature.properties.online === false) {
				header = 'Ladestationen für E-Fahrräder (offline)';
			} else {
				header = 'Ladestationen für E-Fahrräder (online) ';
			}
			primary = currentFeature.properties.standort;
		}
		links = getLinksForStation(currentFeature.properties, {
			zoomToFeature: () => {
				zoomToFeature(currentFeature);
			},
			showSecondaryInfo: setVisibleStateOfSecondaryInfo,
			phone: true,
			email: true,
			web: true
		});
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
				? 'Station'
				: 'Stationen'} in Wuppertal`}
			currentlyShownCountLabel={`${featureCollection.length} ${featureCollection.length === 1
				? 'Station'
				: 'Stationen'} angezeigt`}
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
