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
    Platform,
    Alert
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
import {fetchAccessToken} from '../action/UserActions';
import {createNotification,downloadGeneratedTTS} from '../action/JpushActions';
import {enableCarOrderRefresh} from '../action/CarActions';
import AudioExample from '../../AudioExample';
import DropdownAlert from 'react-native-dropdownalert'

var WeChat = require('react-native-wechat');


class App extends React.Component {

    navigate2AudioExample(path){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'audioExample',
                component: AudioExample,
                params: {
                    path:path
                }
            })
        }
    }


    onNotificationRecv(payload)
    {
        Alert.alert(
            'onNotificationRecv',
            'onNotificationRecv'+payload.type,
            [
                {text: 'OK', onPress: () => console.log('Cancel OK!')},
            ]
        )

        var {type}=payload;
        switch(type)
        {
            case 'from-service':
                var {orderId,servicePersonId,date}=payload;
                var content='工号为'+servicePersonId+'的服务人员发出接单请求';
                var user={};
                date=new Date(date);

                this.props.dispatch(fetchAccessToken())
                .then((json)=>{

                   if(json.re==1)
                   {
                        //获取accessToken并进行页面跳转
                       this.props.dispatch(createNotification(payload,'service'))
                           .then(function (json) {
                               Alert.alert(
                                   '获取accessToken并进行页面跳转',
                                   '获取accessToken并进行页面跳转',
                                   [
                                       {text: 'OK', onPress: () => console.log('Cancel OK!')},
                                   ]
                               )

                                //TODO:下载音频文件
                                return this.props.dispatch(downloadGeneratedTTS({content:content}));

                           })
                           .then(function (json) {
                                if(json.re==1)
                                {
                                    var path=json.data;
                                    console.log('path='+path);
                                    //TODO:播放音频文件
                                    this.navigate2AudioExample(path);
                                    //TODO:popup插件

                                }
                           });

                   }else{
                   }
                }).catch(function (e) {
                    alert(e);
                })

                break;
            case 'from-background':
                var {orderState}=payload;
                switch(orderState)
                {
                    case 3:
                        //报价完成
                        var {orderId,orderNum,orderType,date}=payload;
                        date=new Date(date);
                        var content='订单号为'+orderNum+'的车险订单已报价完成';
                        var msg=null;
                        if(orderType==1)
                        {
                            msg='订单号为'+orderNum+'的车险订单已报价完成\r\n'+'是否现在进入车险订单页面查看';
                            this.props.dispatch(enableCarOrderRefresh());
                        }
                        else if(orderType==2)
                        {
                            msg='订单号为'+orderNum+'的寿险订单已报价完成\r\n'+'是否现在进入寿险订单页面查看';
                            this.props.dispatch(enableCarOrderRefresh());
                        }

                        this.props.dispatch(fetchAccessToken())
                            .then(function (json) {
                                if(json.re==1)
                                {
                                    //获取accesToken
                                    this.props.dispatch(createNotification(payload,orderType==1?'car':'life'))
                                        .then(function (json) {
                                            return this.props.dispatch(downloadGeneratedTTS({content:msg}));
                                        })
                                        .then(function (json) {
                                            if(json.re==1)
                                            {
                                                var path=json.data;
                                                //TODO:播放文件

                                                //TODO:popup插件
                                            }
                                        })
                                }
                            })


                        break;
                }
                break;
        }

    }

    constructor(props) {
        super(props);
        this.state={
            tab:'product',
            selectedTab:'home',
            name:null
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

    }

    onReceiveMessage(message) {
        //TODO:make a notification through
        var notification=message._data;
        this.onNotificationRecv(notification);
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
        auth: state.user.auth,
        accessToken: state.user.accessToken,
    })
)(App);
