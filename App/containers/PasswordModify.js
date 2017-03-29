/**
 * Created by danding on 17/3/25.
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
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
import PreferenceStore from '../components/utils/PreferenceStore';
import {
    verifyMobilePhoneRedundancy,
    generateSecurityCode,
    registerUser,
    passwordModify
} from '../action/UserActions';

import {
    PAGE_LOGIN
} from '../constants/PageStateConstants';

import {
    updatePageState
} from '../action/PageStateActions';


class PasswordModify extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    save()
    {
        var {info}=this.state;

        if(info.code!==undefined&&info.code!==null&&info.code!='')
        {
            if(info.pwd!==undefined&&info.pwd!==null)
            {
                if(info.pwd_again!==undefined&&info.pwd_again!==null)
                {
                    if(info.pwd_again==info.pwd)
                    {
                        this.props.dispatch(passwordModify({password:info.pwd})).then((json)=>{
                            if(json.re==1)
                            {
                                Alert.alert(
                                    '信息',
                                    '密码修改成功'
                                )
                            }
                        }).catch((e)=>{
                            Alert.alert(
                                '错误',
                                e
                            )
                        })
                    }else{
                        Alert.alert(
                            '错误',
                            '您输入的验证码不正确'
                        )
                    }

                }else{
                    Alert.alert(
                        '错误',
                        '请输入确认密码后再点击完成'
                    )
                }
            }else{
                Alert.alert(
                    '错误',
                    '请输入新的密码后再点击完成'
                )
            }
        }else{
            Alert.alert(
                '错误',
                '请输入验证码后再点击完成'
            )
        }
    }

    setLifeInsurer(insurer){
        var lifeInsurer = insurer;
        this.setState({insurer:lifeInsurer});


    }

    setLifeInsuranceder(insuranceder){
        var lifeInsuranceder = insuranceder;
        this.setState({insuranceder:lifeInsuranceder});


    }

    setLifeBenefiter(benefiter){

        var lifeBenefiter = benefiter;
        if(lifeBenefiter.perName!=='法定'){
            this.setState({benefiter:lifeBenefiter,isLegalBenefiter:0});
        }
        else{

            this.setState({benefiter:lifeBenefiter,isLegalBenefiter:1});
        }

    }

    //转向登录界面
    navigate2Login(){

        this.props.dispatch(updatePageState({state:PAGE_LOGIN}));
    }


    register()
    {
        //TODO:比对state.code和state.info.code
        var {code,info}=this.state;
        if(parseInt(code)==parseInt(info.code))
        {
            this.props.dispatch(registerUser(info)).then((json)=>{
                if(json.re==1) {

                    PreferenceStore.put('username',info.username);
                    PreferenceStore.put('password',info.password);

                    //TODO:make this to confirm
                    Alert.alert(
                        '信息',
                        '注册成功！是否要直接登录？',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                            {text: 'OK', onPress: () => this.navigate2Login()},
                        ]
                    )

                }else{
                    Alert.alert(
                        '错误',
                        '注册失败'
                    )
                }
            }).catch((e)=>{
                alert(e);
            })

        }else{
            Alert.alert(
                '错误',
                '手机验证码输入错误'
            )
        }
    }


    getCode()
    {
        //获取验证码
        var {mobilePhone}=this.state.info;
        var reg=/^\d{11}$/;
        if(reg.exec(mobilePhone)!==null)
        {
            this.props.dispatch(verifyMobilePhoneRedundancy({mobilePhone:mobilePhone})).then((json)=>{
                if(json.data==true)
                {
                    Alert.alert(
                        '错误',
                        '您输入的手机号已被使用,请重新填入手机号再注册'
                    )

                }else{
                    generateSecurityCode({mobilePhone:mobilePhone}).then((json)=>{
                        if(json.re==1)
                        {
                            this.setState({code:json.data});
                        }
                    })
                }

            }).catch((e)=>{
                Alert.alert(
                    '错误',
                    e
                )

            })

        }else{
            Alert.alert(
                '错误',
                '请输入11位的数字作为手机号\r\n再点击获取验证码'
            )
        }

    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            insurer:{perName:null},
            insuranceder:{perName:null},
            benefiter:{perName:null},
            isLegalBenefiter:false,
            insuranceType:null,
            insuranceTypeCode:null,
            hasSocietyInsurance:0,
            hasCommerceInsurance:0,
            planInsuranceFee:null,
            insuranceTypeButtons:['取消','重疾险','意外险','养老险','理财险','医疗险'],
            redundancyConfirmModal:false,
            redundancyConfirmText:'',
            modifiedFlag:false,
            info:{}
        };
    }

    render(){

        var props=this.props;
        var state=this.state;

        return (

            <View style={{flex:1}}>
                <View style={[{flex:1,padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                    <TouchableOpacity onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        修改密码
                    </Text>
                </View>

                {/*body*/}
                <Image resizeMode="stretch" source={require('../img/login_background@2x.png')} style={{flex:20,width:width}}>
                    <View style={{flex:10,padding:10}}>



                        {/*手机验证*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:70,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                               <Text style={{color:'#bf530c'}}>手机号:</Text>
                            </View>

                            <View style={{flex:2,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:13,paddingLeft:10}}
                                    onChangeText={(phone) =>
                                    {

                                       var info=_.cloneDeep(state.info);
                                       info.phone=phone;

                                       this.setState({info:info});
                                    }}

                                    value={state.info.phone}
                                    placeholder='请输入手机号'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            <TouchableOpacity style={{padding:5,paddingHorizontal:20,justifyContent:'center',alignItems:'center',borderRadius:4,
                                    backgroundColor:'#f79916'}}
                                              onPress={()=>{
                                         this.getCode();
                                      }}>
                                <Text style={{color:'#fff',fontSize:12}}>发送验证码</Text>
                            </TouchableOpacity>
                        </View>






                        {/*验证码*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:70,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Text style={{color:'#bf530c'}}>验证码:</Text>
                            </View>

                            <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:13,paddingLeft:10}}
                                    onChangeText={(code) =>
                                    {

                                       this.setState({info:Object.assign(state.info,{code:code})});
                                    }}
                                    value={state.info.code}
                                    placeholder='请输入验证码'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>



                        {/*新密码*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:70,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Text style={{color:'#bf530c'}}>新密码:</Text>
                            </View>

                            <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:13,paddingLeft:10}}
                                    onChangeText={(pwd) =>
                                    {

                                       this.setState({info:Object.assign(state.info,{pwd:pwd})});
                                    }}
                                    value={state.info.pwd}
                                    placeholder='请输入新密码'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        {/*确认密码*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:70,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Text style={{color:'#bf530c'}}>确认密码:</Text>
                            </View>

                            <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:13,paddingLeft:10}}
                                    onChangeText={(pwd_again) =>
                                    {

                                       this.setState({info:Object.assign(state.info,{pwd_again:pwd_again})});
                                    }}
                                    value={state.info.pwd_again}
                                    placeholder='请再次输入新密码'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>


                        {/*完成*/}
                        <View style={{alignItems:'center',height:30,marginTop:10}}>
                            <TouchableOpacity style={{width:width*2/3,borderRadius:6,padding:8,paddingVertical:10,backgroundColor:'#ef473a',justifyContent:'center',
                                alignItems:'center'}}
                                              onPress={()=>{
                                         this.save();
                                      }}>
                                <Text style={{color:'#fff'}}>完成</Text>
                            </TouchableOpacity>
                        </View>


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
        accessToken:state.user.accessToken
    })
)(PasswordModify);

