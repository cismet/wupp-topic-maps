import React from 'react';
import BaederModalMenuIntroduction from './BaederModalMenuIntroduction';
import BaederModalMenuHelpSection from './BaederModalMenuHelpSection';
import GenericModalApplicationMenu from '../commons/GenericModalApplicationMenu';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import BaederModalMenuSettingsPanel from './BaederModalMenuSettingsPanel';

const BaederModalMenu = ({
	uiState,
	uiStateActions,
	urlPathname,
	urlSearch,
	pushNewRoute,
	currentMarkerSize,
	changeMarkerSymbolSize
}) => {
	return (
		<GenericModalApplicationMenu
			uiState={uiState}
			uiStateActions={uiStateActions}
			menuIntroduction={<BaederModalMenuIntroduction uiStateActions={uiStateActions} />}
			menuSections={[
				<BaederModalMenuSettingsPanel
					uiState={uiState}
					uiStateActions={uiStateActions}
					width={uiState.width}
					pushNewRoute={pushNewRoute}
					currentMarkerSize={currentMarkerSize}
					changeMarkerSymbolSize={changeMarkerSymbolSize}
					urlPathname={urlPathname}
					urlSearch={urlSearch}
				/>,

				<BaederModalMenuHelpSection
					key="BaederModalMenuHelpSection"
					uiState={uiState}
					uiStateActions={uiStateActions}
				/>
			]}
		/>
	);
};
export default BaederModalMenu;
