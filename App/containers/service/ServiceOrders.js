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
import ServiceOrderDetail from './ServiceOrderDetail';
import {fetchServiceOrders} from '../../action/ServiceActions';
import _ from 'lodash';


class ServiceOrders extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2ServiceOrderDetail(order)
    {

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ServiceOrderDetail',
                component: ServiceOrderDetail,
                params: {
                    order:order
                }
            })
        }
    }

    fetchData()
    {
        this.props.dispatch(fetchServiceOrders()).then(function (json) {
            if(json.re==1)
            {
                console.log('...');
            }
        });

    }

    appliedRender(rowData,sectionId,rowId)
    {
        var lineStyle=null;

        lineStyle={flex:1,backgroundColor:'transparent',paddingLeft:4,paddingRight:4};

        var row=

            <View style={lineStyle}>

                <TouchableOpacity style={{flexDirection:'row',borderBottomWidth:1,borderColor:'rgba(210,210,210,0.4)',borderLeftWidth:1,borderRightWidth:1,
                            justifyContent:'flex-start',padding:10}}
                                  onPress={()=>{
                                          this.navigate2ServiceOrderDetail(rowData);
                                      }}>


                    <View style={{flex:1,alignItems:'center'}}>
                        {
                            rowData.estimateTime !== undefined && rowData.estimateTime !== null && rowData.estimateTime !== '' ?
                                <Text style={{color:'#222',fontSize:13}}>
                                    {DateFilter.filter(rowData.estimateTime, 'yyyy-mm-dd') }
                                </Text>:
                                <Text style={{color:'#222',fontSize:13}}>
                                    ----
                                </Text>
                        }
                    </View>

                    <View style={{flex:3,alignItems:'center'}}>
                        <Text style={{color:'#222',fontSize:13}}>
                            订单号:{rowData.orderNum}
                        </Text>
                        <Text style={{color:'#222',fontSize:13}}>
                            类型:{rowData.serviceName}
                        </Text>

                    </View>

                    <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}}>

                        {
                            rowData.candidateState==true?
                                <View style={[styles.rotate,{borderWidth:1,borderColor:'#ff4f39',borderRadius:4,
                                    paddingVertical:4,paddingHorizontal:6,}]}>
                                    <Text style={{color:'#222',fontSize:12}}>
                                        已接单
                                    </Text>
                                </View>:
                                <Text style={{color:'#222'}}>
                                    详细
                                </Text>
                        }
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>;

        return row;
    }


    handlingRender(rowData,sectionId,rowId)
    {
        var lineStyle=null;

        lineStyle={flex:1,backgroundColor:'transparent',paddingLeft:4,paddingRight:4};

        var row=

            <View style={lineStyle}>

                <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'rgba(210,210,210,0.4)',borderLeftWidth:1,borderRightWidth:1,
                            justifyContent:'flex-start',padding:10}}>


                    <View style={{flex:1,alignItems:'center'}}>
                        {
                            rowData.estimateTime !== undefined && rowData.estimateTime !== null && rowData.estimateTime !== '' ?
                                <Text style={{color:'#222',fontSize:12}}>
                                    {DateFilter.filter(rowData.estimateTime, 'yyyy-mm-dd') }
                                </Text>:
                                <Text style={{color:'#222',fontSize:12}}>
                                    ----
                                </Text>
                        }
                    </View>

                    <View style={{flex:3,alignItems:'center'}}>
                        <Text style={{color:'#222',fontSize:13}}>
                            订单号:{rowData.orderNum}
                        </Text>
                        <Text style={{color:'#222',fontSize:13}}>
                            类型:{rowData.serviceName}
                        </Text>

                    </View>

                    <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#222',fontSize:13}}>
                            详细
                        </Text>
                        <Icon name="angle-right" size={36} color="#222" style={{marginLeft:8}}></Icon>
                    </TouchableOpacity>
                </View>
            </View>;

        return row;
    }


    finishedRender(rowData,sectionId,rowId)
    {
        var lineStyle=null;

        lineStyle={flex:1,backgroundColor:'transparent',paddingLeft:12,paddingRight:12};

        var row=

            <View style={lineStyle}>

                <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'rgba(210,210,210,0.4)',borderLeftWidth:1,borderRightWidth:1,
                            justifyContent:'flex-start',padding:10}}>


                    <View style={{flex:1,alignItems:'center'}}>
                        {
                            rowData.estimateTime !== undefined && rowData.estimateTime !== null && rowData.estimateTime !== '' ?
                                <Text style={{color:'#222',fontSize:13}}>
                                    {DateFilter.filter(rowData.estimateTime, 'yyyy-mm-dd') }
                                </Text>:
                                <Text style={{color:'#222',fontSize:13}}>
                                    ----
                                </Text>
                        }
                    </View>

                    <View style={{flex:3,alignItems:'center'}}>
                        <Text style={{color:'#222',fontSize:13}}>
                            订单号:{rowData.orderNum}
                        </Text>
                        <Text style={{color:'#222',fontSize:13}}>
                            类型:{rowData.serviceName}
                        </Text>

                    </View>

                    <TouchableOpacity style={{flex:1,alignItems:'center'}}>
                        <Text style={{color:'#222'}}>
                            详细
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>;

        return row;
    }


    constructor(props) {
        super(props);
        this.state={
            personInfo:props.personInfo,
            selectedTab:0,
            feePayInfo : null
        }

    }

    render() {

        var props=this.props;
        var state=this.state;


        var appliedList=null;
        var handlingList=null;
        var finishedList=null;

        var subServiceTypeMap={1:'机油,机滤',2:'检查制动系统,更换刹车片',3:'雨刷片更换',
            4:'轮胎更换',5:'燃油添加剂',6:'空气滤清器',7:'检查火花塞',8:'检查驱动皮带',9:'更换空调滤芯',10:'更换蓄电池,防冻液'};

        var serviceTypeMap={11:'维修-日常保养',12:'维修-故障维修',13:'维修-事故维修',
            21:'车驾管-审车',22:'车驾管-审证',23:'车驾管-接送机',24:'车驾管-接送站',
            31:'鈑喷'};

        if(this.props.orders!==undefined&&this.props.orders!==null&&this.props.orders.length>0)
        {

            var _orders=_.cloneDeep(this.props.orders);
            var orders1=[];
            var orders2=[];
            var orders3=[];
            _orders.map(function (order,i) {
                order.serviceName=serviceTypeMap[order.serviceType];
                var subServiceTypes=order.subServiceTypes;
                var serviceContent='';
                if(subServiceTypes!==undefined&&subServiceTypes!==null)
                {
                    var types=subServiceTypes.split(',');
                    types.map(function(type,i) {
                        serviceContent+=subServiceTypeMap[type];;
                    });
                    order.subServiceContent=serviceContent;
                }

                var date=new Date(order.estimateTime);
                order.time=date.getFullYear().toString()+'-'
                    +date.getMonth().toString()+'-'+date.getDate().toString();

                if(order.orderState==1)
                    orders1.push(order);
                if(order.orderState==2)
                    orders2.push(order);
                if(order.orderState==3)
                    orders3.push(order);
            })





            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            appliedList=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(orders1)}
                        renderRow={this.appliedRender.bind(this)}
                    />
                </ScrollView>);

            handlingList=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(orders2)}
                        renderRow={this.handlingRender.bind(this)}
                    />
                </ScrollView>);

            finishedList=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(orders3)}
                        renderRow={this.finishedRender.bind(this)}
                    />
                </ScrollView>);



        }else{
            this.fetchData();
        }



        return (
            <View style={styles.container}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>

                {/*need to finish*/}
                <View style={{height:60,width:width,backgroundColor:'rgba(17, 17, 17, 0.6)',borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                    <View style={[styles.row,{marginTop:20}]}>

                        <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                          onPress={()=>{
                                          this.goBack();
                                      }}
                        >
                            <Icon name="angle-left" size={30} color="#fff"></Icon>
                        </TouchableOpacity>

                        <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12}}>
                            <Text style={{color:'#fff'}}>我的积分</Text>
                        </View>

                        <View style={{width:80,alignItems:'center',marginRight:20,backgroundColor:'#aaa',
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}>
                            <Text style={{fontSize:12}}>积分提现</Text>
                        </View>

                    </View>
                </View>



                {/*scroll tab pages*/}
                <ScrollableTabView
                    style={{marginTop: 20, }}
                    initialPage={1}
                    renderTabBar={() =>  <FacebookTabBar />}
                >
                    <View tabLabel="已下单">

                        {/*list header*/}
                        <View style={{height:25,width:width,paddingLeft:4,paddingRight:4,marginTop:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(210,210,210,0.4)',padding:6,
                                    borderTopLeftRadius:4,borderTopRightRadius:4}}>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>预约时间</Text>
                                </View>

                                <View style={{flex:2,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>服务内容</Text>
                                </View>


                            </View>
                        </View>

                        {appliedList}
                    </View>
                    <View tabLabel="服务中">

                        {/*list header*/}
                        <View style={{height:25,width:width,paddingLeft:4,paddingRight:4,marginTop:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(210,210,210,0.4)',padding:6,
                                    borderTopLeftRadius:4,borderTopRightRadius:4}}>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>预约时间</Text>
                                </View>

                                <View style={{flex:3,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>服务内容</Text>
                                </View>

                                <View style={{width:50}}></View>

                            </View>
                        </View>

                        {handlingList}
                    </View>


                    <View tabLabel="已完成">
                        <View style={{height:25,width:width,paddingLeft:12,paddingRight:12,marginTop:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(210,210,210,0.4)',padding:6,
                                    borderTopLeftRadius:4,borderTopRightRadius:4}}>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>预约时间</Text>
                                </View>

                                <View style={{flex:2,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>服务内容</Text>
                                </View>

                            </View>
                        </View>

                        {finishedList}
                    </View>

                </ScrollableTabView>
                </Image>

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
        height: 150,
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

const mapStateToProps = (state, ownProps) => {


    var orders=state.service.orders;
    return {
        orders,
        ...ownProps,
    }
}


module.exports = connect(mapStateToProps)(ServiceOrders);

