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
						Durch Anklicken eines Links auf einen B-Plan oder ein FNP-Änderungsverfahren
						in der Info-Box oder eines PDF-Symbols in der Info-Box wird in einer neuen
						Registerkarte Ihres Browsers ein Dokumentenviewer geöffnet, in dem die
						Dokumente zu dem B-Plan bzw. FNP-Änderungsverfahren oder zum FNP betrachtet
						werden können. Wenn zu einem Verfahren mehrere Dokumente verfügbar sind,
						werden diese in einer Navigationsleiste am linken Rand des Dokumentenviewers
						angeboten. Klicken Sie auf eines der Symbole in der Navigationsleiste, um
						das zugehörige Dokument in den Anzeigebereich des Dokumentenviewers zu
						laden. Mit den Werkzeugen <Icon name='chevron-left' />{' '}
						<i>"vorherige Seite"</i> und <Icon name='chevron-right' />{' '}
						<i>"nächste Seite"</i> in der Werkzeugleiste am oberen Rand des
						Dokumentenviewers können Sie in mehrseitigen Dokumenten vor- und
						zurückblättern.
					</p>
					<p>
						Beim FNP werden immer mehrere Dokumente angezeigt, nämlich der
						Erläuterungsbericht und die vier Anlagen. Zu den FNP-Änderungsverfahren gibt
						nur dann separate verfahrensbegleitende Zusatzdokumente, wenn es sich um
						Änderungen gemäß §2 ff. BauGB handelt. Bei Berichtigungen gemäß § 13a BauGB
						werden die Dokumente zur FNP-Berichtigung bei dem B-Plan-Verfahren geführt,
						das der Anlass für die Berichtigung war. Sowohl bei den B-Plan-Verfahren wie
						auch bei den FNP-Änderungsverfahren werden die verfahrensbegleitenden
						Zusatzdokumente nur dann im Dokumentenviewer angezeigt, wenn sie bereits in
						digitaler Form vorliegen. (Bei B-Planverfahren werden allerdings auch dann
						schon mehrere Dokumente angezeigt, wenn der B-Plan mehrere Planteile
						umfasst.) Die Online-Bereitstellung der Zusatzdokumente ist ein laufendes
						Vorhaben der Stadtverwaltung Wuppertal. Stand 03/2020 sind sie für rund 72%
						der Wuppertaler B-Pläne und 63% der relevanten FNP-Änderungsverfahren
						verfügbar. Die Namenskonventionen für die vielfältigen Zusatzdateien sind
						jeweils im Dokument{' '}
						<a
							target='_info'
							href='https://wunda-geoportal-docs.cismet.de/fnp_dokumente/Info_FNP-Zusatzdokumente_WUP.pdf'
						>
							Info Dateinamen
						</a>{' '}
						beschrieben, das in der Navigationsleiste ggf. als oberstes Zusatzdokument
						angeboten wird.
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
