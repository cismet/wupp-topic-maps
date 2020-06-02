import React from 'react';

const Comp = ({ stylesDesc = ' (Tag | Nacht)' }) => {
	return (
		<li>
			<strong>Stadtplan{stylesDesc}</strong>: Kartendienst (WMS) des Regionalverbandes Ruhr
			(RVR). Datengrundlage: <strong>Stadtkarte 2.0</strong>. Wöchentlich in einem
			automatischen Prozess aktualisierte Zusammenführung des Straßennetzes der OpenStreetMap
			mit Amtlichen Geobasisdaten des Landes NRW aus den Fachverfahren ALKIS (Gebäude,
			Flächennutzungen) und ATKIS (Gewässer). © RVR und Kooperationspartner (<a
				target='_legal'
				href='https://www.govdata.de/dl-de/by-2-0'
			>
				Datenlizenz Deutschland - Namensnennung - Version 2.0
			</a>). Lizenzen der Ausgangsprodukte: {' '}
			<a target='_legal' href='https://www.govdata.de/dl-de/zero-2-0'>
				Datenlizenz Deutschland - Zero - Version 2.0
			</a>{' '}
			(Amtliche Geobasisdaten) und{' '}
			<a target='_legal' href='https://www.opendatacommons.org/licenses/odbl/1.0/'>
				ODbL
			</a>{' '}
			(OpenStreetMap contributors).
		</li>
	);
};

export default Comp;
