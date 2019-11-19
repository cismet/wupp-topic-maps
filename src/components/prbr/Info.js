import React from 'react';
import PropTypes from 'prop-types';
import InfoBox from '../commons/InfoBox';
import { getColorForProperties } from '../../utils/prbrHelper';
import { triggerLightBoxForPOI } from '../../utils/stadtplanHelper';
import { Icon } from 'react-fa';
import IconLink from '../commons/IconLink';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const BaederInfo = ({
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
	minify
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
		if (currentFeature.properties.tel) {
			links.push(
				<IconLink
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

		if (currentFeature.properties.foto) {
			const foto =
				'https://www.wuppertal.de/geoportal/prbr/fotos/' + currentFeature.properties.foto;
			fotoPreview = (
				<table style={{ width: '100%' }}>
					<tbody>
						<tr>
							<td style={{ textAlign: 'right', verticalAlign: 'top' }}>
								<a
									onClick={() => {
										triggerLightBoxForPOI(
											{ properties: { foto } },
											uiStateActions
										);
									}}
									hrefx={foto}
									target='_fotos'
								>
									<img
										alt='Bild'
										style={{ paddingBottom: '5px' }}
										src={foto.replace(
											/http:\/\/.*fotokraemer-wuppertal\.de/,
											'https://wunda-geoportal-fotos.cismet.de/'
										)}
										width='150'
									/>
								</a>
							</td>
						</tr>
					</tbody>
				</table>
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
			subtitle={anzahl_plaetze}
			additionalInfo={info}
			zoomToAllLabel={`${items.length} Anlagen in Wuppertal`}
			currentlyShownCountLabel={`${featureCollection.length} ${featureCollection.length === 1
				? 'Anlage'
				: 'Anlagen'} angezeigt`}
			fotoPreview={fotoPreview}
			collapsedInfoBox={minified}
			setCollapsedInfoBox={minify}
			noCurrentFeatureTitle={<h5>Keine Anlagen gefunden!</h5>}
			noCurrentFeatureContent={
				<div style={{ marginRight: 9 }}>
					<p>
						Für mehr Anlagen Ansicht mit <Icon name='minus-square' /> verkleinern oder
						mit dem untenstehenden Link auf das komplette Stadtgebiet zoomen.
					</p>
					<div align='center'>
						<a onClick={fitAll}>{items.length} Anlagen in Wuppertal</a>
					</div>
				</div>
			}
		/>
	);
};

export default BaederInfo;
BaederInfo.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	filteredPOIs: PropTypes.array.isRequired,
	selectedIndex: PropTypes.number.isRequired,
	next: PropTypes.func.isRequired,
	previous: PropTypes.func.isRequired,
	fitAll: PropTypes.func.isRequired,
	showModalMenu: PropTypes.func.isRequired,
	panelClick: PropTypes.func.isRequired
};

BaederInfo.defaultProps = {
	featureCollection: [],
	filteredPOIs: [],
	selectedIndex: 0,
	next: () => {},
	previous: () => {},
	fitAll: () => {},
	showModalMenu: () => {}
};
