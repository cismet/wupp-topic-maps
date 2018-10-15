import React from 'react';
import { FormGroup, ControlLabel } from "react-bootstrap";

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

	let namedMapStyle = new URLSearchParams(urlSearch).get('mapStyle') || 'default';
	let filter="";
	if (uiState.namedFilters[namedMapStyle]){
		filter=uiState.namedFilters[namedMapStyle];
	}
	const preview = (
		<div>
			<FormGroup>
				<ControlLabel>Vorschau:</ControlLabel>
				<br />
				<div
					style={{
						backgroundImage:
							"url('/images/map.preview.default" +
							".png')",
						width: '100%',
						height: '250px',
						filter: filter,
						backgroundPosition: 'center'
					}}
				>
				</div>
			</FormGroup>
		</div>
	);

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
								modes= {[ { title: 'mehrfarbig', mode: 'default' }, { title: 'blau', mode: 'blue' } ]}
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
