import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='bplaene-suchen'
			sectionTitle='B-Pläne suchen'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<p>
						F&uuml;r Detailinformation, Dokumentbetrachtung und Download m&uuml;ssen Sie
						zun&auml;chst nach B-Pl&auml;nen suchen. Die Treffer werden automatisch
						geladen und in der Karte als transparente farbige Fl&auml;chen mit der
						B-Plan-Nummer in jeder Teilfl&auml;che dargestellt (Geltungsbereiche der
						B-Pl&auml;ne).
					</p>
					<p>
						Gr&uuml;ne Fl&auml;chen/Nummern stehen f&uuml;r rechtswirksame Verfahren,
						rote Fl&auml;chen/Nummern f&uuml;r laufende. Eine gr&uuml;ne Fl&auml;che mit
						roter Nummer bedeutet, dass es unter dieser Nummer ein rechtswirksames und
						ein laufendes Verfahren gibt, die genau dasselbe Gebiet abdecken.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
