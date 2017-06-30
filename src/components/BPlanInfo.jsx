import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import { OverlayTrigger, Glyphicon, Well, Tooltip } from 'react-bootstrap';
import Control from 'react-leaflet-control';
import ziputils from 'jszip-utils';
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import Loadable from 'react-loading-overlay';
import {Icon} from 'react-fa'


// Since this component is simple and static, there's no parent container for it.
const BPlanInfo = ({featureCollection, selectedIndex, next, previous, fitAll, loadingIndicator, downloadPlan, downloadEverything}) => {

  const currentFeature=featureCollection[selectedIndex];


  let logCurrentFeature=function() {
    //console.log(JSON.stringify(currentFeature));
  }

  let planOrPlaene;
  let planOrPlanteile_rk;
  let planOrPlanteile_nrk;
  let dokumentArt=""

  if (currentFeature.properties.plaene_rk.length+currentFeature.properties.plaene_nrk.length>1){
    planOrPlaene="Pläne";
    dokumentArt="ZIP Archiv"
  }
  else {
    planOrPlaene="Plan";  
    dokumentArt="PDF Dokument"
  }

  if (currentFeature.properties.plaene_rk.length>1||currentFeature.properties.plaene_rk.length==0){
    planOrPlanteile_rk="rechtskräftigen Planteilen";
  }
  else {
    planOrPlanteile_rk="rechtskräftigem Plan";
  }  
  if (currentFeature.properties.plaene_nrk.length>1||currentFeature.properties.plaene_nrk.length==0){
    planOrPlanteile_nrk="nicht rechtskräftigen Planteilen";
  }
  else {
    planOrPlanteile_nrk="nicht rechtskräftigem Plan";
  }
  
  let nichtRK=""
  if (currentFeature.properties.plaene_nrk.length>0) {
    nichtRK=" und "+ currentFeature.properties.plaene_nrk.length + " " + planOrPlanteile_nrk
  }

  const planTooltip = (  
    <Tooltip id="planTooltip">{dokumentArt} mit {currentFeature.properties.plaene_rk.length + " " + planOrPlanteile_rk+nichtRK}</Tooltip>
  );

  let docsEnabled;
  let docOrDocs;
  if (currentFeature.properties.docs.length===0){
    docsEnabled=false;
    docOrDocs="Dokumente";
  }
  else if (currentFeature.properties.docs.length>0){
    docsEnabled=true;
    docOrDocs="Zusatzdokumenten";
  }
  else {
    docsEnabled=true;
    docOrDocs="Zusatzdokument";
  }

  const docsTooltip = (
    <Tooltip id="docsTooltip">ZIP Archiv mit allen Plänen und {currentFeature.properties.docs.length + " " + docOrDocs}</Tooltip>
  );

  let docDownload=null;
  if (docsEnabled){
    docDownload=(
        <h6>
            <OverlayTrigger placement="left" overlay={docsTooltip}>
                <a href="#" onClick={downloadEverything}>alles</a>
            </OverlayTrigger>
        </h6>      
    );
  }
  else {
    docDownload=(
      <h6>
          &nbsp;
        </h6>   
    )
  }

  let statusGlyphs=null;
  let status=currentFeature.properties.status;
  //let rk=(<FontAwesome name='check-circle-o' />);
  let rktt=(<Tooltip id="rktt">rechtswirksam</Tooltip>)
  let nrktt=(<Tooltip id="nrktt">laufendes Verfahren</Tooltip>)

  let rk=(<OverlayTrigger placement="top" overlay={rktt}><Icon style={{color: 'green',opacity: .50}} name='check-circle-o' /></OverlayTrigger>);
  let nrk=(<OverlayTrigger placement="top" overlay={nrktt}><Icon style={{color: 'red',opacity: .50}} name='times-circle-o' /></OverlayTrigger>);
  if (status=="rechtskräftig") {
    statusGlyphs=(<span>&nbsp;{rk}</span>);
  }
  else if (status=="nicht rechtskräftig") {
    statusGlyphs=(<span>&nbsp;{nrk}</span>);
  }
  else {
    statusGlyphs=(<span>&nbsp;{rk}&nbsp;{nrk}</span>)
  }
  return (
    <Loadable
      active={loadingIndicator}
      spinner
      text='Zusammenstellen der Dokumente ...'
    >
        <Well bsSize="small" style={{ width: '250px'}} onClick={logCurrentFeature}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                  <h4>BPlan {currentFeature.properties.nummer}{statusGlyphs}</h4>
                  <h6>{currentFeature.properties.name}</h6>
                  </td>
                <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                  <h4><Glyphicon glyph="download" /></h4>
                  <h6>
                      <OverlayTrigger placement="left" overlay={planTooltip}>
                          <a href="#" onClick={downloadPlan} >{planOrPlaene}</a>
                      </OverlayTrigger>
                  </h6>
                 {docDownload}
                </td>
              </tr>
            </tbody>
          </table>
          <br/>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'center' }}><a onClick={previous} href="#">&lt;&lt;</a></td>
                <td style={{ textAlign: 'center', verticalAlign: 'center' }}><a onClick={fitAll} href="#"> {featureCollection.length} insgesamt</a></td>
                <td style={{ textAlign: 'right', verticalAlign: 'center' }}><a onClick={next} href="#">&gt;&gt;</a></td>
              </tr>
            </tbody>
          </table>
        </Well>
</Loadable>

  );
};



export default BPlanInfo;
 BPlanInfo.propTypes = {
   featureCollection: PropTypes.array.isRequired,
   selectedIndex: PropTypes.number.isRequired,
   loadingIndicator: PropTypes.bool.isRequired,
   next: PropTypes.func.isRequired,
   previous: PropTypes.func.isRequired,
   fitAll: PropTypes.func.isRequired,
   downloadPlan: PropTypes.func.isRequired,
   downloadEverything: PropTypes.func.isRequired,
 };


