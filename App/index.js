/**
 * Created by dingyiming on 2017/2/15.
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store/index';
import App from './containers/App';

export default class Root extends Component {
    render() {
        return (
            <Provider store = {store} >
                <App />
            </Provider>
        )
    }
}
