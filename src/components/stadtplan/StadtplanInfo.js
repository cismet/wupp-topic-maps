import Color from 'color';
import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { getColorForProperties } from '../../utils/stadtplanHelper';
import IconLink from '../commons/IconLink';
import InfoBox from '../commons/InfoBox';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for
// it.
const StadtplanInfo = ({
	featureCollection,
	filteredPOIs,
	selectedIndex,
	next,
	previous,
	fitAll,
	loadingIndicator,
	showModalMenu,
	uiState,
	uiStateActions,
	panelClick,
	minified,
	minify,
	headerText,
	headerColor
}) => {
	const currentFeature = featureCollection[selectedIndex];

	let info = '';
	let links = [];
	let title, localHeaderText, poiColor, adresse;
	if (currentFeature) {
		if (currentFeature.properties.info) {
			info = currentFeature.properties.info;
		}

		if (currentFeature.properties.tel) {
			links.push(
				<a
					title='Anrufen'
					key={'stadtplan.poi.phone.action.'}
					href={'tel:' + currentFeature.properties.tel}
				>
					<Icon
						style={{
							color: 'grey',
							width: '26px',
							textAlign: 'center'
						}}
						size='2x'
						name={'phone'}
					/>
				</a>
			);
		}
		if (currentFeature.properties.email) {
			links.push(
				<a
					title='E-Mail schreiben'
					key={'stadtplan.poi.mail.action.'}
					href={'mailto:' + currentFeature.properties.email}
				>
					<Icon
						style={{
							color: 'grey',
							width: '26px',
							textAlign: 'center'
						}}
						size='2x'
						name={'envelope-square'}
					/>
				</a>
			);
		}
		if (currentFeature.properties.url) {
			links.push(
				<a
					title='Zur Homepage'
					key={'stadtplan.poi.url.action.'}
					href={currentFeature.properties.url}
					target='_blank'
					rel='noopener noreferrer'
				>
					<Icon
						style={{
							color: 'grey',
							width: '26px',
							textAlign: 'center'
						}}
						size='2x'
						name={'external-link-square'}
					/>
				</a>
			);
		}

		if (currentFeature.properties.wup_live_url) {
			links.push(
				<IconLink
					key={`IconLink.wupplive`}
					tooltip='Programm anzeigen'
					href={currentFeature.properties.wup_live_url}
					target='wupplive'
					iconname='calendar'
				/>
			);
		}
	}

	if (currentFeature) {
		poiColor = headerColor || Color(getColorForProperties(currentFeature.properties));
		localHeaderText =
			headerText || currentFeature.properties.mainlocationtype.lebenslagen.join(', ');

		adresse = currentFeature.properties.adresse;

		if (currentFeature.properties.stadt !== 'Wuppertal') {
			if (adresse) {
				adresse += ', ' + currentFeature.properties.stadt;
			} else {
				adresse = currentFeature.properties.stadt;
			}
		}

		title = currentFeature.text;
	}
	return (
		<InfoBox
			isCollapsible={currentFeature !== undefined}
			featureCollection={featureCollection}
			items={filteredPOIs}
			selectedIndex={selectedIndex}
			next={next}
			previous={previous}
			fitAll={fitAll}
			loadingIndicator={loadingIndicator}
			showModalMenu={showModalMenu}
			uiState={uiState}
			uiStateActions={uiStateActions}
			linksAndActions={links}
			panelClick={panelClick}
			colorize={getColorForProperties}
			pixelwidth={250}
			header={localHeaderText}
			headerColor={poiColor}
			links={links}
			title={title}
			subtitle={adresse}
			additionalInfo={info}
			zoomToAllLabel={`${filteredPOIs.length} POI in Wuppertal`}
			currentlyShownCountLabel={`${featureCollection.length} POI angezeigt`}
			collapsedInfoBox={minified}
			setCollapsedInfoBox={minify}
			noCurrentFeatureTitle={<h5>Keine POI gefunden!</h5>}
			noCurrentFeatureContent={
				<div>
					<p>
						Für mehr POI Ansicht mit <Icon name='minus-square' /> verkleinern. Um nach
						Themenfeldern zu filtern, das
						<a onClick={() => showModalMenu('filter')}>
							{' '}
							Men&uuml;&nbsp;
							<Icon
								name='bars'
								style={{
									color: 'black'
								}}
							/>{' '}
							&ouml;ffnen.
						</a>
					</p>
					<div align='center'>
						<a onClick={fitAll}>{filteredPOIs.length + ' '}POI in Wuppertal</a>
					</div>
				</div>
			}
		/>
	);
};

export default StadtplanInfo;
StadtplanInfo.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	filteredPOIs: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,
	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired,
	showModalMenu: PropTypes.func.isRequired,
	panelClick: PropTypes.func.isRequired
};

StadtplanInfo.defaultProps = {
	featureCollection: [],
	filteredPOIs: [],
	selectedIndex: 0,
	next: () => {},
	previous: () => {},
	fitAll: () => {},
	showModalMenu: () => {}
};
