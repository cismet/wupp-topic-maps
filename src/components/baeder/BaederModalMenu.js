import React from 'react';
import BaederModalMenuIntroduction from './BaederModalMenuIntroduction';
import BaederModalMenuHelpSection from './BaederModalMenuHelpSection';
import GenericModalApplicationMenu from '../commons/GenericModalApplicationMenu';
import BaederModalMenuSettingsPanel from './BaederModalMenuSettingsPanel';

const BaederModalMenu = ({
	uiState,
	uiStateActions,
	urlPathname,
	urlSearch,
	pushNewRoute,
	currentMarkerSize,
	changeMarkerSymbolSize,
	topicMapRef,
	setLayerByKey,
	activeLayerKey
}) => {
	return (
		<GenericModalApplicationMenu
			uiState={uiState}
			uiStateActions={uiStateActions}
			menuIntroduction={<BaederModalMenuIntroduction uiStateActions={uiStateActions} />}
			menuTitle='Einstellungen und Kompaktanleitung'
			menuSections={[
				<BaederModalMenuSettingsPanel
					key='BaederModalMenuSettingsPanel'
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
				/>,

				<BaederModalMenuHelpSection
					key='BaederModalMenuHelpSection'
					uiState={uiState}
					uiStateActions={uiStateActions}
				/>
			]}
		/>
	);
};
export default BaederModalMenu;
