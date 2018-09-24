import PropTypes from "prop-types";
import "leaflet-easybutton";
import "leaflet-easybutton/src/easy-button.css";
import "./EasyButtonOverrides.css";

// const NewWindowControl = ({url}) => {

//     return (
//         <Control position="topleft" >
//             <Button  onClick={()=>{console.log("OPEN")}}><Icon name="expand"/></Button>
//         </Control>
//     );
// }

// import PropTypes from 'prop-types';
import { MapControl } from "react-leaflet";
import L from "leaflet";

class NewWindowControl extends MapControl {
  componentWillMount() {
    let that = this;
    this.leafletElement = L.easyButton(
      "fa-external-link-square",
      function(btn, map) {
        window.open(
          document.location.origin +
            "/#" +
            that.props.routing.location.pathname +
            that.props.routing.location.search
        );
      },
      this.props.title,
      {
        position: this.props.position
      }
    );
  }
}

NewWindowControl.propTypes = {
  position: PropTypes.string,
  title: PropTypes.string,
  routing: PropTypes.object
};

export default NewWindowControl;
