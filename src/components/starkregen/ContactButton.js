import PropTypes from "prop-types";
import "leaflet-easybutton";
import "leaflet-easybutton/src/easy-button.css";
import "../EasyButtonOverrides.css";

import { MapControl } from "react-leaflet";
import L from "leaflet";

class ContactButton extends MapControl {
  componentWillMount() {
    let that = this;

    this.leafletElement = L.easyButton(
      "fa-comment",
      function(btn, map) {
        that.props.action();
      },
      this.props.title,
      {
        position: this.props.position
      }
    );
  }
}

ContactButton.propTypes = {
  position: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.func,
  id: PropTypes.string
};

ContactButton.defaultProps = {
  position: "topleft",
  title: "",
  action: () => {},
  id: "ContactButton"
};

export default ContactButton;
