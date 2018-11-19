import React from 'react';
import { Icon } from 'react-fa';

const Comp = ({showModalMenu}) => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				<b>Hintergrundkarte</b>: True Orthophoto 2018, Amtliche Basiskarte (ABK), Hillshade © Stadt Wuppertal |
				Stadtplanwerk 2.0 (Beta) © RVR | WebAtlasDE © BKG{' '}
				<a onClick={() => {
          console.log('showModalMenu',showModalMenu);
          
          showModalMenu('datengrundlage')}}>(Details und Nutzungsbedingungen)</a>
				<br />
				<b>Modellierung und Simulationsberechnung</b> (Version 0.9 | 10/2018):{' '}
				<a target="_wsw" href="https://www.wsw-online.de/wsw-energie-wasser/privatkunden/">
					WSW Energie und Wasser AG
				</a>{' '}
				|{' '}
				<a target="_pecher" href="https://www.pecher.de/">
					Dr. Pecher AG (Erkrath)
				</a>
				<br />
				<b>Technische Realisierung</b>:{' '}
				<a href="https://cismet.de/" target="_cismet">
					cismet GmbH
				</a>{' '}
				auf Basis von{' '}
				<a href="http://leafletjs.com/" target="_leaflet">
					Leaflet
				</a>{' '}
				und{' '}
				<a href="https://cismet.de/#refs" target="_cismet">
					cids | WuNDa
				</a>
				<br />
				<a target="_blank" rel="noopener noreferrer" href="https://cismet.de/datenschutzerklaerung.html">
					Datenschutzerklärung (Privacy Policy)
				</a>
			</span>
		</div>
	);
};

export default Comp;
Comp.defaultProps = {
	showModalMenu: () => {}
};