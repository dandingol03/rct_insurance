/**
 * Created by danding on 17/3/17.
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
    Modal,
    ActivityIndicator
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import DateFilter from '../../filter/DateFilter';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import{
    fetchServicePersonByUnitId,
    createNewCustomerPlace,
    generateMaintainServiceOrderFee,
    generateCarServiceOrder,
    selectTab,
    enableServiceOrdersRefresh,
    disableServiceOrdersRefresh,
    enableServiceOrdersClear,
    updateCandidateState,
    fetchDestinationByPersonId,
    getServicePersonsByUnits,
    uploadAudio,
    uploadVideo,
    createVideoAttachment,
    updateServiceVideoAttachment
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
import AppendCustomPlace from '../../components/modal/AppendCustomPlace';


const wholeHeight=Dimensions.get('window').height-80;


const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;

class MapDailyConfirm extends Component{


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

            // navigator.resetTo({
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


    //上传视频
    videoCheck(orderId)
    {
        return new Promise((resolve, reject) => {
            if(this.state.maintain.destination.video)
            {
                this.props.dispatch(uploadVideo({
                    path:this.state.maintain.destination.audio,
                    filename:'serviceAudio.wav',
                    orderId:orderId
                })).then((json)=>{
                    if(json.re==1)
                    {
                        var path=json.data;
                        this.props.dispatch(createVideoAttachment({path:path,orderId:orderId})).then((json)=>{
                            if(json.re==1)
                            {
                                var videoAttachId=json.data;
                                this.props.dispatch(updateServiceVideoAttachment({videoAttachId:videoAttachId,orderId:orderId}))
                                    .then((json)=>{
                                        resolve(json)
                                    })
                            }else{
                                //TODO:....
                            }
                        })
                    }else{
                        reject(json.data)
                    }
                }).catch((e)=>{
                    reject(e)
                })
            }
        });
    }

    //上传音频
    audioCheck(orderId)
    {

        return new Promise((resolve, reject) => {
            if(this.state.maintain.description.audio)
            {
                //TODO:上传音频
                this.props.dispatch(uploadAudio({
                    path:this.state.maintain.destination.audio,
                    filename:'serviceAudio.wav',
                    orderId:orderId
                })).then((json)=>{
                    resolve({re:1})
                }).catch((e)=>{
                    reject(e)
                })
            }else{
                resolve({re:1})
            }
        });
    }


    //生成服务订单
    generateServiceOrder()
    {

        var {unit,units,maintain,verify}=this.state;

        //维修,判定serviceType

        if(unit!==undefined&&unit!==null)//维修厂
        {
            maintain.servicePlaceId=unit.placeId;
            if( maintain.servicePerson.servicePersonId!==undefined&& maintain.servicePerson.servicePersonId!==null){
                maintain.servicePersonId=maintain.servicePerson.servicePersonId;
            }
            maintain.orderState=2;

            this.props.dispatch(generateCarServiceOrder({maintain:maintain})).then((json)=>{

                if(json.re==1)
                {
                    var serviceName = '维修';
                    var order=json.data;

                    this.props.dispatch(sendCustomMessage({order:order,serviceName:serviceName,category:'maintain'}))
                        .then((json)=>{
                            if(json.re==1)
                            {

                                //TODO:需要测试
                                this.audioCheck(order.orderId).then((json)=>{

                                    if(json.re==1)
                                    {
                                           this.videoCheck(order.orderId).then((json)=>{

                                               if(json.re==1)
                                               {

                                                   this.props.dispatch(selectTab({tabIndex:1}));
                                                   this.props.dispatch(enableServiceOrdersRefresh());
                                                   this.props.dispatch(enableServiceOrdersClear());

                                                   Alert.alert('信息','服务订单生成成功',[{text:'确认',onPress:()=>{

                                                       this.navigate2ServiceOrders();
                                                   }}])
                                               }
                                           })
                                    }else{

                                    }
                                })

                            }
                        })
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
            this.props.dispatch(generateCarServiceOrder({maintain:maintain})).then((json)=>{
                if(json.re==1)
                {
                    order=json.data;
                    servicePersonIds=verify.servicePersonIds;
                    personIds=verify.personIds;
                }

                this.props.dispatch(updateCandidateState({order:order,servicePersonIds:servicePersonIds})).then((json)=>{
                    if(json.re==1)
                    {
                        var serviceName = '维修';
                        this.props.dispatch(sendCustomMessage({order:order,servicePersonIds:servicePersonIds,
                            serviceName:serviceName,isBatch:true})).then((json)=>{

                            if(json.re==1)
                            {

                                this.setState({doingBusiness:false})
                                setTimeout(()=>{
                                    this.props.dispatch(selectTab({tabIndex:0}));
                                    this.props.dispatch(enableServiceOrdersRefresh());
                                    this.props.dispatch(enableServiceOrdersClear());

                                    Alert.alert('信息','服务订单生成成功',[{text:'确认',onPress:()=>{

                                        this.navigate2ServiceOrders();
                                    }}])
                                },900)

                            }

                        })

                    }
                })

            }).catch((e)=>{
                this.setState({doingBusiness:false})
                setTimeout(()=>{
                    Alert.alert(
                        '错误',
                        e
                    );
                },900)
            });


        }


    }

    //维修订单提交
    applyMaintainServiceOrder()
    {
        var fee = null;
        var scoreBalance = null;
        var {maintain}=this.state;

        this.props.dispatch(fetchScoreBalance()).then((json)=>{

            if(json.re==1)
                scoreBalance=json.data;
            return this.props.dispatch(generateMaintainServiceOrderFee({maintain:maintain}));

        }).then((json)=>{

            if(json.re==1){
                fee=json.data;
                this.state.maintain.fee=fee;

                if(scoreBalance>=fee){
                    var flag=false;
                    if(maintain.isAgent==true)
                    {
                        if(maintain.destination==undefined||maintain.destination==null||
                            maintain.destination.address==undefined||maintain.destination.address==null)
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
            this.setState({doingBusiness:false})
            setTimeout(()=>{
                Alert.alert(
                    '错误',
                    e
                );
            },900)
        });

    }


    //提交前的预审
    preCheck()
    {

        this.setState({doingBusiness: true});

        if(this.state.maintain.estimateTime)
        {

            var {unit,units,maintain}=this.state;
            if(unit!==undefined&&unit!==null)//已选维修厂
            {
                var access = this.verifyServiceSegment(maintain.servicePerson);
                if (access == false) {
                    this.setState({doingBusiness:false})
                    setTimeout(()=>{
                        Alert.alert(
                            '错误',
                            '您所选的预约时间不在工作人员时段,请重新选择'
                        );
                    },900)
                    return ;
                }else{
                    if(maintain.destination!==undefined&&maintain.destination!==null&&
                        (maintain.destination.placeId==undefined||maintain.destination.placeId==null))
                    {

                        //TODO:create a new destination
                        createNewCustomerPlace({destination:maintain.destination}).then( (json)=> {
                            if(json.re==1) {
                                var customerPlace=json.data;
                                this.state.maintain.destination=customerPlace;

                                this.applyMaintainServiceOrder();
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
                        this.applyMaintainServiceOrder();
                    }
                }

            }else{
                //范围选择
                var servicePersonIds = [];
                var personIds = [];
                this.props.dispatch(getServicePersonsByUnits({units:units})).then((json)=>{
                    if(json.re==1)
                    {
                        //寻找符合时间段的服务人员
                        json.data.map((servicePerson,i)=>{
                            var flag=this.verifyServiceSegment(servicePerson);
                            if(flag==false)
                            {}else{
                                servicePersonIds.push(servicePerson.servicePersonId);
                                personIds.push(servicePerson.personId);
                            }
                        });

                        if(servicePersonIds.length==0)
                        {

                            this.setState({doingBusiness:false})
                            setTimeout(()=>{
                                Alert.alert(
                                    '错误',
                                    '你所选的预约时间没有合适的服务人员,请重新选择'
                                );
                            },900)
                            return {re:-1};

                        }else{
                            this.state.maintain.verify={
                                servicePersonIds:servicePersonIds,
                                personIds:personIds
                            };
                            return {re:1};
                        }

                    }
                }).then((json)=>{
                    if(json.re==1)
                    {
                        if(maintain.destination!==undefined&&maintain.destination!==null&&
                            (maintain.destination.placeId==undefined||maintain.destination.placeId==null))
                        {

                            //TODO:create a new destination
                            createNewCustomerPlace({destination:maintain.destination}).then( (json)=> {
                                if(json.re==1) {
                                    var customerPlace=json.data;
                                    this.state.carManage.destination=customerPlace;

                                    this.applyMaintainServiceOrder();
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
                            this.applyMaintainServiceOrder();
                        }
                    }
                }).catch((e)=>{
                    this.setState({doingBusiness:false})
                    setTimeout(()=>{
                        alert(e);
                    },900)

                })


            }


        }else{
            this.setState({doingBusiness:false})
            setTimeout(()=>{
                Alert.alert(
                    '错误',
                    '请选择预约时间'
                );
            },900)
        }


    }

    verifyDate(date)
    {

        this.state.selectTime=true;

        var {maintain}=this.state;

        var curDay=new Date();
        var hour=date.getHours();
        var day=date.getDay();
        var serviceHour=null;
        var serviceDay=null;

        if((date-curDay)>0&&curDay.getDate()!=date.getDate())
        {
            if(maintain.servicePerson!==undefined&& maintain.servicePerson!==null){

                var servicePerson=maintain.servicePerson;
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
                        this.state.maintain.estimateTime=date;
                        this.setState({maintain:this.state.maintain,selectTime:false});
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
                this.state.maintain.estimateTime=date;
                this.setState({maintain:this.state.maintain,selectTime:false});

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
        var unit=null;
        var units=null;
        var carInfo=null;
        if (contentInfo !== undefined && contentInfo !== null) {

            if(contentInfo.unit!==undefined&&contentInfo.unit!==null)
                unit = contentInfo.unit;
            if(contentInfo.units!==undefined&&contentInfo.units!==null)
                units=contentInfo.units;
        }



        this.state={
            contentInfo:contentInfo,
            unit:unit,
            units:units,
            actionSheetCallbacks:[],
            doingBusiness:false,
            carInfo:carInfo,
            selectTime:false,
            maintain:props.maintain!==undefined&&props.maintain!==null?props.maintain:null,
            modalVisible:false

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

        if(state.unit&&(state.maintain.servicePerson==undefined||state.maintain.servicePerson==null))
        {


            this.props.dispatch(fetchServicePersonByUnitId({placeId:state.unit.placeId})).then((json)=>{

                if(json.re==1)
                {
                    this.setState({maintain:Object.assign(this.state.maintain,{servicePerson:json.data})});
                }else{

                    Alert.alert(
                        '错误',
                        '该维修厂没有指定的服务人员'
                    );
                }

            }).catch((e)=>{
                Alert.alert(
                    '错误',
                    e
                );
            })

        }else{

        }



        return (
            <View style={styles.container}>

                <View style={{ flex: 1,justifyContent: 'flex-start',alignItems: 'center',
                        backgroundColor: '#F5FCFF',position:'relative',}}>

                    {/*header part*/}
                    <View style={{height:parseInt(height*54/667),padding: 10,paddingTop:20,width:width,backgroundColor:'rgba(17, 17, 17, 0.6)',
                borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                        <View style={[styles.row,{marginTop:0}]}>

                            <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                              onPress={()=>{
                                          this.goBack();
                                      }}
                            >
                                <Icon name="angle-left" size={40} color="#fff"></Icon>
                            </TouchableOpacity>

                            <View>
                                <Text style={{fontSize:17,flex:3,paddingLeft:40,textAlign:'center',color:'#fff'}}>提交维修订单</Text>
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
                                    state.maintain.estimateTime!==undefined&&state.maintain.estimateTime!==null?
                                        <Text style={{fontSize:13}}>
                                            {DateFilter.filter(state.maintain.estimateTime,'yyyy-mm-dd hh:mm')}
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
                                        dateInput:{height:24},
                                        dateTouchBody:{marginLeft:10,marginRight:10,height:22,borderWidth:0,backgroundColor:'#f79916'}
                                    }}
                                    date={this.state.issueDate}
                                    mode="datetime"
                                    placeholder="点击选择日期"
                                    format="YYYY-MM-DD HH:mm"
                                    minDate={new Date()}
                                    confirmBtnText="确认"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
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


                    {/*检测公司*/}
                    {
                        state.unit?
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
                                            {state.unit.name}
                                        </Text>
                                    </View>
                                </View>
                            </View>:null
                    }

                    {/*服务人员*/}
                    {
                        state.maintain.servicePerson?
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
                                            state.maintain.servicePerson?
                                                <Text style={{fontSize:14,color:'#222'}}>
                                                    {state.maintain.servicePerson.perName}
                                                </Text>:null
                                        }
                                    </View>
                                </View>
                            </View>:null
                    }



                    {/*取送车*/}

                    <View style={[styles.row,{width:width,padding:7,paddingHorizontal:12,alignItems:'center'}]}>

                        <View style={{paddingRight:12,alignItems:'center',width:80}}>
                            <Text style={{color:'#bf530c'}}>取送车</Text>
                        </View>


                        <View style={{width:120,}}>

                            <Switch
                                width={42}
                                height={25}
                                value={this.state.maintain.isAgent}
                                backgroundActive="#f79916"
                                backgroundInactive="#666"
                                onSyncPress={value =>{
                                   this.setState({maintain:Object.assign(this.state.maintain,{isAgent:value})})
                                }}/>

                        </View>

                    </View>



                    {/*选择取车地点*/}
                    {
                        this.state.maintain.isAgent==true?
                            <View style={[styles.row,{padding:2,paddingHorizontal:12,width:width,marginTop:4}]}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#bf530c',
                            padding:3,paddingHorizontal:4}}>


                                    <View style={{width:60,borderRightWidth:1,borderColor:'#bf530c',
                                    justifyContent:'center',alignItems:'center'}}>
                                        <Icon name="home" size={24} color="#bf530c"></Icon>
                                    </View>

                                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                        {
                                            state.maintain.destination?
                                                <Text style={{fontSize:13}}>
                                                    {state.maintain.destination.title}
                                                </Text>:
                                                <Text style={{color:'#aaa',fontSize:13}}>
                                                    地点
                                                </Text>
                                        }
                                    </View>

                                    <TouchableOpacity style={{width:100,justifyContent:'center',alignItems:'center',padding:7,
                                    paddingHorizontal:12,backgroundColor:'#f79916',borderRadius:6}}
                                                      onPress={()=>{
                                          props.dispatch(fetchDestinationByPersonId()).then((json)=>{
                                                var addresses=[];
                                                if(json.data)
                                                {
                                                    json.data.map((add)=>{
                                                       addresses.push(add.title);
                                                    });
                                                    this.setState({addresses:addresses});
                                                    this.state.actionSheetCallbacks.push(function(index){

                                                      if(index==0)
                                                      {
                                                        this.setState({modalVisible:true})
                                                      }else if(index>0)
                                                      {
                                                            var address=json.data[index-1];
                                                            this.setState({maintain:Object.assign(this.state.maintain,{destination:address})})
                                                      }else{
                                                      }
                                                    }.bind(this));

                                                    setTimeout(()=>{
                                                        this.ActionSheet.show();
                                                    },400);

                                                }
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
                                               if(this.state.doingBusiness==false)
                                                    this.preCheck();
                                      }}
                        >
                            <Text style={{color:'#fff'}}>提交维修订单</Text>
                        </TouchableOpacity>

                    </View>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}>


                        <View style={{marginTop: 22}}>
                            <AppendCustomPlace
                                onClose={(address)=>{
                                    if(address)
                                    {
                                         this.setState({modalVisible:!this.state.modalVisible,
                                                maintain:Object.assign(this.state.carManage,{destination:address})});

                                    }else{
                                         this.setState({modalVisible:!this.state.modalVisible});

                                    }
                                }}
                                dispatch={this.props.dispatch}
                            />
                        </View>

                    </Modal>



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
                                        生成维修订单...
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    <ActionSheet
                        ref={(o) => this.ActionSheet = o}
                        title="选择地点"
                        options={['取消','其他'].concat(this.state.addresses)}
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




module.exports = connect(state=>({
    maintain:state.maintain
}))(MapDailyConfirm);

