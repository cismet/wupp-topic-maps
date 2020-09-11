import React from 'react';

const Comp = () => {
	return (
		<li>
			<strong>Luftbildkarte</strong>: (1) Kartendienst (WMS) der Stadt Wuppertal.
			Datengrundlage: <strong>True Orthophoto aus Bildflügen vom 26. und 27.03.2020</strong>,
			hergestellt durch Aerowest GmbH/Dortmund, Bodenauflösung 10 cm. (True Orthophoto: Aus
			Luftbildern mit hoher Längs- und Querüberdeckung in einem automatisierten
			Bildverarbeitungsprozess berechnetes Bild in Parallelprojektion, also ohne
			Gebäudeverkippung und sichttote Bereiche.) © Stadt Wuppertal (<a
				target='_legal'
				href='https://www.wuppertal.de/geoportal/Nutzungsbedingungen/NB-GDIKOM-C_Geodaten.pdf'
			>
				NB-GDIKOM C
			</a>). (2) Kartendienste (WMS) des Regionalverbandes Ruhr (RVR). Datengrundlagen:{' '}
			<strong>Stadtkarte 2.0</strong> und{' '}
			<strong>Kartenschrift aus der Stadtkarte 2.0</strong>. (Details s. Hintergrundkarte
			Stadtplan).
		</li>
	);
};

export default Comp;
