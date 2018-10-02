import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Icon } from "react-fa";
import Control from "react-leaflet-control";
import { Form, FormGroup, InputGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import { actions as uiStateActions } from "../../redux/modules/uiState";
import { actions as mappingActions } from "../../redux/modules/mapping";

function mapStateToProps(state) {
  return {
    uiState: state.uiState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch)
  };
}

export class GazetteerSearchControl_ extends React.Component {
  constructor(props) {
    super(props);
    this.internalSearchButtonTrigger = this.internalSearchButtonTrigger.bind(this);
    this.internalClearButtonTrigger = this.internalClearButtonTrigger.bind(this);
  }
  internalSearchButtonTrigger(event) {
    if (this.searchOverlay) {
      this.searchOverlay.hide();
    }
    if (this.props.searchInProgress === false && this.props.searchButtonTrigger !== undefined) {
      //          this.searchControl.wrappedInstance.clear();
      this.clear();
      this.props.mappingActions.gazetteerHit(null);
      this.props.searchButtonTrigger(event);
    } else {
      //console.log("search in progress or no searchButtonTrigger defined");
    }
  }
  internalClearButtonTrigger(event) {
    if (this.gazClearOverlay) {
      this.gazClearOverlay.hide();
    }
    if (this.props.overlayFeature !== null) {
      this.props.mappingActions.setOverlayFeature(null);
    }

    //this.searchControl.wrappedInstance.clear();
    this.clear();
    this.props.mappingActions.gazetteerHit(null);
  }

  render() {
    let firstbutton;
    if (this.props.searchAfterGazetteer === true) {
      firstbutton = (
        <InputGroup.Button
          disabled={this.props.searchInProgress || !this.props.searchAllowed}
          onClick={e => {
            if (this.props.searchAllowed) {
              this.internalSearchButtonTrigger(e);
            } else {
              // Hier kann noch eine Meldung angezeigt werden.
            }
          }}
        >
          <OverlayTrigger
            ref={c => (this.searchOverlay = c)}
            placement="top"
            overlay={this.props.searchTooltipProvider()}
          >
            <Button disabled={this.props.searchInProgress || !this.props.searchAllowed}>
              {this.props.searchIcon}
            </Button>
          </OverlayTrigger>
        </InputGroup.Button>
      );
    } else {
      if (!this.props.searchAllowed) {
        firstbutton = (
          <InputGroup.Button onClick={this.internalClearButtonTrigger}>
            <OverlayTrigger
              ref={c => (this.gazClearOverlay = c)}
              placement="top"
              overlay={this.props.gazClearTooltipProvider()}
            >
              <Button
                disabled={this.props.overlayFeature === null && this.props.gazetteerHit === null}
              >
                <Icon name="times" />
              </Button>
            </OverlayTrigger>
          </InputGroup.Button>
        );
      }
    }

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
              {firstbutton}
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

GazetteerSearchControl_.propTypes = {
  enabled: PropTypes.bool,
  placeholder: PropTypes.string,
  pixelwidth: PropTypes.number,
  searchControlPosition: PropTypes.string,
  firstbutton: PropTypes.object,
  gazData: PropTypes.array,
  gazeteerHitTrigger: PropTypes.func,
  renderMenuItemChildren: PropTypes.func,
  gazClearTooltipProvider: PropTypes.func
};

GazetteerSearchControl_.GazetteerSearchControl = {
  enabled: true,
  placeholder: "Geben Sie einen Suchbegriff ein",
  pixelwidth: 300,
  searchControlPosition: "bottomleft",
  gazData: [],
  gazeteerHitTrigger: () => {},
  searchTooltipProvider: function() {
    return (
      <Tooltip
        style={{
          zIndex: 3000000000
        }}
        id="searchTooltip"
      >
        Objekte suchen
      </Tooltip>
    );
  },
  gazClearTooltipProvider: () => (
    <Tooltip
      style={{
        zIndex: 3000000000
      }}
      id="gazClearTooltip"
    >
      Suche zurücksetzen
    </Tooltip>
  ),
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
