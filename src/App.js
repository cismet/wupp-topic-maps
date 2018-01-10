import React from 'react';
import {  persistStore  } from 'redux-persist';
import { Route,  Switch } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage';
import Layout from './components/Layout';
import DefaultPage from './containers/DefaultPage';
import BPlaene from './containers/BPlaene';
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
    if (false && !this.state.rehydrated){
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
                <Route exact path="/xxx" component={BPlaene} />
                <Route exact path="/bplaene/:layers?/:bplannummer?" component={BPlaene} />
                <Route exact path="/default(/:layers)(/:bplannummer)" component={DefaultPage}/>
                <Route component={NotFoundPage} />
              </Switch>
            </main>
          </div>
      );
    }
  }
}
