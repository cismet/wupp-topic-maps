import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Well, Tooltip } from 'react-bootstrap';
import {Icon} from 'react-fa'
import { constants as ehrenamtConstants } from '../redux/modules/ehrenamt';

// Since this component is simple and static, there's no parent container for it.
const StadtplanInfo = ({featureCollection, filteredPOIs, selectedIndex, next, previous, fitAll, loadingIndicator, showModalMenu, }) => {

  const currentFeature=featureCollection[selectedIndex];


  let logCurrentFeature=function() {
    console.log(currentFeature.properties.mainlocationtype.signatur);
  }
  let info="";
  let t="Kein POI selektiert.";
//   console.log(currentFeature);
    if (currentFeature){
        t=currentFeature.text;
        info=currentFeature.properties.info;
    }
  
   


    return (
            <div>
            <Well bsSize="small" onClick={logCurrentFeature}>
                <h4>{t}</h4>
                <p>{info}</p>
            </Well>
            </div>
        );
    
};



export default StadtplanInfo;
StadtplanInfo.propTypes = {
   featureCollection: PropTypes.array.isRequired,
   filteredPOIs: PropTypes.array.isRequired,
   selectedIndex: PropTypes.number.isRequired,
   next: PropTypes.func.isRequired,
   previous: PropTypes.func.isRequired,
   fitAll: PropTypes.func.isRequired,
   showModalMenu: PropTypes.func.isRequired,
 };
