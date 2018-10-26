import React from 'react';
import { Link } from 'react-scroll';

const DemoMenuIntroduction = ({ uiStateActions }) => {
	return (
		<span>
			Über{' '}
			<Link
				to="settings"
				containerId="myMenu"
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('settings')}
			>
				Einstellungen
			</Link>{' '}
			können Sie die Darstellung der Hintergrundkarte und der Kitas an Ihre Vorlieben anpassen. Wählen Sie{' '}
			<Link
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
export default DemoMenuIntroduction;
