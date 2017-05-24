import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import { OverlayTrigger, Glyphicon, Well, Tooltip } from 'react-bootstrap';
import Control from 'react-leaflet-control';
import ziputils from 'jszip-utils';
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { downloadSingleFile,downloadMultipleFiles } from '../utils/downloadHelper';

// Since this component is simple and static, there's no parent container for it.
const BPlanInfo = ({featureCollection, selectedIndex, next, previous}) => {

  const currentFeature=featureCollection[selectedIndex];

  let downloadPlan=function() {
    if ((currentFeature.properties.plaene_rk.length+currentFeature.properties.plaene_nrk.length)==1 ) {
      if (currentFeature.properties.plaene_rk.length==1) {
        downloadSingleFile(currentFeature.properties.plaene_rk[0]);
      }
      else {
        downloadSingleFile(currentFeature.properties.plaene_nrk[0]);
      }
    }
    else {
      downloadMultipleFiles(
        [
          {"folder":"/","downloads":currentFeature.properties.plaene_rk},
          {"folder":"/nicht rechtskräftig/","downloads":currentFeature.properties.plaene_nrk}
        ], "BPLAN_Plaene."+currentFeature.properties.nummer);
    }
  }

  let downloadDocs=function() {
      downloadMultipleFiles(
        [
          {"folder":"/","downloads":currentFeature.properties.plaene_rk},
          {"folder":"/nicht rechtskräftig/","downloads":currentFeature.properties.plaene_nrk},
          {"folder":"/Zusatzdokumente/","downloads":currentFeature.properties.docs}
        ], "BPLAN_Plaene_und_Zusatzdokumente."+currentFeature.properties.nummer);
  };

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
                <a href="#" onClick={downloadDocs}>alles</a>
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

  return (
        <Well bsSize="small" style={{ width: '250px'}}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                  <h4>BPlan {currentFeature.properties.nummer}</h4>
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
                <td style={{ textAlign: 'center', verticalAlign: 'center' }}>{featureCollection.length-1} weitere</td>
                <td style={{ textAlign: 'right', verticalAlign: 'center' }}><a onClick={next} href="#">&gt;&gt;</a></td>
              </tr>
            </tbody>
          </table>
        </Well>
  );
};

export default BPlanInfo;
 BPlanInfo.propTypes = {
   featureCollection: PropTypes.array.isRequired,
   selectedIndex: PropTypes.number.isRequired,
 };
