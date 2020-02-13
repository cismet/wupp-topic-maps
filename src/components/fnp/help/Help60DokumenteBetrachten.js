import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='DokumenteBetrachten'
			sectionTitle='Dokumente betrachten'
			sectionBsStyle='info'
			sectionContent={
				<div>
					<p>
						Durch Anklicken eines B-Plan-Links oder eines PDF-Symbols in der Info-Box
						wird in einer neuen Registerkarte Ihres Browsers ein Dokumentenviewer
						geöffnet, in dem die Dokumente zu dem B-Plan-Verfahren bzw. zum FNP oder zu
						dem aktuell geladenen FNP-Änderungsverfahren betrachtet werden können. Wenn
						zu einem Verfahren mehrere Dokumente verfügbar sind, werden diese in einer
						Navigationsleiste am linken Rand des Dokumentenviewers angeboten. Klicken
						Sie auf eines der Symbole in der Navigationsleiste, um das zugehörige
						Dokument in den Anzeigebereich des Dokumentenviewers zu laden. Mit den
						Werkzeugen <Icon name='chevron-left' /> <i>"vorherige Seite"</i> und{' '}
						<Icon name='chevron-right' /> <i>"nächste Seite"</i> in der Werkzeugleiste
						am oberen Rand des Dokumentenviewers können Sie in mehrseitigen Dokumenten
						vor- und zurückblättern.
					</p>
					<p>
						Beim FNP werden immer mehrere Dokumente angezeigt, nämlich der
						Erläuterungsbericht und die vier Anlagen. Bei B-Plan-Verfahren werden nur
						dann mehrere Dokumente angezeigt, wenn der B-Plan mehrere Planteile umfasst
						oder wenn - wie auch bei FNP-Änderungsverfahren - die verfahrensbegleitenden
						Zusatzdokumente bereits in digitaler Form vorliegen. Die
						Online-Bereitstellung der Zusatzdokumente ist ein laufendes Vorhaben der
						Stadtverwaltung Wuppertal. Stand 01/2020 sind sie für rund 70% der
						Wuppertaler B-Pläne und 21% der FNP-Änderungsverfahren verfügbar. Die
						Namenskonventionen für die vielfältigen Zusatzdateien sind jeweils im
						Dokument <a target='_info'>Info Dateinamen</a> beschrieben, das in der
						Navigationsleiste ggf. als oberstes Zusatzdokument angeboten wird.
					</p>
					<p>
						Im Anzeigebereich können Sie das Dokument durch Ziehen mit der Maus
						verschieben. Mit den Werkzeugen <Icon name='plus' /> und{' '}
						<Icon name='minus' /> können Sie die Darstellung vergrößern bzw.
						verkleinern. Darüber hinaus finden Sie in der Werkzeugleiste mit{' '}
						<Icon name='arrows-h' /> <i>"an Fensterbreite anpassen"</i> und{' '}
						<span style={{ whiteSpace: 'nowrap' }}>
							<Icon name='arrows-v' /> <i>"an Fensterhöhe anpassen"</i>
						</span>{' '}
						zwei Möglichkeiten zur schnellen Optimierung der Dokumentdarstellung. Der
						FNP-Inspektor benutzt maximal zwei Dokumentenviewer auf zwei Registerkarten
						ihres Browsers, einen für FNP-Dokumente und einen für B-Plan-Dokumente. Wenn
						Sie also z. B. für ein neues FNP-Änderungsverfahren zur Dokumentbetrachtung
						wechseln, wird eine ggf. bereits zuvor für den FNP-Dokumentenviewer
						geöffnete Registerkarte Ihres Browsers angesteuert.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
