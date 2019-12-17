import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { getColorForProperties } from '../../utils/emobHelper';
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
	setVisibleStateOfSecondaryInfo
}) => {
	const currentFeature = featureCollection[selectedIndex];

	let header, links, subtitle, additionaInfo, headerColor, title;
	if (items && items.length === 0) {
		return null;
	}

	if (currentFeature) {
		if (currentFeature.properties.online === false) {
			header = 'Ladestation für E-Autos (offline)';
		} else {
			header = 'Ladestation für E-Autos (online)';
		}

		additionaInfo = currentFeature.properties.detailbeschreibung;

		subtitle = `${currentFeature.properties.strasse} ${currentFeature.properties
			.hausnummer}${currentFeature.properties.plz !== undefined ? ', ' : ''}${currentFeature
			.properties.plz || ''} ${currentFeature.properties.ort || ''}`;

		links = [];
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
		if (currentFeature.properties.betreiber.telefon) {
			links.push(
				<IconLink
					key={`IconLink.tel`}
					tooltip='Betreiber Anrufen'
					href={'tel:' + currentFeature.properties.betreiber.telefon}
					iconname='phone'
				/>
			);
		}
		if (currentFeature.properties.betreiber.email) {
			links.push(
				<IconLink
					key={`IconLink.email`}
					tooltip='E-Mail an Betreiber schreiben'
					href={'mailto:' + currentFeature.properties.betreiber.email}
					iconname='envelope-square'
				/>
			);
		}
		if (currentFeature.properties.betreiber.homepage) {
			links.push(
				<IconLink
					key={`IconLink.web`}
					tooltip='Betreiberwebseite'
					href={currentFeature.properties.betreiber.homepage}
					target='_blank'
					iconname='external-link-square'
				/>
			);
		}
		headerColor = getColorForProperties(currentFeature.properties);
		title = currentFeature.text;
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
			subtitle={subtitle}
			additionalInfo={additionaInfo}
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
