import React from 'react';
import Datengrundlage from './Help10Datengrundlage';
import Introduction from './Help05Introduction';
import Karteninhalt from './Help20Karteninhalt';
import InKartePositionieren from './Help30InKartePositionieren';
import MeinStandort from './Help40MeinStandort';
import WasserstandAbfragen from './Help50WasserstandAbfragen';
import SimulierteSzenarien from './Help60SimulierteSzenarien';
import Aussagekraft from './Help70AussagekraftDerSimulationen';
import ModellfehlerMelden from './Help80ModellfehlerMelden';

import GenericModalApplicationMenu from '../commons/GenericModalApplicationMenu';
import Footer from './Help99Footer';
const ModalHelpAndInfo = ({ uiState, uiStateActions }) => {
	const showModalMenu=(section) => uiStateActions.showApplicationMenuAndActivateSection(true, section);
	return (
		<GenericModalApplicationMenu
			uiState={uiState}
			uiStateActions={uiStateActions}
			menuIntroduction={<Introduction uiStateActions={uiStateActions} />}
			menuIcon="info"
			menuTitle="Kompaktanleitung und Hintergrundinformationen"
			menuSections={[
				<Datengrundlage key="Datengrundlage" uiState={uiState} uiStateActions={uiStateActions} />,
				<Karteninhalt key="Karteninhalt" uiState={uiState} uiStateActions={uiStateActions} showModalMenu={showModalMenu} />,
				<InKartePositionieren key="InKartePositionieren" uiState={uiState} uiStateActions={uiStateActions} />,
				<MeinStandort key="MeinStandort" uiState={uiState} uiStateActions={uiStateActions} />,
				<WasserstandAbfragen key="WasserstandAbfragen" uiState={uiState} uiStateActions={uiStateActions} />,
				<SimulierteSzenarien key="SimulierteSzenarien" uiState={uiState} uiStateActions={uiStateActions} />,
				<Aussagekraft key="Aussagekraft" uiState={uiState} uiStateActions={uiStateActions} />,
				<ModellfehlerMelden key="ModellfehlerMelden" uiState={uiState} uiStateActions={uiStateActions} />
			]}
			menuFooter={
				<Footer
					showModalMenu={showModalMenu}
				/>
			}
		/>
	);
};
export default ModalHelpAndInfo;
