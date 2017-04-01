/**
 * Created by danding on 17/3/29.
 */

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
    TouchableOpacity,
} from 'react-native';

import DatePicker from 'react-native-datepicker';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import{
    fetchServicePersonByPlaceId,
    createNewCustomerPlace,
    generateCarServiceOrderFee,
    generateCarServiceOrder,
    selectTab,
    enableServiceOrdersRefresh,
    disableServiceOrdersRefresh,
    enableServiceOrdersClear,
    updateCandidateState,
    getServicePersonsByPlaces
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

class MapPaperValidateConfirm extends Component{


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


    //获取车管所的服务人员信息
    fetchServicePersonByPlaceId()
    {
        var {place}=this.state;
        this.props.dispatch(fetchServicePersonByPlaceId({place:place})).then((json)=>{
            if(json.re==1)
            {
                var {carManage}=this.state;
                this.setState({carManage:Object.assign(carManage,{servicePerson:json.data})});
            }
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

        var {place,places,carManage,carInfo,verify}=this.state;
        carManage.carId=carInfo.carId;
        //审车----选择检测公司
        carManage.serviceType=22;
        if(place!==undefined&&place!==null)//已选车管所
        {
            carManage.servicePlaceId=place.placeId;
            if( carManage.servicePerson.servicePersonId!==undefined&& carManage.servicePerson.servicePersonId!==null){
                carManage.servicePersonId=carManage.servicePerson.servicePersonId;
            }
            carManage.orderState=2;

            this.props.dispatch(generateCarServiceOrder(carManage)).then((json)=>{

                if(json.re==1)
                {
                    var serviceName = '车驾管-审证';
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
            //批量选中维修厂
            var order = null;
            var servicePersonIds = [];
            var personIds = [];
            var {verify}=this.state.carManage;

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

                    var {place,places,carManage}=this.state;
                    if(place!==undefined&&place!==null)//已选检测公司
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
                        //范围选择
                        var servicePersonIds = [];
                        var personIds = [];
                        this.props.dispatch(getServicePersonsByPlaces({places:places}))
                            .then((json)=>{
                                if(json.re==1)
                                {
                                    //寻找符合时间段的服务人员
                                    json.data.map(function(servicePerson,i) {
                                        var flag=this.verifyServiceSegment(servicePerson);
                                        if(flag==false)
                                        {}else{
                                            servicePersonIds.push(servicePerson.servicePersonId);
                                            personIds.push(servicePerson.personId);
                                        }
                                    });


                                    if(servicePersonIds.length==0)
                                    {

                                        Alert.alert(
                                            '错误',
                                            '你所选的预约时间没有合适的服务人员,请重新选择'
                                        );
                                        return {re:-1};

                                    }else {
                                        this.state.carManage.verify={
                                            servicePersonIds:servicePersonIds,
                                            personIds:personIds
                                        };
                                        return {re:1};
                                    }
                                }
                            }).then((json)=>{
                            if(json.re==1)
                            {
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
                        }).catch((e)=>{
                            alert(e);
                        })

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

    verifyDate(_date)
    {

        this.state.selectTime=true;

        var {carManage}=this.state;

        var date=new Date(_date);
        var curDay=new Date();
        var hour=date.getHours();
        var day=date.getDay();
        var serviceHour=null;
        var serviceDay=null;

        if((date-curDay)>0&&curDay.getDate()!=date.getDate())
        {
            if(carManage.servicePerson!==undefined&& carManage.servicePerson!==null){

                var servicePerson=carManage.servicePerson;
                var serviceSegments=servicePerson.serviceSegments;
                serviceHour = parseInt(serviceSegments.substring(1, 2));
                serviceDay = parseInt(serviceSegments.substring(0, 1));

                var tip='周';
                switch (serviceDay) {
                    case 1:
                        tip+='一';
                        break;
                    case 2:
                        tip+='二';
                        break;
                    case 3:
                        tip+='三';
                        break;
                    case 4:
                        tip+='四';
                        break;
                    case 5:
                        tip+='五';
                        break;
                    case 6:
                        tip+='六';
                        break;
                    case 7:
                        tip+='日';
                        break;
                }
                switch(serviceHour)
                {
                    case 1:
                        tip+='上午';
                        break;
                    case 2:
                        tip+='下午';
                        break;
                }

                if(day==serviceDay)
                {
                    if(parseInt(hour/12)==serviceHour-1)
                    {
                        //TODO:make a change
                        this.state.carManage.estimateTime=date;
                        this.setState({carManage:this.state.carManage,selectTime:false});
                        return;
                    }else{
                        setTimeout(()=>{
                            Alert.alert('错误','您所选的日期时段不对,该服务人员的工作时段位于'+tip+',请重新选择',[{text:'确认',onPress:()=>{

                            }}])
                        },600);
                        this.setState({selectTime:false});
                    }

                }else{

                    setTimeout(()=>{
                        Alert.alert('错误','您所选的日期时段不对,该服务人员的工作时段位于'+tip+',请重新选择',[{text:'确认',onPress:()=>{

                        }}]);
                    },600)
                    this.setState({selectTime:false});
                }


            }else{
                this.state.carManage.estimateTime=date;
                this.setState({carManage:this.state.carManage,selectTime:false});

            }
        }else{

            setTimeout(()=>{
                Alert.alert('错误','您所选的日期必须在当天之后,请重新选择',[{text:'确认',onPress:()=>{

                }}]);
            },600)

            this.setState({selectTime:false});

        }

    }


    constructor(props) {
        super(props);

        var contentInfo=props.contentInfo;
        var place=null;
        var places=null;
        var carInfo=null;
        if (contentInfo !== undefined && contentInfo !== null) {

            if(contentInfo.place!==undefined&&contentInfo.place!==null)
                place=contentInfo.place;
            if(contentInfo.places!==undefined&&contentInfo.places!==null)
                places=contentInfo.places;

            if(contentInfo.carInfo!==undefined&&contentInfo.carInfo!==null)
                carInfo=contentInfo.carInfo;
            else
                carInfo={};
        }


        this.state={
            contentInfo:contentInfo,
            place:place,
            places:places,
            carManage:{},
            actionSheetCallbacks:[],
            doingBusiness:false,
            carInfo:carInfo,
            selectTime:false
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

        if(state.place&&(state.carManage.servicePerson==undefined||state.carManage.servicePerson==null))
        {
            this.fetchServicePersonByPlaceId();
        }else{

        }



        return (
            <View style={styles.container}>

                <View style={{ flex: 1,justifyContent: 'flex-start',alignItems: 'center',
                        backgroundColor: '#F5FCFF',position:'relative',}}>

                    {/*header part*/}
                    <View style={{height:40,width:width,backgroundColor:'rgba(120,120,120,0.2)',borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                        <View style={[styles.row,{marginTop:0}]}>

                            <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                              onPress={()=>{
                                          this.goBack();
                                      }}
                            >
                                <Icon name="angle-left" size={40} color="#bf530c"></Icon>
                            </TouchableOpacity>

                            <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12,marginLeft:12}}>
                                <Text style={{color:'#bf530c',fontWeight:'bold'}}>确认审证订单</Text>
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

                            <View style={{width:100,justifyContent:'center',alignItems:'center',padding:2,
                                    paddingHorizontal:12,backgroundColor:'#f79916',borderRadius:6}}>

                                <DatePicker
                                    style={{width:100,marginLeft:0}}
                                    customStyles={{
                                        placeholderText:{color:'#fff',fontSize:12},
                                        dateInput:{height:20},
                                        dateTouchBody:{height:24}
                                    }}
                                    date={this.state.issueDate}
                                    mode="datetime"
                                    placeholder="点击选择日期"
                                    format="YYYY-MM-DD hh:mm"
                                    minDate={new Date()}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    iconSource={null}
                                    onDateChange={(date) => {
                                        if(state.selectTime==false)
                                        {
                                            //TODO:校检date的合法性
                                            this.verifyDate(date);
                                        }else{
                                        }

                                    }}


                                />

                            </View>

                        </View>
                    </View>

                    {/*车管所*/}
                    <View style={[styles.row,{padding:2,paddingHorizontal:12,width:width,marginTop:4}]}>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#bf530c',
                            padding:5,paddingHorizontal:4}}>

                            <View style={{width:60,borderRightWidth:1,borderColor:'#bf530c',
                                    justifyContent:'center',alignItems:'center',paddingVertical:5}}>
                                <Text style={{color:'#bf530c',fontSize:14}} >
                                    车管所
                                </Text>
                            </View>

                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

                                <Text style={{fontSize:14,color:'#222'}}>
                                    {state.place.name}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.row,{width:width,padding:6,paddingHorizontal:12,alignItems:'center',
                            justifyContent:'center',marginTop:10}]}>
                        <TouchableOpacity style={{width:width*2/3,padding:9,paddingHorizontal:12,backgroundColor:'#11c1f3',
                                alignItems:'center',borderRadius:6}}
                                          onPress={()=>{
                                          this.preCheck();
                                      }}
                        >
                            <Text style={{color:'#fff'}}>提交审证订单</Text>
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




module.exports = connect()(MapPaperValidateConfirm);
