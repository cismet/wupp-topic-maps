import React from 'react';
import GenericModalApplicationMenu from 'components/commons/GenericModalApplicationMenu';

import Introduction from './Help05Introduction';
import Hintergrundkarte from './Help10Hintergrundkarte';
import MeinStandort from './Help20MeinStandort';
import BPlaeneSuchen from './Help30BPlaeneSuchen';
import SucheImKartenausschnitt from './Help40SucheImKartenausschnitt';
import SucheUeberBPlanNummer from './Help50SucheUeberBPlanNummer';
import SucheUberAdresseOderPOI from './Help60SucheUberAdresseOderPOI';
import TreffermengeDurchmusternn from './Help70TreffermengeDurchmusternn';
import PlanDokumenteBetrachten from './Help80BPlanDokumenteBetrachten';
import BPlaeneHerunterladen from './Help90BPlaeneHerunterladen';

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
			menuTitle='Kompaktanleitung B-Plan-Auskunft Wuppertal'
			menuSections={[
				<Hintergrundkarte
					key='Hintergrundkarte'
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
				<BPlaeneSuchen
					key='BPlaeneSuchen'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<SucheImKartenausschnitt
					key='SucheImKartenausschnitt'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<SucheUeberBPlanNummer
					key='SucheUeberBPlanNummer'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<SucheUberAdresseOderPOI
					key='SucheUberAdresseOderPOI'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<TreffermengeDurchmusternn
					key='TreffermengeDurchmusternn'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<PlanDokumenteBetrachten
					key='PlanDokumenteBetrachten'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<BPlaeneHerunterladen
					key='BPlaeneHerunterladen'
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
