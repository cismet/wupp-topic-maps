import React from "react";
import PropTypes from "prop-types";
import Cismap from "../containers/Cismap";
import { connect } from "react-redux";
import { Well } from "react-bootstrap";
import ReactLoading from "react-loading";
import { bindActionCreators } from "redux";
import { routerActions } from "react-router-redux";
import { resetAll } from "../redux/reducer";
import queryString from "query-string";

function mapStateToProps(state) {
  return {
    routing: state.routing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    routingActions: bindActionCreators(routerActions, dispatch),
    rootActions: bindActionCreators({ resetAll }, dispatch)
  };
}

export class Reset_ extends React.Component {
  render() {
    console.log(this.props);

    return (
      <div>
        <main>
          <ReactLoading
            style={{
              margin: "auto",
              width: "30%",
              height: "60%",
              padding: "50px"
            }}
            type="spin"
            color="#444"
          />
          <h1 align="center">Anwendung wird zurückgesetzt...</h1>
        </main>
      </div>
    );
  }
  componentDidMount() {
    let redirectingTo = queryString.parse(this.props.routing.location.search)
      .to;
      
    
    let pushRoute=this.props.routingActions.push;
    setTimeout(() => {
      console.log("RESETTING");
      this.props.rootActions.resetAll();
      setTimeout(() => {
        console.log("Redirecting to " + redirectingTo);
        pushRoute("kitas")
      }, 1000);
    }, 2000);
  }
}
const Reset = connect(
  mapStateToProps,
  mapDispatchToProps
)(Reset_);

export default Reset;
