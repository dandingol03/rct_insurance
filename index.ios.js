/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from './App/index';

import Icon from 'react-native-vector-icons/FontAwesome';
import  TabNavigator from 'react-native-tab-navigator';
import JPush , {JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush'





import BaiduMapDemo from './BaiduMapDemo';


export class rn extends Component {
    render() {
        return (
            <BaiduMapDemo />
        );
    }
}

export class Jpush extends Component{
  render()
  {
    return (
      <View style={{flex:1}}>
        <Text style={{color:'#222',fontSize:18}}>jpush</Text>
      </View>
    );
  }
    componentDidMount() {
        JPush.requestPermissions()
        this.pushlisteners = [
            JPush.addEventListener(JpushEventReceiveMessage, this.onReceiveMessage.bind(this)),
            JPush.addEventListener(JpushEventOpenMessage, this.onOpenMessage.bind(this)),
        ]
    }
    componentWillUnmount() {
        this.pushlisteners.forEach(listener=> {
            JPush.removeEventListener(listener);
        });
    }
    onReceiveMessage(message) {
      alert(message);
    }
    onOpenMessage(message) {
      alert(message);
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('rct_insurance', () => Jpush);
