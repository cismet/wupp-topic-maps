import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Well, Tooltip } from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {Icon} from 'react-fa'

// Since this component is simple and static, there's no parent container for it.
const EhrenamtInfo = ({featureCollection, filteredOffers, selectedIndex, next, previous, fitAll, loadingIndicator, downloadPlan, downloadEverything, filter,resetFilter}) => {

  const currentFeature=featureCollection[selectedIndex];


  let logCurrentFeature=function() {
    //console.log(JSON.stringify(currentFeature));
  }

  let angebotOrAngebote="Angebote werden";
  if (featureCollection.length===1) {
    angebotOrAngebote="Angebot wird";
  }
  let filterstatus=(<div/>);

  let positiv=filter.positiv.globalbereiche.length+
                filter.positiv.kenntnisse.length+
                filter.positiv.zielgruppen.length;

    let negativ=filter.negativ.globalbereiche.length+
                filter.negativ.kenntnisse.length+
                filter.negativ.zielgruppen.length;

            


  if ((positiv+negativ)>0) {
    filterstatus=(
         <table style={{ width: '100%' }}>
            <tbody>
              <tr>
              <td style={{ textAlign: 'left', verticalAlign: 'top',background:'grey', opacity:'0.9', padding: '3px' }}>
              <Icon name='filter' /> Filter aktiviert ({positiv+negativ})
                </td>
                <td style={{ textAlign: 'right', verticalAlign: 'top', background:'grey',opacity:'0.9',padding: '3px' }}>
                <a onClick={resetFilter} style={{ color: 'black'}}><Icon name='close' /></a>
                </td>
              </tr>
            </tbody>
          </table>
    );
  }



  return (
        <Well bsSize="small" onClick={logCurrentFeature}>
          {filterstatus}
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'top', padding: '5px' }}>
                  <h5>Angebot Nr. {currentFeature.id}</h5>
                  <h6>{currentFeature.text}</h6>
                </td>
              </tr>
            </tbody>
          </table>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td/>
                    <td style={{ textAlign: 'center', verticalAlign: 'center' }}><a onClick={fitAll} >{filteredOffers.length} Angebote in Wuppertal</a></td>

                  <td/>
                </tr>
              </tbody>
            </table>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <OverlayTrigger placement="top" overlay={(<Tooltip style={{zIndex: 3000000000}} id="prevtt">vorheriger Treffer</Tooltip>)}>
                    <td style={{ textAlign: 'left', verticalAlign: 'center' }}><a onClick={previous}>&lt;&lt;</a></td>
                  </OverlayTrigger>
                  <td style={{ textAlign: 'center', verticalAlign: 'center' }}>{featureCollection.length} {angebotOrAngebote} angezeigt</td>

                  <OverlayTrigger placement="top" overlay={(<Tooltip style={{zIndex: 3000000000}} id="nexttt">n&auml;chster Treffer</Tooltip>)}>
                    <td style={{ textAlign: 'right', verticalAlign: 'center' }}><a onClick={next} >&gt;&gt;</a></td>
                  </OverlayTrigger>

                </tr>
              </tbody>
            </table>
        </Well>
  );
};



export default EhrenamtInfo;
 EhrenamtInfo.propTypes = {
   featureCollection: PropTypes.array.isRequired,
   filteredOffers: PropTypes.array.isRequired,
   selectedIndex: PropTypes.number.isRequired,
   next: PropTypes.func.isRequired,
   previous: PropTypes.func.isRequired,
   fitAll: PropTypes.func.isRequired,
 };
