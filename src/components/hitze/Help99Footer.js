import React from 'react';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({ showModalMenu }) => {
	return (
		<div style={{ fontSize: '11px' }}>
			<b>Hintergrundkarten</b>: True Orthophoto 2020, Amtliche Basiskarte (ABK), Hillshade ©
			Stadt Wuppertal | Stadtkarte 2.0 © RVR | WebAtlasDE © BKG{' '}
			<a onClick={() => showModalMenu('datengrundlage')}>(Details und Nutzungsbedingungen)</a>
			<br />
			<b>Modellberechnungen</b>:{' '}
			<a target='_more' href='http://www.k.plan.ruhr/'>
				K.PLAN Klima.Umwelt &amp; Planung GmbH
			</a>{' '}
			im Auftrag der{' '}
			<a target='_more' href='https://www.wuppertal.de/microsite/klimaschutz/index.php'>
				Stadt Wuppertal / Klimaschutz
			</a>
			<CismetFooterAcks />
		</div>
	);
};

export default Comp;
Comp.defaultProps = {
	showModalMenu: () => {}
};
