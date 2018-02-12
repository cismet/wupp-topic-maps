import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Well, Tooltip } from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {Icon} from 'react-fa'

// Since this component is simple and static, there's no parent container for it.
const EhrenamtInfo = ({featureCollection, filteredOffers, selectedIndex, next, previous, fitAll, loadingIndicator, downloadPlan, downloadEverything, filter,resetFilter, showModalMenu, cart, toggleCart,}) => {

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
                <a onClick={()=>showModalMenu("filtertab")} style={{ color: 'black'}}><Icon name='filter' /> Filter aktiviert ({positiv+negativ})</a>
                </td>
                <td style={{ textAlign: 'right', verticalAlign: 'top', background:'grey',opacity:'0.9',padding: '3px' }}>
                <a onClick={resetFilter} style={{ color: 'black'}}><Icon name='close' /></a>
                </td>
              </tr>
            </tbody>
          </table>
    );
  }

  if (featureCollection.length===0) {
    let offerLink;
    if (filteredOffers.length>0) {
        offerLink=(
            <table style={{ width: '100%' }}>
            <tbody>
              <tr>
              <td style={{ textAlign: 'center', verticalAlign: 'top',}}>
              <a onClick={fitAll} >{filteredOffers.length} Angebote in Wuppertal</a>
                </td>
              </tr>
            </tbody>
          </table>
        );
    }
    else {
        offerLink=(<div/>)
    }
    return (
    
    <Well bsSize="small" pixelwidth={250}>
        {filterstatus}
        <h5>Aktuell werden keine Angebote angezeigt.</h5>
        <p>Um Angebote an einem bestimmten Ort anzuzeigen, den Anfang (mindestens 2 Zeichen)
        eines Suchbegriffs eingeben und Eintrag aus Vorschlagsliste auswählen.</p>
        <p>Um nach Aufgabenfeldern, Tätigkeiten oder Zielgruppen zu filtern, das 
        <a onClick={()=>showModalMenu("filtertab")}> Men&uuml;&nbsp;<Icon name="bars" style={{color:"black"}}/> öffnen.</a></p>
        {offerLink}
    </Well>)
  }
  else {

    let cartIcon="plus-square";
    let bookmarkColor="#DDDDDD";
    if (cart.find(x => x.id === currentFeature.id)!==undefined){
        cartIcon="check-square";
    }
    if (cart.length>0){
        bookmarkColor="#666666";
    }
    return (
            <div>
            <Well bsSize="small" onClick={logCurrentFeature}>
            {filterstatus}
            <table style={{ width: '100%' }}>
                <tbody>
                <tr>
                    <td style={{ textAlign: 'left', verticalAlign: 'top', padding: '5px' }}>
                    <table style={{ width: '100%' }}>
                     <tbody>
                        <tr>
                        <td style={{ textAlign: 'left' }}>
                            <h5>Angebot Nr. {currentFeature.id}</h5>
                        </td>
                        <td style={{ textAlign: 'right'}}>
                        <OverlayTrigger placement="left" overlay={(<Tooltip style={{zIndex: 3000000000}} id="bookmarkstt">Merkliste &ouml;ffnen</Tooltip>)}>
                            <a key={"ico.bookmark."+bookmarkColor} onClick={()=>showModalMenu("cart")} style={{ color: bookmarkColor}}><Icon size="2x" name={"bookmark"} /></a>
                        </OverlayTrigger>
                        </td>
                        </tr>
                        </tbody>
                    </table>
                    <table style={{ width: '100%' }}>
                     <tbody>
                        <tr>
                        <td style={{ textAlign: 'left' }}>
                            <h6>{currentFeature.text}</h6>
                        </td>
                        <td style={{ textAlign: 'right'}}>
                            <a onClick={()=>{toggleCart(currentFeature)}} style={{ color: 'black'}}><Icon size="2x" name={cartIcon} /></a>
                        </td>
                        </tr>
                        </tbody>
                    </table>
                   
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
            </div>
        );
    }
};



export default EhrenamtInfo;
 EhrenamtInfo.propTypes = {
   featureCollection: PropTypes.array.isRequired,
   filteredOffers: PropTypes.array.isRequired,
   selectedIndex: PropTypes.number.isRequired,
   next: PropTypes.func.isRequired,
   previous: PropTypes.func.isRequired,
   fitAll: PropTypes.func.isRequired,
   showModalMenu: PropTypes.func.isRequired,
   cart: PropTypes.array.isRequired,
   toggleCart: PropTypes.func.isRequired,

 };
