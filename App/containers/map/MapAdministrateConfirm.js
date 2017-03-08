
import React,{Component} from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    View,
    Alert,
    ListView,
    TouchableOpacity
} from 'react-native';

import DatePicker from 'react-native-datepicker';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import{
    fetchServicePersonByDetectUnitId,
    createNewCustomerPlace,
    generateCarServiceOrderFee,
    generateCarServiceOrder,
    selectTab,
    enableServiceOrdersRefresh,
    disableServiceOrdersRefresh,
    enableServiceOrdersClear,
    updateCandidateState
} from '../../action/ServiceActions';
import {
    fetchCarsNotInDetectState
} from '../../action/CarActions';

import {
    fetchScoreBalance
} from '../../action/UserActions';

import {
    sendCustomMessage
} from '../../action/JpushActions';


import ActionSheet from 'react-native-actionsheet';
import Switch from 'react-native-switch-pro'

import ServiceOrders from '../service/ServiceOrders';



const wholeHeight=Dimensions.get('window').height-80;


const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;

class MapAdministrateConfirm extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2ServiceOrders()
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'ServiceOrders',
                component: ServiceOrders,
                params: {
                }
            })
        }
    }


    _handlePress(index)
    {
        //如果回调队列不为空
        if(this.state.actionSheetCallbacks!==undefined&&this.state.actionSheetCallbacks!==null)
        {
            this.state.actionSheetCallbacks.map(function (callback,i) {
                callback(index-1);
            });
        }
        this.state.actionSheetCallbacks=[];
    }


    //周边搜索
    fetchServicePersonByDetectUnitId()
    {
        var {detectUnit}=this.state;
        this.props.dispatch(fetchServicePersonByDetectUnitId({detectUnit:detectUnit})).then((json)=>{
            var {carManage}=this.state;
            carManage.servicePerson=json.data;
            this.setState({carManage:carManage});
        });
    }


    //服务时间段校检
    verifyServiceSegment(servicePerson)
    {
        var {carManage}=this.state;
        var estimateTime=carManage.estimateTime;
        var day=estimateTime.getDay();
        var hour=estimateTime.getHours();
        var serviceSegments=servicePerson.serviceSegments;
        var flag=false;
        if(day==parseInt(serviceSegments.substring(0,1)))
        {
            var seg=serviceSegments.substring(1,2);
            switch(seg)
            {
                case '1':
                    if(hour<=12)
                        flag=true;
                    break;
                case '2':
                    if(hour>12)
                        flag=true;
                    break;
            }
        }
        return flag;
    }


    //生成服务订单
    generateServiceOrder()
    {

        var {detectUnit,detectUnites,carManage,carInfo,verify}=this.state;
        carManage.carId=carInfo.carId;
        //审车----选择检测公司
        carManage.serviceType=21;
        if(detectUnit!==undefined&&detectUnit!==null)//已选检测公司
        {
            carManage.servicePlaceId=detectUnit.placeId;
            if( carManage.servicePerson.servicePersonId!==undefined&& carManage.servicePerson.servicePersonId!==null){
                carManage.servicePersonId=carManage.servicePerson.servicePersonId;
            }
            carManage.orderState=2;

            this.props.dispatch(generateCarServiceOrder(carManage)).then((json)=>{

                if(json.re==1)
                {
                    var serviceName = '车驾管-审车';
                    var order=json.data;

                    this.props.dispatch(sendCustomMessage({order:order,serviceName:serviceName,category:'carManage'}))
                        .then((json)=>{
                            if(json.re==1)
                            {

                                //TODO:make dispatch
                                this.props.dispatch(selectTab({tabIndex:1}));
                                this.props.dispatch(enableServiceOrdersRefresh());
                                this.props.dispatch(enableServiceOrdersClear());

                                Alert.alert('信息','服务订单生成成功',[{text:'确认',onPress:()=>{

                                    this.navigate2ServiceOrders();
                                }}])



                            }
                        })
                        .catch((e)=>{

                        });
                }


            }).catch((e)=>{
                Alert.alert(
                    '错误',
                    e
                );
            })

        }else{
            //未选定维修厂,批量选中
            var order = null;
            var servicePersonIds = [];
            var personIds = [];
            this.props.dispatch(generateCarServiceOrder(carManage)).then((json)=>{
                if(json.re==1)
                {
                    order=json.data;
                    servicePersonIds=verify.servicePersonIds;
                    personIds=verify.personIds;
                }

                this.props.dispatch(updateCandidateState(order,servicePersonIds)).then((json)=>{
                    if(json.re==1)
                    {
                        var serviceName = '车驾管-审车';
                        this.props.dispatch(sendCustomMessage({order:order,servicePersonIds:servicePersonIds,
                            serviceName:serviceName,isBatch:true})).then((json)=>{

                            if(json.re==1)
                            {

                                this.state.doingBusiness=false;
                                this.props.dispatch(selectTab({tabIndex:0}));
                                this.props.dispatch(enableServiceOrdersRefresh());
                                this.props.dispatch(enableServiceOrdersClear());

                                Alert.alert('信息','服务订单生成成功',[{text:'确认',onPress:()=>{

                                    this.navigate2ServiceOrders();
                                }}])

                            }

                        }).catch((e)=>{

                        });

                    }
                })

            }).catch((e)=>{
                Alert.alert(
                    '错误',
                    e
                );
            });


        }


    }

    //审车订单提交
    applyCarServiceOrder()
    {
        var fee = null;
        var scoreBalance = null;
        var {carManage}=this.state;

        this.props.dispatch(fetchScoreBalance()).then((json)=>{

            if(json.re==1)
                scoreBalance=json.data;

            return this.props.dispatch(generateCarServiceOrderFee());

        }).then((json)=>{

            if(json.re==1){
                fee=json.data;
                this.state.carManage.fee=fee;

                if(scoreBalance>=fee){
                    var flag=false;
                    if(carManage.isAgent==true)
                    {
                        if(carManage.destination==undefined||carManage.destination==null||
                            carManage.destination.address==undefined||carManage.destination.address==null)
                        {
                            this.state.doingBusiness=false;
                            Alert.alert(
                                '错误',
                                '请先选择取车地点'
                            );
                            return;
                        }
                    }

                    this.generateServiceOrder();

                }else{
                    this.state.doingBusiness=false;

                    Alert.alert(
                        '错误',
                        '服务订单的费用超过您现在的积分'
                    );
                }


            }

        }).catch((e)=>{
            Alert.alert(
                '错误',
                e
            );
        });

    }


    //提交前的预审
    preCheck()
    {
        //业务不处于进行中
        if(this.state.doingBusiness==false)
        {
            this.state.doingBusiness=true;
            if(this.state.estimateTime)
            {
                if(this.state.carInfo&&this.state.carInfo.carId)
                {
                    var {detectUnit,detectUnites,carManage}=this.state;
                    if(detectUnit!==undefined&&detectUnit!==null)//已选检测公司
                    {
                        var access = this.verifyServiceSegment(carManage.servicePerson);
                        if (access == false) {
                            Alert.alert(
                                '错误',
                                '您所选的预约时间不在工作人员时段,请重新选择'
                            );
                            return ;
                        }else{
                            if(carManage.destination!==undefined&&carManage.destination!==null&&
                                (carManage.destination.placeId==undefined||carManage.destination.placeId==null))
                            {

                                //TODO:create a new destination
                                createNewCustomerPlace({destination:carManage.destination}).then( (json)=> {
                                    if(json.re==1) {
                                        var customerPlace=json.data;
                                        this.state.carManage.destination=customerPlace;

                                        this.applyCarServiceOrder();
                                    }else if(json.re==2) {
                                        this.state.doingBusiness=false;
                                    }else{
                                        this.state.doingBusiness=false;
                                    }
                                }).catch((err)=>{
                                    Alert.alert(
                                        '错误',
                                        err
                                    );
                                });
                            }else{
                                this.applyCarServiceOrder();
                            }


                        }




                    }else{

                    }

                }else{
                    Alert.alert(
                        '错误',
                        '请先选择车辆'
                    );
                }
            }else{
                Alert.alert(
                    '错误',
                    '请选择预约时间'
                );
            }

        }else{

        }
    }


    constructor(props) {
        super(props);

        var contentInfo=props.contentInfo;
        var detectUnit=null;
        var detectUnites=null;
        var carInfo=null;
        if (contentInfo !== undefined && contentInfo !== null) {

            if(contentInfo.detectUnit!==undefined&&contentInfo.detectUnit!==null)
                detectUnit = contentInfo.detectUnit;
            if(contentInfo.detectUnites!==undefined&&contentInfo.detectUnites!==null)
                detectUnites=contentInfo.detectUnites;
            if(contentInfo.carInfo!==undefined&&contentInfo.carInfo!==null)
                carInfo=contentInfo.carInfo;
            else
                carInfo={};
        }


        this.state={
            contentInfo:contentInfo,
            detectUnit:detectUnit,
            detectUnites:detectUnites,
            carManage:{},
            actionSheetCallbacks:[],
            doingBusiness:false,
            carInfo:carInfo
        }

    }

    render() {

        var props=this.props;
        var state=this.state;
        var title=''



        var tags=null;
        var results=null;


        var mapWholeStyle=null;
        var panelScaffoldedStyle=null;
        if(state.isScaffold)
        {
            mapWholeStyle={height:wholeHeight};
            panelScaffoldedStyle={height:0};
        }

        if(state.detectUnit&&(state.carManage.servicePerson==undefined||state.carManage.servicePerson==null))
        {
            this.fetchServicePersonByDetectUnitId();
        }else{

        }



        return (
            <View style={styles.container}>

                <View style={{ flex: 1,justifyContent: 'flex-start',alignItems: 'center',
                        backgroundColor: '#F5FCFF',position:'relative',}}>

                    {/*header part*/}
                    <View style={{height:60,width:width,backgroundColor:'rgba(120,120,120,0.2)',borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                        <View style={[styles.row,{marginTop:20}]}>

                            <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                              onPress={()=>{
                                          this.goBack();
                                      }}
                            >
                                <Icon name="angle-left" size={40} color="#bf530c"></Icon>
                            </TouchableOpacity>

                            <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12,marginLeft:12}}>
                                <Text style={{color:'#bf530c',fontWeight:'bold'}}>选择检测公司</Text>
                            </View>

                            <View style={{width:80,alignItems:'center',marginRight:20,
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}>

                            </View>

                        </View>
                    </View>


                    {/*服务时间*/}
                    <View style={[styles.row,{padding:2,paddingHorizontal:12,width:width,marginTop:20}]}>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#bf530c',
                            padding:3,paddingHorizontal:4}}>


                            <View style={{width:60,borderRightWidth:1,borderColor:'#bf530c',
                                    justifyContent:'center',alignItems:'center'}}>
                                <Icon name="calendar" size={20} color="#bf530c"></Icon>
                            </View>

                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                {
                                    state.carManage.estimateTime!==undefined&&state.carManage.estimateTime!==null?
                                        <Text style={{fontSize:13}}>
                                            {state.carManage.estimateTime}
                                        </Text>:
                                        <Text style={{color:'#aaa',fontSize:13}}>
                                            服务时间
                                        </Text>
                                }
                            </View>

                            <View style={{width:120,justifyContent:'center',alignItems:'center',padding:2,
                                    paddingHorizontal:12,backgroundColor:'#f79916',borderRadius:6}}>

                                <DatePicker
                                    style={{width:100,marginLeft:10}}
                                    customStyles={{
                                        placeholderText:{color:'#fff',fontSize:12},
                                        dateInput:{height:20},
                                        dateTouchBody:{height:24}
                                    }}
                                    date={this.state.issueDate}
                                    mode="datetime"
                                    placeholder="点击选择日期"
                                    format="YYYY-MM-DD"
                                    minDate="2016-05-01"
                                    maxDate="2016-12-30"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    iconSource={null}
                                    onDateChange={(date) => {
                                        //TODO:校检date的合法性
                                        this.state.carManage.estimateTime=date;
                                        this.setState({carManage:this.state.carManage});
                                    }}
                                />

                            </View>

                        </View>
                    </View>


                    {/*检测公司*/}
                    <View style={[styles.row,{padding:2,paddingHorizontal:12,width:width,marginTop:4}]}>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#bf530c',
                            padding:5,paddingHorizontal:4}}>


                            <View style={{width:60,borderRightWidth:1,borderColor:'#bf530c',
                                    justifyContent:'center',alignItems:'center',paddingVertical:5}}>
                                <Text style={{color:'#bf530c',fontSize:14}} >
                                    检测公司
                                </Text>
                            </View>

                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

                                <Text style={{fontSize:14,color:'#222'}}>
                                    {state.detectUnit.name}
                                </Text>

                            </View>



                        </View>
                    </View>

                    {/*服务人员*/}
                    <View style={[styles.row,{padding:2,paddingHorizontal:12,width:width,marginTop:4}]}>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#bf530c',
                            padding:5,paddingHorizontal:4}}>


                            <View style={{width:60,borderRightWidth:1,borderColor:'#bf530c',
                                    justifyContent:'center',alignItems:'center',paddingVertical:5}}>
                                <Text style={{color:'#bf530c',fontSize:14}} >
                                    服务人员
                                </Text>
                            </View>

                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

                                {
                                    state.carManage.servicePerson?
                                        <Text style={{fontSize:14,color:'#222'}}>
                                            {state.carManage.servicePerson.perName}
                                        </Text>:null
                                }

                            </View>

                        </View>
                    </View>

                    {/*选择车*/}
                    <View style={[styles.row,{padding:2,paddingHorizontal:12,width:width,marginTop:4}]}>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#bf530c',
                            padding:3,paddingHorizontal:4}}>


                            <View style={{width:60,borderRightWidth:1,borderColor:'#bf530c',
                                    justifyContent:'center',alignItems:'center'}}>
                                <Icon name="car" size={22} color="#bf530c"></Icon>
                            </View>

                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                {
                                    state.carInfo?
                                        <Text style={{fontSize:13}}>
                                            {state.carInfo.carNum}
                                        </Text>:
                                        <Text style={{color:'#aaa',fontSize:13}}>
                                            车牌号
                                        </Text>
                                }
                            </View>

                            <TouchableOpacity style={{width:100,justifyContent:'center',alignItems:'center',padding:7,
                                    paddingHorizontal:12,backgroundColor:'#f79916',borderRadius:6}}
                                              onPress={()=>{
                                          props.dispatch(fetchCarsNotInDetectState()).then((json)=>{
                                                var cars=[];
                                                if(json.data)
                                                {
                                                    json.data.map((car)=>{
                                                       cars.push(car.carNum);
                                                    });
                                                }
                                                this.setState({cars:cars});
                                                setTimeout(()=>{
                                                    this.ActionSheet.show();
                                                },400);

                                          });
                                      }}>
                                <Text style={{color:'#fff',fontSize:12}}>
                                    选择车辆
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    {/*取送车*/}

                    <View style={[styles.row,{width:width,padding:7,paddingHorizontal:12,alignItems:'center'}]}>

                        <View style={{paddingRight:12,alignItems:'center',width:80}}>
                            <Text style={{color:'#bf530c'}}>取送车</Text>
                        </View>


                        <View style={{width:120,}}>

                                <Switch
                                    width={42}
                                    height={25}
                                    value={this.state.carManage.isAgent}
                                    backgroundActive="#f79916"
                                    backgroundInactive="#666"
                                    onSyncPress={value =>{
                                   this.setState({carManage:Object.assign(this.state.carManage,{isAgent:value})})
                                }}/>

                        </View>

                        {/*<Switch activeButtonColor="#fff"   inactiveButtonPressedColor="#666" activeBackgroundColor="#bf530c"*/}
                                {/*onChangeState={(toggle)=>{*/}

                                  {/*console.log(toggle);*/}
                                {/*this.setState({carManage:Object.assign(this.state.carManage,{isAgent:toggle})})*/}
                        {/*}}*/}

                                {/*onPress={(status)=>{*/}
                                   {/*alert(status);*/}
                                {/*}}*/}
                        {/*/>*/}
                    </View>



                    {/*选择取车地点*/}
                    {
                        this.state.carManage.isAgent==true?
                            <View style={[styles.row,{padding:2,paddingHorizontal:12,width:width,marginTop:4}]}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#bf530c',
                            padding:3,paddingHorizontal:4}}>


                                    <View style={{width:60,borderRightWidth:1,borderColor:'#bf530c',
                                    justifyContent:'center',alignItems:'center'}}>
                                        <Icon name="home" size={24} color="#bf530c"></Icon>
                                    </View>

                                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                        {
                                            state.carManage.destination?
                                                <Text style={{fontSize:13}}>
                                                    {state.carManage.destination.title}
                                                </Text>:
                                                <Text style={{color:'#aaa',fontSize:13}}>
                                                    地点
                                                </Text>
                                        }
                                    </View>

                                    <TouchableOpacity style={{width:100,justifyContent:'center',alignItems:'center',padding:7,
                                    paddingHorizontal:12,backgroundColor:'#f79916',borderRadius:6}}
                                                      onPress={()=>{
                                          props.dispatch(fetchCarsNotInDetectState()).then((json)=>{
                                                var cars=[];
                                                if(json.data)
                                                {
                                                    json.data.map((car)=>{
                                                       cars.push(car.carNum);
                                                    });
                                                }
                                                this.setState({cars:cars});
                                                setTimeout(()=>{
                                                    this.ActionSheet.show();
                                                },400);

                                          });
                                      }}>
                                        <Text style={{color:'#fff',fontSize:12}}>
                                            选择取车地点
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>:null
                    }



                    <View style={[styles.row,{width:width,padding:6,paddingHorizontal:12,alignItems:'center',
                            justifyContent:'center',marginTop:10}]}>
                        <TouchableOpacity style={{width:width*2/3,padding:9,paddingHorizontal:12,backgroundColor:'#11c1f3',
                                alignItems:'center',borderRadius:6}}
                                          onPress={()=>{
                                          this.preCheck();
                                      }}
                        >
                            <Text style={{color:'#fff'}}>提交审车订单</Text>
                        </TouchableOpacity>

                    </View>



                    <ActionSheet
                        ref={(o) => this.ActionSheet = o}
                        title="选择车辆"
                        options={['取消'].concat(this.state.cars)}
                        cancelButtonIndex={CANCEL_INDEX}
                        onPress={this._handlePress.bind(this)}
                    />

                </View>




            </View>
        )
    }

    componentDidMount() {

    }


    componentWillUnmount() {

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer:{
        marginTop: 30
    },
    popoverContent: {
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText:{
        color:'#444',
        marginLeft:14,
        fontWeight:'bold'
    },
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        height: 150,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    rotate:{
        transform:[{rotate:'12deg'}]
    },
    map: {
        width: Dimensions.get('window').width,
        height: 250,
        marginBottom: 0
    },
    panel:{
        height:Dimensions.get('window').height-305
    },
    appleSwitch: {
        marginTop: 0,
        marginBottom: 0,
    }


});




module.exports = connect()(MapAdministrateConfirm);
