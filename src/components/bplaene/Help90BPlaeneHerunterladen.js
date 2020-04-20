import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='plandownload'
			sectionTitle='B-Pläne herunterladen'
			sectionBsStyle='info'
			sectionContent={
				<div>
					<p>
						Das Herunterladen der Dokumente zu einem B-Plan-Verfahren erfolgt aus dem
						Dokumentenviewer. Dazu finden Sie in der Werkzeugleiste zwei Möglichkeiten.
						Mit dem immer verfügbaren Werkzeug <Icon name='download' />{' '}
						<i>"Dokument herunterladen (pdf)"</i> können Sie das aktuell im
						Anzeigebereich dargestellte Dokument als PDF-Datei herunterladen. Das zweite
						Werkzeug <Icon name='file-archive-o' /> <i>"alles herunterladen (zip)"</i>{' '}
						dient zum Download eines zip-Archivs mit allen Planteilen und
						verfahrensbegleitenden Zusatzdokumenten einschließlich des Info-Dokuments zu
						den Namenskonventionen für die Zusatzdokumente. Es lässt sich nur
						aktivieren, wenn zu dem aktuell betrachteten B-Plan mehrere Dokumente
						verfügbar sind.
					</p>
					<p>
						Unten rechts im Anzeigebereich finden Sie stets den Dateinamen, unter dem
						das gerade dargestellte Dokument heruntergeladen wird. Diese Dateinamen sind
						etwas länger als die in der Navigationsleiste verwendeten Bezeichnungen, wo
						die für alle Dokumente eines B-Plans gleichen Namensbestandteile
						ausgeblendet werden.
					</p>
					<p>
						Ob eine heruntergeladene Datei nach dem Download sofort mit einem geeigneten
						Programm (PDF-Viewer oder Dateimanager) geöffnet wird, hängt von Ihren
						Betriebssystem- und/oder Browsereinstellungen ab.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
