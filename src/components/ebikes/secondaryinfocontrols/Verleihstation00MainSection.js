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
			{station.weitereinfo !== undefined &&
			station.weitereinfo.trim() !== '' && (
				<div>
					<div>
						<b>Weitere Informationen:</b>
					</div>
					<div>{station.weitereinfo}</div>
					<br />
				</div>
			)}
			{station.bemerkung !== undefined && (
				<div>
					<div>
						<b>Bemerkung:</b>
					</div>
					<div>{station.bemerkung}</div>
					<br />
				</div>
			)}
			<div>
				<b>Öffnungszeiten:</b> {station.oeffnungszeiten}
			</div>
		</div>
	);
};

export default Comp;
