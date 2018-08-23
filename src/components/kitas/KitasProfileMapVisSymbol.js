import React from "react";
import { Icon } from "react-fa";
import { getColorForProperties } from "../../utils/kitasHelper";
import { constants as kitasConstants } from "../../redux/modules/kitas";

const KitasProfileMapVisSymbol = ({inklusion}) => {
  return (
    <Icon
      style={{
        color: getColorForProperties(
          { plaetze_fuer_behinderte: inklusion },
          kitasConstants.FEATURE_RENDERING_BY_PROFIL
        ),
        width: "30px",
        textAlign: "center"
      }}
      name={"circle"}
    />
  );
};

export default KitasProfileMapVisSymbol;
