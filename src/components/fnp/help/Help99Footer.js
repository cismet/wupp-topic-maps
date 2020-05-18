import React from 'react';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({ showModalMenu }) => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				<div>
					<strong>Hintergrundkarte</strong>:{' '}
					<a
						target='ackmore'
						rel='noopener noreferrer'
						href='https://www.rvr.ruhr/?id=1002#c179626'
					>
						Stadtplanwerk 2.0 © RVR
					</a>{' '}
					| Deutsche Grundkarte (DGK 5) Stand 1996 © Geobasis NRW | Flächennutzungsplan
					vom 17.01.2005 © Stadt Wuppertal (<a
						onClick={() => showModalMenu('RechtsplanUndArbeitskarte')}
					>
						Details und Nutzungsbedingungen
					</a>
					)
					<CismetFooterAcks />
				</div>
			</span>
		</div>
	);
};

export default Comp;
Comp.defaultProps = {
	showModalMenu: () => {}
};
