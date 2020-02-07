import React from 'react';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({ showModalMenu }) => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				<div>
					<strong>Hintergrundkarte</strong>: Stadtplanwerk 2.0 (Beta) © RVR | Amtliche
					Basiskarte (ABK), B-Plan-Geltungsbereiche (
					<a
						target='ackmore'
						href='https://offenedaten-wuppertal.de/dataset/rechtsverbindliche-bebauungspl%C3%A4ne-wuppertal'
					>
						rechtswirksam{' '}
					</a>{' '}
					|{' '}
					<a
						target='ackmore'
						href='https://offenedaten-wuppertal.de/dataset/laufende-bebauungsplanverfahren-wuppertal'
					>
						laufende Verfahren
					</a>
					) © Stadt Wuppertal |
					<a
						target='ackmore'
						href='http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&amp;gdz_akt_zeile=4&amp;gdz_anz_zeile=4&amp;gdz_unt_zeile=0&amp;gdz_user_id=0'
					>
						{' '}
						WebAtlasDE
					</a>{' '}
					© BKG{' '}
					<a target='ackmore' onClick={() => showModalMenu('hintergrundkarte')}>
						(Details und Nutzungsbedingungen)
					</a>
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
