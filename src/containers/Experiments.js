import React from 'react';
import PropTypes from 'prop-types';
import Cismap from '../containers/Cismap';
import {connect} from "react-redux";
import {Well} from 'react-bootstrap';


function mapStateToProps(state) {
    return {ui: state.uiState};
}
export class Experiments_ extends React.Component {
    render() {
        
        return (
            <div>
            </div>
        );
    }
}
const Experiments = connect(mapStateToProps)(Experiments_);

export default Experiments;

Experiments_.propTypes = {
    ui: PropTypes.object,
    kassenzeichen: PropTypes.object,
    uiState: PropTypes.object
};
