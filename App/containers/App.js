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


const tabBarTintColor = '#f8f8f8';// 标签栏的背景颜色
const tabTintColor = '#3393F2'; // 被选中图标颜色



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
                renderIcon={() => <Icon name={icon} size={25}/>}
                renderSelectedIcon={() => <Icon name={icon} size={25} color='#00f' />}
                onPress={() => this.setState({ selectedTab: route })}>
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
                <TabNavigator>
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

