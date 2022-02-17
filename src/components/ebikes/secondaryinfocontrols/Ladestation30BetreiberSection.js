import React from 'react';
import GenericSecondaryInfoPanelSection from 'components/commons/GenericSecondaryInfoPanelSection';

const Comp = ({ station, links }) => {
  if (station.betreiber) {
    return (
      <GenericSecondaryInfoPanelSection
        header={'Betreiber '}
        bsStyle="success"
        content={
          <div>
            <div
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                float: 'right',
                paddingBottom: '5px',
              }}
            >
              {links}
            </div>
            <div>{station.betreiber.name}</div>
            <div>
              {station.betreiber.strasse} {station.betreiber.hausnummer || ''}
            </div>
            <div>
              {station.betreiber.plz} {station.betreiber.ort}
            </div>
            <div>{station.betreiber.bemerkung}</div>
          </div>
        }
      />
    );
  } else {
    return null;
  }
};

export default Comp;
