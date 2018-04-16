import React from 'react';
import {  persistStore  } from 'redux-persist';
import { Route,  Switch } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage';
import Layout from './components/Layout';
import DefaultPage from './containers/DefaultPage';
import BPlaene from './containers/BPlaene';
import Ehrenamt from './containers/Ehrenamt';
import Stadtplan from './containers/Stadtplan';
import store from './redux/store';
import ReactLoading from 'react-loading';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { rehydrated: false };
  }

  componentWillMount(){
    persistStore(store,null, () => {
      let thisHere=this;
      setTimeout(()=>{
        thisHere.setState({ rehydrated: true });
      },1);
    });
  }

  render() {
    if (!this.state.rehydrated){
     return (
        <div>
          <main>
            <ReactLoading style={{margin: "auto",width: "30%" , height: "60%", padding: "50px"}} type="spin" color="#444" />
          </main>
        </div>
      );
    } else {
      return (
        <div>
            <main>
              <Route component={Layout}/>
              <Switch>
                <Route exact path="/" component={DefaultPage} />
                <Route exact path="/ehrenamt/:layers?/:offerid?" component={Ehrenamt} />
                <Route exact path="/bplaene/:layers?/:bplannummer?" component={BPlaene} />
                {/* <Route exact path="/stadtplan/:layers?/" component={Stadtplan} /> */}
                <Route exact path="/default(/:layers)(/:bplannummer)" component={DefaultPage}/>
                <Route component={NotFoundPage} />
              </Switch>
            </main>
          </div>
      );
    }
  }
}
