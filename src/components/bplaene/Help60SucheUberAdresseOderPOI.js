import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='suche-ueber-adresse-oder-poi'
			sectionTitle='Suche über Adresse oder POI'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<p>
						Um die B-Plan-Situation an einem bestimmten Punkt des Stadtgebietes zu
						erkunden, geben Sie den Anfang eines Stra&szlig;ennamens oder eines
						interessanten Ortes (auch Point of Interest oder kurz POI genannt) im
						Eingabefeld ein (mindestens 2 Zeichen). In der inkrementellen Auswahlliste
						werden Ihnen passende Treffer angeboten. (Wenn sie weitere Zeichen eingeben,
						wird der Inhalt der Auswahlliste angepasst.)
					</p>
					<p>
						Durch das vorangestellte Symbol erkennen Sie, ob es sich dabei um eine&nbsp;
						<Icon name='home' />
						&nbsp;Adresse, eine&nbsp;
						<Icon name='road' />
						&nbsp;Stra&szlig;e ohne zugeordnete Hausnummern, einen&nbsp;
						<Icon name='tag' />
						&nbsp;POI oder die&nbsp;
						<Icon name='tags' />
						&nbsp;alternative Bezeichnung eines POI handelt. (Probieren Sie es mal mit
						der Eingabe &bdquo;Sankt&ldquo;.)
					</p>
					<p>
						Nach der Auswahl eines Eintrags wird die entsprechende Position in der Karte
						markiert. B-Plan-Verfahren werden hier allerdings in der Umgebung dieses
						Punktes gesucht, in einem Kartenausschnitt der Zoomstufe 14. Sie erhalten
						daher in der Regel mehrere Treffer.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
