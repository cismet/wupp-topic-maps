import React from 'react';
import PropTypes from 'prop-types';
import Cismap from '../containers/Cismap';

import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import { Well, Tooltip} from 'react-bootstrap';


import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { actions as ehrenamtActions, constants as ehrenamtConstants } from '../redux/modules/ehrenamt';

import { bindActionCreators } from 'redux';
import EhrenamtModalApplicationMenu from '../components/EhrenamtModalApplicationMenu';
import EhrenamtInfo  from '../components/EhrenamtInfo'

import { featureStyler, featureHoverer, ehrenAmtClusterIconCreator } from '../utils/ehrenamtHelper';
import {Icon} from 'react-fa'

import Loadable from 'react-loading-overlay';

function mapStateToProps(state) {
  return {
    ui: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    ehrenamt: state.ehrenamt
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    ehrenamtActions: bindActionCreators(ehrenamtActions, dispatch),

  };
}

export class Ehrenamt_ extends React.Component {
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
    componentWillMount() {
        this.dataLoaded=false;
        this.loadTheOffers().then((data) => {
            this.dataLoaded=true;
        });
        this.props.uiStateActions.setApplicationMenuActiveKey("filtertab");
      }
   


    loadTheOffers() {
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.props.ehrenamtActions.loadOffers();
                resolve('ok');
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
        console.log(this);
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
      this.props.ehrenamtActions.toggleFilter(filtergroup,filter);
    }

    resetFilter() {
        if (this.props.ehrenamt.mode===ehrenamtConstants.FILTER_FILTER){
            this.props.ehrenamtActions.resetFilter();
        }
        else {
            this.props.ehrenamtActions.setMode(ehrenamtConstants.FILTER_FILTER);
        }
        
    }
    searchTooltip(){
        return (<div/>);
    };

    
    render() {
      let info= null;
        let numberOfOffers=this.props.ehrenamt.filteredOffers.length;
           info = (
             <EhrenamtInfo 
                 pixelwidth={250}
                 featureCollection={this.props.mapping.featureCollection}
                 filteredOffers={this.props.ehrenamt.filteredOffers}
                 selectedIndex={this.props.mapping.selectedIndex||0}
                 next={this.selectNextIndex}
                 previous={this.selectPreviousIndex}
                 fitAll={this.gotoHome}
                 downloadPlan={this.downloadPlan}
                 downloadEverything={this.downloadEverything}
                 filter={this.props.ehrenamt.filterX}
                 resetFilter={this.resetFilter}
                 showModalMenu={(section)=>this.props.uiStateActions.showApplicationMenuAndActivateSection(true,section)}
                 cart={this.props.ehrenamt.cart}
                 toggleCart={this.props.ehrenamtActions.toggleCart}
                 filterMode={this.props.ehrenamt.mode}

                 />
             )
      

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
      return (
           <div key={'div.EhrenamtModalApplicationMenu.visible:'+this.props.ui.applicationMenuVisible}>
               <EhrenamtModalApplicationMenu key={'EhrenamtModalApplicationMenu.visible:'+this.props.ui.applicationMenuVisible}
                zielgruppen={this.props.ehrenamt.zielgruppen}
                kenntnisse={this.props.ehrenamt.kenntnisse}
                globalbereiche={this.props.ehrenamt.globalbereiche}
                filterX={this.props.ehrenamt.filterX}
                filterChanged={this.filterChanged}
                filteredOffersCount={this.props.ehrenamt.filteredOffers.length}
                featureCollectionCount={this.props.mapping.featureCollection.length}
                offersMD5={this.props.ehrenamt.offersMD5}
                centerOnPoint={this.centerOnPoint}
               />
               <Loadable
      active={!this.dataLoaded}
      spinner
      text='Laden der Angebote ...'
    >
               <Cismap ref={cismap => {this.cismapRef = cismap;}}
                       layers={this.props.match.params.layers ||'rvrWMS@75'}
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

                    >
                    </Cismap>
               </Loadable>
              

           </div>
       );
    }
}




const Ehrenamt = connect(mapStateToProps,mapDispatchToProps)(Ehrenamt_);

export default Ehrenamt;

Ehrenamt.propTypes = {
  ui: PropTypes.object,
  uiState: PropTypes.object,
};
