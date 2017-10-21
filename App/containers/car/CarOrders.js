/**
 * Created by dingyiming on 2017/2/16.
 */
import React,{Component} from 'react';

import  {
    ActivityIndicator,
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
    Modal,
    RefreshControl,
    Animated,
    Easing
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

import Config from '../../../config';
import Proxy from '../../proxy/Proxy';

import {
    enableCarOrdersOnFresh,
    fetchCarOrdersInHistory,
    fetchApplyedCarOrders,
    updateCarOrdersInHistory,
    updateAppliedCarOrders,
    disableCarOrdersOnFresh,

} from '../../action/CarActions';





import DateFilter from '../../filter/DateFilter';
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';
import CarOrderPrices from '../../containers/car/CarOrderPrices';
import CarOrderDetail from '../../containers/car/CarOrderDetail';

class CarOrders extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    _onRefresh() {
        this.setState({ isRefreshing: true, fadeAnim: new Animated.Value(0) });
        setTimeout(function () {
            this.setState({
                isRefreshing: false,
            });
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bounce
                },           // Configuration
            ).start();
        }.bind(this), 500);

        const {dispatch} = this.props;
        dispatch(enableCarOrdersOnFresh());
    }

    navigate2CarOrderDetail(orderId,orderState)
    {
        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'CarOrderDetail',
                component: CarOrderDetail,
                params: {
                    orderId: orderId,
                    orderState:orderState
                }
            })
        }
    }

    navigate2CarOrderPrices(order)
    {
        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'CarOrderPrices',
                component: CarOrderPrices,
                params: {
                    order: order
                }
            })
        }
    }


    renderRow(rowData,sectionId,rowId){

        var lineStyle={flex:1,flexDirection:'row',padding:2,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};

        var row=(
            <TouchableOpacity style={lineStyle} onPress={()=>{

                        if(rowData.pricedCount&&rowData.pricedCount>0)
                            this.navigate2CarOrderPrices(rowData)
                        else
                            this.navigate2CarOrderDetail(rowData.orderId,rowData.orderState)
                  }}>
                <View style={{flex:3,justifyContent:'flex-start',alignItems:'flex-start',padding:6,paddingTop:10,borderRightWidth:1,borderColor:'#ddd'}}>
                    <Text style={{fontSize:13,justifyContent:'flex-start',alignItems:'flex-start',color:'#222'}}>{DateFilter.filter(rowData.applyTime,'yyyy-mm-dd')}</Text>
                    <Text style={{fontSize:13,paddingTop:2,justifyContent:'flex-start',alignItems:'flex-start',color:'#222'}}>{DateFilter.filter(rowData.applyTime,'hh:mm')}</Text>
                </View>
                <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:6,paddingLeft:15}}>
                    <View>
                        <Text style={{color:'#666',fontSize:14,padding:2}}>
                            {rowData.orderNum}
                        </Text>
                        {
                            rowData.orderState==3?
                                <Text style={{color:'#222',fontSize:13,padding:2,fontWeight:'bold'}}>
                                    已完成
                                </Text>:rowData.orderState==2?
                                    <Text style={{color:'#222',fontSize:13,padding:2,fontWeight:'bold'}}>
                                        客户确认
                                    </Text>:
                                    rowData.pricedCount&&rowData.pricedCount>0?
                                    <Text style={{color:'#ff4f39',fontSize:13,padding:2}}>
                                        已报价公司数: <Text style={{color:'#222',fontWeight: 'bold',fontSize:13}}>{rowData.pricedCount}</Text>
                                    </Text>:
                                        <Text style={{color:'#222',fontSize:13,padding:2,fontWeight:'bold'}}>
                                            已申请
                                        </Text>
                        }
                    </View>
                </View>

                <View style={{flex:2,flexDirection:'row',padding:2,paddingLeft:0,paddingRight:0,
                        borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'}}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                        <Text style={{color:'#222',fontSize:13,marginRight:5}}>
                            详细
                        </Text>
                        <Icon name="angle-right" size={30} color="#222"/>
                    </View>
                </View>
            </TouchableOpacity>
        );


        return row;
    }

    //拉取订单数据
    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        var historyOrders=null;
        var appliedOrders=null;

        this.props.dispatch(fetchCarOrdersInHistory()).then((json)=>{

            if (json.re == 1) {
                json.data.map(function (order, i) {
                    var insuranceFeeTotal=0;
                    insuranceFeeTotal+=order.price.contractFee;
                    if(order.price.carTax!==undefined&&order.price.carTax!==null)
                        insuranceFeeTotal+=order.price.carTax;
                    order.insuranceFeeTotal=insuranceFeeTotal;

                });
                historyOrders = json.data;
            }

            return this.props.dispatch(fetchApplyedCarOrders());
        }).then((json)=>{

            if(json.re==1) {

                if(json.data!==undefined&&json.data!==null&&json.data.length>0)
                {
                    json.data.map(function (order,i) {
                        var pricedC=0;
                        var confirmed=false;
                        if(order.prices!==undefined&&order.prices!==null)
                        {
                            order.prices.map(function (price,j) {
                                //已报价
                                if(price.priceState==1)
                                    pricedC++;
                                if(price.isConfirm==1)
                                    confirmed=true;
                            });
                            order.pricedCount=pricedC;
                        }else{
                            order.pricedCount=0;
                        }
                        order.confirmed=confirmed;
                    })
                    appliedOrders=json.data;

                }else{}
            }
    //TODO:make some dispatch
            this.props.dispatch(updateCarOrdersInHistory({historyOrders:historyOrders}));
            this.props.dispatch(updateAppliedCarOrders({appliedOrders:appliedOrders}))
            this.props.dispatch(disableCarOrdersOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
        }).catch((e)=>{
            this.props.dispatch(disableCarOrdersOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });

    }


    constructor(props)
    {
        super(props);
        this.state = {
            selectedTab:0,
            doingFetch:false,
            doingFetchOld:false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
        };
    }


    render(){
        var appliedListView=null;
        var historyListView=null;
        var {historyOrders,appliedOrders,onFresh}=this.props;

        if(onFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            if(historyOrders!==undefined&&historyOrders!==null&&historyOrders.length>0)
            {
                historyListView=(
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(historyOrders)}
                            renderRow={this.renderRow.bind(this)}
                        />
                );
            }

            if(appliedOrders!==undefined&&appliedOrders!==null&&appliedOrders.length>0)
            {
                appliedListView=(

                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(appliedOrders)}
                            renderRow={this.renderRow.bind(this)}
                        />
                );
            }

        }

        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>

                {/*标题*/}
                <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                    height:parseInt(height*54/667),backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                    <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}
                                      onPress={()=>{
                            this.goBack();
                        }}>
                        <Icon name="angle-left" size={40} color="#fff"/>
                    </TouchableOpacity>

                    <View style={{flex:4,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:17,color:'#fff',marginLeft:4}}>
                            车险订单
                        </Text>
                    </View>

                    <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>{
                                               const {dispatch} = this.props;
                                               dispatch(enableCarOrdersOnFresh());
                                          }}>
                        <Icon name='repeat' size={22} color='#fff'/>
                    </TouchableOpacity>
                </View>

                {/*列表*/}
                <ScrollableTabView   style={{flex:13,padding:0,marginTop: 10}}
                                     onChangeTab={(data)=>{
                                        var tabIndex=data.i;
                                        this.state.selectedTab=tabIndex;
                                     }}
                                     renderTabBar={() =>  <FacebookTabBar />}>


                    <View tabLabel='已申请' style={{flex:1}}>
                        {/*body*/}
                        <Animated.View style={{opacity: this.state.fadeAnim,padding:20,paddingHorizontal:0}}>
                            <ScrollView
                                refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor="#9c0c13"
                                    title="刷新..."
                                    titleColor="#9c0c13"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#ffff00"
                                />
                                }
                            >
                            {appliedListView}
                            </ScrollView>
                        </Animated.View>

                    </View>


                    <View tabLabel='已完成' style={{flex:1}}>

                        <Animated.View style={{opacity: this.state.fadeAnim,padding:20,}}>
                            <ScrollView
                                refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor="#9c0c13"
                                    title="刷新..."
                                    titleColor="#9c0c13"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#ffff00"
                                />
                                }
                            >
                            {historyListView}
                            </ScrollView>
                        </Animated.View>


                    </View>


                </ScrollableTabView>

                {/*底部留白*/}
                <View style={{flex:2}}>

                </View>

                {/*loading模态框*/}
                <Modal animationType={"fade"} transparent={true} visible={this.state.doingFetchOld}>

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
                                    拉取车险订单...
                                </Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                </Image>

            </View>);
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        flexDirection:'row'
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
        historyOrders:state.car.historyOrders,
        appliedOrders:state.car.appliedOrders,
        onFresh:state.car.onFresh
    })
)(CarOrders);

