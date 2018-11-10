import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey="wasserstand"
			sectionTitle="Maximalen Wasserstand abfragen"
			sectionBsStyle="success"
			sectionContent={
				<div>
					<p>
						Und es war ihnen wie eine Bestätigung ihrer neuen Träume und guten Absichten, als am Ziele ihrer
						Fahrt die Tochter als erste sich erhob und ihren jungen Körper dehnte. »Es ist ein
						eigentümlicher Apparat«, sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem
						gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat. Sie hätten noch ins Boot
						springen können, aber der Reisende hob ein schweres, geknotetes Tau vom Boden, drohte ihnen
						damit und hielt sie dadurch von dem Sprunge ab.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
