import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey="karteninhalt"
			sectionTitle="Karteninhalt auswählen"
			sectionBsStyle="success"
			sectionContent={
				<div>
					<p>
						»Es ist ein eigentümlicher Apparat«, sagte der Offizier zu dem Forschungsreisenden und
						überblickte mit einem gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat. Sie
						hätten noch ins Boot springen können, aber der Reisende hob ein schweres, geknotetes Tau vom
						Boden, drohte ihnen damit und hielt sie dadurch von dem Sprunge ab. In den letzten Jahrzehnten
						ist das Interesse an Hungerkünstlern sehr zurückgegangen.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
