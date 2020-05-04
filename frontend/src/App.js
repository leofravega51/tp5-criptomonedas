import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './components/Home';
import Criptocoin from './components/Criptocoin';
import Top5 from './components/Top5';
import Top20 from './components/Top20';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/cripto_coin" component={Criptocoin} />
            <Route exact path="/top5" component={Top5} />
            <Route exact path="/top20" component={Top20} />
          </Switch>
        </div>
      </BrowserRouter>

    );
  }
}

export default App;
