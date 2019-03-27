import React from 'react';
import CismetFooterAcks from '../commons/CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({ showModalMenu }) => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				<b>Hintergrundkarten</b>: True Orthophoto 2018, Amtliche Basiskarte (ABK), Hillshade
				© Stadt Wuppertal | Stadtplanwerk 2.0 (Beta) © RVR | WebAtlasDE © BKG{' '}
				<a onClick={() => showModalMenu('datengrundlage')}>
					(Details und Nutzungsbedingungen)
				</a>
				<br />
				<b>Modellierung und Simulationsberechnung</b> (Version 1.0 | 12/2018):{' '}
				<a target='_wsw' href='https://www.wsw-online.de/wsw-energie-wasser/privatkunden/'>
					WSW Energie und Wasser AG
				</a>{' '}
				|{' '}
				<a target='_pecher' href='https://www.pecher.de/'>
					Dr. Pecher AG (Erkrath)
				</a>
				<CismetFooterAcks />
			</span>
		</div>
	);
};

export default Comp;
Comp.defaultProps = {
	showModalMenu: () => {}
};
