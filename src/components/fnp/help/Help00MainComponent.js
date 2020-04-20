import React from 'react';
import GenericModalApplicationMenu from 'components/commons/GenericModalApplicationMenu';

import Introduction from './Help05Introduction';
import RechtsplanUndArbeitskarte from './Help10RechtsplanUndArbeitskarte';
import InKartePositionieren from './Help15InKartePositionieren';
import MeinStandort from './Help20MeinStandort';
import AenderungsverfahrenAnzeigenUndAbfragen from './Help30AenderungsverfahrenAnzeigenUndAbfragen';
import AenderungsverfahrenSuchenUndDurchmustern from './Help40AenderungsverfahrenSuchenUndDurchmustern';
import FlaechenInDerArbeitskarteAuswaehlenUndAbfragen from './Help50FlaechenInDerArbeitskarteAuswaehlenUndAbfragen';
import DokumenteBetrachten from './Help60DokumenteBetrachten';
import DokumenteHerunterladen from './Help70DokumenteHerunterladen';

import Footer from './Help99Footer';
const ModalHelpAndInfo = ({ uiState, uiStateActions }) => {
	const showModalMenu = (section) =>
		uiStateActions.showApplicationMenuAndActivateSection(true, section);
	return (
		<GenericModalApplicationMenu
			uiState={uiState}
			uiStateActions={uiStateActions}
			menuIntroduction={<Introduction uiStateActions={uiStateActions} />}
			menuIcon='info'
			menuTitle='Kompaktanleitung FNP-Inspektor Wuppertal'
			menuSections={[
				<RechtsplanUndArbeitskarte
					key='RechtsplanUndArbeitskarte'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<InKartePositionieren
					key='InKartePositionieren'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<MeinStandort
					key='MeinStandort'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<AenderungsverfahrenAnzeigenUndAbfragen
					key='AenderungsverfahrenAnzeigenUndAbfragen'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<AenderungsverfahrenSuchenUndDurchmustern
					key='AenderungsverfahrenSuchenUndDurchmustern'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<FlaechenInDerArbeitskarteAuswaehlenUndAbfragen
					key='FlaechenInDerArbeiotskarteAuswaehlenUndAbfragen'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<DokumenteBetrachten
					key='DokumenteBetrachten'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<DokumenteHerunterladen
					key='DokumenteHerunterladen'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>
			]}
			menuFooter={<Footer showModalMenu={showModalMenu} />}
		/>
	);
};
export default ModalHelpAndInfo;
