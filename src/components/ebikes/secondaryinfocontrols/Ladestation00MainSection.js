import PropTypes from 'prop-types';
import React from 'react';

const Comp = ({ station }) => {
	return (
		<div style={{ fontSize: '115%', padding: '10px', paddingTop: '0px' }}>
			<div>
				<b>Adresse:</b>
			</div>
			<div>
				{station.strasse} {station.hausnummer || ''}
			</div>
			<br />
			<div>
				<b>Detailinformation:</b>
			</div>
			<div>{station.detailbeschreibung}</div>
			<br />
			<div>
				<b>Bemerkung:</b>
			</div>
			<div>{station.bemerkung}</div>
			<br />
			<div>
				<b>Öffnungszeiten:</b> {station.oeffnungszeiten + 'XXX'}
			</div>
			<br />
			<div>
				<b>Stellplätze:</b> {station.anzahl_plaetze}
			</div>
		</div>
	);
};

export default Comp;
