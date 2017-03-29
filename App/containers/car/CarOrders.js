/**
 * Created by dingyiming on 2017/2/16.
 */
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
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import {fetchCarOrders,enableCarOrdersOnFresh} from '../../action/actionCreator';
import DateFilter from '../../filter/DateFilter';


class CarOrders extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',padding:4,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};

        var row=(
            <TouchableOpacity style={lineStyle} onPress={()=>{
                 rowData.checked=!rowData.checked;
                 var relativePersons=this.state.relativePersons;
                 if(rowData.checked==true)
                 {
                      relativePersons.map(function(person,i) {
                          if(person.personId!=rowData.personId)
                              person.checked=false;
                      });
                 }
                 this.setState({relativePersons:this.state.relativePersons,insuranceder:rowData});   }}>
                <View style={{flex:1,alignItems:'center'}}>
                    <Text style={{fontSize:18,color:'#222'}}>{DateFilter.filter(rowData.modifyTime,'yyyy-mm-dd')}</Text>
                    <Text style={{fontSize:18,color:'#222'}}>{DateFilter.filter(rowData.modifyTime,'hh:mm')}</Text>
                </View>
                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:2}}>
                    <View>
                        <Text style={{color:'#000',fontSize:18}}>
                            {rowData.orderNum}
                        </Text>
                    </View>
                </View>
                <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                    {
                        rowData.checked==true?
                            <Icon name="check-square-o" size={30} color="#00c9ff"/>:
                            <Icon name="hand-pointer-o" size={30} color="#888"/>
                    }
                </View>
            </TouchableOpacity>
        );


        return row;
    }


    renderPricedRow(rowData,sectionId,rowId){
        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',justifyContent:'flex-start',backgroundColor:'transparent'};

        var row=(
            <TouchableOpacity style={lineStyle} onPress={()=>{
                 rowData.checked=!rowData.checked;
                 var relativePersons=this.state.relativePersons;
                 if(rowData.checked==true)
                 {
                      relativePersons.map(function(person,i) {
                          if(person.personId!=rowData.personId)
                              person.checked=false;
                      });
                 }
                 this.setState({relativePersons:this.state.relativePersons,insuranceder:rowData});   }}>
                <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'center',borderRightWidth:1,borderColor:'#888'}}>
                    <View style={{flex:1,alignItems:'center'}}>
                        <Text style={{fontSize:18,color:'#222'}}>{DateFilter.filter(rowData.modifyTime,'yyyy-mm-dd')}</Text>
                        <Text style={{fontSize:18,color:'#222'}}>{DateFilter.filter(rowData.modifyTime,'hh:mm')}</Text>
                    </View>
                </View>
                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:2}}>
                    <View style={{flex:1,marginLeft:20}}>
                        <Text style={{color:'#222',fontSize:18}}>
                            {rowData.orderNum}
                        </Text>
                        {
                            rowData.orderState==3?
                                <Text style={{color:'#222',fontSize:16}}>
                                    报价完成
                                </Text>:
                                <Text style={{color:'#222',fontSize:16}}>
                                    报价中
                                </Text>
                        }
                    </View>
                </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                    <Text style={{color:'#222',fontSize:18,marginRight:5}}>
                        详细
                    </Text>
                    <Icon name="angle-right" size={30} color="#222"/>
                </View>
            </TouchableOpacity>
        );

        return row;
    }


    fetchData(){
        const { accessToken } = this.props;
        const {dispatch} = this.props;
        dispatch(fetchCarOrders(accessToken,function () {
            this.setState({doingFetch:false});
        }.bind(this)));
        this.state.doingFetch=true;
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            selectedTab:0,
            accessToken: accessToken,
            doingFetch:false
        };
    }


    render(){
        var applyedListView=null;
        var pricedListView=null;
        var historyListView=null;
        var {historyOrders,pricedAndPricingOrders,applyedOrders,onFresh}=this.props;

        if(onFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            if(pricedAndPricingOrders!==undefined&&pricedAndPricingOrders!==null&&pricedAndPricingOrders.length>0)
            {
                pricedListView=(
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(pricedAndPricingOrders)}
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
                <View style={[{padding: 10,marginTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:50},styles.card]}>
                    <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}
                                      onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={45} color="#222"/>
                    </TouchableOpacity>

                    <View style={{flex:3,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:23,color:'#222',marginLeft:10}}>
                            车险订单
                        </Text>
                    </View>

                    <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>{
                                           const {dispatch} = this.props;
                                            dispatch(enableCarOrdersOnFresh());
                                      }}>
                        <Icon name='repeat' size={24} color='#222'/>
                    </TouchableOpacity>

                </View>

                <ScrollableTabView style={{flex:1,padding:0,margin:0}} onChangeTab={(data)=>{
                        var tabIndex=data.i;
                        this.state.selectedTab=tabIndex;
                    }} renderTabBar={() => <DefaultTabBar style={{borderBottomWidth:0}} activeTextColor="#00c9ff"  inactiveTextColor="#222" underlineStyle={{backgroundColor:'#00c9ff'}}/>}
                >
                    <View tabLabel='已申请' style={{flex:1}}>
                        {/*body*/}
                        <View style={{padding:20,height:height-264}}>
                            {applyedListView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                        padding:10,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                        this.applyCarInsurance();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:19}}>提交车险意向</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View tabLabel='估价列表' style={{flex:1}}>

                        <View style={{padding:20,height:height-264}}>
                            {pricedListView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                        padding:10,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                        this.applyCarInsurance();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:19}}>提交车险意向</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View tabLabel='已完成' style={{flex:1}}>

                        <View style={{padding:20,height:height-264}}>
                            {historyListView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                        padding:10,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                        this.applyCarInsurance();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:19}}>提交车险意向</Text>
                            </View>
                        </TouchableOpacity>
                    </View>


                </ScrollableTabView>


            </View>);
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
        flexDirection:'row'
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        historyOrders:state.carOrders.historyOrders,
        pricedAndPricingOrders:state.carOrders.pricedAndPricingOrders,
        applyedOrders:state.carOrders.applyedOrders,
        onFresh:state.carOrders.onFresh
    })
)(CarOrders);

