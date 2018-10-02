import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Icon } from "react-fa";
import Control from "react-leaflet-control";
import { Form, FormGroup, InputGroup } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import { actions as uiStateActions } from "../../redux/modules/uiState";




function mapStateToProps(state) {
    return {
      uiState: state.uiState,
     
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      uiStateActions: bindActionCreators(uiStateActions, dispatch),
    };
  }

export class GazetteerSearchControl_ extends React.Component {
  render() {
    return (
      <Control pixelwidth={this.props.pixelwidth} position={this.props.searchControlPosition}>
        <Form
          style={{
            width: this.props.pixelwidth + "px"
          }}
          action="#"
        >
          <FormGroup>
            <InputGroup>
              {this.props.firstbutton}
              <Typeahead
                ref="typeahead"
                style={{ width: `${this.props.pixelwidth}px` }}
                labelKey="string"
                options={this.props.gazData}
                onChange={this.props.gazeteerHitTrigger}
                paginate={true}
                dropup={true}
                disabled={!this.props.enabled}
                placeholder={this.props.placeholder}
                minLength={2}
                filterBy={(option, text) => {
                  return option.string.toLowerCase().startsWith(text.toLowerCase());
                }}
                align={"justify"}
                emptyLabel={"Keine Treffer gefunden"}
                paginationText={"Mehr Treffer anzeigen"}
                autoFocus={true}
                submitFormOnEnter={true}
                searchText={"suchen ..."}
                renderMenuItemChildren={this.props.renderMenuItemChildren}
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </Control>
    );
  }
  clear() {
    this.refs.typeahead.getInstance().clear();
  }
}
const GazetteerSearchControl = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
  )(GazetteerSearchControl_);

export default GazetteerSearchControl;

GazetteerSearchControl.propTypes = {
  enabled: PropTypes.bool,
  placeholder: PropTypes.string,
  pixelwidth: PropTypes.number,
  searchControlPosition: PropTypes.string,
  firstbutton: PropTypes.object,
  gazData: PropTypes.array,
  gazeteerHitTrigger: PropTypes.function,
  renderMenuItemChildren: PropTypes.function
};

GazetteerSearchControl.GazetteerSearchControl = {
  enabled: true,
  placeholder: "Geben Sie einen Suchbegriff ein",
  pixelwidth: 300,
  searchControlPosition: "bottomleft",
  firstbutton: PropTypes.object,
  gazData: [],
  gazeteerHitTrigger: () => {},
  renderMenuItemChildren: (option, props, index) => (
    <div key={option.sorter}>
      <Icon
        style={{
          marginRight: "10px",
          width: "18px"
        }}
        name={option.glyph}
        size={"lg"}
      />
      <span>{option.string}</span>
    </div>
  )
};
