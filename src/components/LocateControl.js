import { MapControl } from "react-leaflet";
import L from "leaflet";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet.locatecontrol";

export default class PrintControl extends MapControl {
  createLeafletElement(props) {
    return L.control.locate(props);
  }

  componentDidMount() {
    const { map } = this.context;
    this.leafletElement.addTo(map);
  }
}
