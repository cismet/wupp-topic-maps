import React from 'react';
import PropTypes from 'prop-types';
import Cismap from '../containers/Cismap';

import { connect } from "react-redux";
import { Tooltip, Button} from 'react-bootstrap';
import Control from 'react-leaflet-control';
import {Icon} from 'react-fa'


import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { actions as ehrenamtActions, constants as ehrenamtConstants } from '../redux/modules/ehrenamt';
import {routerActions} from 'react-router-redux'

import { bindActionCreators } from 'redux';
import EhrenamtModalApplicationMenu from '../components/EhrenamtModalApplicationMenu';
import EhrenamtInfo  from '../components/EhrenamtInfo'

import { featureStyler, featureHoverer, ehrenAmtClusterIconCreator } from '../utils/ehrenamtHelper';

import Loadable from 'react-loading-overlay';
import queryString from 'query-string';

import {modifyQueryPart} from '../utils/routingHelper'
import ProjSingleGeoJson from '../components/ProjSingleGeoJson';

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    ehrenamt: state.ehrenamt,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    ehrenamtActions: bindActionCreators(ehrenamtActions, dispatch),
    routingActions: bindActionCreators(routerActions, dispatch),
  };
}

export class Stadtplan_ extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.gazeteerhHit=this.gazeteerhHit.bind(this);
      this.searchButtonHit=this.searchButtonHit.bind(this);
      this.featureClick=this.featureClick.bind(this);
      this.gotoHome=this.gotoHome.bind(this);
      this.doubleMapClick=this.doubleMapClick.bind(this);
      this.searchTooltip=this.searchTooltip.bind(this);
      this.selectNextIndex=this.selectNextIndex.bind(this);
      this.selectPreviousIndex=this.selectPreviousIndex.bind(this);
      this.createfeatureCollectionByBoundingBox=this.createfeatureCollectionByBoundingBox.bind(this);
      this.filterChanged=this.filterChanged.bind(this);
      this.resetFilter=this.resetFilter.bind(this);
      this.centerOnPoint=this.centerOnPoint.bind(this);
      this.props.mappingActions.setBoundingBoxChangedTrigger(this.createfeatureCollectionByBoundingBox);
      this.maskingGeoJSON=null;
        this.mask=this.mask.bind(this);

    }
    componentWillUnmount() {
        // console.log("Ehrenamt unmount")
    }

    componentWillMount() {
        // console.log("Ehrenamt mount")
        this.dataLoaded=true;
        this.loadThePOIs().then((data) => {
            this.dataLoaded=true;
        });
        this.props.uiStateActions.setApplicationMenuActiveKey("filtertab");
      }
    componentWillUpdate() {
      
        if (this.props.ehrenamt.offers.length===0){
            return;
        }
        let urlCart=queryString.parse(this.props.routing.location.search).cart;
        let urlCartIds=new Set();
        if (urlCart){
            urlCartIds=new Set(urlCart.split(",").sort((a,b)=>parseInt(a,10)-parseInt(b,10)));
        }
        let cartIds=new Set(this.props.ehrenamt.cart.map(x=>x.id).sort((a,b)=>parseInt(a,10)-parseInt(b,10)));

        let missingIdsInCart=new Set([...urlCartIds].filter(x => !cartIds.has(x)));

        if (missingIdsInCart.size>0) {
            this.props.ehrenamtActions.addToCartByIds(Array.from(missingIdsInCart));
        }        
        
        let newUrlCartArr=Array.from(cartIds).sort((a,b)=>parseInt(a,10)-parseInt(b,10));
    
        let newUrlCart=newUrlCartArr.join();

        if (urlCart!==newUrlCart && newUrlCart.length>0){
            
            let pn=this.props.routing.location.pathname;
            if (pn.indexOf("stadtplan")===-1){ 
                pn="/stadtplan"; //in certain conditions the pathname does not contain ehrenamt. fix that. 
            }
            let newRoute= pn + modifyQueryPart(this.props.routing.location.search, {
                cart: newUrlCart
            });
            console.log("push new route:"+newRoute);
            this.props.routingActions.push(newRoute);
        }
    }
     





    loadThePOIs() {
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                // this.props.ehrenamtActions.loadOffers();
                // resolve('ok');
            }, 100);
        });
        return promise;
    }
    createfeatureCollectionByBoundingBox(bbox) {
      this.props.ehrenamtActions.createFeatureCollectionFromOffers(bbox)
    }

    gazeteerhHit(selectedObject) {

    }

    searchButtonHit(event) {

    }

    featureClick(event){
      if (event.target.feature) {
        this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.index);
      }
    }

    doubleMapClick(event) {

    }

    gotoHome() {
      //x1=361332.75015625&y1=5669333.966678483&x2=382500.79703125&y2=5687261.576954328
      this.cismapRef.wrappedInstance.gotoHomeBB()
    }

    centerOnPoint(x,y,z) {
        this.cismapRef.wrappedInstance.centerOnPoint(x,y,z);
    }

    selectNextIndex() {
      let potIndex=this.props.mapping.selectedIndex+1;
      if (potIndex>=this.props.mapping.featureCollection.length){
        potIndex=0;
      }
      this.props.mappingActions.setSelectedFeatureIndex(potIndex);
      //this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
    }

    selectPreviousIndex() {
      let potIndex=this.props.mapping.selectedIndex-1;
      if (potIndex<0){
        potIndex=this.props.mapping.featureCollection.length-1;
      }
      this.props.mappingActions.setSelectedFeatureIndex(potIndex);

    }
    filterChanged(filtergroup,filter) {
      //this.props.ehrenamtActions.toggleFilter(filtergroup,filter);
    }

    resetFilter() {
        // if (this.props.ehrenamt.mode===ehrenamtConstants.FILTER_FILTER){
        //     this.props.ehrenamtActions.resetFilter();
        // }
        // else {
        //     this.props.ehrenamtActions.setMode(ehrenamtConstants.FILTER_FILTER);
        // }
        
    }
    searchTooltip(){
        return (<div/>);
    };

    mask(){
        let f={"type":"Feature","geometry":
            {"type":"Polygon",
            "coordinates":[[[374448.9815935381,5681697.912798932],[374452.11872445047,5681699.641664326],[374450.98518161476,5681701.257767179],[374448.4372401871,5681703.910305271],[374453.13134646416,5681705.497409623],[374455.1547717452,5681704.917454478],[374455.36999546364,5681705.386866037],[374469.89264791086,5681709.731729614],[374470.8677190095,5681709.258567396],[374471.33915648237,5681710.169806779],[374483.44023328274,5681714.087402168],[374483.9588583857,5681713.900149315],[374484.4430597909,5681714.635683638],[374495.2922706194,5681719.722087694],[374496.79127897695,5681719.045435926],[374497.1482563317,5681719.700257105],[374510.5229010768,5681727.26473131],[374512.1706536412,5681726.698107425],[374512.48557343706,5681727.454723046],[374516.7998006083,5681719.248003268],[374516.24065751955,5681719.323973958],[374515.90951455757,5681717.636578101],[374517.795598004,5681717.3705047285],[374517.92640475556,5681717.949404797],[374526.0570843145,5681720.020180599],[374530.50608388707,5681711.810176284],[374524.4014435448,5681707.0240010135],[374523.4745393917,5681707.504131398],[374522.5829069689,5681705.613582197],[374523.1508409977,5681705.383316264],[374512.535105288,5681700.330353825],[374511.43591002375,5681700.9494750025],[374510.4418737404,5681699.102244023],[374510.95768082514,5681698.845966932],[374501.6825572476,5681695.629233589],[374500.68530871347,5681696.075157122],[374499.85722040385,5681694.22095209],[374500.6674363762,5681693.84976541],[374490.60699154437,5681691.316479424],[374489.7031509355,5681691.699508674],[374488.71786375716,5681690.184946235],[374489.2261443101,5681689.895056336],[374489.13659596816,5681684.013027204],[374486.0367448777,5681683.262810575],[374485.4989001006,5681685.526008512],[374483.723216027,5681692.771889875],[374480.23726017773,5681691.483784047],[374483.37864650786,5681689.011442356],[374482.1464066319,5681686.766792823],[374467.3541948758,5681681.51920709],[374466.18892779946,5681681.870995035],[374465.6433042474,5681679.929187264],[374466.6168084219,5681679.609280322],[374471.6723681651,5681668.39766473],[374471.08984165266,5681668.562557539],[374470.82118465006,5681666.813491973],[374472.04015428945,5681666.480570756],[374475.60606185347,5681657.496909076],[374474.8323290162,5681657.611656674],[374474.78016550094,5681657.092333575],[374461.67454634607,5681652.619412167],[374461.56709896773,5681652.926838551],[374459.80247493833,5681652.225539785],[374460.49882878363,5681650.4140918255],[374462.2529485002,5681650.9587127045],[374462.0112566836,5681651.6520036785],[374478.7247306481,5681646.5355229145],[374478.21575286984,5681645.194538936],[374479.42261727527,5681644.857084554],[374479.9800536297,5681641.926590815],[374479.503663104,5681641.752053877],[374479.74737137556,5681641.08067324],[374458.07199321315,5681632.880538086],[374455.0778676346,5681640.281003039],[374452.3207867369,5681639.36006965],[374443.9081726745,5681661.817351916],[374443.3993817866,5681661.62997341],[374443.2628669664,5681662.037737219],[374443.12178536877,5681662.990071107],[374442.4180089943,5681664.938808054],[374441.64068522677,5681665.234850859],[374435.0371177122,5681662.319854522],[374429.67316368595,5681660.33875312],[374427.1891831085,5681659.420812037],[374423.52084916085,5681658.065775536],[374419.1694616154,5681670.883769487],[374422.9590083882,5681672.481908575],[374422.8379222676,5681671.722366775],[374424.9360188432,5681671.357448496],[374425.39463089406,5681673.005788123],[374424.46027317643,5681673.180951111],[374433.6158554591,5681676.543891913],[374433.4539910704,5681675.671032802],[374435.2429421842,5681675.207655534],[374435.70492596924,5681676.98480594],[374435.0623449236,5681677.103138246],[374439.0428243689,5681683.52517316],[374441.872718852,5681682.358928161],[374444.01502615213,5681677.028271179],[374448.34704221785,5681665.694086004],[374451.7795132138,5681667.031672541],[374447.37297398224,5681678.2848375235],[374438.067838341,5681701.917135054],[374438.4164100401,5681702.708169715],[374438.4395444803,5681702.713373848],[374439.7068532966,5681702.902526029],[374441.72186100483,5681702.828148444],[374444.22874262556,5681702.085293375],[374447.6106812544,5681699.666829635],[374448.9815935381,5681697.912798932]]]},
            "crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::25832"}},"properties":{"id":589519,"art_abk":"VF","flaechenart":"versiegelte Fläche","anschlussgrad":"angeschl.","groesse":3489,"groesse_korrektur":3489},"selected":true};
        console.log("MASK");
        if (this.maskingGeoJSON){
            this.maskingGeoJSON=null;
            this.props.mappingActions.setOverlayFeature(null);
        }
        else {
            this.maskingGeoJSON=(
                <div>
                <Control position="bottomleft"><Button><Icon name="check"/></Button></Control>
                <ProjSingleGeoJson 
                    key={JSON.stringify(f)} 
                    geoJson={f} 
                    mapRef={this.cismapRef}
                    />
                </div>
            )
            this.props.mappingActions.setOverlayFeature(f);

        }
    }

    
    render() {
      let info= null;
           info = (
                <div/>            
             )
            //  <EhrenamtInfo 
            //  key={"ehrenamtInfo."+(this.props.mapping.selectedIndex||0)+".cart:+JSON.stringify(this.props.ehrenamt.cart"}
            //   pixelwidth={250}
            //   featureCollection={this.props.mapping.featureCollection}
            //   filteredOffers={this.props.ehrenamt.filteredOffers}
            //   selectedIndex={this.props.mapping.selectedIndex||0}
            //   next={this.selectNextIndex}
            //   previous={this.selectPreviousIndex}
            //   fitAll={this.gotoHome}
            //   downloadPlan={this.downloadPlan}
            //   downloadEverything={this.downloadEverything}
            //   filter={this.props.ehrenamt.filterX}
            //   resetFilter={this.resetFilter}
            //   showModalMenu={(section)=>this.props.uiStateActions.showApplicationMenuAndActivateSection(true,section)}
            //   cart={this.props.ehrenamt.cart}
            //   toggleCartFromFeature={this.props.ehrenamtActions.toggleCartFromFeature}
            //   filterMode={this.props.ehrenamt.mode}

            //   />

        // Auflistung der ids die momentan nicht dargestllt werden
        // let offerIds=[];
        // let fcIds=[];
        // for (let f of this.props.mapping.featureCollection) {
        //     fcIds.push(f.id);
        // }
        // for (let o of this.props.ehrenamt.offers) {
        //     offerIds.push(o.id);
        // }
        // offerIds.sort();
        // fcIds.sort();
        // let difference = offerIds.filter(x => !fcIds.includes(x));
        // console.log(difference);



        //        <EhrenamtModalApplicationMenu key={'EhrenamtModalApplicationMenu.visible:'+this.props.uiState.applicationMenuVisible}
        //         zielgruppen={this.props.ehrenamt.zielgruppen}
        //         kenntnisse={this.props.ehrenamt.kenntnisse}
        //         globalbereiche={this.props.ehrenamt.globalbereiche}
        //         filterX={this.props.ehrenamt.filterX}
        //         filterChanged={this.filterChanged}
        //         filteredOffersCount={this.props.ehrenamt.filteredOffers.length}
        //         featureCollectionCount={this.props.mapping.featureCollection.length}
        //         offersMD5={this.props.ehrenamt.offersMD5}
        //         centerOnPoint={this.centerOnPoint}
        //        />


      return (
           <div>
        
               <Loadable
      active={!this.dataLoaded}
      spinner
      text='Laden der POIs ...'
    >
               <Cismap ref={cismap => {this.cismapRef = cismap;}}
                       layers={this.props.match.params.layers ||'rvrWMS@90'}
                       gazeteerHitTrigger={this.gazeteerhHit}
                       searchButtonTrigger={this.searchButtonHit}
                       featureStyler={featureStyler}
                       hoverer={featureHoverer}
                       featureClickHandler={this.featureClick}
                       ondblclick={this.doubleMapClick}
                       searchTooltipProvider={this.searchTooltip}
                       searchMinZoom={99}
                       searchMaxZoom={98}
                       gazTopics={["pois","adressen", "bezirke", "quartiere"]}
                       clustered={true}
                       minZoom={6}
                       clusterOptions={{
                            spiderfyOnMaxZoom: false,
                            showCoverageOnHover: false,
                            zoomToBoundsOnClick: false,
                            maxClusterRadius:40,
                            disableClusteringAtZoom:19,
                            animate:false,
                            cismapZoomTillSpiderfy:12,
                            selectionSpiderfyMinZoom:12,
                            iconCreateFunction: ehrenAmtClusterIconCreator,
                        }}
                        infoBox={info}
                        applicationMenuTooltipProvider={()=> (<Tooltip style={{
                                zIndex: 3000000000
                              }} id="helpTooltip">Filter | Merkliste | Anleitung</Tooltip>)
                           }
                        gazBoxInfoText="Stadtteil | Adresse | POI" >   
                        <Control position="bottomleft"><Button onClick={this.mask}><Icon name="lock"/></Button></Control>
                    </Cismap>
                    
               </Loadable>
              

           </div>
       );
    }
}


//<Control position = "bottomleft"> <Button>xxx</Button></Control>

const Stadtplan = connect(mapStateToProps,mapDispatchToProps)(Stadtplan_);

export default Stadtplan;

Stadtplan.propTypes = {
  ui: PropTypes.object,
  uiState: PropTypes.object,
};
