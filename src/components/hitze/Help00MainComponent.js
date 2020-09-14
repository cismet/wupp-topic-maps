import React from 'react';
import Datengrundlage from './Help10Datengrundlage';
import Introduction from './Help05Introduction';
import Karteninhalt from './Help20Karteninhalt';
import InKartePositionieren from './Help30InKartePositionieren';
import MeinStandort from './Help40MeinStandort';
import Modellberechnungen from './Help60Modellberechnungen';
import Aussagekraft from './Help70Aussagekraft';

import GenericModalApplicationMenu from 'components/commons/GenericModalApplicationMenu';
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
			menuTitle='Kompaktanleitung und Hintergrundinformationen'
			menuSections={[
				<Datengrundlage
					key='Datengrundlage'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<Karteninhalt
					key='Karteninhalt'
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

				<Modellberechnungen
					key='modellberechnungen'
					uiState={uiState}
					uiStateActions={uiStateActions}
					showModalMenu={showModalMenu}
				/>,
				<Aussagekraft
					key='Aussagekraft'
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
