import React from 'react';
import { Link } from 'react-scroll';

const BaederModalMenuIntroduction = ({ uiStateActions }) => {
	return (
		<span>
			Der <strong>Kulturstadtplan Wuppertal</strong> präsentiert Ihnen alle Points Of Interest
			(POI) aus unserem Open-Data-Datensatz{' '}
			<a
				href='https://offenedaten-wuppertal.de/dataset/interessante-orte-wuppertal-poi'
				target='_opendata'
			>
				Interessante Orte Wuppertal (POI)
			</a>, die dort als kultureller Veranstaltungsort eingeordnet sind. Unter{' '}
			<Link
				to='filter'
				containerId='myMenu'
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('filter')}
			>
				Mein Kulturstadtplan
			</Link>{' '}
			können Sie die angezeigten POI auf die Kategorien beschränken, die Sie interessieren
			oder nach den jeweils angebotenen Veranstaltungsarten filtern. Über{' '}
			<Link
				to='settings'
				containerId='myMenu'
				smooth={true}
				delay={100}
				onClick={() => uiStateActions.setApplicationMenuActiveKey('settings')}
			>
				Einstellungen
			</Link>{' '}
			können Sie die Karten- und POI-Darstellung an Ihre Vorlieben anpassen. Wählen Sie{' '}
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
