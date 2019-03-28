import React from 'react';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import { resetAll } from '../redux/reducer';
import queryString from 'query-string';
import { actions as UiStateActions } from '../redux/modules/uiState';

function mapStateToProps(state) {
  return {
    routing: state.routing,
    allState: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    routingActions: bindActionCreators(routerActions, dispatch),
    uiStateActions: bindActionCreators(UiStateActions, dispatch),
    rootActions: bindActionCreators({ resetAll }, dispatch)
  };
}

export class Reset_ extends React.Component {
  render() {
    return (
      <div>
        <main>
          <ReactLoading
            style={{
              margin: 'auto',
              width: '30%',
              height: '60%',
              padding: '50px'
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
    console.log(this.props.allState);
    let redirectingTo = queryString.parse(this.props.location.search).to;
    const uiActions = this.props.uiStateActions;
    let pushRoute = this.props.routingActions.push;
    setTimeout(() => {
      console.log('RESETTING');
      this.props.rootActions.resetAll();
      setTimeout(() => {
        console.log('Redirecting to ' + redirectingTo);
        uiActions.screenResize(window.innerHeight, window.innerWidth);
        if (redirectingTo) {
          pushRoute(redirectingTo);
        } else {
          console.log('no redirect set');
        }
      }, 1000);
    }, 2000);
  }
}
const Reset = connect(
  mapStateToProps,
  mapDispatchToProps
)(Reset_);

export default Reset;
