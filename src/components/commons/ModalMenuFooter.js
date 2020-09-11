import React from 'react';
import CismetFooterAcks from './CismetFooterAcknowledgements';

/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({ showModalMenu }) => {
	return (
		<div style={{ fontSize: '11px' }}>
			<b>Hintergrundkarten</b>: Stadtkarte 2.0 © RVR | True Orthophoto 2020 © Stadt Wuppertal {' '}
			<a onClick={() => showModalMenu('help')}>(Details und Nutzungsbedingungen)</a>
			<br />
			<CismetFooterAcks />
		</div>
	);
};

export default Comp;
Comp.defaultProps = {
	showModalMenu: () => {}
};
