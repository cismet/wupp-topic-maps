import React, { PropTypes } from 'react';
import Cismap from '../containers/Cismap.jsx';
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    ui: state.uiState,
  };
}
export class HomePage_ extends React.Component {
  constructor(props, context) {
      super(props, context);
  }
  render() {   
    console.log(this.props.ui.width+" - "+this.props.ui.height) 
   return (
        <div>
            <Cismap />
        </div>
    );
  }
}
const HomePage = connect(mapStateToProps)(HomePage_);

export default HomePage;

HomePage_.propTypes = {
  ui: PropTypes.object,
  kassenzeichen: PropTypes.object,
  uiState: PropTypes.object

};
