import React from 'react';
import { Link } from 'react-scroll';

const BaederModalMenuIntroduction = ({ uiStateActions }) => {
	return (
		<span>
			Über{' '}
			<Link
				id="lnkSettings"
				to="settings"
				containerId="myMenu"
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('settings')}
			>
				Einstellungen
			</Link>{' '}
			können Sie die Darstellung der Hintergrundkarte und der Bäder an Ihre Vorlieben anpassen. Wählen Sie{' '}
			<Link
				id="lnkHelp"
				to="help"
				containerId="myMenu"
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('help')}
			>
				Kompaktanleitung
			</Link>{' '}
			für detailliertere Bedienungsinformationen.
		</span>
	);
};
export default BaederModalMenuIntroduction;
