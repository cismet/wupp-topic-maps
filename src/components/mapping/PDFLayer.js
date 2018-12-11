import { GridLayer } from 'react-leaflet';
import L from 'leaflet';

// import filters from 'pleeease-filters'; /a postcss  plugin. worked only for the first expression
import PDFLayerImpl from './PDFLayerImpl';
import PropTypes from 'prop-types';

export class PDFLayer extends GridLayer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
    super.componentDidMount();
    console.log('PDFLAyer mount');
    new Promise((resolve, reject) => {
      console.log('PDFLAyer mount(in Promise)');
      this.leafletElement = new PDFLayerImpl({
        pdf: '/tmp/B442_DBA.pdf',
        x_7kb_pdf: '/tmp/BPL_1131_0_PB_Drs_10-2011_Auflistung-TÖB.pdf',
        _30kb_pdf: '/tmp/BPL_1131_0_PB_Drs_10-2011_Abwägung.pdf',
        dcpdf: '/tmp/BPL_0774_0_PB_Drs_05-1989_Beitrittsbeschluss.pdf',
        
        page: 1,
        minZoom: 1,
        maxZoom: 25,
        bounds: new L.LatLngBounds([ -0.5, -0.5 ], [ 0.5, 0.5 ]),
        crs: L.CRS.Simple
      });
      console.log('PDFLAyer created');
      super.componentDidMount();

    }).then(()=>{
      console.log('done');
      
    });
    
	}
}
PDFLayer.propTypes = {
	pdf: PropTypes.string,
	page: PropTypes.string
};

export default PDFLayer;
