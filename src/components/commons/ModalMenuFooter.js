import React from 'react';
import CismetFooterAcks from './CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({ showModalMenu }) => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				<b>Hintergrundkarten</b>: Stadtplanwerk 2.0 (Beta) © RVR | True Orthophoto 2018 ©
				Stadt Wuppertal {' '}
				<a onClick={() => showModalMenu('help')}>(Details und Nutzungsbedingungen)</a>
				<br />
				<CismetFooterAcks />
			</span>
		</div>
	);
};

export default Comp;
Comp.defaultProps = {
	showModalMenu: () => {}
};
