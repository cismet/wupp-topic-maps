import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey="help"
			sectionTitle="Fehler im Geländemodell melden*"
			sectionBsStyle="danger"
			sectionContent={
				<div>
					<p>
						Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu
						einem ungeheueren Ungeziefer verwandelt. Und es war ihnen wie eine Bestätigung ihrer neuen
						Träume und guten Absichten, als am Ziele ihrer Fahrt die Tochter als erste sich erhob und ihren
						jungen Körper dehnte. »Es ist ein eigentümlicher Apparat«, sagte der Offizier zu dem
						Forschungsreisenden und überblickte mit einem gewissermaßen bewundernden Blick den ihm doch
						wohlbekannten Apparat.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
