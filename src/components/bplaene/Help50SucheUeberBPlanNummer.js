import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='suche-ueber-bplan-nummer'
			sectionTitle='Suche über B-Plan-Nummer'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<p>
						Um ein B-Plan-Verfahren direkt anzusteuern, geben Sie den Anfang der
						B-Plan-Nummer im Eingabefeld rechts neben&nbsp;
						<Icon name='search' />
						&nbsp;ein (mindestens 2 Ziffern). Alle Verfahren, die mit diesen Ziffern
						beginnen, werden Ihnen in einer inkrementellen Auswahlliste angeboten. (Wenn
						Sie weitere Zeichen eingeben, wird der Inhalt der Auswahlliste angepasst.)
					</p>
					<p>
						Nach Auswahl eines B-Plan-Verfahrens aus dieser Liste wird
						ausschlie&szlig;lich der zugeh&ouml;rige Plan geladen. Er wird
						vollst&auml;ndig und zentriert dargestellt. Das ist vor allem n&uuml;tzlich,
						um sich einen &Uuml;berblick &uuml;ber Pl&auml;ne mit einem komplizierten
						Geltungsbereich zu verschaffen. (Probieren Sie mal die Nummer 150.)
					</p>
					<p>
						Nach einer solchen Positionierung in der Karte über die B-Plan-Nummer können
						Sie die Suche mit dem Werkzeug <Icon name='times' /> links neben dem
						Eingabefeld zurücksetzen (Entfernung von Marker bzw. Abdunklung, Löschen des
						Textes im Eingabebereich). Es wird Ihnen danach an dieser Stelle wieder das
						Werkzeug <Icon name='search' /> angeboten, mit dem Sie im aktuellen
						Kartenausschnitt nach B-Plänen suchen können.
					</p>
					<p>
						Klicken Sie auf <Icon name='search' />, um alle Pl&auml;ne hinzuzuladen, die
						im jetzt aktuellen Ausschnitt liegen. Damit stellen Sie auch sicher, dass
						Sie keinen Plan &uuml;bersehen, der sich mit dem zuvor gesuchten
						&uuml;berlappt.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
