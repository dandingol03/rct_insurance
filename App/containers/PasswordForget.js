/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    ListView,
    Image,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    Alert,
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Config from '../../config';
import Proxy from '../proxy/Proxy';

import Icon from 'react-native-vector-icons/FontAwesome';
import {
    PAGE_LOGIN,
} from '../constants/PageStateConstants';
import {
    updatePageState
} from '../action/PageStateActions';

class PasswordForget extends Component{

    goBack(){
        this.props.dispatch(updatePageState({state:PAGE_LOGIN}))
    }

    getCode(){
        Proxy.get({
            url:Config.server+'/securityCode?'+"phoneNum=" + this.state.phoneNum,
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            }
        },(res)=> {
            var json = res.data;
            if(json.re==1) {

                this.state.generatedCode = json.data;
            }
            else{
                console.error('error=\r\n'+json.data);
            }

        }, (err) =>{
        });
    }

    apply(){
        if(this.state.generatedCode==this.state.code)
        {
            Proxy.post({
                url:Config.server+'/passwordForget?'+'phone='+this.state.phoneNum,
                headers: {
                    'Authorization': "Bearer " + this.state.accessToken,
                    'Content-Type': 'application/json'
                }
            },(json)=> {
                if(json.re==1) {
                    var pwd=json.data;
                    Alert.alert(
                        '找回密码',
                        '您的密码已通过短信发送到手机，请注意查收',
                        [
                            {text: '返回', onPress: () => console.log('Cancel Pressed!')},
                            {text: '查看密码', onPress: () => {
                               alert('您的密码是：'+pwd);
                            }},
                        ]
                    )
                }else if(json.re==-1) {
                    alert(json.data);
                }else{}

            }, (err) =>{
                console.error('err=\r\n' + err);
            });

        }else{
           alert('验证码输入错误');
        }
    }

    constructor(props)
    {
        super(props);

        this.state = {
            phoneNum:null,
            code:null,
            generatedCode:null,
        };
    }

    render(){

        return (

            <View style={{flex:1}}>
                <View style={[{flex:1,padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                    <TouchableOpacity onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        找回密码
                    </Text>
                </View>

                {/*body*/}
                <Image resizeMode="stretch" source={require('../img/login_background@2x.png')} style={{flex:20,width:width}}>

                    <View style={{flex:1,padding:5,marginTop:10}}>

                        <View style={{flex:3,padding:5}}>

                            <View style={{flex:1,margin:5,padding:10,borderWidth:1,borderColor:'#aaa',flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                                <View style={{flex:1,padding:10,borderRightWidth:1,borderRightColor:'#bf530c',backgroundColor:'transparent'}}>
                                    <Icon name="phone" size={25} color="#bf530c" />
                                </View>
                                <View style={{flex:5,padding:10,}}>
                                    <TextInput
                                        style={{height: 40,fontSize:15}}
                                        onChangeText={(phoneNum) => {
                                    this.setState({phoneNum:phoneNum});
                                }}
                                        value={this.state.phoneNum}
                                        placeholder={'请输入手机号'}
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                                <TouchableOpacity style={{flex:3,padding:5,backgroundColor:'#f79916',justifyContent:'center',alignItems:'center',}}
                                                  onPress={()=>{
                                         this.getCode();
                                      }}>
                                    <Text style={{padding:5,paddingLeft:0,paddingRight:0,color:'#fff',fontSize:13}}>发送验证码</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{flex:1,margin:5,marginTop:0,padding:10,borderWidth:1,borderColor:'#aaa',flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                                <View style={{flex:1,padding:10,borderRightWidth:1,borderRightColor:'#bf530c',backgroundColor:'transparent'}}>
                                    <Icon name="lock" size={25} color="#bf530c" />
                                </View>
                                <View style={{flex:10,padding:10,}}>
                                    <TextInput
                                        style={{height: 40,fontSize:15}}
                                        onChangeText={(code) => {
                                    this.setState({code:code});
                                }}
                                        value={this.state.code}
                                        placeholder={'请输入验证码'}
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>

                            <View style={{flex:1,margin:5,}}>

                            </View>

                        </View>

                        <TouchableOpacity style={{flex:1,width:width-30,marginLeft:10,marginBottom:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                  backgroundColor:'#e42112',borderRadius:8}}
                                          onPress={()=>{
                                         this.apply();
                                      }}>
                            <Text style={{fontSize:15,color:'#fff'}}>提交信息</Text>

                        </TouchableOpacity>

                    </View>

                    <View style={{flex:1,padding:10,}}>

                    </View>

                </Image>

            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderBottomWidth: 0,
        shadowColor: '#eee',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    logo:{
        width:width,
        height:290
    },
    module:{
        width:90,
        height:90
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        height: 50,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = connect(state=>({

    })
)(PasswordForget);

