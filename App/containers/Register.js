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
import AppendLifeInsurer from './life/AppendLifeInsurer.js';
import LifeOrders from './life/LifeOrders';
import MyPop from 'react-native-popupwindow';

class Life extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    onPressHandle() {
        let options = {
        };
        MyPop.showPopupWindow(options,(err,action,button) =>{
            if(err){
                ToastAndroid.show(err,ToastAndroid.SHORT);
            }else{
                if(action === 'buttonClicked'){
                    if(button === 'positive'){
                        ToastAndroid.show('点击确定',ToastAndroid.SHORT);
                    }else if(button === 'negative'){
                        ToastAndroid.show('点击取消',ToastAndroid.SHORT);
                    }
                }
            }
        });
    }



    show(actionSheet) {
        this[actionSheet].show();
    }

    saveLifeInsuranceIntend(){
        if(this.state.insuranceder.personId!=undefined&&this.state.insuranceder.personId!=null
            &&this.state.insurer.personId!=undefined&&this.state.insurer.personId!=null
            &&((this.state.benefiter.personId!=undefined&&this.state.benefiter.personId!=null)
            ||(this.state.isLegalBenefiter!=undefined&&$this.state.isLegalBenefiter!=null))
            &&this.state.planInsuranceFee!=undefined&&this.state.planInsuranceFee!=null
            &&this.state.insuranceTypeCode!=undefined&&this.state.insuranceTypeCode!=null)
        {
            //TDOO:校验是否已有寿险订单
            //受益人法定
            Proxy.post({
                url:Config.server+'/svr/request',
                headers: {
                    'Authorization': "Bearer " + this.state.accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request:'validateLifeInsuranceOrderApplyRedundancy',
                    info:{
                        insurancederId:this.state.insuranceder.personId,
                        insurerId:this.state.insurer.personId,
                        benefiterId:this.state.benefiter.personId
                    }
                }
            }, (res)=> {
                var json=res.data;
                if(json==true) {

                    if(this.state.benefiter.personId!==undefined&&this.state.benefiter.personId!==null&&this.state.benefiter.personId!=='')
                    {
                        Alert.alert(
                            '您的订单',
                            '已存在正在申请的相同投保人、被保险人的寿险订单,是否仍要提交',
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                                {text: 'OK', onPress: () => this.applyLifeInsuranceIntend()},
                            ]
                        )
                    }
                    else{

                        Alert.alert(
                            '您的订单',
                            '已存在正在申请的相同投保人、被保险人、受益人的寿险订单的寿险订单,是否仍要提交',
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                                {text: 'OK', onPress: () => this.applyLifeInsuranceIntend()},
                            ]
                        )
                    }

                }else{
                    this.applyLifeInsuranceIntend();
                }

            }, (err) =>{
            });
        }
        else
        {
            alert("请填写完寿险意向后才选择提交")
        }

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


    navigate2LifeOrders(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'life_orders',
                component: LifeOrders,
                params: {

                }
            })
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

    navigate2AppendLifeInsurer(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'append_life_insurer',
                component: AppendLifeInsurer,
                params: {
                    setLifeInsurer:this.setLifeInsurer.bind(this),
                }
            })
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
                                    style={{height: 35,fontSize:15,paddingLeft:20}}
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
                                    style={{height: 35,fontSize:15,paddingLeft:20}}
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


                        {/*投保人*/}
                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:12}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                                <Text style={{fontSize:16,flex:3,textAlign:'left',}}>投保人:</Text>
                            </View>
                            {
                                (insurer.perName!==undefined&&insurer.perName!==null)?
                                    <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                        <Text style={{fontSize:15}}>{insurer.perName}</Text>
                                    </View>:
                                    <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                        <Text style={{fontSize:15}}>谁交保费</Text>
                                    </View>

                            }
                            <TouchableOpacity style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            marginBottom:0,borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                              onPress={()=>{
                                                  this.navigate2AppendLifeInsurer();
                                         console.log('选择投保人')
                                      }}>
                                <View>
                                    <Text style={{color:'#fff',fontSize:12}}>选择</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>

                    <TouchableOpacity style={{flex:1,width:width-60,marginLeft:30,marginBottom:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                  backgroundColor:'rgba(17, 17, 17, 0.6)',borderRadius:8}}
                                      onPress={()=>{
                                         this.saveLifeInsuranceIntend();
                                      }}>
                        <View>
                            <Text style={{fontSize:15,color:'#fff'}}>提交寿险意向</Text>
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
        accessToken:state.user.accessToken
    })
)(Life);

