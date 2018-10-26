import React, { Component } from 'react';
import Navigator from './components/Navigator';

class App extends Component {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <Navigator />;
    }

}

export default App;