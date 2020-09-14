import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='aussagekraft'
			sectionTitle='Aussagekraft der Modellberechnungen'
			sectionBsStyle='info'
			sectionContent={
				<div>
					<p>
						Während die Klimatopkartierung für den Ist-Zustand auf einer recht sicheren
						Datengrundlage aufsetzt, beruht die Darstellung des Zukunftsszenarios
						2050-2060 auf naturgemäß unsicheren Annahmen über die zukünftige Entwicklung
						des Klimas. Die zentrale Hypothese, die hier einfließt, ist das gewählte
						Szenario für die Entwicklung der Treibhausgasemissionen. Die
						Wissenschaftsgemeinde hat hierzu die sogenannten &quot;Repräsentativen
						Konzentrationspfade&quot; (<a
							target='_more'
							href='http://www.iiasa.ac.at/web-apps/tnt/RcpDb/'
						>
							Representative Concentration Pathways, abgekürzt RCP
						</a>) erstellt. Für unser Zukunftsszenario wurde das Treibhausgas-Szenario
						RCP 8.5 verwendet, in dem ein sehr hoher vom Menschen verursachter
						Strahlungsantrieb von 8.5 W/m² bis zum Jahr 2100 angenommen wird. Der
						Strahlungsantrieb beschreibt den Energieumsatz pro Zeitspanne und
						Flächeneinheit, der durch die Treibhausgasemissionen verursacht wird. RCP
						8.5 passt zu der Annahme, dass keine wirksamen Klimaschutzmaßnahmen
						umgesetzt werden. Für die Klimaentwicklung ist das also eine pessimistische
						Erwartungshaltung (&quot;Worst Case&quot;). Allerdings liegen die derzeit
						ablaufenden Emissionen in der Nähe bzw. sogar oberhalb der Annahmen zu
						diesem Worst-Case-Szenario.
					</p>
					<p>
						Das gewählte Treibhausgas-Szenario wird für eine Vorhersage der
						Klimaentwicklung (hier der mittlere Jahrestemperaturen) in ein globales
						Klimamodell eingebracht - man muss im ersten Schritt immer das gesamte
						System &quot;Erde&quot; betrachten! Das Potsdam-Instituts für
						Klimafolgenforschung (PIK) hat hierbei 21 globale Klimamodelle (Global
						Climate Models, abgekürzt GCM) eingesetzt, deren Ergebnisse natürlich
						streuen. Das PIK hat daher für jedes betrachtete RCP-Szenario eine hohe,
						eine geringe und eine mittlere Temperaturzunahme bestimmt. Für unser
						Zukunftsszenario wurde die hohe Temperaturzunahme unterstellt, auch bei
						diesem Schritt bleiben wir demnach beim Worst-Case-Szenario.{' '}
					</p>
					<p>
						<strong>
							Unser Zukunftsszenario ist also wie folgt zu verstehen: &quot;So heiß
							kann es in Wuppertal werden, wenn die weltweiten Treibhausgasemissionen
							nicht reduziert werden.&quot;
						</strong>{' '}
					</p>
				</div>
			}
		/>
	);
};
export default Component;
