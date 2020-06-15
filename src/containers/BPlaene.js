import Icon from 'components/commons/Icon';
import proj4 from 'proj4';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip, Well } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BPlanInfo from '../components/bplaene/BPlanInfo';
import BPlanModalHelp from '../components/bplaene/Help00MainComponent';
import { proj4crs25832def } from '../constants/gis';
import { actions as bplanActions } from '../redux/modules/bplaene';
import {
	actions as gazetteerTopicsActions,
	getGazDataForTopicIds
} from '../redux/modules/gazetteerTopics';
import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { actions as PlanoffenlegungsActions } from '../redux/modules/planoffenlegungen';
import {
	bplanFeatureStyler,
	bplanLabeler,
	getMarkerStyleFromFeatureConsideringSelection as bplanMarkerStyle
} from '../utils/bplanHelper';
import TopicMap from './TopicMap';
import ContactButton from '../components/commons/ContactButton';

function mapStateToProps(state) {
	return {
		ui: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		bplaene: state.bplaene,
		allGazetteerTopics: state.gazetteerTopics,
		planoffenlegungen: state.planoffenlegungen
	};
}

function mapDispatchToProps(dispatch) {
	return {
		bplanActions: bindActionCreators(bplanActions, dispatch),
		mappingActions: bindActionCreators(mappingActions, dispatch),
		uiStateActions: bindActionCreators(uiStateActions, dispatch),
		gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch),
		planoffenlegungsActions: bindActionCreators(PlanoffenlegungsActions, dispatch)
	};
}

export class BPlaene_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.bplanSearchButtonHit = this.bplanSearchButtonHit.bind(this);
		this.bplanGazeteerhHit = this.bplanGazeteerhHit.bind(this);
		this.selectNextIndex = this.selectNextIndex.bind(this);
		this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
		this.fitAll = this.fitAll.bind(this);
		this.featureClick = this.featureClick.bind(this);
		this.doubleMapClick = this.doubleMapClick.bind(this);
		this.openDocViewer = this.openDocViewer.bind(this);
	}

	componentDidMount() {
		this.props.gazetteerTopicsActions.loadTopicsData([ 'bplaene' ]).then(() => {
			this.bplaeneGazData = getGazDataForTopicIds(this.props.allGazetteerTopics, [
				'bplaene'
			]);
		});
		document.title = 'B-Plan-Auskunft Wuppertal';
	}

	bplanGazeteerhHit(selectedObject) {
		this.props.bplanActions.searchForPlans(selectedObject);
	}

	bplanSearchButtonHit(event) {
		this.props.bplanActions.searchForPlans();
	}

	selectNextIndex() {
		let potIndex = this.props.mapping.selectedIndex + 1;
		if (potIndex >= this.props.mapping.featureCollection.length) {
			potIndex = 0;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
	}

	doubleMapClick(event) {
		const pos = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [
			event.latlng.lng,
			event.latlng.lat
		]);
		let wkt = `POINT(${pos[0]} ${pos[1]})`;
		this.props.bplanActions.searchForPlans(null, wkt);
	}

	selectPreviousIndex() {
		let potIndex = this.props.mapping.selectedIndex - 1;
		if (potIndex < 0) {
			potIndex = this.props.mapping.featureCollection.length - 1;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
	}

	fitAll() {
		this.props.mappingActions.fitAll();
	}

	isInPlanOffenlegung() {
		let selectedFeature = this.props.mapping.featureCollection[
			this.props.mapping.selectedIndex
		];

		return (
			selectedFeature !== undefined &&
			this.props.planoffenlegungen.dataState.items.bplaene.includes(
				selectedFeature.properties.nummer
			) &&
			selectedFeature.properties.status === 'nicht rechtskräftig'
		);
	}

	openDocViewer() {
		const currentFeature = this.props.mapping.featureCollection[
			this.props.mapping.selectedIndex
		];
		let urlPrefix = '';
		let target = '_docviewer';

		if (this.isInPlanOffenlegung() === true) {
			urlPrefix = 'https://wuppertal.planoffenlegung.de';
			target = '_planoffenlegung';
		}
		try {
			let link = document.createElement('a');
			document.body.appendChild(link);
			link.setAttribute('type', 'hidden');

			if (this.bplaeneGazData) {
				const found = this.bplaeneGazData.find((gazEntry) => {
					//TODO
					//dont know if the implicit type conversion ist needed
					// therefore
					/*eslint-disable */
					return gazEntry.string == currentFeature.properties.nummer;
					/*eslint-enable */
				});
				if (found) {
					link.href =
						urlPrefix + '/#/docs/bplaene/' + currentFeature.properties.nummer + '/1/1'; //keepLatLng';
				} else {
					link.href =
						urlPrefix +
						'/#/docs/bplaene/' +
						currentFeature.properties.nummer +
						' (' +
						currentFeature.properties.status +
						')/1/1'; //?keepLatLng';
				}
			}

			link.target = target;
			link.click();
		} catch (err) {
			window.alert(err);
		}
	}

	featureClick(event) {
		if (event.target.feature.selected) {
			this.props.mappingActions.fitSelectedFeatureBounds();
			if (event.target.feature.twin != null) {
				this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.twin);
			}
		} else {
			this.props.mappingActions.setSelectedFeatureIndex(
				this.props.mapping.featureCollection.indexOf(event.target.feature)
			);
		}
	}

	searchTooltip() {
		return (
			<Tooltip style={{ zIndex: 3000000000 }} id='searchTooltip'>
				B-Pl&auml;ne im Kartenausschnitt laden
			</Tooltip>
		);
	}

	componentDidUpdate(prevProps) {
		if (!this.props.allGazetteerTopics.bplaene) {
			//loading of gaz not completed
			return;
		}
		if (
			prevProps.mapping.selectedIndex !== this.props.mapping.selectedIndex ||
			(JSON.stringify(prevProps.mapping.featureCollection.map((x) => x.id)) !==
				JSON.stringify(this.props.mapping.featureCollection.map((x) => x.id)) &&
				this.props.mapping.featureCollection &&
				this.props.mapping.featureCollection.length > 0)
		) {
			if (
				new URLSearchParams(this.props.routing.location.search).get('syncDocViewer') !==
				null
			) {
				this.openDocViewer();
			}
		}
	}

	render() {
		let inPlanoffenlegung = false;
		let selectedFeature;

		if (
			this.props.mapping.featureCollection !== undefined &&
			this.props.mapping.selectedIndex !== undefined &&
			this.props.mapping.selectedIndex !== -1
		) {
			selectedFeature = this.props.mapping.featureCollection[
				this.props.mapping.selectedIndex
			];

			inPlanoffenlegung = this.isInPlanOffenlegung();
		}
		let info = null;
		if (this.props.mapping.featureCollection.length > 0) {
			info = (
				<BPlanInfo
					pixelwidth={270}
					featureCollection={this.props.mapping.featureCollection}
					selectedIndex={this.props.mapping.selectedIndex || 0}
					next={this.selectNextIndex}
					previous={this.selectPreviousIndex}
					fitAll={this.fitAll}
					loadingIndicator={this.props.bplaene.documentsLoading}
					downloadPlan={this.openDocViewer}
					downloadEverything={this.openDocViewer}
					uiState={this.props.uiState}
					uiStateActions={this.props.uiStateActions}
					collapsed={this.props.bplaene.infoBoxState.minified}
					setCollapsed={(collapsed) => {
						this.props.bplanActions.setCollapsedInfoBox(collapsed);
					}}
					inPlanoffenlegung={{ inPlanoffenlegung }}
				/>
			);
		} else {
			//TODO better way to follow the jsx-a11y/anchor-is-valid rule
			/* eslint-disable */
			info = (
				<Well bsSize='small' pixelwidth={350}>
					<h5>Aktuell keine Bebauungspl&auml;ne geladen.</h5>
					<ul>
						<li>
							<b>einen B-Plan laden:</b> Doppelklick auf Plan in Hintergrundkarte
						</li>
						<li>
							<b>alle B-Pl&auml;ne im Kartenausschnitt laden:</b>{' '}
							<Icon name='search' />
						</li>
						<li>
							<b>bekannten B-Plan laden:</b> Nummer als Suchbegriff eingeben, Auswahl
							aus Vorschlagsliste
						</li>
						<li>
							<b>Suche nach B-Pl&auml;nen:</b> Adresse oder POI als Suchbegriff
							eingeben, Auswahl aus Vorschlagsliste
						</li>
					</ul>
					<a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
						Kompaktanleitung
					</a>
				</Well>
			);
			/* eslint-enable */
		}

		return (
			<div>
				<TopicMap
					noInitialLoadingText
					home={{
						center: [ 51.2724, 7.199806 ],
						zoom: 13
					}}
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					gazetteerTopicsList={[ 'pois', 'bplaene', 'adressen' ]}
					gazetteerSearchBoxPlaceholdertext=' B-Plan-Nr. | Adresse | POI'
					infoBox={info}
					backgroundlayers={this.props.match.params.layers || 'uwBPlan|wupp-plan-live@20'}
					dataLoader={[ this.props.planoffenlegungsActions.loadPlanoffenlegungen ]}
					getFeatureCollectionForData={() => {
						return this.props.mapping.featureCollection;
					}}
					setSelectedFeatureIndex={this.props.mappingActions.setSelectedFeatureIndex}
					featureStyler={bplanFeatureStyler}
					featureLabeler={bplanLabeler}
					markerStyle={bplanMarkerStyle}
					showMarkerCollection={true}
					applicationMenuTooltipString='Kompaktanleitung anzeigen'
					modalMenu={
						<BPlanModalHelp
							uiState={this.props.ui}
							uiStateActions={this.props.uiStateActions}
						/>
					}
					applicationMenuIconname='info'
					featureClickHandler={this.featureClick}
					ondblclick={this.doubleMapClick}
					searchMinZoom={12}
					searchMaxZoom={18}
					gazeteerHitTrigger={this.bplanGazeteerhHit}
					searchButtonTrigger={this.bplanSearchButtonHit}
					searchAfterGazetteer={true}
				>
					{inPlanoffenlegung === true && (
						<ContactButton
							id='329487'
							key='dsjkhfg'
							position='topleft'
							title='Stellungnahme einreichen'
							action={() => {
								let link = document.createElement('a');
								link.setAttribute('type', 'hidden');
								const br = '\n';

								let mailToHref =
									'mailto:bauleitplaene@stadt.wuppertal.de?subject=Stellungnahme%20zu%20B-Plan%20' +
									selectedFeature.properties.nummer +
									'&body=' +
									encodeURI(
										`Sehr geehrte Damen und Herren,${br}${br}` +
											`zum offenliegenden Bebauungsplan ${selectedFeature
												.properties.nummer} äußere ich mich ` +
											`als Privatperson | als Vertreter einer Firma oder Organisation [Nichtzutreffendes bitte löschen] ` +
											`wie folgt:${br}` +
											`${br}${br}` +
											`[Tragen Sie hier bitte Ihre Stellungnahme ein.]${br}` +
											`${br}${br}` +
											`Mit freundlichen Grüßen${br}` +
											`${br}${br}${br}` +
											`[Bitte überschreiben Sie den nachfolgenden Block mit Ihren Kontaktinformationen, damit wir Ihnen das Ergebnis der Prüfung Ihrer Stellungnahme mitteilen können:]` +
											`${br}${br}` +
											`Vor- und Nachname${br}` +
											`ggf. Firma / Organisation${br}` +
											`Straße und Hausnummer${br}` +
											`Postleitzahl und Ort${br}` +
											`E-Mail-Adresse${br}` +
											`Telefonnummer${br}${br}` +
											`!! Mit Absenden dieser E-Mail erkläre ich mein Einverständnis mit der zweckgebundenen Verarbeitung meiner personenbezogenen Daten gemäß der Information nach Artikel 13 bzw. Art. 14 Datenschutz-Grundverordnung (DS-GVO).`
									);
								document.body.appendChild(link);
								//link.href = downloadOptions.url;
								link.href = mailToHref;
								//link.download = downloadOptions.file;
								//link.target = "_blank";
								link.click();
							}}
						/>
					)}
				</TopicMap>
			</div>
		);
	}
}

const BPlaene = connect(mapStateToProps, mapDispatchToProps)(BPlaene_);

export default BPlaene;

BPlaene.propTypes = {
	ui: PropTypes.object,
	kassenzeichen: PropTypes.object,
	uiState: PropTypes.object,
	bplaene: PropTypes.object
};
