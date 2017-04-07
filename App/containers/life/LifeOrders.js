/**
 * Created by dingyiming on 2017/2/20.
 */
import React,{Component} from 'react';
import {
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
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import {fetchLifeOrders,enableLifeOrdersOnFresh,setLifePlans} from '../../action/LifeActions';
import DateFilter from '../../filter/DateFilter';
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';
import ApplyedLifeOrderDetails from './ApplyedLifeOrderDetails'
import LifePlan from './LifePlan'

class LifeOrders extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2ApplyedLifeOrderDetail(order){

        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'getAppliedLifeOrderByOrderId',
                info:{
                    orderId:order.orderId
                }
            }
        }, (res)=> {
            var json=res;
            if(json.re==1){
                var applyedOrder = json.data;
                const { navigator } = this.props;
                if(navigator) {
                    navigator.push({
                        name: 'applyed_life_order_details',
                        component: ApplyedLifeOrderDetails,
                        params: {
                            applyedOrder:applyedOrder,
                        }
                    })
                }
            }

        }, (err) =>{
        });

    }

    navigate2LifePlan(order){
        const { navigator } = this.props;
        const {dispatch} = this.props;
        dispatch(setLifePlans(order.plans));

        if(navigator) {
            navigator.push({
                name: 'life_plan',
                component: LifePlan,
                params: {
                    order:order,
                }
            })
        }
    }

    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;
        lineStyle={flex:1,flexDirection:'row',padding:2,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};

        var row=(
            <View style={lineStyle}>
                <View style={{flex:3,justifyContent:'flex-start',alignItems:'flex-start',padding:6,paddingTop:10,borderRightWidth:1,borderColor:'#ddd'}}>
                    <Text style={{fontSize:13,justifyContent:'flex-start',alignItems:'flex-start',color:'#222'}}>{DateFilter.filter(rowData.applyTime,'yyyy-mm-dd')}</Text>
                    <Text style={{fontSize:13,paddingTop:2,justifyContent:'flex-start',alignItems:'flex-start',color:'#222'}}>{DateFilter.filter(rowData.applyTime,'hh:mm')}</Text>
                </View>
                <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:6,paddingLeft:15}}>
                    <View>
                        <Text style={{color:'#000',fontSize:14,padding:2}}>
                            {rowData.orderNum}
                        </Text>
                        {
                            rowData.orderState==1?
                                <Text style={{color:'#222',fontSize:13,padding:2}}>
                                    已申请
                                </Text>:
                                <Text style={{color:'#222',fontSize:13,padding:2}}>
                                    正在报价
                                </Text>
                        }
                    </View>
                </View>

                <TouchableOpacity style={{flex:2,flexDirection:'row',padding:2,paddingLeft:0,paddingRight:0,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'}}
                                  onPress={()=>{
                                      this.navigate2ApplyedLifeOrderDetail(rowData);
                 }}>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                    <Text style={{color:'#222',fontSize:13,marginRight:5}}>
                        详细
                    </Text>
                    <Icon name="angle-right" size={30} color="#222"/>
                  </View>
                </TouchableOpacity>
            </View>
        );
        return row;
    }

    renderPricedRow(rowData,sectionId,rowId){
        var lineStyle=null;
        lineStyle={flex:1,flexDirection:'row',padding:2,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};
        var row=(
            <View style={lineStyle}>
                <View style={{flex:3,justifyContent:'flex-start',alignItems:'flex-start',padding:3,paddingTop:10,borderRightWidth:1,borderColor:'#ddd'}}>
                    <Text style={{fontSize:13,justifyContent:'flex-start',alignItems:'flex-start',color:'#222'}}>{DateFilter.filter(rowData.modifyTime,'yyyy-mm-dd')}</Text>
                    <Text style={{fontSize:13,paddingTop:2,justifyContent:'flex-start',alignItems:'flex-start',color:'#222'}}>{DateFilter.filter(rowData.modifyTime,'hh:mm')}</Text>
                </View>
                <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:6,paddingLeft:15}}>
                    <View>
                        <Text style={{color:'#000',fontSize:14,padding:2}}>
                            {rowData.orderNum}
                        </Text>
                        {
                            rowData.orderState==3?
                                <Text style={{color:'#222',fontSize:13,padding:2}}>
                                    报价完成
                                </Text>:
                                <Text style={{color:'#222',fontSize:13,padding:2}}>
                                     用户确认
                                </Text>
                        }
                    </View>
                </View>

                <TouchableOpacity style={{flex:2,flexDirection:'row',padding:2,paddingLeft:0,paddingRight:0,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'}}
                                  onPress={()=>{
                                      this.navigate2LifePlan(rowData);
                 }}>
                    <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                        <Text style={{color:'#222',fontSize:13,marginRight:5}}>
                            详细
                        </Text>
                        <Icon name="angle-right" size={30} color="#222"/>
                    </View>
                </TouchableOpacity>
            </View>
        );
        return row;
    }

    fetchData(){


        setTimeout(()=>{

            this.setState({doingFetch:true})
            this.props.dispatch(fetchLifeOrders()).then(()=> {

                this.setState({doingFetch:false})
            });
        },200)

    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            selectedTab:0,
            accessToken: accessToken,
            doingFetch:false,
        };
    }

    render(){
        var applyedListView=null;
        var pricedListView=null;
        var historyListView=null;
        var {historyOrders,pricedOrders,applyedOrders,onFresh}=this.props;

        if(onFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if(pricedOrders!==undefined&&pricedOrders!==null&&pricedOrders.length>0)
            {
                pricedListView=(
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(pricedOrders)}
                            renderRow={this.renderPricedRow.bind(this)}
                        />
                    </ScrollView>);
            }

            if(historyOrders!==undefined&&historyOrders!==null&&historyOrders.length>0)
            {
                historyListView=(
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(historyOrders)}
                            renderRow={this.renderRow.bind(this)}
                        />
                    </ScrollView>
                );
            }

            if(applyedOrders!==undefined&&applyedOrders!==null&&applyedOrders.length>0)
            {
                applyedListView=(
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(applyedOrders)}
                            renderRow={this.renderRow.bind(this)}
                        />
                    </ScrollView>
                );
            }
        }

        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                    <View style={[{flex:1,height:60,padding:10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                        <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}
                                          onPress={()=>{
                            this.goBack();
                        }}>
                            <Icon name="angle-left" size={40} color="#fff"/>
                        </TouchableOpacity>

                        <View style={{flex:4,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:17,color:'#fff',marginLeft:4}}>
                                寿险订单
                            </Text>
                        </View>

                        <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                          onPress={()=>{
                                               const {dispatch} = this.props;
                                               dispatch(enableLifeOrdersOnFresh());
                                          }}>
                            <Icon name='repeat' size={22} color='#fff'/>
                        </TouchableOpacity>
                    </View>

                    <ScrollableTabView
                        style={{flex:25,padding:0,marginTop: 10}}
                        onChangeTab={(data)=>{
                            var tabIndex=data.i;
                            this.state.selectedTab=tabIndex;
                        }}
                        renderTabBar={() =>  <FacebookTabBar />}>

                        <View tabLabel='已申请' style={{flex:1,margin:10}}>
                            {/*body*/}
                            <View style={{paddingBottom:10,height:height-240,borderTopWidth:1,borderColor:'#ddd'}}>
                                {applyedListView}
                            </View>

                        </View>

                        <View tabLabel='寿险方案' style={{flex:1,margin:10}}>

                            <View style={{paddingBottom:10,height:height-240,borderTopWidth:1,borderColor:'#ddd'}}>
                                {pricedListView}
                            </View>

                        </View>

                        <View tabLabel='已完成' style={{flex:1,margin:10}}>

                            <View style={{paddingBottom:10,height:height-240,borderTopWidth:1,borderColor:'#ddd'}}>
                                {historyListView}
                            </View>

                        </View>

                    </ScrollableTabView>

                </Image>


                {/*loading模态框*/}
                <Modal animationType={"fade"} transparent={true} visible={this.state.doingFetch}>

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
                                    拉取寿险订单...
                                </Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>);
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    loader: {
        marginTop: 10
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
        flexDirection:'row'
    }
});

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        historyOrders:state.life.historyOrders,
        pricedOrders:state.life.pricedOrders,
        applyedOrders:state.life.applyedOrders,//已申请和正在报价
        onFresh:state.life.onFresh
    })
)(LifeOrders);
