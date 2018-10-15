import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import SymbolSizeChooser from '../commons/SymbolSizeChooser';
import NamedMapStyleChooser from '../commons/NamedMapStyleChooser';
import SettingsPanelWithPreviewSection from '../commons/SettingsPanelWithPreviewSection';
import { getInternetExplorerVersion } from '../../utils/browserHelper';
import 'url-search-params-polyfill';
import { getColorForProperties, getBadSVG } from '../../utils/baederHelper';

const BaederModalMenuSettingsSection = ({
	uiState,
	uiStateActions,
	width,
	urlPathname,
	urlSearch,
	pushNewRoute,
	changeMarkerSymbolSize,
	currentMarkerSize
}) => {
	let preview = <div />;

	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey="settings"
			sectionTitle="Einstellungen"
			sectionBsStyle="primary"
			sectionContent={
				<SettingsPanelWithPreviewSection
					width={width}
					preview={preview}
					settingsSections={[
						getInternetExplorerVersion() === -1 && (
							<NamedMapStyleChooser
								currentNamedMapStyle={namedMapStyle}
								pathname={urlPathname}
								search={urlSearch}
								pushNewRoute={pushNewRoute}
							/>
						),
						<SymbolSizeChooser
							changeMarkerSymbolSize={changeMarkerSymbolSize}
							currentMarkerSize={currentMarkerSize}
							getSymbolSVG={getBadSVG}
							symbolColor={getColorForProperties({
								more: { zugang: 'öffentlich', betreiber: 'Verein' }
							})}
						/>
					]}
				/>
			}
		/>
	);
};

export default BaederModalMenuSettingsSection;
