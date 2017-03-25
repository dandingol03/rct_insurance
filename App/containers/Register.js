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
    registerUser
} from '../action/UserActions';

import {
    PAGE_LOGIN
} from '../constants/PageStateConstants';

import {
    updatePageState
} from '../action/PageStateActions';

class Register extends Component{

    goBack(){
        this.props.dispatch(updatePageState({state:PAGE_LOGIN}));
    }

    show(actionSheet) {
        this[actionSheet].show();
    }


    applyLifeInsuranceIntend(){

        var order = {
            insurer:this.state.insurer,
            insuranceder:this.state.insuranceder,
            benefiter:this.state.benefiter,
            isLegalBenefiter:this.state.isLegalBenefiter,
            insuranceType:this.state.insuranceType,
            insuranceTypeCode:this.state.insuranceTypeCode,
            hasSocietyInsurance:this.state.hasSocietyInsurance,
            hasCommerceInsurance:this.state.hasCommerceInsurance,
            planInsuranceFee:this.state.planInsuranceFee,
        }

        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'generateLifeInsuranceOrder',
                info:order,
            }
        }, (res)=> {
            var json = res;
            if(json.re==1)
            {
                var orderId=json.data.orderId;
                if(orderId!==undefined&&orderId!==null)
                {
                    Alert.alert(
                        '您的订单',
                        '您的寿险意向已提交,请等待工作人员配置方案后在"我的寿险订单"中进行查询',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                            {text: 'OK', onPress: () => this.navigate2LifeOrders()},
                        ]
                    )

                }
            }
        }, (err) =>{
            var str='';
            for(var field in err)
                str += field + ':' + err[field];
            alert('error=\r\n' + str);
        });
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

        var insuranceType = this.state.insuranceType;
        var hasSocietyInsurance= this.state.hasSocietyInsurance;
        var hasCommerceInsurance= this.state.hasCommerceInsurance;
        var insurer = this.state.insurer;
        var insuranceder = this.state.insuranceder;
        var benefiter = this.state.benefiter;

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const insuranceTypeButtons=['取消','重疾险','意外险','养老险','理财险','医疗险'];
        return (

            <View style={{flex:1}}>
                <View style={[{flex:1,padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                    <TouchableOpacity onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        用户注册
                    </Text>
                </View>

                {/*body*/}
                <Image resizeMode="stretch" source={require('../img/login_background@2x.png')} style={{flex:20,width:width}}>
                    <View style={{flex:10,padding:10}}>


                        {/*用户名*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5}]}>
                            <View style={{width:35,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Icon name="user-o" size={24} color="#bf530c" />
                            </View>

                            <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:14,paddingLeft:20}}
                                    onChangeText={(username) =>
                                    {

                                       this.setState({info:Object.assign(state.info,{username:username})});
                                    }}
                                    value={state.info.username}
                                    placeholder='请输入用户名'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>


                        {/*密码*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:35,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Icon name="lock" size={24} color="#bf530c" />
                            </View>

                            <View style={{flex:2,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:14,paddingLeft:20}}
                                    onChangeText={(password) =>
                                    {
                                       var reg=/\W/;
                                       var info=_.cloneDeep(state.info);
                                       info.password=password;
                                       if(reg.exec(password)!=null)
                                       {
                                           info.password_error=true
                                       }
                                       this.setState({info:info});
                                    }}
                                    password={true}
                                    value={state.info.password}
                                    placeholder='请输入密码'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            {
                                state.info.password_error==true?
                                    <View style={{flex:2,padding:5,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                                        <Text style={{color:'#222'}}>密码不能含中文</Text>
                                    </View>:null
                            }

                        </View>

                        {/*邮箱*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:35,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Icon name="envelope-o" size={22} color="#bf530c" />
                            </View>

                            <View style={{flex:2,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:14,paddingLeft:20}}
                                    onChangeText={(mail) =>
                                    {
                                       var reg=/@.*?\./;
                                       var info=_.cloneDeep(state.info);
                                       info.mail=mail;
                                       if(reg.exec(mail)!=null)
                                       {
                                       }else{
                                           info.mail_error=true
                                       }
                                       this.setState({info:info});
                                    }}

                                    value={state.info.mail}
                                    placeholder='请输入邮箱地址，本项选填'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            {

                                state.info.mail_error==true?
                                    <View style={{flex:2,padding:5,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                                        <Text style={{color:'#222'}}>输入的邮箱格式不正确</Text>
                                    </View>:null
                            }

                        </View>


                        {/*手机验证*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:35,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Icon name="mobile" size={27} color="#bf530c" />
                            </View>

                            <View style={{flex:2,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:14,paddingLeft:20}}
                                    onChangeText={(mobilePhone) =>
                                    {

                                       var info=_.cloneDeep(state.info);
                                       info.mobilePhone=mobilePhone;

                                       this.setState({info:info});
                                    }}

                                    value={state.info.mobilePhone}
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


                        {/*验证码比对*/}
                        <View style={[styles.row,{height:40,borderWidth:1,borderColor:'#ccc',borderBottomColor:'#ccc',padding:5,marginTop:10}]}>
                            <View style={{width:35,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'transparent',borderRightWidth:1,borderColor:'#bf530c'}}>
                                <Icon name="expeditedssl" size={24} color="#bf530c" />
                            </View>

                            <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 35,fontSize:14,paddingLeft:20}}
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





                    </View>

                    <TouchableOpacity style={{flex:1,width:width-60,marginLeft:30,marginBottom:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                  backgroundColor:'rgba(17, 17, 17, 0.6)',borderRadius:8}}
                                      onPress={()=>{
                                         this.register();
                                      }}>
                        <View>
                            <Text style={{fontSize:15,color:'#fff'}}>用户注册</Text>
                        </View>

                    </TouchableOpacity>
                </Image>

            </View>
        );
    }

    componentDidMount()
    {
        // SInfo.setItem('name', 'danding',{
        //     sharedPreferencesName:'shared_preferences',
        //     keychainService:'app'
        // });

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
)(Register);

