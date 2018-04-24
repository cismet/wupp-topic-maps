import React from 'react';
import PropTypes from 'prop-types';
import Cismap from '../containers/Cismap';

import { connect } from "react-redux";
import { Tooltip, Button} from 'react-bootstrap';
import Control from 'react-leaflet-control';
import {Icon} from 'react-fa'


import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { actions as stadtplanActions } from '../redux/modules/stadtplan';
import {routerActions} from 'react-router-redux'

import { bindActionCreators } from 'redux';

import { featureStyler, featureHoverer, poiClusterIconCreator } from '../utils/stadtplanHelper';

import Loadable from 'react-loading-overlay';
import queryString from 'query-string';

import {modifyQueryPart} from '../utils/routingHelper'
import ProjSingleGeoJson from '../components/ProjSingleGeoJson';

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    stadtplan: state.stadtplan,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    stadtplanActions: bindActionCreators(stadtplanActions, dispatch),
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
    }
    componentWillUnmount() {
        // console.log("Ehrenamt unmount")
    }

    componentWillMount() {
        // console.log("Ehrenamt mount")
        this.dataLoaded=false;
        this.loadThePOIs().then((data) => {
            this.dataLoaded=true;
        });
        //this.props.uiStateActions.setApplicationMenuActiveKey("filtertab");
      }
    componentWillUpdate() {
      
        if (this.props.stadtplan.pois.length===0){
            return;
        }
        // let urlCart=queryString.parse(this.props.routing.location.search).cart;
        // let urlCartIds=new Set();
        // if (urlCart){
        //     urlCartIds=new Set(urlCart.split(",").sort((a,b)=>parseInt(a,10)-parseInt(b,10)));
        // }
        // let cartIds=new Set(this.props.ehrenamt.cart.map(x=>x.id).sort((a,b)=>parseInt(a,10)-parseInt(b,10)));

        // let missingIdsInCart=new Set([...urlCartIds].filter(x => !cartIds.has(x)));

        // if (missingIdsInCart.size>0) {
        //     this.props.ehrenamtActions.addToCartByIds(Array.from(missingIdsInCart));
        // }        
        
        // let newUrlCartArr=Array.from(cartIds).sort((a,b)=>parseInt(a,10)-parseInt(b,10));
    
        // let newUrlCart=newUrlCartArr.join();

        // if (urlCart!==newUrlCart && newUrlCart.length>0){
            
        //     let pn=this.props.routing.location.pathname;
        //     if (pn.indexOf("stadtplan")===-1){ 
        //         pn="/stadtplan"; //in certain conditions the pathname does not contain ehrenamt. fix that. 
        //     }
        //     let newRoute= pn + modifyQueryPart(this.props.routing.location.search, {
        //         cart: newUrlCart
        //     });
        //     console.log("push new route:"+newRoute);
        //     this.props.routingActions.push(newRoute);
        // }
    }
     





    loadThePOIs() {
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.props.stadtplanActions.loadPOIs();
                resolve('ok');
            }, 100);
        });
        return promise;
    }
    createfeatureCollectionByBoundingBox(bbox) {
       this.props.stadtplanActions.createFeatureCollectionFromPOIs(bbox)
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
                       gazTopics={["adressen", "bezirke", "quartiere","pois"]}
                       clustered={(queryString.parse(this.props.routing.location.search).clustered)!==undefined}
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
                            iconCreateFunction: poiClusterIconCreator,
                        }}
                        infoBox={info}
                        applicationMenuTooltipProvider={()=> (<Tooltip style={{
                                zIndex: 3000000000
                              }} id="helpTooltip">Filter | Merkliste | Anleitung</Tooltip>)
                           }
                        gazBoxInfoText="Stadtteil | Adresse | POI" >   
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
