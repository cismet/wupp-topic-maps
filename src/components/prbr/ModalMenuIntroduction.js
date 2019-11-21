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
			</Link>, um die in der Karte angezeigten Park+Ride- bzw. Bike+Ride-Anlagen auf die für
			Sie relevanten Anlagen zu beschränken. Über{' '}
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
			können Sie die Darstellung der Hintergrundkarte und der Anlagen an Ihre Vorlieben
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
