import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey="szenarien"
			sectionTitle="Simulierte Szenarien"
			sectionBsStyle="info"
			sectionContent={
				<div>
					<p>
						In den letzten Jahrzehnten ist das Interesse an Hungerkünstlern sehr zurückgegangen. Aber sie
						überwanden sich, umdrängten den Käfig und wollten sich gar nicht fortrühren. Jemand musste Josef
						K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens
						verhaftet. »Wie ein Hund! « sagte er, es war, als sollte die Scham ihn überleben. Als Gregor
						Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem
						ungeheueren Ungeziefer verwandelt.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
