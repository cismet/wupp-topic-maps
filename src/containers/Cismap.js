import React from 'react';
import PropTypes from 'prop-types';
import {Map, ZoomControl} from 'react-leaflet';
import {connect} from "react-redux";
import 'proj4leaflet';
import {Layers} from '../components/Layers';
import FeatureCollectionDisplay from '../components/FeatureCollectionDisplay';
import GazetteerHitDisplay from '../components/GazetteerHitDisplay';
import {crs25832, proj4crs25832def} from '../constants/gis';
import proj4 from 'proj4';
import {bindActionCreators} from 'redux';
//import 'react-leaflet-fullscreen/dist/styles.css';
import FullscreenControl from '../components/FullscreenControl';
import Control from 'react-leaflet-control';
import {
  Form,
  FormGroup,
  InputGroup,
  Button,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import * as stateConstants from '../constants/stateConstants';

import {routerActions} from 'react-router-redux'
import {modifyQueryPart} from '../utils/routingHelper'
import {actions as mappingActions} from '../redux/modules/mapping';
import objectAssign from 'object-assign';
import {Icon} from 'react-fa'
import {actions as uiStateActions} from '../redux/modules/uiState';
import {actions as gazetteerTopicsActions} from '../redux/modules/gazetteerTopics';
import 'url-search-params-polyfill';
import * as turfHelpers from '@turf/helpers';
import bbox from '@turf/bbox';
import {WUNDAAPI} from '../constants/services';
import * as gisHelpers from '../utils/gisHelper';

const fallbackposition = {
  lat: 51.272399,
  lng: 7.199712
};

function mapStateToProps(state) {
  return {uiState: state.uiState, mapping: state.mapping, attributionControl: false, routing: state.routing, gazetteerTopics: state.gazetteerTopics};
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    routingActions: bindActionCreators(routerActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch)
  };
}

export function createLeafletElement() {}

export class Cismap_ extends React.Component {
  constructor(props) {
    super(props);
    this.internalGazeteerHitTrigger = this.internalGazeteerHitTrigger.bind(this);
    this.internalSearchButtonTrigger = this.internalSearchButtonTrigger.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.showModalHelpComponent = this.showModalHelpComponent.bind(this);
    this.gazData=[];
  }

  componentWillMount() {

    //Über uiStateActions anzeigen dass die Combobox nocht nicht funktionsfähig ist

    this.props.uiStateActions.setGazetteerBoxEnabled(false);
    this.props.uiStateActions.setGazetteerBoxInfoText("Ortsinformationen werden geladen ...");

    this.props.gazetteerTopicsActions.loadTopicsData(this.props.gazTopics).then(() => {
      let from = Date.now()
      // console.log("parse the shit ")


      //console.log("######################################################## loadTopicsData().then()")



      if (this.props.gazetteerTopics.adressen === undefined) {
        console.log("this.props.gazetteerTopics.adressen === undefined")
      }

      let adressen = JSON.parse(this.props.gazetteerTopics.adressen);
      let pois = JSON.parse(this.props.gazetteerTopics.pois);
      let quartiere = JSON.parse(this.props.gazetteerTopics.quartiere);
      let bezirke = JSON.parse(this.props.gazetteerTopics.bezirke);
      let bplaene = JSON.parse(this.props.gazetteerTopics.bplaene);
      let sorter=0;
      this.gazData = [];
      if (this.props.gazTopics.indexOf("pois")!==-1) {
        for (let i = 0; i < pois.length; ++i) {
          let topicItem = pois[i];
          let g = {
            sorter: sorter++,
            string: topicItem.s,
            glyph: topicItem.g,
            x: topicItem.x,
            y: topicItem.y,
            more: topicItem.m
          };
          this.gazData.push(g);
        }
      }
      if (this.props.gazTopics.indexOf("quartiere")!==-1) {
        for (let i = 0; i < quartiere.length; ++i) {
          let topicItem = quartiere[i];
          let g = {
            sorter: sorter++,
            string: topicItem.s,
            glyph: topicItem.g,
            x: topicItem.x,
            y: topicItem.y,
            more: topicItem.m
          };
          this.gazData.push(g);
        }
      }

      if (this.props.gazTopics.indexOf("bezirke")!==-1) {
        for (let i = 0; i < bezirke.length; ++i) {
          let topicItem = bezirke[i];
          let g = {
            sorter: sorter++,
            string: topicItem.s,
            glyph: topicItem.g,
            x: topicItem.x,
            y: topicItem.y,
            more: topicItem.m
          };
          this.gazData.push(g);
        }
      }

      if (this.props.gazTopics.indexOf("adressen")!==-1) {
        for (let i = 0; i < adressen.length; ++i) {
          let topicItem = adressen[i];
          let string=topicItem.s;
          if (topicItem.nr!=="" && topicItem.nr!==0) {
            string=string +" "+topicItem.nr;
          }
          if (topicItem.z!=="") {
            string=string +" "+topicItem.z;
          }
          let g = {
            sorter: sorter++,
            string: string,
            glyph: topicItem.g,
            x: topicItem.x,
            y: topicItem.y,
            more: topicItem.m
          };
          this.gazData.push(g);
        }
      }

      if (this.props.gazTopics.indexOf("bplaene")!==-1) {
        for (let i = 0; i < bplaene.length; ++i) {
          let topicItem = bplaene[i];
          let g = {
            sorter: sorter++,
            string: topicItem.s,
            glyph: topicItem.g,
            x: topicItem.x,
            y: topicItem.y,
            more: topicItem.m
          };
          this.gazData.push(g);
        }
      }

      // console.log("++++++++++++++++++++++++ done with parsing " + ( from - Date.now()))
      this.props.uiStateActions.setGazetteerBoxEnabled(true);
      this.props.uiStateActions.setGazetteerBoxInfoText("Geben Sie einen Suchbegriff ein.");

      this.forceUpdate(); //ugly winning: prevent typeahead to have shitty behaviour
    });

  }
  componentDidMount() {
    this.refs.leafletMap.leafletElement.on('moveend', () => {
      const zoom = this.refs.leafletMap.leafletElement.getZoom();
      const center = this.refs.leafletMap.leafletElement.getCenter();
      const latFromUrl = parseFloat(new URLSearchParams(this.props.routing.location.search).get('lat'));
      const lngFromUrl = parseFloat(new URLSearchParams(this.props.routing.location.search).get('lng'));
      const zoomFromUrl = parseInt(new URLSearchParams(this.props.routing.location.search).get('zoom'), 10);
      var lat = center.lat
      var lng = center.lng

      if (Math.abs(latFromUrl - center.lat) < 0.0001) {
        lat = latFromUrl;
      }
      if (Math.abs(lngFromUrl - center.lng) < 0.0001) {
        lng = lngFromUrl;
      }

      if (lng !== lngFromUrl || lat !== latFromUrl || zoomFromUrl !== zoom) {
        //store.dispatch(push(this.props.routing.locationBeforeTransitions.pathname + querypart))
        this.props.routingActions.push(this.props.routing.location.pathname + modifyQueryPart(this.props.routing.location.search, {
          lat: lat,
          lng: lng,
          zoom: zoom
        }))
      }
      this.storeBoundingBox();

    });
    this.storeBoundingBox();
  }

  componentDidUpdate() {
    if ((typeof(this.refs.leafletMap) !== 'undefined' && this.refs.leafletMap != null)) {
      if (this.props.mapping.autoFitBounds) {
        if (this.props.mapping.autoFitMode === stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN) {
          if (!this.refs.leafletMap.leafletElement.getBounds().contains(this.props.mapping.autoFitBoundsTarget)) {
            this.refs.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);
          }
        } else {
          this.refs.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);
        }
        this.props.mappingActions.setAutoFit(false);
      }
    }
  }

  storeBoundingBox() {
    //store the projected bounds in the store
    const bounds = this.refs.leafletMap.leafletElement.getBounds()
    const projectedNE = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [bounds._northEast.lng, bounds._northEast.lat])
    const projectedSW = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [bounds._southWest.lng, bounds._southWest.lat])
    const bbox = {
      left: projectedSW[0],
      top: projectedNE[1],
      right: projectedNE[0],
      bottom: projectedSW[1]
    };
    //console.log(getPolygon(bbox));
    this.props.mappingActions.mappingBoundsChanged(bbox);
  }

  internalGazeteerHitTrigger(hit) {
    console.log(hit)
    //this.props.routingActions.push(this.props.routing.locationBeforeTransitions.pathname+"lat=51.271767290892676&lng=7.2000696125004575&zoom=14");
    if (hit !== undefined && hit.length !== undefined && hit.length > 0 && hit[0].x !== undefined && hit[0].y !== undefined) {
      //console.log(JSON.stringify(hit))
      const pos = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [
        hit[0].x,
        hit[0].y
      ])
      //console.log(pos)
      this.refs.leafletMap.leafletElement.panTo([
        pos[1], pos[0]
      ], {"animate": false});

      let hitObject = objectAssign({}, hit[0]);

      if (hitObject.more.zl) {
        this.refs.leafletMap.leafletElement.setZoom(hitObject.more.zl, {"animate": false});
      } else if (hitObject.more.g) {
        // let geom= {"type":"Polygon","coordinates":[[[367095.626800000027288,5681084.772599999792874],[367089.009799999999814,5681079.795300000347197],[367093.638700000010431,5681074.163800000213087],[367092.478500000026543,5681069.545599999837577],[367176.927900000009686,5681009.916500000283122],[367168.54570000001695,5681001.47510000038892],[367149.407899999991059,5681007.154799999669194],[367123.46929999999702,5681009.770800000056624],[367102.14179999998305,5681015.721699999645352],[367087.545099999988452,5681019.794599999673665],[367101.269800000009127,5681013.369599999859929],[367134.379499999980908,5680997.869699999690056],[367174.008499999996275,5680988.243800000287592],[367210.436899999971502,5680973.746100000105798],[367267.77990000002319,5680932.377600000239909],[367310.996400000003632,5680912.599700000137091],[367373.321200000005774,5680908.128499999642372],[367375.239799999981187,5680907.990899999625981],[367375.84230000001844,5680907.947700000368059],[367381.397999999986496,5680978.705099999904633],[367382.348300000012387,5681028.860700000077486],[367382.396999999997206,5681031.429800000041723],[367384.885400000028312,5681030.78870000038296],[367389.399600000004284,5681029.625599999912083],[367475.071600000024773,5681025.252500000409782],[367494.462200000009034,5681022.29079999960959],[367512.573900000017602,5681016.018500000238419],[367522.590499999991152,5681014.808199999853969],[367537.380100000009406,5681024.04009999986738],[367546.803699999989476,5681027.028599999845028],[367548.039500000013504,5681024.839499999769032],[367551.463400000007823,5681018.774100000038743],[367555.919799999974202,5680986.430200000293553],[367555.958999999973457,5680986.145499999634922],[367548.217100000008941,5680958.803399999625981],[367539.289600000018254,5680915.527099999599159],[367539.236600000003818,5680915.269999999552965],[367542.118000000016764,5680906.249699999578297],[367560.318299999984447,5680877.045099999755621],[367568.802000000025146,5680852.673999999649823],[367569.619999999995343,5680850.324000000022352],[367569.62400000001071,5680850.312599999830127],[367571.969900000025518,5680851.177699999883771],[367584.101699999999255,5680855.651399999856949],[367584.120899999979883,5680855.658499999903142],[367613.795500000007451,5680842.11710000038147],[367635.425600000016857,5680842.239199999719858],[367635.460399999981746,5680842.239400000311434],[367683.662000000011176,5680851.345999999903142],[367683.686199999996461,5680851.350599999539554],[367691.795199999993201,5680847.864500000141561],[367692.101399999985006,5680847.732900000177324],[367660.654500000004191,5680817.786999999545515],[367660.668799999984913,5680812.416100000031292],[367660.669899999978952,5680811.992899999953806],[367668.566099999996368,5680801.848399999551475],[367685.679500000027474,5680768.792999999597669],[367699.004499999980908,5680754.581600000150502],[367718.873399999982212,5680744.019399999640882],[367746.492099999974016,5680725.588100000284612],[367756.721399999980349,5680715.55379999987781],[367756.892999999981839,5680715.385400000028312],[367755.191600000020117,5680712.858900000341237],[367755.012800000025891,5680712.593500000424683],[367761.828800000017509,5680706.5777000002563],[367768.077099999994971,5680697.495099999941885],[367769.926600000006147,5680689.600200000219047],[367769.956300000019837,5680689.473600000143051],[367768.088600000017323,5680670.792700000107288],[367762.82640000001993,5680650.042299999855459],[367756.877900000021327,5680639.472000000067055],[367710.708400000003166,5680573.812199999578297],[367696.332700000028126,5680544.415300000458956],[367696.201100000005681,5680544.146099999547005],[367701.199000000022352,5680538.299700000323355],[367702.833999999973457,5680536.387099999934435],[367702.851900000008754,5680536.366100000217557],[367704.447099999990314,5680538.347599999979138],[367712.989100000006147,5680548.958499999716878],[367728.122099999978673,5680561.108599999919534],[367792.492199999978766,5680599.738800000399351],[367805.26480000000447,5680601.681200000457466],[367811.024800000013784,5680603.459999999962747],[367842.683000000019092,5680639.037899999879301],[367865.683499999984633,5680657.176900000311434],[367894.031200000026729,5680681.427099999971688],[367894.044500000018161,5680681.438500000163913],[367894.200499999977183,5680681.355899999849498],[367896.271200000017416,5680680.259300000034273],[367922.272400000016205,5680666.490299999713898],[367922.293599999975413,5680666.479100000113249],[367921.31339999998454,5680647.450799999758601],[367921.291800000006333,5680647.030899999663234],[367948.271000000007916,5680642.822999999858439],[367948.556700000015553,5680642.821999999694526],[367981.119000000006054,5680642.707000000402331],[368008.195999999996275,5680635.09499999973923],[368008.742000000027474,5680634.705599999986589],[368028.007299999997485,5680620.966900000348687],[368030.160199999983888,5680619.431599999777973],[368030.189599999983329,5680619.410600000061095],[368030.228200000012293,5680619.56140000000596],[368030.854099999996834,5680622.007299999706447],[368046.149099999980535,5680681.781999999657273],[368051.48340000002645,5680696.006799999624491],[368077.21820000000298,5680730.177799999713898],[368078.711599999980535,5680732.160699999891222],[368078.725299999990966,5680732.178899999707937],[368080.625500000023749,5680730.546299999579787],[368121.304300000017975,5680695.59499999973923],[368100.303300000028685,5680660.871000000275671],[368126.316099999996368,5680646.936300000175834],[368162.15669999999227,5680646.032700000330806],[368162.191500000015367,5680646.03179999999702],[368170.051500000001397,5680627.485700000077486],[368170.056700000015553,5680627.473500000312924],[368196.07760000001872,5680638.223299999721348],[368198.317800000018906,5680639.14879999961704],[368198.358499999972992,5680639.165599999949336],[368198.388299999991432,5680639.177899999544024],[368199.322299999999814,5680636.858799999579787],[368206.539999999979045,5680618.938000000081956],[368206.886899999983143,5680618.076700000092387],[368206.891300000017509,5680618.065899999812245],[368209.252199999988079,5680618.905199999921024],[368254.191799999971408,5680634.882000000216067],[368254.195599999977276,5680634.883399999700487],[368278.433499999984633,5680633.817999999970198],[368278.463999999978114,5680633.816700000315905],[368301.464500000001863,5680640.951399999670684],[368301.471100000024308,5680640.95339999999851],[368418.59240000002319,5680632.512600000016391],[368453.166099999973085,5680629.208700000308454],[368497.669400000013411,5680623.329499999992549],[368516.547000000020489,5680619.669300000183284],[368518.542499999981374,5680619.282399999909103],[368519.70529999997234,5680619.056900000199676],[368517.776200000022072,5680617.436999999918044],[368517.241600000008475,5680616.988099999725819],[368473.845600000000559,5680580.547600000165403],[368471.895900000003166,5680577.749699999578297],[368469.127099999983329,5680573.776399999856949],[368466.3583000000217,5680569.803000000305474],[368443.65559999999823,5680537.224000000394881],[368442.223999999987427,5680535.169599999673665],[368440.632400000002235,5680533.240699999965727],[368422.882900000025984,5680511.729299999773502],[368419.0625,5680507.099299999885261],[368417.737699999997858,5680506.336400000378489],[368416.767300000006799,5680505.777599999681115],[368414.832200000004377,5680504.66330000013113],[368360.652200000011362,5680473.463600000366569],[368295.456699999980628,5680421.774799999780953],[368293.436099999991711,5680420.172799999825656],[367968.985600000014529,5680120.238900000229478],[367929.220700000005309,5680072.961500000208616],[367927.606099999975413,5680071.041799999773502],[367915.836100000014994,5680056.393799999728799],[367914.262999999977183,5680054.436099999584258],[367897.422100000025239,5680034.112300000153482],[367833.300400000007357,5679942.387099999934435],[367832.050400000007357,5679940.188799999654293],[367804.551700000010896,5679891.829300000332296],[367753.2333000000217,5679786.875099999830127],[367726.808699999994133,5679727.924399999901652],[367726.236900000018068,5679725.375799999572337],[367717.020399999979418,5679684.296500000171363],[367716.37599999998929,5679681.880800000391901],[367663.616399999998976,5679484.082999999634922],[367631.558399999979883,5679376.084999999962747],[367628.408899999980349,5679373.922199999913573],[367538.741800000017975,5679312.346300000324845],[367476.919500000018161,5679253.609600000083447],[367475.073800000012852,5679251.922399999573827],[367373.695899999991525,5679159.251600000075996],[367368.195999999996275,5679154.224100000225008],[367279.636899999983143,5679092.80449999962002],[367200.614400000020396,5679019.988199999555945],[367167.764499999990221,5678993.307599999941885],[367167.752299999992829,5678993.29769999999553],[367165.81160000001546,5678991.721499999985099],[367167.408500000019558,5678989.797799999825656],[367183.881999999983236,5678969.952600000426173],[367185.513299999991432,5678967.987499999813735],[367183.728999999992084,5678966.191100000403821],[367175.70350000000326,5678958.111100000329316],[367165.452999999979511,5678947.791100000031292],[367012.258399999991525,5678793.556599999777973],[367006.775399999984074,5678790.906299999915063],[366968.368599999987055,5678772.342100000008941],[366927.618499999982305,5678779.011699999682605],[366891.130100000009406,5678816.523299999535084],[366829.184999999997672,5678999.952200000174344],[366822.564300000027288,5679019.557000000029802],[366821.762899999972433,5679021.930100000463426],[366818.835199999972247,5679030.599399999715388],[366789.927000000025146,5679317.096699999645352],[366789.638399999996182,5679319.956799999810755],[366789.635100000014063,5679319.975899999961257],[366789.178799999994226,5679322.60120000038296],[366783.647899999981746,5679354.426699999719858],[366783.158500000019558,5679357.242600000463426],[366782.648800000024494,5679360.07880000025034],[366775.621900000027381,5679399.181400000117719],[366775.007400000002235,5679402.60120000038296],[366775.000500000023749,5679402.633200000040233],[366774.353500000026543,5679405.652599999681115],[366753.159999999974389,5679504.551099999807775],[366714.805799999972805,5679619.6402000002563],[366713.947299999999814,5679622.216199999675155],[366624.507999999972526,5679857.706299999728799],[366623.620300000009593,5679860.043499999679625],[366602.058100000023842,5679919.958899999968708],[366601.908300000010058,5679920.045699999667704],[366599.400599999993574,5679921.49930000025779],[366598.736700000008568,5679921.884100000374019],[366598.331400000024587,5679922.118999999947846],[366564.914999999979045,5679941.488699999637902],[366528.280199999979232,5679950.99170000012964],[366498.190500000026077,5679967.606200000271201],[366495.010400000028312,5679969.362200000323355],[366471.689300000027288,5679986.325299999676645],[366461.051800000015646,5680019.777200000360608],[366450.638700000010431,5680096.763799999840558],[366450.637899999972433,5680096.769399999640882],[366450.302700000000186,5680099.247499999590218],[366447.832600000023376,5680098.85840000025928],[366392.364699999976438,5680090.121199999935925],[366389.868900000001304,5680089.728099999949336],[366389.841200000024401,5680092.254599999636412],[366389.492900000012014,5680123.97649999987334],[366391.978599999973085,5680138.074199999682605],[366402.163100000005215,5680179.720700000412762],[366402.757700000016484,5680182.152200000360608],[366400.299600000027567,5680182.624499999918044],[366341.435400000016671,5680193.935499999672174],[366346.15759999997681,5680214.577600000426173],[366356.470900000014808,5680211.974600000306964],[366366.603899999987334,5680246.446999999694526],[366241.20150000002468,5680268.546699999831617],[366241.809499999973923,5680275.776700000278652],[366254.443099999974947,5680296.904000000096858],[366254.815699999977369,5680311.81180000025779],[366244.059499999973923,5680332.622000000439584],[366299.289400000008754,5680406.466000000014901],[366300.841899999999441,5680408.541799999773502],[366293.660600000002887,5680416.486700000241399],[366279.338899999973364,5680422.904400000348687],[366250.546199999982491,5680421.892199999652803],[366227.926900000020396,5680421.566800000146031],[366206.919200000003912,5680422.424599999561906],[366183.006600000022445,5680427.333100000396371],[366183.297299999976531,5680430.455799999646842],[366190.850199999986216,5680511.590800000354648],[366191.083900000026915,5680514.100899999961257],[366195.981099999975413,5680584.941800000146031],[366197.62579999997979,5680609.817900000140071],[366200.134799999999814,5680609.899299999698997],[366296.81359999999404,5680613.035699999891222],[366358.309699999983422,5680624.997100000269711],[366360.767300000006799,5680625.47510000038892],[366360.15759999997681,5680627.903300000354648],[366330.700000000011642,5680745.214399999938905],[366296.302800000004936,5680928.333399999886751],[366283.298300000024028,5681021.060300000011921],[366282.932499999995343,5681023.668399999849498],[366285.523300000000745,5681023.19539999961853],[366321.193599999998696,5681016.682699999772012],[366338.243699999991804,5681006.197900000028312],[366350.707200000004377,5680986.112999999895692],[366354.581000000005588,5680944.006000000052154],[366366.798699999984819,5680921.181300000287592],[366423.85899999999674,5680927.358900000341237],[366475.618699999991804,5680928.543499999679625],[366539.595499999995809,5680938.133799999952316],[366665.159999999974389,5680950.016499999910593],[366667.68660000001546,5680950.104199999943376],[366850.53159999998752,5680956.45380000025034],[366986.502399999997579,5681002.919800000265241],[367023.604500000015832,5681029.417799999937415],[367024.448900000017602,5681071.737599999643862],[367033.83029999997234,5681081.680700000375509],[367035.652999999991152,5681083.612599999643862],[367036.855900000024121,5681081.244599999859929],[367037.547800000000279,5681079.88260000012815],[367053.447299999999814,5681084.721199999563396],[367067.06160000001546,5681086.717699999921024],[367093.571400000015274,5681086.800800000317395],[367095.626800000027288,5681084.772599999792874]]]};

        var feature = turfHelpers.feature(hitObject.more.g);
      var bb = bbox(feature);
      console.log(bb)
      console.log(gisHelpers.convertBBox2Bounds(bb))
      console.log(this.refs.leafletMap.leafletElement.getBounds());
      this.refs.leafletMap.leafletElement.fitBounds(gisHelpers.convertBBox2Bounds(bb));
        //this.refs.leafletMap.leafletElement.setZoom(hitObject.more.zl, {"animate": false});
      }


      // this.props.routingActions.push(
      //       this.props.routing.locationBeforeTransitions.pathname
      //       + modifyQueryPart(this.props.routing.locationBeforeTransitions.query,{
      //         lat:pos[1],
      //         lng:pos[0]
      //       }));
      this.props.mappingActions.gazetteerHit(hitObject);

      if (this.props.gazeteerHitTrigger !== undefined) {
        this.props.gazeteerHitTrigger(hit);
      }
    } else {
      //console.log(hit);
    }

  }

  internalSearchButtonTrigger(event) {
    if (this.searchOverlay) {
      this.searchOverlay.hide();
    }
    if (this.props.mapping.searchInProgress === false && this.props.searchButtonTrigger !== undefined) {
      this.refs.typeahead.getInstance().clear();
      this.props.mappingActions.gazetteerHit(null);
      this.props.searchButtonTrigger(event)
    } else {
      //console.log("search in progress or no searchButtonTrigger defined");
    }

  }
  featureClick(event) {
    this.props.featureClickHandler(event);
  }

  showModalHelpComponent() {
    this.props.uiStateActions.showHelpComponent(true);
  }

  renderMenuItemChildren(option, props, index) {
    return (<div key={option.sorter}>
      <Icon style={{
          marginRight: '10px',
          width: '18px'
        }} name={option.glyph} size={'lg'}/>
      <span>{option.string}</span>
    </div>);
  }

  handleSearch(query) {
    if (!query) {
      return;
    }

    let queryO = {
      "list": [
        {
          "key": "input",
          "value": query
        }
      ]
    };
    fetch(WUNDAAPI + '/searches/WUNDA_BLAU.BPlanAPIGazeteerSearch/results?role=all&limit=100&offset=0', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryO)

    }).then(resp => resp.json()).then(json => {
      this.setState({options: json.$collection});
    });
  }

  render() {
    // console.log("-------------------RENDERING CISMAP")
    const mapStyle = {
      height: this.props.uiState.height,
      width: this.props.uiState.width
    };
    if (mapStyle.height == null || mapStyle.width == null) {
      mapStyle.height = window.innerHeight
      mapStyle.width = window.innerWidth
    }

    //    const positionByUrl=[parseFloat(this.props.routing.locationBeforeTransitions.query.lat)||fallbackposition.lat,parseFloat(this.props.routing.locationBeforeTransitions.query.lng)||fallbackposition.lng]
    //    const zoomByUrl= parseInt(this.props.routing.locationBeforeTransitions.query.zoom)||14

    const positionByUrl = [
      parseFloat(new URLSearchParams(this.props.routing.location.search).get('lat')) || fallbackposition.lat,
      parseFloat(new URLSearchParams(this.props.routing.location.search).get('lng')) || fallbackposition.lng
    ];
    const zoomByUrl = parseInt(new URLSearchParams(this.props.routing.location.search).get('zoom'), 10) || 14;

    const layerArr = this.props.layers.split(",");

    //      <Icon name='search' />

    let searchIcon = (<Icon name='search'/>)
    if (this.props.mapping.searchInProgress) {
      searchIcon = (<Icon spin={true} name="refresh"/>)
    }

    // this was in the typeahead :    {..this.state}
    // DKW

    const searchAllowed = (zoomByUrl >= this.props.searchMinZoom && zoomByUrl <= this.props.searchMaxZoom);
    return (<Map ref="leafletMap" key="leafletMap" crs={crs25832} style={mapStyle} center={positionByUrl} zoom={zoomByUrl} zoomControl={false} attributionControl={false} doubleClickZoom={false} minZoom={7} maxZoom={18}>
      {
        layerArr.map((layerWithOpacity) => {
          const layOp = layerWithOpacity.split('@')
          return Layers.get(layOp[0])(parseInt(layOp[1] || '100', 10) / 100.0);
        })
      }
      <GazetteerHitDisplay key={"gazHit" + JSON.stringify(this.props.mapping)} mappingProps={this.props.mapping}/>
      <FeatureCollectionDisplay key={JSON.stringify(this.props.mapping)} mappingProps={this.props.mapping} style={this.props.featureStyler} labeler={this.props.labeler} featureClickHandler={this.featureClick} mapRef={this.refs.leafletMap}/>
      <ZoomControl position="topleft" zoomInTitle="Vergr&ouml;ßern" zoomOutTitle="Verkleinern"/>
      <FullscreenControl title="Vollbildmodus" forceSeparateButton={true} titleCancel="Vollbildmodus beenden" position="topleft"/>
      <Control position="bottomleft">
        <Form style={{
            width: '300px'
          }} action="#">
          <FormGroup >
            <InputGroup>
              <InputGroup.Button disabled={this.props.mapping.searchInProgress || !searchAllowed} onClick={this.internalSearchButtonTrigger}>
                <OverlayTrigger ref={c => this.searchOverlay = c} placement="top" overlay={this.props.searchTooltipProvider()}>
                  <Button disabled={this.props.mapping.searchInProgress || !searchAllowed}>{searchIcon}</Button>
                </OverlayTrigger>
              </InputGroup.Button>

              <Typeahead
                ref="typeahead"
                style={{ width: '300px'}}
                labelKey="string"
                options={this.gazData}
                onChange={this.internalGazeteerHitTrigger}
                paginate={true}
                dropup={true}
                disabled={!this.props.uiState.gazetteerBoxEnabled}
                placeholder={this.props.uiState.gazeteerBoxInfoText}
                minLength={2}
                filterBy={(option, text) => {
                  return (option.string.toLowerCase().startsWith(text.toLowerCase()));
                }}
                align={'justify'}
                emptyLabel={'Keine Treffer gefunden'}
                paginationText={"Mehr Treffer anzeigen"}
                autoFocus={true} submitFormOnEnter={true}
                searchText={"suchen ..."}
                renderMenuItemChildren={this.renderMenuItemChildren}/>
            </InputGroup>
          </FormGroup>
        </Form>
      </Control>
      <Control position="topright">
        <OverlayTrigger placement="left" overlay={this.props.helpTooltipProvider()}>
          <Button onClick={this.showModalHelpComponent}><Icon name='info'/></Button>
        </OverlayTrigger>
      </Control>

      {this.props.children}
    </Map>);

  }
}

const Cismap = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Cismap_);
export default Cismap;

Cismap_.propTypes = {
  uiState: PropTypes.object,
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  gazeteerHitTrigger: PropTypes.func.isRequired,
  searchButtonTrigger: PropTypes.func.isRequired,
  mappingAction: PropTypes.object,
  featureStyler: PropTypes.func.isRequired,
  labeler: PropTypes.func.isRequired,
  featureClickHandler: PropTypes.func.isRequired,
  helpTooltipProvider: PropTypes.func,
  searchTooltipProvider: PropTypes.func,
  searchMinZoom: PropTypes.number,
  searchMaxZoom: PropTypes.number,
  gazTopics: PropTypes.array.isRequired

};

Cismap_.defaultProps = {
  layers: "bplan_abkg_uncached",
  gazeteerHitTrigger: function() {},
  searchButtonTrigger: function() {},
  featureClickHandler: function() {},
  helpTooltipProvider: function() {
    return (<Tooltip style={{
        zIndex: 3000000000
      }} id="helpTooltip">Bedienungsanleitung anzeigen</Tooltip>);
  },
  searchTooltipProvider: function() {
    return (<Tooltip style={{
        zIndex: 3000000000
      }} id="searchTooltip">Objekte suchen</Tooltip>);
  },
  searchMinZoom: 7,
  searchMaxZoom: 18,
  gazTopics: []
}
