/**
 * Created by dingyiming on 2017/2/15.
 * android的面板可用内容实际上会少23
 */
import React from 'react';

var {
    Component
} = React;

import {
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    TabBarIOS,
    TouchableOpacity,
    Dimensions,
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
var Proxy = require('../proxy/Proxy');
import {
    loginAction,
    setTimerAction
} from '../action/actionCreator';


import {
    updatePageState
} from '../action/PageStateActions';

import {
    PAGE_REGISTER
} from '../constants/PageStateConstants';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Sound from 'react-native-sound';


var  Login =React.createClass({

    onLoginPressed:function () {
        const {dispatch} = this.props;
        var {user}=this.state;
        if(user.username!==undefined&&user.username!==null)
        {
            if(user.password!==undefined&&user.password!==null)
            {
                this.setState({showProgress: true,modalVisible:true});
                const {dispatch} = this.props;
                this.timer= setInterval(

                    function () {

                        var loginDot=this.state.loginDot;
                        if(loginDot=='......')
                            loginDot='.';
                        else
                            loginDot+='.';
                        this.setState({loginDot:loginDot});
                    }.bind(this)
                    ,
                    600,
                );
                dispatch(setTimerAction(this.timer));
                dispatch(loginAction(user.username,user.password,function () {
                    this.setState({showProgress: false,user:{}});
                }.bind(this)));
            }
        }else{}

    },

    navigate2Register:function(){
        //TODO:dispatch a action
        this.props.dispatch(updatePageState({state:PAGE_REGISTER}))
    },

    onPress:function () {
        var form = this.refs.form.getValue();
        console.log('struct=\r\n'+form);
        this.setState({showProgress: true});
        const {dispatch} = this.props;
        dispatch(loginAction(form.username,form.password));
    },

    getInitialState:function(){
        return ({
            user:{},
            modalVisible:false,
            showProgress:false,
            loginDot:'.'
        });
    },
    render:function () {

        const shadowOpt = {
            width:width-20,
            height:200,
            color:"#000",
            border:2,
            radius:3,
            opacity:0.2,
            x:0,
            y:1.5,
            style:{marginVertical:5}
        }

        return (
            <View style={[styles.container]}>

                <Image resizeMode="stretch" source={require('../img/login_background@2x.png')} style={{width:width,height:height}}>
                    <View style={{justifyContent:'center',flexDirection:'row',padding:0,marginTop:40}}>

                        <View style={{
                            position:"relative",
                            width: width-20,
                            backgroundColor: "transparent",
                            borderRadius:3,
                            height:120,
                            justifyContent:'center',
                            flexDirection:'row',
                            overflow:"hidden"}}>
                            <Image style={styles.logo} source={require('../img/jiehuibao.png')} />
                        </View>

                    </View>

                    <View style={{padding:10,paddingTop:2}}>

                        {/*输入用户名*/}
                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginBottom:20}]}>
                            <View style={{flex:1}}></View>

                            <View style={{flex:6}}>
                                <View style={{flex:1,borderBottomWidth:1,borderColor:'#222',flexDirection:'row'}}>

                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',padding:6,
                                        paddingLeft:10,paddingRight:15,marginLeft:0}}>
                                        <Icon size={26} name="user" color="#444"></Icon>
                                    </View>



                                    <View style={{flex:6,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                        <TextInput
                                            style={{height: 46,flex:1,paddingLeft:10,paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:16,
                                                        }}
                                            onChangeText={(username) => {

                                            this.state.user.username=username;
                                            this.setState({user:this.state.user});
                                            }}
                                            value={this.state.user.username}
                                            placeholder='请输入用户名'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>


                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',padding:6,
                                        paddingLeft:10,paddingRight:15,marginLeft:0}}>
                                    </View>
                                </View>
                            </View>

                            <View style={{flex:1}}></View>
                        </View>



                        {/*输入密码*/}
                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginBottom:20}]}>
                            <View style={{flex:1}}></View>

                            <View style={{flex:6}}>
                                <View style={{flex:1,borderBottomWidth:1,borderColor:'#222',flexDirection:'row'}}>

                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',padding:6,
                                        paddingLeft:10,paddingRight:15,marginLeft:0}}>
                                        <Icon size={26} name="lock" color="#444"></Icon>
                                    </View>

                                    <View style={{flex:6,flexDirection:'row',alignItems:'center'}}>
                                        <TextInput
                                            style={{height: 46,flex:1,paddingLeft:10,paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:16}}
                                            onChangeText={(password) => {
                                            this.state.user.password=password;
                                            this.setState({user:this.state.user});
                                        }}
                                            secureTextEntry={true}
                                            value={this.state.user.password}
                                            placeholder='请输入密码'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',padding:6,
                                        paddingLeft:10,paddingRight:15,marginLeft:0}}>
                                    </View>

                                </View>
                            </View>

                            <View style={{flex:1}}></View>
                        </View>

                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <View style={[styles.row,{borderBottomWidth:0,marginBottom:10,width:width*3/5}]}>
                                <TouchableOpacity style={{flex:1,justifyContent:'flex-start',flexDirection:'row',marginLeft:10
                                    ,backgroundColor:'transparent'}}
                                                  onPress={()=>{
                                        this.navigate2Register();
                                    }}>
                                    <Text style={{color:'rgba(66, 162, 136, 0.97)',fontSize:16}}>注册</Text>
                                </TouchableOpacity>
                                <View style={{flex:1,justifyContent:'flex-end',flexDirection:'row',marginRight:10,
                                     backgroundColor:'transparent'}}>
                                    <Text style={{color:'rgba(66, 162, 136, 0.97)',fontSize:16}}>忘记密码</Text>
                                </View>
                            </View>
                        </View>

                        {/*登录*/}
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <View style={[styles.row,{borderBottomWidth:0,marginTop:20,width:width*3/5}]}>

                                <TouchableOpacity style={{flex:1,backgroundColor:'rgba(66, 162, 136, 0.97)',padding:12,borderRadius:20,flexDirection:'row',
                                justifyContent:'center',}} onPress={()=>{
                                             this.onLoginPressed()
                                          }}>
                                    <Text style={{color:'#fff',fontSize:18}}>登录</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Modal
                            animationType={"fade"}
                            transparent={true}
                            visible={this.state.showProgress}
                            onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                            <View style={[styles.modalContainer,styles.modalBackgroundStyle]}>
                                <ActivityIndicator
                                    animating={true}
                                    style={[styles.loader, {height: 80}]}
                                    size="large"
                                    color="#fff"
                                />
                                <View style={{flexDirection:'row',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:18,alignItems:'center'}}>
                                        登录中
                                    </Text>
                                    <Text style={{color:'#fff',fontSize:24,alignItems:'center'}}>
                                        {this.state.loginDot}
                                    </Text>
                                </View>
                            </View>
                        </Modal>

                    </View>



                    <MessageBarAlert ref="alert" />
                    <MessageBarAlert ref="msg" />


                    <Image style={{position:'absolute',bottom:0,width:width}} source={require('../img/tree.png')} />
                </Image>
            </View>
        );

    },

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);

        setTimeout(function () {
            Sound.setCategory('Playback', true)
            const s = new Sound('./serviceAudio.wav',  Sound.MAIN_BUNDLE,(e) => {
                if (e) {
                    alert(e)
                    return;
                }

                s.play(() => s.release());
            });
        },1000)


        // var  makePromise=(name, delay) =>{
        //     return new Promise((resolve) => {
        //         console.log(`${name} started`);
        //         setTimeout(() => {
        //             console.log(`${name} completed`);
        //             resolve(name);
        //         }, delay);
        //     });
        // }
        //
        // var data = [2000, 1, 1000];
        // Promise.reduce(data, ( item, index) => {
        //     return makePromise(index, item).then(res => {
        //         return  res;
        //     });
        // }, 0).then(res => {
        //     console.log(res);
        // });


        // MessageBarManager.showAlert({
        //     title: "John Doe", // Title of the alert
        //     message: "Hello, any suggestions?", // Message of the alert
        //     avatar: require('../img/person.jpg'),
        //     titleNumberOfLines: 1,
        //     messageNumberOfLines: 0,
        //     titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //     messageStyle: { color: 'white', fontSize: 16 ,},
        //     avatarStyle: { height: 40, width: 40, borderRadius: 20 },
        //     animationType: 'SlideFromLeft',
        //     shouldHideAfterDelay:false,
        //     stylesheetExtra:{backgroundColor:'rgba(180,180,180,0.5)',strokeColor:'transparent'}
        // });
        //
        // setTimeout(function () {
        //     MessageBarManager.hideAlert();
        // }.bind(this),1000);

    },
    componentWillUnmount() {
        // Remove the alert located on this master page from the manager
        MessageBarManager.unregisterMessageBar();
    }

});


export default connect(
)(Login);




var styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
        margin:0,
        padding:0
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    logo: {
        width: 140,
        resizeMode:'cover',
        backgroundColor:'transparent',
    },
    heading: {
        fontSize: 30,
        marginTop: 10
    },
    input: {
        width:240,
        justifyContent:'center',
        height: 42,
        marginTop: 10,
        padding: 4,
        fontSize: 12,
        borderWidth: 1,
        borderColor: '#48bbec',
        color: '#48bbec',
        borderBottomWidth:0
    },
    title: {
        fontSize: 38,
        backgroundColor: 'transparent'
    },
    button: {
        marginRight: 10
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    loader: {
        marginTop: 10
    },
    error: {
        color: 'red',
        paddingTop: 10,
        fontWeight: 'bold'
    },
    row:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#222'
    }
});
