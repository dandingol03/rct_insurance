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
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';


import { connect } from 'react-redux';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from '../containers/Login';
import Register from './Register';
import PasswordForget from './PasswordForget';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Sound from 'react-native-sound';
import StatusBarAlert from 'react-native-statusbar-alert';
import JPush , {JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush'
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Home from './home/index';
import My from './my/My';
import Chat from './Chat';
import {fetchAccessToken} from '../action/UserActions';
import {
    createNotification,
    downloadGeneratedTTS,
    alertWithType,
    closeMessage
} from '../action/JpushActions';
import {enableCarOrderRefresh} from '../action/CarActions';
import {
    PAGE_LOGIN,
    PAGE_REGISTER,
    PAGE_PASSWORDFORGET,

} from '../constants/PageStateConstants';

var WeChat = require('react-native-wechat');
import ws from '../components/utils/WebSocket';

class App extends React.Component {

    onNotificationRecv(payload)
    {

        var {type}=payload;
        console.log('type='+type);

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
                        //TODO:获取accessToken并进行页面跳转


                       this.props.dispatch(createNotification(payload,'service'))
                           .then( (json) =>{
                                //TODO:下载音频文件
                                console.log('go get tts');
                                return this.props.dispatch(downloadGeneratedTTS({content:content}));
                           })
                           .then( (json)=> {
                                if(json.re==1)
                                {
                                    var path=json.data;
                                    //TODO:播放音频文件
                                    var sound = new Sound(json.data, '', (error) => {
                                        if (error) {
                                            console.log('failed to load the sound', error);
                                        }
                                    });
                                    this.state.soundMounted=sound;
                                    setTimeout(() => {
                                        sound.play((success) => {
                                            if (success) {
                                                console.log('successfully finished playing');
                                                sound.release();
                                                this.state.soundMounted=null;
                                            } else {
                                                console.log('playback failed due to audio decoding errors');
                                                sound.release();
                                                this.state.soundMounted=null;
                                            }
                                        });
                                    }, 100);

                                    //TODO:popup插件,当点击这个插件时取消音频播放,sound.stop();sound.release();
                                    this.props.dispatch(alertWithType({msg:content}));


                                }
                           });

                   }else{
                   }
                }).catch( (e)=> {
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
                                                //TODO:播放音频文件
                                                var sound = new Sound(json.data, '', (error) => {
                                                    if (error) {
                                                        console.log('failed to load the sound', error);
                                                    }
                                                });
                                                this.state.soundMounted=sound;
                                                setTimeout(() => {
                                                    sound.play((success) => {
                                                        if (success) {
                                                            console.log('successfully finished playing');
                                                            sound.release();
                                                            this.state.soundMounted=null;
                                                        } else {
                                                            console.log('playback failed due to audio decoding errors');
                                                            sound.release();
                                                            this.state.soundMounted=null;
                                                        }
                                                    });
                                                }, 100);

                                                //TODO:popup插件,当点击这个插件时取消音频播放,sound.stop();sound.release();
                                                this.props.dispatch(alertWithType({msg:content}));


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
            name:null,
            recved:this.props.notification.recved,
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
                component=Chat;
                break;
            default:
                break;
        }



        var routeMapper = {
            LeftButton(route, navigator, index, navState) {
                if (index > 0) {
                    return (
                        <TouchableHighlight style={{ marginTop: 10 }} onPress={() => {
                            if (index > 0) {
                                navigator.pop();
                            }
                        } }>
                            <Text>Back</Text>
                        </TouchableHighlight>
                    )
                } else {
                    return null
                }
            },

            RightButton(route, navigator, index, navState) {
                return null;
            },

            Title(route, navigator, index, navState) {
                return (
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ color: 'white', margin: 10, fontSize: 16 }}>
                            Data Entry
                        </Text>
                    </TouchableOpacity>
                );
            }
        };



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


                <View style={{flex:1}}>

                    <StatusBarAlert
                        backgroundColor="#3CC29E"
                        color="white"
                        visible={this.props.notification.validate}
                        message={this.props.notification.msg}
                        onPress={() => {

                            //如果挂载音频不为空，则点击停止
                            if(this.state.soundMounted!==undefined&&this.state.soundMounted!==null)
                            {
                                var sound=this.state.soundMounted;
                                sound.stop();
                                sound.release();
                                this.state.soundMounted=null;
                            }
                            this.props.dispatch(closeMessage());
                        }}
                    />

                    <Navigator
                        initialRoute={{ name: route, component:component }}
                            configureScene={(route) => {
                            return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
                          }}
                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            return (<Component {...route.params} navigator={navigator} />);
                          }}

                    />

                </View>


            </TabNavigator.Item>
        );
    }

    render() {

        var props=this.props;
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
            switch(props.page.state)
            {
                case PAGE_LOGIN:
                    return (<Login/>);
                    break;
                case PAGE_REGISTER:
                    return (<Register/>);
                    break;
                case PAGE_PASSWORDFORGET:
                    return (<PasswordForget/>);
                    break;
            }
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



        var socket=new window.WebSocket('ws://139.129.96.231:3010');

        //进行websocket连接
        ws.connect();

        // setTimeout(()=>{
        //     this.setState({recved:true});
        // },12000)


    }
    onReceiveMessage(message) {
        //TODO:make a notification through
        var notification=message._data;
        this.onNotificationRecv(notification);
    }

    onOpenMessage(message) {
        console.log(message);

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
        notification:state.notification,
        page:state.page
    })
)(App);
