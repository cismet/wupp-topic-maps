import React from 'react';
import ModalMenuIntroduction from './ModalMenuIntroduction';
import ModalMenuHelpSection from './ModalMenuHelpSection';
import GenericModalApplicationMenu from '../commons/GenericModalApplicationMenu';
import ModalMenuSettingsPanel from './ModalMenuSettingsPanel';
import ModalMenuFilteringPanel from './ModalMenuFilteringPanel';
import Footer from '../commons/ModalMenuFooter';
const ModalMenu = ({
	uiState,
	uiStateActions,
	urlPathname,
	urlSearch,
	pushNewRoute,
	currentMarkerSize,
	changeMarkerSymbolSize,
	topicMapRef,
	filteredPOIs,
	featureCollectionCount,
	queryString,
	setLayerByKey,
	activeLayerKey,
	lebenslagen,
	apps,
	filter,
	filterchanged,
	offersMD5,
	stadtplanActions,
	setFeatureCollectionKeyPostfix
}) => {
	return (
		<GenericModalApplicationMenu
			uiState={uiState}
			uiStateActions={uiStateActions}
			menuIntroduction={<ModalMenuIntroduction uiStateActions={uiStateActions} />}
			menuTitle='Filterung, Einstellungen und Kompaktanleitung'
			menuSections={[
				<ModalMenuFilteringPanel
					key='ModalMenuFilteringPanel'
					uiState={uiState}
					uiStateActions={uiStateActions}
					width={uiState.width}
					pushNewRoute={pushNewRoute}
					currentMarkerSize={currentMarkerSize}
					changeMarkerSymbolSize={changeMarkerSymbolSize}
					urlPathname={urlPathname}
					urlSearch={urlSearch}
					topicMapRef={topicMapRef}
					filteredPOIs={filteredPOIs}
					featureCollectionCount={featureCollectionCount}
					lebenslagen={lebenslagen}
					apps={apps}
					filter={filter}
					filterchanged={filterchanged}
					offersMD5={offersMD5}
					stadtplanActions={stadtplanActions}
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
					stadtplanActions={stadtplanActions}
					setFeatureCollectionKeyPostfix={setFeatureCollectionKeyPostfix}
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
