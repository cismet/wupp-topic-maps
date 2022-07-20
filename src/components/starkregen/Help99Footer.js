import React from 'react';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({ showModalMenu }) => {
  return (
    <div style={{ fontSize: '11px' }}>
      <b>Hintergrundkarten</b>: True Orthophoto 2022, Amtliche Basiskarte (ABK), Hillshade © Stadt
      Wuppertal | Stadtkarte 2.0 © RVR | WebAtlasDE © BKG{' '}
      <a onClick={() => showModalMenu('datengrundlage')}>(Details und Nutzungsbedingungen)</a>
      <br />
      <b>Modellierung und Simulationsberechnung</b> (Version 2.0 | 12/2020):{' '}
      <a target="_wsw" href="https://www.wsw-online.de/wsw-energie-wasser/privatkunden/">
        WSW Energie und Wasser AG
      </a>{' '}
      |{' '}
      <a target="_pecher" href="https://www.pecher.de/">
        Dr. Pecher AG (Erkrath)
      </a>
      <CismetFooterAcks />
    </div>
  );
};

export default Comp;
Comp.defaultProps = {
  showModalMenu: () => {},
};
