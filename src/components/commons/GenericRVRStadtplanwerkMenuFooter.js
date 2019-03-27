import React from 'react';
import { Icon } from 'react-fa';
import CismetFooterAcks from '../commons/CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const GenericRVRStadtplanwerkMenuFooter = () => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				{/* Hintergrundkarte: Stadtplanwerk 2.0 (Beta) © Regionalverband Ruhr und Kooperationspartner (CC BY 4.0), Datengrundlagen © Land NRW (2018), Datenlizenz Deutschland - Namensnennung - Version 2.0 und OpenStreetMap contributors (ODbL) */}
				<b>Hintergrundkarte</b>: <a>Stadtplanwerk 2.0 (Beta)</a> <Icon name='copyright' />{' '}
				Regionalverband Ruhr (RVR) und Kooperationspartner (
				<a
					href='https://creativecommons.org/licenses/by/4.0/legalcode.de'
					target='_licensing'
				>
					CC BY 4.0
				</a>
				), Datengrundlagen <Icon name='copyright' /> Land NRW (2018){' '}
				<a href='http://www.govdata.de/dl-de/by-2-0' target='_licensing'>
					Datenlizenz Deutschland - Namensnennung - Version 2.0
				</a>{' '}
				und OpenStreetMap contributors (
				<a href='http://www.opendatacommons.org/licenses/odbl/1.0/' target='_licensing'>
					ODbL
				</a>
				).
				<br />
				<CismetFooterAcks />
			</span>
		</div>
	);
};

export default GenericRVRStadtplanwerkMenuFooter;
