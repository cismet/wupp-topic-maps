import React from 'react';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const GenericRVRStadtplanwerkMenuFooter = () => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				<b>Hintergrundkarte</b>:Stadtkarte 2.0 © Regionalverband Ruhr (RVR) und
				Kooperationspartner (<a href='https://www.govdata.de/dl-de/by-2-0'>
					Datenlizenz Deutschland - Namensnennung - Version 2.0
				</a>), Lizenzen der Ausgangsprodukte:{' '}
				<a href='https://www.govdata.de/dl-de/zero-2-0'>
					Datenlizenz Deutschland - Zero - Version 2.0
				</a>{' '}
				(Amtliche Geobasisdaten) und{' '}
				<a href='https://www.opendatacommons.org/licenses/odbl/1.0/'>ODbL</a> (OpenStreetMap
				contributors).
				<br />
				<CismetFooterAcks />
			</span>
		</div>
	);
};

export default GenericRVRStadtplanwerkMenuFooter;
