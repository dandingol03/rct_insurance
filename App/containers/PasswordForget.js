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

class PasswordForget extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    apply(){

    }

    constructor(props)
    {
        super(props);

        this.state = {
            phoneNum:null,
            code:null,

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
                    <View style={{flex:5,padding:10}}>

                        <View style={{flex:1,padding:10,flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                            <View style={{flex:1,padding:10,}}>
                                <Icon name="angle-left" size={20} color="#bf530c" />
                            </View>
                            <View style={{flex:2,padding:10,}}>
                                <TextInput
                                    style={{height: 40}}
                                    onChangeText={(phoneNum) => {
                                    this.setState({phoneNum:phoneNum});
                                }}
                                    value={this.state.phoneNum}
                                    placeholder={'请输入手机号'}
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <View style={{flex:2,padding:10,backgroundColor:'#f79916'}}>
                                <Text style={{flex:2,padding:10,}}>发送验证码</Text>
                            </View>
                        </View>

                        <View style={{flex:1,padding:10,}}>
                            <View style={{flex:2,padding:10,}}>
                                <Icon name="angle-left" size={40} color="#fff" />
                            </View>
                            <View style={{flex:2,padding:10,}}>
                                <TextInput
                                    style={{height: 40}}
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

                    </View>

                    <TouchableOpacity style={{flex:1,width:width-60,marginLeft:30,marginBottom:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                  backgroundColor:'rgba(17, 17, 17, 0.6)',borderRadius:8}}
                                      onPress={()=>{
                                         this.apply();
                                      }}>
                        <View>
                            <Text style={{fontSize:15,color:'#fff'}}>提交信息</Text>
                        </View>

                    </TouchableOpacity>
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

