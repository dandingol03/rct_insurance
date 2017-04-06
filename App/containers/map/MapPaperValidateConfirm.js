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
    ActivityIndicator,
    Modal
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import DateFilter from '../../filter/DateFilter';
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
            navigator.popToTop();
            // navigator.push({
            //     name: 'ServiceOrders',
            //     component: ServiceOrders,
            //     params: {
            //     }
            // })
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
            }else{

                Alert.alert('错误',
                    '该车管所没有对应的服务人员',
                    [{text:'确认',onPress:()=>{
                        this.goBack()
                    }}])
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

            this.props.dispatch(generateCarServiceOrder({carManage:carManage})).then((json)=>{

                if(json.re==1)
                {
                    var serviceName = '车驾管-审证';
                    var order=json.data;

                    this.props.dispatch(sendCustomMessage({order:order,serviceName:serviceName,category:'carManage'}))
                        .then((json)=>{
                            if(json.re==1)
                            {
                                this.setState({doingBusiness:false})
                                setTimeout(()=>{
                                    this.props.dispatch(selectTab({tabIndex:1}));
                                    this.props.dispatch(enableServiceOrdersRefresh());
                                    this.props.dispatch(enableServiceOrdersClear());

                                    Alert.alert('信息','服务订单生成成功,请到我的界面进行查看',[{text:'确认',onPress:()=>{

                                        this.navigate2ServiceOrders();
                                    }}])
                                },900)

                            }else{
                                this.setState({doingBusiness:false})
                                setTimeout(()=>{
                                    Alert.alert('错误',json.data)
                                },900)

                            }
                        })
                        .catch((e)=>{
                            this.setState({doingBusiness:false})
                            setTimeout(()=>{
                                Alert.alert('错误',e)
                            },900)
                        });
                }


            }).catch((e)=>{
                this.state.doingBusiness=false;
                setTimeout(()=>{
                    Alert.alert('错误',e)
                },900)
            })

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

            return this.props.dispatch(generateCarServiceOrderFee({carManage:carManage}));

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
                            this.setState({doingBusiness:false})
                            setTimeout(()=>{
                                Alert.alert(
                                    '错误',
                                    '请先选择取车地点'
                                );
                            },900)
                            return;
                        }
                    }

                    this.generateServiceOrder();

                }else{
                    this.setState({doingBusiness:false})
                    setTimeout(()=>{
                        Alert.alert(
                            '错误',
                            '服务订单的费用超过您现在的积分'
                        );
                    },900)
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

        this.setState({doingBusiness: true});

        if(this.state.carManage.estimateTime)
        {

            var {place,places,carManage}=this.state;
            if(place!==undefined&&place!==null)//已选车管所
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
                                this.setState({doingBusiness:false})
                            }else{
                                this.setState({doingBusiness:false})
                            }
                        }).catch((err)=>{
                            this.setState({doingBusiness:false})
                            setTimeout(()=>{
                                Alert.alert(
                                    '错误',
                                    err
                                );
                            },900)
                        });
                    }else{
                        this.applyCarServiceOrder();
                    }

            }


        }else{
            this.state.doingBusiness=false;
            Alert.alert(
                '错误',
                '请选择预约时间'
            );
        }


    }

    verifyDate(date)
    {

        this.state.selectTime=true;
        var {carManage}=this.state;

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
            carManage:{
                serviceType:'22'
            },
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
                                            {DateFilter.filter(state.carManage.estimateTime,'yyyy-mm-dd hh:mm')}
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
                                    format="YYYY-MM-DD HH:mm"
                                    minDate={new Date()}
                                    confirmBtnText="确认"
                                    cancelBtnText="Cancel"
                                    iconSource={null}
                                    onDateChange={(date) => {
                                        if(state.selectTime==false)
                                        {
                                            //TODO:校检date的合法性
                                            var reg=/([\d]{4})-([\d]{2})-([\d]{2})\s([\d]{2})\:([\d]{2})/;
                                            var re=reg.exec(date);
                                            if(re)
                                            {
                                                var tmpDate=new Date(re[1],parseInt(re[2])-1,re[3],re[4],re[5])
                                                this.verifyDate(tmpDate);
                                            }
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
                                               if(this.state.doingBusiness==false)
                                                    this.preCheck();
                                      }}
                        >
                            <Text style={{color:'#fff'}}>提交审证订单</Text>
                        </TouchableOpacity>

                    </View>


                    {/*loading模态框*/}
                    <Modal animationType={"fade"} transparent={true} visible={this.state.doingBusiness}>

                        <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                          onPress={()=>{
                                            //TODO:cancel this behaviour
                                          }}>

                            <View style={{width:width*2/3,height:80,backgroundColor:'rgba(60,60,60,0.9)',position:'relative',
                                        justifyContent:'center',alignItems:'center',borderRadius:6}}>
                                <ActivityIndicator
                                    animating={true}
                                    style={[styles.loader, {height: 40,position:'absolute',top:8,right:20,transform: [{scale: 1.6}]}]}
                                    size="large"
                                    color="#00BFFF"
                                />
                                <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                    <Text style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>
                                        生成审证订单...
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>


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
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'rgba(0,0,0,0.3)'
    },


});




module.exports = connect()(MapPaperValidateConfirm);

