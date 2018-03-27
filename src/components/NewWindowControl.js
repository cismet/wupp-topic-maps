import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import {Icon} from 'react-fa'
import Control from 'react-leaflet-control';



// const NewWindowControl = ({url}) => {


//     return (
//         <Control position="topleft" >
//             <Button  onClick={()=>{console.log("OPEN")}}><Icon name="expand"/></Button>
//         </Control>
//     );
// }


// import PropTypes from 'prop-types';
// import { MapControl } from 'react-leaflet';
// import L from 'leaflet';


// class FullscreenControl extends MapControl {
//     componentWillMount() {
//     this.leafletElement = L.control.fullscreen({
//       title: {
//         'false':this.props.title,
//         'true': this.props.titleCancel
//       },
//       position:this.props.position,
//       content:this.props.content,
//       forceSeparateButton:this.props.forceSeparateButton,
//       forcePseudoFullscreen:this.props.forcePseudoFullscreen,
//       fullscreenElement:this.props.fullscreenElement,
//       container:this.props.container
//     });
//   }
// }

// FullscreenControl.propTypes = {
//   position: PropTypes.string,
//   title: PropTypes.string,
//   titleCancel: PropTypes.string,
//   content: PropTypes.node,
//   forceSeparateButton: PropTypes.bool,
//   forcePseudoFullscreen: PropTypes.bool,
//   fullscreenElement: PropTypes.bool
// };

// export default FullscreenControl;


// export default NewWindowControl;
