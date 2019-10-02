import React, { Component } from 'react';
import Header from 'containers/Header';
import Home from 'module/Home';

import 'styles/global.scss';

class App extends Component {
  render() {
    return (
      <div className="main">
        <Header />
        <Home />
      </div>
    );
  }
}

export default App;
