import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='InKartePositionieren'
			sectionTitle='In Karte positionieren'
			sectionBsStyle='warning'
			sectionContent={
				<div>
					<p>
						Um den Kartenausschnitt auf ein FNP-Änderungsverfahren zu positionieren,
						geben Sie den Anfang der Nummer dieses Änderungsverfahrens im Eingabefeld
						links unten ein. In der inkrementellen Auswahlliste werden Ihnen die dazu
						passenden Treffer hinter dem Symbol <Icon name='file' overlay='F' />{' '}
						angeboten. (Wenn Sie weitere Zahlen eingeben, wird der Inhalt der
						Auswahlliste angepasst.) Aber Achtung: Das Suchfeld unterstützt auch die
						Suche nach B-Plan-Nummern. Die zu ihrer Eingabe passenden B-Plan-Nummern
						sind mit dem Symbol <Icon name='file' overlay='B' /> gekennzeichnet. Noch
						ein Tipp: Wenn Sie „ÄV" oder „BPL“ im Suchfeld eingeben, wird Ihnen eine
						Auswahlliste aller FNP-Änderungsverfahren bzw. aller B-Plan-Nummern
						angeboten. Nach der Auswahl eines Treffers aus der Liste wird die Karte auf
						die zugehörige Position zentriert und ein <Icon name='map-marker' /> Marker
						auf der Zielposition platziert.
					</p>
					<p>
						Wenn Sie die Karte wie oben beschrieben auf ein{' '}
						<Icon name='file' overlay='F' /> FNP-Änderungsverfahren positionieren, wird
						zusätzlich der Geltungsbereich dieses Verfahrens geladen und der Fokus auf
						dieses Verfahren gesetzt, sodass die zugehörigen Informationen direkt in der
						Info-Box angezeigt werden (s.{' '}
						<a onClick={() => showModalMenu('AenderungsverfahrenAnzeigenUndAbfragen')}>
							Änderungsverfahren anzeigen und abfragen
						</a>). Wenn Sie die Karte auf einen <Icon name='file' overlay='B' /> B-Plan
						positionieren, überprüfen wir, ob dieser der Anlass für ein
						FNP-Änderungsverfahren war. Ist das der Fall, wird das zugehörige
						FNP-Änderungsverfahren geladen, so als hätten Sie es direkt ausgewählt.
						Hinweis: Bei einer Positionierung auf ein FNP-Änderungsverfahren wird,
						sofern erforderlich, zuvor die{' '}
						<a onClick={() => showModalMenu('AenderungsverfahrenAnzeigenUndAbfragen')}>
							Anzeige der Änderungsverfahren in der Hintergrundkarte
						</a>{' '}
						aktiviert.
					</p>
					<p>
						Die Positionierung in der Karte ist auch über weitere Begriffe möglich,
						nämlich Stadtteil (Stadtbezirk oder Quartier), Adresse, Straßenname oder
						POI. Durch das in der Auswahlliste vorangestellte Symbol erkennen Sie, ob es
						sich bei einem Treffer um einen{' '}
						<span style={{ whiteSpace: 'nowrap' }}>
							<Icon name='stadtbezirk' /> Stadtbezirk
						</span>, ein <Icon name='quartier' /> Quartier, eine <Icon name='adresse' />{' '}
						Adresse, eine <Icon name='strasse' /> Straße ohne zugeordnete Hausnummern,
						einen <Icon name='poi' /> POI, die <Icon name='altpoi' /> alternative
						Bezeichnung eines POI oder eine <Icon name='kita' /> Kindertageseinrichtung
						handelt. Bei Suchbegriffen mit Punktgeometrie (Adresse, Straße, POI, Kita)
						wird ein großer Maßstab (Zoomstufe 14) eingestellt und ein{' '}
						<Icon name='map-marker' /> Marker auf der Zielposition platziert. Bei
						Suchbegriffen mit Flächengeometrie (Stadtbezirk, Quartier) wird der Maßstab
						so eingestellt, dass die Fläche vollständig dargestellt werden kann.
						Zusätzlich wird der Bereich außerhalb dieser Fläche abgedunkelt
						(Spotlight-Effekt).
					</p>
					<p>
						Nach einer Positionierung in der Karte über das Suchfeld können Sie mit dem
						Werkzeug <Icon name='x' /> links neben dem Eingabebereich die Suche
						zurücksetzen (Entfernung von Marker bzw. Abdunklung, Löschen des Textes im
						Eingabebereich). Im Rechtsplan wird Ihnen danach an dieser Stelle wieder das
						Werkzeug <Icon name='lupe' /> angeboten, mit dem Sie im aktuellen
						Kartenausschnitt nach{' '}
						<a onClick={() => showModalMenu('AenderungsverfahrenAnzeigenUndAbfragen')}>
							FNP-Änderungsverfahren
						</a>{' '}
						suchen können.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
