import React from 'react';
import { Link } from 'react-scroll';

const BaederModalMenuIntroduction = ({ uiStateActions }) => {
	return (
		<span>
			Verwandeln Sie den Wuppertaler Online-Stadtplan in Ihren persönlichen Themenstadtplan.
			<br />
			W&auml;hlen Sie dazu unter{' '}
			<Link
				to='filter'
				containerId='myMenu'
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('filter')}
			>
				Mein Themenstadtplan
			</Link>{' '}
			die Themenfelder aus, zu denen Sie die Points Of Interest (POI) anzeigen oder ausblenden
			möchten. Über{' '}
			<Link
				to='settings'
				containerId='myMenu'
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('settings')}
			>
				Einstellungen
			</Link>{' '}
			können Sie die Karten- und POI-Darstellung an Ihre Vorlieben anpassen. W&auml;hlen Sie{' '}
			<Link
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
