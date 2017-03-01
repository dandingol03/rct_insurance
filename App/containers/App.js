/**
 * Created by dingyiming on 2017/2/15.
 */
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TabBarIOS,
    Navigator,
    BackAndroid,
    ToastAndroid,
    Platform
} from 'react-native';


import { connect } from 'react-redux';


import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from '../containers/Login';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import JPush , {JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush'
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Home from './home/index';
import My from './my/My';
import dym from './dym';

var WeChat = require('react-native-wechat');


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            tab:'product',
            selectedTab:'home'
        }
    }

    _createNavigatorItem(route,icon)
    {

        var component=Home;
        switch (route) {
            case 'home':
                break;
            case 'my':
                component=My;
                break;
            case 'dym':
                component=dym;
                break;
            default:
                break;
        }


        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === route}
                title={route}
                titleStyle={{color:'#fff'}}
                selectedTitleStyle={{color:'#00c9ff'}}
                renderIcon={() => <Icon name={icon} size={25} color="#fff"/>}
                renderSelectedIcon={() => <Icon name={icon} size={25} color='#00c9ff' />}
                onPress={() => this.setState({ selectedTab: route })}
                tabStyle={{backgroundColor:'transparent'}}
                onSelectedStyle={{backgroundColor:'rgba(17, 17, 17, 0.6);'}}
            >
                <Navigator
                    initialRoute={{ name: route, component:component }}
                    configureScene={(route) => {
                        return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
                      }}
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} />
                      }} />
            </TabNavigator.Item>
        );
    }

    render() {

        let auth=this.props.auth;
        if(auth==true)
        {
            return (
                <TabNavigator tabBarStyle={{backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                    {this._createNavigatorItem('home','home')}
                    {this._createNavigatorItem('my','user-circle')}
                    {this._createNavigatorItem('dym','car')}
                </TabNavigator>
            );
        }else{
            return (<Login/>);
        }
    }

    onBackAndroid()
    {
        if(this.lastBackPressed&&this.lastBackPressed+2000>=Date.now())
        {
            return false;
        }
        this.lastBackPressed=Date.now();
        ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
        return true;
    }

    componentWillMount()
    {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
        this.pushlisteners.forEach(listener=> {
            JPush.removeEventListener(listener);
        });
    }

    componentDidMount() {
        JPush.requestPermissions()
        this.pushlisteners = [
            JPush.addEventListener(JpushEventReceiveMessage, this.onReceiveMessage.bind(this)),
            JPush.addEventListener(JpushEventOpenMessage, this.onOpenMessage.bind(this)),
        ]
        WeChat.registerApp('wx47ac1051332cb08a').then(function (res) {

        })
        // setTimeout(function () {
        //     WeChat.isWXAppInstalled().then(function (json) {
        //         alert(json);
        //     })
        // }.bind(this),1000);
        // setTimeout(function () {
        //     WeChat.shareToTimeline({
        //         type: 'text',
        //         description: 'hello, wechat'
        //     });
        // }.bind(this),2000);

        setTimeout(function () {
            JPush.getRegistrationID().then(function (res) {
                if(res)
                    alert(res);
            })

        },1000);

    }
    onReceiveMessage(message) {
        alert(message);
    }
    onOpenMessage(message) {
        alert(message);
    }

}

var styles = StyleSheet.create({
    heading: {
        fontSize: 30,
        marginTop: 10
    },
    container:{
        flex: 1,
        alignItems:'center',
        marginTop:60
    },
    text: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize:16,
        textAlign:'center'
    },
    wrapper:{

    },
    slide1:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#9DD6EB'
    },
    slide2:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#97CAE5'
    },
    slide3:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#92BBD9'
    }
});

export default connect(
    (state) => ({
        auth: state.user.auth
    })
)(App);

