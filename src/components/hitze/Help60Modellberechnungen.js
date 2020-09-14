import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='modellberechnungen'
			sectionTitle='Modellberechnungen'
			sectionBsStyle='info'
			sectionContent={
				<div>
					<p>
						Die Darstellung der Hitzebelastungen im Ist-Zustand basiert auf einer durch
						K.Plan erarbeiteten <strong>Klimatopkartierung</strong> für das gesamte
						Wuppertaler Stadtgebiet. Klimatope sind Typisierungen von Flächen nach ihren
						mikroklimatischen Verhältnissen. Freiland-, Wald-, Gewässer- und
						Parkklimatope wurden dabei ausschließlich aus den Daten zur Flächennutzung (<a onClick={() => showModalMenu('datengrundlage')}>Urban Atlas</a>)
						abgeleitet. Für die Abgrenzung der Klimatoptypen in den bebauten Gebieten -
						hier kommen die Typen Vorstadt-, Siedlungs-, Stadt- und Innenstadtklimatop
						in Betracht - wurde zusätzlich die thermische Situation in einem 2m x 2m
						Raster berücksichtigt. Hierzu wurde in einem automatisierten Prozess für
						jede Zelle die &quot;Eignung&quot; bezüglich dieser vier Klimatoptypen
						berechnet. Als Eingangsdaten für diese Modellberechnung dienten neben der
						Flächennutzung (<a onClick={() => showModalMenu('datengrundlage')}>
							Urban Atlas
						</a>) die{' '}
						<a onClick={() => showModalMenu('datengrundlage')}>
							Karte der Oberflächentemperaturen
						</a>{' '}
						und die{' '}
						<a onClick={() => showModalMenu('datengrundlage')}>
							Karte der relativen Lufttemperaturverteilung
						</a>. Anschließend wurde jeder Zelle der Klimatoptyp mit der besten Eignung
						zugeordnet.
					</p>
					<p>
						Die Stadtklimatope werden als &quot;hitzebelastet&quot; eingestuft, die
						Innenstadtklimatope als &quot;stark hitzebelastet&quot;. Mit den
						Schaltflächen <strong>Hitzebelastung</strong> und{' '}
						<strong>starke Hitzebelastung</strong> im Kontrollfeld unter der Überschrift{' '}
						<strong>Modellberechnung</strong> blenden Sie daher die im Ist-Zustand als
						Stadtklimatop (gelb) bzw. als Innenstadtklimatop (rot) eingestuften Zellen
						ein. Das erklärt die Rasterzellenstruktur dieser beiden Datenebenen. Lücken
						in ihrer der Visualisierung sind z. B. dadurch zu erklären, dass die
						&quot;fehlenden&quot; Zellen als Siedlungsklimatop eingestuft worden sind.
					</p>
					<p>
						Zusätzlich wurde ein <strong>Zukunftsszenario</strong> für die
						Hitzebelastungen in Wuppertal im Zeitraum 2050 bis 2060 (Dekadenmittelwerte)
						betrachtet. Auch für dieses Szenario wurde wie für den Ist-Zustand eine
						Klimatopkartierung angefertigt. Dabei wurden zwei Arten von Annahmen
						eingearbeitet:
					</p>
					<ul>
						<li>
							<strong>Großflächige Flächennutzungsänderungen</strong>:
							Berücksichtigung stadtklimarelevanter städtebaulicher Projekte und
							Vorhaben (Wohnbau-, Gewerbe und Grünflächenpotenzialflächen) gemäß
							Stadtentwicklungskonzept Wuppertal (Stand März 2018)
						</li>
						<li>
							<strong>Klimaänderung</strong>: Regionale Klimaprojektion des
							Potsdam-Instituts für Klimafolgenforschung, berechnet mit dem regionalen
							Klimamodell STARS (STAtistical Analogue Resampling Scheme) aus
							meteorologischen Beobachtungsdaten und räumlich differenzierten linearen
							Trends für das Jahresmittel der Lufttemperatur; Trendberechnungen auf
							Grundlage von deutschlandweit gemittelten durchschnittlichen
							Jahrestemperaturen in den Jahren 2011 bis 2100, berechnet aus 21
							globalen Klimamodellen auf Basis des{' '}
							<a onClick={() => showModalMenu('aussagekraft')}>
								Treibhausgas-Szenarios RCP 8.5
							</a>.{' '}
						</li>
					</ul>
					<p>
						Mit der Schaltfläche <strong>Zukunftsszenario 2050-2016</strong> im
						Kontrollfeld unter der Überschrift <strong>Modellberechnung</strong> blenden
						Sie alle Rasterzellen als violetten Decker ein, die in der
						Klimatopkartierung für das Zukunftsszenario als Stadtklima- oder
						Innenstadtklimatop eingestuft worden sind. Auf eine unterschiedliche
						Darstellung dieser beiden Klimatoptypen wurde dabei verzichtet, um dem
						Umstand Rechnung zu tragen, dass das Zukunftsszenario hypothetische und
						damit naturgemäß unsichere Verhältnisse darstellt.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
