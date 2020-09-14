import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='positionieren'
			sectionTitle='In Karte positionieren'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<p>
						Um die heutige und zukünftig erwartete Hitzebelastung in einem bestimmten
						Bereich des Stadtgebietes zu erkunden, geben Sie den Anfang (mindestens zwei
						Zeichen) eines Stadtteils (Stadtbezirk oder Quartier), einer Adresse oder
						eines interessanten Ortes (Point of Interest POI) im Eingabefeld links unten
						ein. In der inkrementellen Auswahlliste werden Ihnen passende Treffer
						angeboten. (Wenn Sie weitere Zeichen eingeben, wird der Inhalt der
						Auswahlliste angepasst.) Durch das vorangestellte Symbol erkennen Sie, ob es
						sich dabei um einen <Icon name='circle' /> Stadtbezirk, ein{' '}
						<Icon name='pie-chart' /> Quartier, eine <Icon name='home' /> Adresse, eine{' '}
						<Icon name='road' /> Straße ohne zugeordnete Hausnummern, einen{' '}
						<Icon name='tag' /> POI, die <Icon name='tags' /> alternative Bezeichnung
						eines POI oder eine <Icon name='child' /> Kindertageseinrichtung handelt.
					</p>

					<p>
						Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die
						zugehörige Position zentriert. Bei Suchbegriffen mit Punktgeometrie
						(Adresse, Straße, POI) wird außerdem ein großer Maßstab (Zoomstufe 14)
						eingestellt und ein Marker <Icon name='map-marker' /> auf der Zielposition
						platziert. Bei Suchbegriffen mit Flächengeometrie (Stadtbezirk, Quartier)
						wird der Maßstab so eingestellt, dass die Fläche vollständig dargestellt
						werden kann. Zusätzlich wird der Bereich außerhalb dieser Fläche abgedunkelt
						(Spotlight-Effekt).
					</p>
					<p>
						Durch Anklicken des Werkzeugs <Icon name='close' /> links neben dem
						Eingabefeld können Sie die Suche zurücksetzen (Entfernung von Marker bzw.
						Abdunklung, Löschen des Textes im Eingabefeld).
					</p>
				</div>
			}
		/>
	);
};
export default Component;
