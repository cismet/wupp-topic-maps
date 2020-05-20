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
				<b>Weitere Informationen:</b>
			</div>
			<div>{station.weitereinfo}</div>
			<br />
			<div>
				<b>Bemerkung:</b>
			</div>
			<div>{station.zusatzinfo}</div>
			<br />
			<div>
				<b>Öffnungszeiten:</b> {station.oeffnungszeiten}
			</div>
		</div>
	);
};

export default Comp;
