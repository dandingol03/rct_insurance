/**
 * Created by danding on 17/3/1.
 */
import React,{Component} from 'react';

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

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import DateFilter from '../../filter/DateFilter';
import {fetchAppliedOrderDetail} from '../../action/ServiceActions';
import {fetchServiceOrders} from '../../action/ServiceActions';

import _ from 'lodash';
import Evaluate from './Evaluate'


class ServiceOrderDetail extends Component{

    goBack(){
        this.props.fetchData();
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    fetchData()
    {
        this.props.dispatch(fetchAppliedOrderDetail({order:this.props.order})).then(function (json) {
            if(json.re==1)
            {
                if(json.data&&json.data.candidates)
                {
                    var _candidates=_.cloneDeep(json.data.candidates);
                    this.setState({detail:json.data,candidates:_candidates});
                }
                else
                    this.setState({detail:json.data});
            }
        }.bind(this))
    }


    renderRow(rowData,sectionId,rowId) {
        var lineStyle=null;

        if(rowData.checked==true)
            lineStyle={flex:1,backgroundColor:'rgb(106, 159, 220)'};
        else
            lineStyle={flex:1,backgroundColor:'#ccc'};

        var row=

            <View style={lineStyle}>

                <TouchableOpacity style={{flexDirection:'row',borderBottomWidth:1,borderColor:'rgba(210,210,210,0.4)',
                            justifyContent:'flex-start',padding:10}}
                                  onPress={()=>{
                                          //make this selected
                                          if(rowData.checked==true)
                                          {}
                                          else{
                                               var _candidates=_.cloneDeep(this.state.candidates);
                                               _candidates.map(function(candidate,i) {
                                                 if(candidate.candidateId==rowData.candidateId)
                                                     candidate.checked=true;
                                                 else
                                                     candidate.checked=false;
                                               });
                                               this.setState({candidates:_candidates});
                                          }
                                      }}>
                    <View style={{flex:1    ,alignItems:'flex-start'}}>


                        <Text style={{color:'#fff',marginBottom:10}}>
                            服务人员:{rowData.personInfo.perName}
                        </Text>

                        <Text style={{color:'#fff'}}>
                            地址:{rowData.unit.address}
                        </Text>

                    </View>


                    {
                        rowData.checked==true?
                            <View style={{width:80,alignItems:'center',justifyContent:'center'}}>
                                <Icon name="check" size={25} color="#fff"></Icon>
                            </View>:null
                    }
                </TouchableOpacity>
            </View>;

        return row;
    }

    agreeWithCandidate(){
        var candidate=null;
        this.state.detail.candidates.map(function(people,i) {
            if(people.checked==true)
                candidate=people;
        });
        if(candidate!=null)
        {
            //TODO:inject sendCustomMessage to servicePerson
            Proxy.post({
                url:Config.server+'/svr/request',
                headers: {
                    'Authorization': "Bearer " + this.state.accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request:'applyCarServiceOrderCandidate',
                    info: {
                        candidateId:candidate.candidateId
                    },
                }
            }, (res)=> {
                var json = res;
                if(json.re==1)
                {
                    Proxy.post({
                        url:Config.server+'/svr/request',
                        headers: {
                            'Authorization': "Bearer " + this.state.accessToken,
                            'Content-Type': 'application/json'
                        },
                        body: {
                            request:'sendCustomMessage',
                            info: {
                                orderId: this.props.order.orderId,
                                servicePersonId: candidate.servicePersonId,
                                type: 'to-servicePerson',
                                subType:'agreeWithCandidate',
                                orderNum:this.props.order.orderNum
                            }
                        }
                    }, (res)=> {
                        var json = res;
                        if(json.re==1)
                        {
                            Alert.alert(
                                '信息',
                                '接单成功，已通知服务人员',
                                [
                                    {text: 'OK', onPress: () => {
                                        this.goBack();
                                    }},
                                ]
                            )
                        }
                    }, (err) =>{
                        var str='';
                        for(var field in err)
                            str += field + ':' + err[field];
                        alert('error=\r\n' + str);
                    });
                }
            }, (err) =>{
                var str='';
                for(var field in err)
                    str += field + ':' + err[field];
                alert('error=\r\n' + str);
            });

        }else{
            Alert.alert(
                '信息',
                '请勾选服务人员后再点击同意',
                [
                    {text: 'OK', onPress: () => {
                        console.Log('...');
                    }},
                ]
            )
        }
    }


    cancleOrder(state){
        //取消"已下单"的订单
        if(this.props.order.orderState==1){
            //指定了服务人员
            if(this.props.order.servicePersonId!=undefined&&this.props.order.servicePersonId!=null) {
                var date = new Date();
                var timeDifference = parseInt((new Date(this.props.order.estimateTime)-date) /(1000*60*60))
                if (timeDifference >= 2) {

                    Proxy.post({
                        url:Config.server+'/svr/request',
                        headers: {
                            'Authorization': "Bearer " + this.state.accessToken,
                            'Content-Type': 'application/json'
                        },
                        body: {
                            request:'updateServiceOrderState',
                            info: {
                                orderState: state,
                                order: this.props.order,
                            },
                        }
                    }, (res)=> {
                        var json = res;
                        if(json.re==1)
                        {
                            Alert.alert(
                                '信息',
                                '订单取消成功',
                                [
                                    {text: 'OK', onPress: () => {
                                        this.goBack();
                                    }},
                                ]
                            )
                        }
                    }, (err) =>{
                        var str='';
                        for(var field in err)
                            str += field + ':' + err[field];
                        alert('error=\r\n' + str);
                    });

                }
                else {
                    alert("距离预约时间不足两小时，无法取消订单！");
                }
            }
            //未指定服务人员
            else{
                // 通知 candidate表中的服务人员
                var date = new Date();

                var timeDifference = parseInt((new Date(this.props.order.estimateTime)-date) /(1000*60*60))
                if (timeDifference >= 2) {

                    Proxy.post({
                        url:Config.server+'/svr/request',
                        headers: {
                            'Authorization': "Bearer " + this.state.accessToken,
                            'Content-Type': 'application/json'
                        },
                        body: {
                            request:'updateServiceOrderState',
                            info: {
                                orderState: state,
                                order: this.props.order,
                            },
                        }
                    }, (res)=> {
                        var json = res;
                        if(json.re==1)
                        {
                            var servicePersonIdObjs = json.data;
                            var servicePersonIds = [];
                            servicePersonIdObjs.map(function(servicePersonId,i) {
                                servicePersonIds.push(servicePersonId.servicePersonId);
                            })

                            Proxy.post({
                                url:Config.server+'/svr/request',
                                headers: {
                                    'Authorization': "Bearer " + this.state.accessToken,
                                    'Content-Type': 'application/json'
                                },
                                body: {
                                    request:'sendCustomMessage',
                                    info: {
                                        order: this.props.order,
                                        servicePersonIds: servicePersonIds,
                                        type: 'to-servicePerson'
                                    },
                                }
                            }, (res)=> {
                                var json = res;
                                if(json.re==1)
                                {
                                    Alert.alert(
                                        '信息',
                                        '订单取消成功',
                                        [
                                            {text: 'OK', onPress: () => {
                                                this.goBack();
                                            }},
                                        ]
                                    )
                                }
                            }, (err) =>{
                                var str='';
                                for(var field in err)
                                    str += field + ':' + err[field];
                                alert('error=\r\n' + str);
                            });

                        }
                    }, (err) =>{
                        var str='';
                        for(var field in err)
                            str += field + ':' + err[field];
                        alert('error=\r\n' + str);
                    });

                }
                else {
                    alert("距离预约时间不足两小时，无法取消订单！");
                }

            }
        }

        //取消服务中的订单（已有确定人员接单但还未执行））
        if(this.props.order.orderState==2){

            var date = new Date();
            var timeDifference = parseInt((new Date(this.props.order.estimateTime)-date) /(1000*60*60));
            if (timeDifference >= 2) {

                Proxy.post({
                    url:Config.server+'/svr/request',
                    headers: {
                        'Authorization': "Bearer " + this.state.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request:'updateServiceOrderState',
                        info: {
                            orderState: state,
                            order: this.props.order,
                        },
                    }
                }, (res)=> {
                    var json = res;
                    if(json.re==1)
                    {
                        Alert.alert(
                            '信息',
                            '订单取消成功',
                            [
                                {text: 'OK', onPress: () => {
                                    this.goBack();
                                }},
                            ]
                        )
                    }
                }, (err) =>{
                    var str='';
                    for(var field in err)
                        str += field + ':' + err[field];
                    alert('error=\r\n' + str);
                });

            }
            else {
                alert("距离预约时间不足两小时，无法取消订单！");
            }
        }
    }


    finishOrder(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'updateServiceOrderState',
                info: {
                    orderState: 3,
                    order: this.props.order,
                },
            }
        }, (res)=> {
            var json = res;
            if(json.re==1)
            {
                Proxy.post({
                    url:Config.server+'/svr/request',
                    headers: {
                        'Authorization': "Bearer " + this.state.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request:'insertFeePayInfo',
                        info: {
                            fee:this.props.order.fee,
                            orderId: this.props.order.orderId,
                            type:'service'
                        },
                    }
                }, (res)=> {
                    var json = res;
                    if(json.re==1)
                    {
                        Alert.alert(
                            '信息',
                            '订单已完成,是否现在进行评价',
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                                {text: 'OK', onPress: () => this.navigate2Evaluate(this.props.order)},
                            ]
                        )
                    }
                }, (err) =>{
                    var str='';
                    for(var field in err)
                        str += field + ':' + err[field];
                    alert('error=\r\n' + str);
                });
            }else{

                Alert.alert(
                    '信息',
                    '服务订单修改状态失败',
                    [
                        {text: 'OK', onPress: () => console.log('服务订单修改状态失败!')},
                    ]
                )
                return {re: -1};
            }
        }, (err) =>{
            var str='';
            for(var field in err)
                str += field + ':' + err[field];
            alert('error=\r\n' + str);
        });

    }

    navigate2Evaluate(order){

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'Evaluate',
                component: Evaluate,
                params: {
                    order:order
                }
            })
        }
    }


    constructor(props) {
        super(props);
        const { accessToken } = this.props;
        this.state={
            accessToken: accessToken,
            detail:null
        }
    }

    render() {

        var props=this.props;
        var state=this.state;

        var subServiceTypeMap={1:'机油,机滤',2:'检查制动系统,更换刹车片',3:'雨刷片更换',
            4:'轮胎更换',5:'燃油添加剂',6:'空气滤清器',7:'检查火花塞',8:'检查驱动皮带',9:'更换空调滤芯',10:'更换蓄电池,防冻液'};

        var serviceTypeMap={11:'维修-日常保养',12:'维修-故障维修',13:'维修-事故维修',
            21:'车驾管-审车',22:'车驾管-审证',23:'车驾管-接送机',24:'车驾管-接送站',
            31:'鈑喷'};

        var candidateList=null;

        if(this.props.order)
        {
            if(state.detail!==undefined&&state.detail!==null)
            {
                //渲染侯选列表
                if(state.candidates!==undefined&&state.candidates!==null)
                {
                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

                    candidateList=(
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(state.candidates)}
                            renderRow={this.renderRow.bind(this)}
                        />
                    );
                }

            }else {
                this.fetchData();
            }
        }


        return (

            <View style={styles.container}>

                {/*need to finish*/}
                <View style={{height:60,width:width,backgroundColor:'rgba(17, 17, 17, 0.6)',borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                    <View style={[styles.row,{marginTop:20}]}>

                        <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                          onPress={()=>{
                                          this.goBack();
                                      }}
                        >
                            <Icon name="angle-left" size={40} color="#fff"></Icon>
                        </TouchableOpacity>

                        {
                            props.order.orderState==1&&(props.order.servicePersonId==null||props.order.servicePersonId==undefined)?
                                <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12}}>
                                    <Text style={{color:'#fff',fontSize:17}}>订单详情</Text>
                                </View>:
                                <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12,paddingRight:90}}>
                                    <Text style={{color:'#fff',fontSize:17}}>订单详情</Text>
                                </View>
                        }

                        {
                            props.order.orderState==1&&(props.order.servicePersonId==null||props.order.servicePersonId==undefined)?
                                <TouchableOpacity style={{width:80,alignItems:'center',marginRight:20,backgroundColor:'#aaa',
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}
                                                  onPress={()=>{
                                          this.cancleOrder(-3);
                                      }}>
                                    <View>
                                        <Text style={{fontSize:12}}>订单取消</Text>
                                    </View>
                                </TouchableOpacity> :null
                        }


                    </View>
                </View>

                {/*body part*/}

                {
                    state.detail!==undefined&&state.detail!==null?
                        <View>
                            {
                                props.order.serviceType!='23'&&props.order.serviceType!='24'&&props.order.serviceType!='22'?
                                    <View style={{height:45,width:width-30,marginLeft:15,marginTop:20}}>
                                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                            <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14}}>
                                                    车牌号:
                                                </Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center',padding:12}}>
                                                {
                                                    props.order.carInfo!==null?
                                                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                                            {props.order.carInfo.carNum}
                                                        </Text>:null
                                                }

                                            </View>
                                        </View>
                                    </View>:null

                            }

                            <View style={{height:45,width:width-30,marginLeft:15}}>
                                <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                    <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14}}>
                                            服务类型:
                                        </Text>
                                    </View>

                                    <View style={{flex:1,alignItems:'flex-start',justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                            {state.detail.serviceName}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{height:45,width:width-30,marginLeft:15,marginTop:0}}>
                                <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                    <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14}}>
                                            预约时间:
                                        </Text>
                                    </View>

                                    <View style={{flex:1,alignItems:'flex-start',justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                            {DateFilter.filter(state.detail.estimateTime, 'yyyy-mm-dd') }
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{height:45,width:width-30,marginLeft:15,marginTop:0}}>
                                <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                    <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14}}>
                                            服务费:
                                        </Text>
                                    </View>

                                    <View style={{flex:1,alignItems:'flex-start',justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                            ${state.detail.fee}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {
                                state.detail.subServiceContent!==undefined&&state.detail.subServiceContent!==null&&state.detail.subServiceContent!=''?
                                    <View style={{height:45,width:width-30,marginLeft:15,marginTop:0}}>
                                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                            <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14}}>
                                                    服务内容:
                                                </Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                                    {state.detail.subServiceContent}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>:null
                            }


                            {
                                state.detail.servicePerson!==undefined&&state.detail.servicePerson!==null?
                                    <View style={{height:45,width:width-30,marginLeft:15,marginTop:0}}>
                                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                            <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14}}>
                                                    服务人员:
                                                </Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                                    {state.detail.servicePerson.perName}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>:null
                            }

                        </View>:null
                }


                {/*侯选人员列表*/}
                {
                    state.detail&&state.detail.candidates!==undefined&&state.detail.candidates!==null?
                        <View style={[styles.card,{flex:1,marginBottom:20,position:'relative',padding:0}]}>

                            <View style={{padding:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ddd'}}>
                                <Text>候选人员列表</Text>
                            </View>

                            <ScrollView style={{marginBottom:50,padding:8}}>
                                {candidateList}
                            </ScrollView>

                            {/*同意按钮*/}
                            <View style={[styles.row,{width:width,height:50,alignItems:'center',position:'absolute',bottom:10,justifyContent:'center'}]}>
                                <TouchableOpacity style={{width:140,backgroundColor:'#00f',borderRadius:8,padding:10,
                                        alignItems:'center'}}
                                                  onPress={()=>{
                                          this.agreeWithCandidate();
                                      }}
                                >
                                    <Text style={{color:'#fff'}}>同意</Text>
                                </TouchableOpacity>
                            </View>

                        </View>:null
                }


                {/*指定服务人员的已下单订单取消*/}
                {
                    props.order.orderState==1&&props.order.servicePersonId!==null&&props.order.servicePersonId!==undefined?

                        <View style={[styles.row,{width:width,height:50,paddingLeft:30,paddingRight:30,alignItems:'center',position:'absolute',bottom:10,justifyContent:'center'}]}>

                            <TouchableOpacity style={{flex:1,backgroundColor:'#387ef5',borderRadius:8,padding:10,margin:10,
                                        alignItems:'center'}}
                                              onPress={()=>{
                                           this.cancleOrder(-3);
                                      }}
                            >
                                <View>
                                    <Text style={{color:'#fff'}}>取消订单</Text>
                                </View>
                            </TouchableOpacity>

                        </View>:null


                }


                {/*服务中订单的取消和完成*/}
                {
                    props.order.orderState==2?

                        <View style={[styles.row,{width:width,height:50,alignItems:'center',position:'absolute',bottom:10,justifyContent:'center'}]}>

                            <TouchableOpacity style={{flex:1,backgroundColor:'#ef473a',borderRadius:8,padding:10,margin:10,
                                        alignItems:'center'}}
                                              onPress={()=>{
                                          this.cancleOrder(-3);
                                      }}
                            >
                                <View>
                                    <Text style={{color:'#fff'}}>取消</Text>
                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity style={{flex:1,backgroundColor:'#387ef5',borderRadius:8,padding:10,margin:10,
                                        alignItems:'center'}}
                                              onPress={()=>{
                                          this.finishOrder();
                                      }}
                            >
                                <View>
                                    <Text style={{color:'#fff'}}>完成</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null
                }

                {/*完成订单的评价*/}
                {
                    props.order.orderState==3?

                        <View style={[styles.row,{width:width,height:50,paddingLeft:30,paddingRight:30,alignItems:'center',position:'absolute',bottom:10,justifyContent:'center'}]}>

                            <TouchableOpacity style={{flex:1,backgroundColor:'#387ef5',borderRadius:8,padding:10,margin:10,
                                        alignItems:'center'}}
                                              onPress={()=>{
                                          this.navigate2Evaluate(state.detail);
                                      }}
                            >
                                <View>
                                    <Text style={{color:'#fff'}}>评价订单</Text>
                                </View>
                            </TouchableOpacity>

                        </View>:null


                }




            </View>
        )

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
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    rotate:{
        transform:[{rotate:'12deg'}]
    }

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(ServiceOrderDetail);

