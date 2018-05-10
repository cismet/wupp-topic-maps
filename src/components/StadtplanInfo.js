import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Well, Tooltip } from 'react-bootstrap';
import {Icon} from 'react-fa'
import { constants as ehrenamtConstants } from '../redux/modules/ehrenamt';
import queryString from 'query-string';
import {getColorForProperties} from '../utils/stadtplanHelper';
import Color from 'color';

// Since this component is simple and static, there's no parent container for it.
const StadtplanInfo = ({featureCollection, filteredPOIs, selectedIndex, next, previous, fitAll, loadingIndicator, showModalMenu, uiState, uiStateActions}) => {

  const currentFeature=featureCollection[selectedIndex];


  let logCurrentFeature=function() {
    console.log(currentFeature.properties.mainlocationtype.signatur);
  }
  let info="";
  let t="Kein POI selektiert.";
  let fotoStyle={};
  
  let maillink=null;
  let urllink=null;
  let phonelink=null;
  

    if (currentFeature){
        //console.log(currentFeature.properties.info);

        t=currentFeature.text;
        if (currentFeature.properties.info){
            info=currentFeature.properties.info;
        }

        if (currentFeature.properties.foto) {
            fotoStyle={
                backgroundImage: "url("+currentFeature.properties.foto+")",
                backgroundSize: "cover",
                width: "150px",
                height: "150px",
                backgroundPosition: "right center",
                backgroundOrigin: "content-box",
                paddingRight: "5px"

            
            }
        }
        if (currentFeature.properties.tel){
            phonelink=(
                <a key={"stadtplan.poi.phone.action."} href={"tel:"+currentFeature.properties.tel}>
                    <Icon style={{color: "grey", width: '26px', textAlign: 'center'}} size="2x" name={"phone"} />
                </a>
            );
        }
        if (currentFeature.properties.email){
            maillink=(
                <a key={"stadtplan.poi.mail.action."} href={"mailto:"+currentFeature.properties.email}>
                    <Icon style={{color: "grey", width: '26px', textAlign: 'center'}} size="2x" name={"envelope-square"} />
                </a>
            );
        }
        if (currentFeature.properties.url){
            urllink=(
                <a key={"stadtplan.poi.url.action."} href={currentFeature.properties.url} target="_blank">
                    <Icon style={{color: "grey", width: '26px', textAlign: 'center'}} size="2x" name={"link"} />
                </a>
            );
        }
    }

    if (currentFeature) {
        let poiColor=Color(getColorForProperties(currentFeature.properties));
        
        let textColor="black";
        if (poiColor.isDark()){
            textColor="white";
        }
        let llVis=(
            <table style={{ width: '100%' }}>
            <tbody>
              <tr>
              <td style={{ textAlign: 'left', verticalAlign: 'top',background: poiColor, color: textColor, opacity:'0.9', paddingLeft: '3px',paddingTop: '0px',paddingBottom: '0px', }}>
              {currentFeature.properties.mainlocationtype.lebenslagen.join(", ")}
              </td>
             
              </tr>
            </tbody>
          </table>
        );



        let openlightbox = (e) => {
            fetch(currentFeature.properties.fotostrecke.replace(/http:\/\/.*fotokraemer-wuppertal\.de/,"https://wunda-geoportal-fotos.cismet.de/"), {
                    method: 'get'

                }).then(function (response) {
                    return response.text();
                }).then(function (data) {
                    var tmp = document.implementation.createHTMLDocument();
                    tmp.body.innerHTML = data;
                    let urls=[];
                    for (let el of tmp.getElementsByClassName('bilderrahmen')) {
                        //urls.push();
                        let query = queryString.parse(el.getElementsByTagName("a")[0].getAttribute("href"))
                        urls.push("https://wunda-geoportal-fotos.cismet.de/images/"+query.dateiname_bild);
                    }
                    uiStateActions.setLightboxUrls(urls);
                    uiStateActions.setLightboxTitle(currentFeature.text);
                    uiStateActions.setLightboxCaption(
                        <a href={currentFeature.properties.fotostrecke} target="_fotos">Foto Kr&auml;mer</a>
                    );
                    uiStateActions.setLightboxIndex(0);
                    uiStateActions.setLightboxVisible(true);

                }).catch(function (err) {
                    console.log(err);
                });
        };

        return (
            <div>
                
                    <table style={{ width: '100%' }}>
                    <tbody>
                    <tr>
                    <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                        <a onClick={openlightbox} hrefx={currentFeature.properties.fotostrecke||currentFeature.properties.foto} target="_fotos">
                        <img  style={{paddingBottom:"5px"}} src={currentFeature.properties.foto.replace(/http:\/\/.*fotokraemer-wuppertal\.de/,"https://wunda-geoportal-fotos.cismet.de/")} width="150" />
                        </a>
                    </td>
                    </tr>
                        </tbody>
                    </table>
                    {llVis}
            <Well bsSize="small" onClick={logCurrentFeature}  >
            <div > 
            <table style={{ width: '100%' }}>
                <tbody>
                <tr>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                    <table style={{ width: '100%' }}>
                     <tbody>
                        <tr>
                        <td style={{ textAlign: 'left' }}>
                            <h5><b>{currentFeature.text}</b></h5>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                              
                            {urllink}
                            {maillink}
                            {phonelink}
                            
                        </td>
                        </tr>
                        </tbody>
                    </table>
                    <table style={{ width: '100%'}}>
                     <tbody>
                        <tr>
                        <td style={{ textAlign: 'left' }}>
                            <h6>
                                {info.split('\n').map((item, key) => {
                                return <span key={key}>{item}<br/></span>
                                })}</h6>
                            <p>{currentFeature.properties.adresse}</p>
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
                        <td style={{ textAlign: 'center', verticalAlign: 'center' }}><a onClick={fitAll} >{filteredPOIs.length} POI in Wuppertal</a></td>
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
                    <td style={{ textAlign: 'center', verticalAlign: 'center' }}>{featureCollection.length} POI angezeigt</td>

                    <OverlayTrigger placement="top" overlay={(<Tooltip style={{zIndex: 3000000000}} id="nexttt">n&auml;chster Treffer</Tooltip>)}>
                        <td style={{ textAlign: 'right', verticalAlign: 'center' }}><a onClick={next} >&gt;&gt;</a></td>
                    </OverlayTrigger>

                    </tr>
                </tbody>
                </table>

            </div>
            </Well>
            </div>
        );
    }
    else if (filteredPOIs.length>0){
        return (
            <Well bsSize="small" pixelwidth={250}>
            <h5>Keine POI gefunden!</h5>
            <p>Für mehr POI, Ansicht mit <Icon name='minus-square' /> verkleinern.                   
            Um nach Themenfeldern zu filtern, das 
            <a onClick={()=>showModalMenu("filtertab")}> Men&uuml;&nbsp;
            <Icon name="bars" style={{color:"black"}}/> &ouml;ffnen.</a></p>
            <div align="center"><a onClick={fitAll} >{filteredPOIs.length} POI in Wuppertal</a></div>
        </Well>)
                // <Well bsSize="small" onClick={logCurrentFeature}>
                //     <h4>Kein POI slektiert</h4>
                //     <p><br/></p>
                // </Well>
                // </div>
    }   
    else {
        return null;
    } 
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


 StadtplanInfo.defaultProps = {
    featureCollection: [],
   filteredPOIs: [],
   selectedIndex: 0,
   next: ()=>{},
   previous:()=>{},
   fitAll: ()=>{},
   showModalMenu: ()=>{}
}