import React from 'react';
import ModalMenuIntroduction from './ModalMenuIntroduction';
import ModalMenuHelpSection from './ModalMenuHelpSection';
import GenericModalApplicationMenu from '../commons/GenericModalApplicationMenu';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import ModalMenuSettingsPanel from './ModalMenuSettingsPanel';
import ModalMenuFilterPanel from './FilterPaneContent';

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
	setLayerByKey,
	activeLayerKey,
	refreshFeatureCollection,
	setFeatureCollectionKeyPostfix,
	filter,
	setFilter
}) => {
	return (
		<GenericModalApplicationMenu
			uiState={uiState}
			uiStateActions={uiStateActions}
			menuIntroduction={<ModalMenuIntroduction uiStateActions={uiStateActions} />}
			menuTitle='Einstellungen und Kompaktanleitung'
			menuSections={[
				<GenericModalMenuSection
					uiState={uiState}
					uiStateActions={uiStateActions}
					sectionKey='filter'
					sectionTitle='Filter'
					sectionBsStyle='primary'
					sectionContent={<ModalMenuFilterPanel filter={filter} setFilter={setFilter} />}
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
