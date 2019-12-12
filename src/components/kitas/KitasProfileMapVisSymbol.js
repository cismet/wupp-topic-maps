import React from 'react';
import Icon from 'components/commons/Icon';
import { getColorForProperties } from '../../utils/kitasHelper';
import { constants as kitasConstants } from '../../redux/modules/kitas';

const KitasProfileMapVisSymbol = ({ inklusion, visible = true }) => {
  if (visible) {
    return (
      <Icon
        style={{
          color: getColorForProperties(
            { plaetze_fuer_behinderte: inklusion },
            kitasConstants.FEATURE_RENDERING_BY_PROFIL
          ),
          width: '30px',
          textAlign: 'center'
        }}
        name={'circle'}
      />
    );
  } else {
    return null;
  }
};

export default KitasProfileMapVisSymbol;
