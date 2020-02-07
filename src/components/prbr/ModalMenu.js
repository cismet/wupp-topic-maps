import React from 'react';
import { getColorForProperties } from '../../utils/prbrHelper';
import GenericModalApplicationMenu from 'components/commons/GenericModalApplicationMenu';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Footer from '../commons/ModalMenuFooter';
import ModalMenuFilterPanel from './FilterPaneContent';
import ModalMenuHelpSection from './ModalMenuHelpSection';
import ModalMenuIntroduction from './ModalMenuIntroduction';
import ModalMenuSettingsPanel from './ModalMenuSettingsPanel';
import PieChart from './PieChart';

const ModalMenu = ({
	uiState,
	uiStateActions,
	urlPathname,
	urlSearch,
	pushNewRoute,
	currentMarkerSize,
	changeMarkerSymbolSize,
	topicMapRef,
	setLayerByKey,
	activeLayerKey,
	refreshFeatureCollection,
	setFeatureCollectionKeyPostfix,
	filter,
	setFilter,
	filteredObjects,
	featureCollectionObjectsCount,
	envZoneVisible = true,
	setEnvZoneVisible = () => {}
}) => {
	const filteredObjectsCount = (filteredObjects || []).length;
	let rightTerm = filteredObjectsCount !== 1 ? 'Anlagen' : 'Anlage';
	let filterSubTitle = `(${filteredObjectsCount} ${rightTerm} gefunden, davon ${featureCollectionObjectsCount} in der Karte)`;
	return (
		<GenericModalApplicationMenu
			uiState={uiState}
			uiStateActions={uiStateActions}
			menuIntroduction={<ModalMenuIntroduction uiStateActions={uiStateActions} />}
			menuTitle='Filter, Einstellungen und Kompaktanleitung'
			menuSections={[
				<GenericModalMenuSection
					key='GenericModalMenuSection.prbr'
					uiState={uiState}
					uiStateActions={uiStateActions}
					sectionKey='filter'
					sectionTitle={'Filter ' + filterSubTitle}
					sectionBsStyle='primary'
					sectionContent={
						<ModalMenuFilterPanel
							width={uiState.width}
							filter={filter}
							setFilter={setFilter}
							pieChart={
								<PieChart
									filteredObjects={filteredObjects}
									colorizer={getColorForProperties}
									groupingFunction={(obj) => {
										if (obj.schluessel === 'P') {
											return 'P+R';
										} else {
											return 'B+R';
										}
									}}
								/>
							}
						/>
					}
				/>,
				<ModalMenuSettingsPanel
					key='ModalMenuSettingsPanel'
					uiState={uiState}
					uiStateActions={uiStateActions}
					width={uiState.width}
					pushNewRoute={pushNewRoute}
					currentMarkerSize={currentMarkerSize}
					changeMarkerSymbolSize={changeMarkerSymbolSize}
					urlPathname={urlPathname}
					urlSearch={urlSearch}
					topicMapRef={topicMapRef}
					setLayerByKey={setLayerByKey}
					activeLayerKey={activeLayerKey}
					refreshFeatureCollection={refreshFeatureCollection}
					setFeatureCollectionKeyPostfix={setFeatureCollectionKeyPostfix}
					envZoneVisible={envZoneVisible}
					setEnvZoneVisible={setEnvZoneVisible}
				/>,

				<ModalMenuHelpSection
					key='ModalMenuHelpSection'
					uiState={uiState}
					uiStateActions={uiStateActions}
				/>
			]}
			menuFooter={
				<Footer
					showModalMenu={(section) =>
						uiStateActions.showApplicationMenuAndActivateSection(true, section)}
				/>
			}
		/>
	);
};
export default ModalMenu;
