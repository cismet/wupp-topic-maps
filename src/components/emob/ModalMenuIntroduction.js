import React from 'react';
import { Link } from 'react-scroll';

const BaederModalMenuIntroduction = ({ uiStateActions }) => {
	return (
		<span>
			Benutzen Sie die Auswahlmöglichkeiten unter{' '}
			<Link
				id='lnkHelp'
				to='help'
				containerId='myMenu'
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('filter')}
			>
				Filter
			</Link>, um die in der Karte angezeigten Ladestationen für E-Autos auf die für Sie
			relevanten Stationen zu beschränken. Über{' '}
			<Link
				id='lnkSettings'
				to='settings'
				containerId='myMenu'
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('settings')}
			>
				Einstellungen
			</Link>{' '}
			können Sie die Darstellung der Hintergrundkarte und der Ladestationen an Ihre Vorlieben
			anpassen. Wählen Sie{' '}
			<Link
				id='lnkHelp'
				to='help'
				containerId='myMenu'
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
