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
import {
    fetchCarOrders,
    enableCarOrdersOnFresh
} from '../action/actionCreator';
import {
    fetchNotifications,
    updateNotifications
} from '../action/JpushActions';
import DateFilter from '../filter/DateFilter';


class Notification extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    renderLifeRow(rowData,sectionId,rowId){



        var  lineStyle={flex:1,flexDirection:'row',padding:4,paddingVertical:0,paddingLeft:0,paddingRight:0,
            justifyContent:'flex-start',backgroundColor:'transparent',position:'relative'};

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
                 this.setState({relativePersons:this.state.relativePersons,insuranceder:rowData});
            }}>
                <View style={{width:80,alignItems:'flex-start',height:50,justifyContent:'center'}}>
                    <Text style={{fontSize:13,color:'#222',marginLeft:2}}>{DateFilter.filter(rowData.notyTime,'yyyy-mm-dd')}</Text>
                    <Text style={{fontSize:13,color:'#222',marginLeft:2}}>{DateFilter.filter(rowData.notyTime,'hh:mm')}</Text>
                </View>

                <View style={{width:2,backgroundColor:'#666',height:50}}>
                </View>
                <View style={{position:'absolute',left:75,top:12}}>
                    <Icon name="circle-o" size={14} color="#00f" style={{backgroundColor:'#fff'}}/>
                </View>

                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:2,marginLeft:13,
                    height:50}}>
                    <View>
                        <Text style={{color:'#b7462e',fontSize:14}}>
                            订单号为:{rowData.orderNum}
                        </Text>
                        <Text style={{color:'#222',fontSize:13}}>
                            {rowData.content}
                        </Text>

                    </View>
                </View>

            </TouchableOpacity>
        );

        return row;
    }


    renderRow(rowData,sectionId,rowId){

        var  lineStyle={flex:1,flexDirection:'row',padding:4,paddingVertical:0,paddingLeft:0,paddingRight:0,
            justifyContent:'flex-start',backgroundColor:'transparent',position:'relative'};

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
                 this.setState({relativePersons:this.state.relativePersons,insuranceder:rowData});
            }}>
                <View style={{width:80,alignItems:'flex-start',height:44,justifyContent:'center'}}>
                    <Text style={{fontSize:13,color:'#222',marginLeft:2}}>{DateFilter.filter(rowData.notyTime,'yyyy-mm-dd')}</Text>
                    <Text style={{fontSize:13,color:'#222',marginLeft:2}}>{DateFilter.filter(rowData.notyTime,'hh:mm')}</Text>
                </View>

                <View style={{width:2,backgroundColor:'#666',height:44}}>
                </View>
                <View style={{position:'absolute',left:75,top:12}}>
                    <Icon name="circle-o" size={14} color="#00f" style={{backgroundColor:'#fff'}}/>
                </View>

                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:2,marginLeft:13,height:44}}>
                    <View>
                        <Text style={{color:'#b7462e',fontSize:14}}>
                            订单号为:{rowData.orderNum}
                        </Text>
                        <Text style={{color:'#222',fontSize:13}}>
                            {rowData.content}
                        </Text>

                    </View>
                </View>

            </TouchableOpacity>
        );

        return row;
    }



    fetchData(){

        this.props.dispatch(fetchNotifications()).then((json)=>{

            var notifications={0:[],1:[],2:[]};
            if(json.re==1)
            {
                if(json.data!==undefined&&json.data!==null)
                {
                    json.data.map((item,i)=>{
                        switch(item.type)
                        {
                            case 'car':
                                notifications[0].push(item);
                                break;
                            case 'life':
                                notifications[1].push(item);
                                break;
                            case 'service':
                                notifications[2].push(item);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }


            this.state.doingFetch=false;
            this.props.dispatch(updateNotifications({notifications:notifications,onFresh:false}));

        }).catch((e)=>{
            alert(e);
        })

    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            selectedTab:0,
            accessToken: accessToken,
            doingFetch:false,
            notifications:props.notifications
        };
    }


    render(){



        var props=this.props;
        var state=this.state;


        var carNotifications=null;
        var lifeNotifications=null;
        var serviceNotifications=null;
        var carListView=null;
        var lifeListView=null;
        var serviceListView=null;
        var {onFresh}=this.props;

        if(onFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            //分别对应三个数组项
            carNotifications=props.notifications[0];
            lifeNotifications=props.notifications[1];
            serviceNotifications=props.notifications[2];

            if(carNotifications!==undefined&&carNotifications!==null&&carNotifications.length>0)
            {
                carListView=(
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(carNotifications)}
                            renderRow={this.renderRow.bind(this)}
                        />
                    </ScrollView>);
            }

            if(lifeNotifications!==undefined&&lifeNotifications!==null&&lifeNotifications.length>0)
            {
                lifeListView=(
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(lifeNotifications)}
                            renderRow={this.renderLifeRow.bind(this)}
                        />
                    </ScrollView>
                );
            }

            if(serviceNotifications!==undefined&&serviceNotifications!==null&&serviceNotifications.length>0)
            {
                serviceListView=(
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(serviceNotifications)}
                            renderRow={this.renderRow.bind(this)}
                        />
                    </ScrollView>
                );
            }


        }



        return (
            <View style={{flex:1}}>


                <View style={{height:40,width:width,backgroundColor:'rgba(120,120,120,0.2)',flexDirection:'row',
                    alignItems:'center',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#aaa'}}>
                    <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                      onPress={()=>{
                                          this.goBack();
                                      }}>

                        <Icon name="angle-left" size={40} color="#222"></Icon>
                    </TouchableOpacity>


                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#222',fontWeight:'bold'}}>通知</Text>
                    </View>

                    <TouchableOpacity style={{width:80,justifyContent:'center',paddingLeft:30}}
                                      onPress={()=>{
                                           const {dispatch} = this.props;
                                            dispatch(enableCarOrdersOnFresh());
                                      }}
                    >
                        <Icon name='repeat' size={24} color='#555'/>
                    </TouchableOpacity>

                </View>


                <ScrollableTabView style={{flex:1,padding:0,margin:0}} onChangeTab={(data)=>{
                        var tabIndex=data.i;
                        this.state.selectedTab=tabIndex;
                    }} renderTabBar={() => <DefaultTabBar style={{borderBottomWidth:0}} activeTextColor="#00c9ff"  inactiveTextColor="#222" underlineStyle={{backgroundColor:'#00c9ff'}}/>}
                >
                    <View tabLabel='车险' style={{flex:1}}>
                        {/*body*/}
                        <View style={{padding:20,height:height-264}}>
                            {carListView}
                        </View>


                    </View>

                    <View tabLabel='寿险' style={{flex:1}}>

                        <View style={{padding:10,height:height-170,paddingHorizontal:0}}>
                            {lifeListView}
                        </View>


                    </View>

                    <View tabLabel='服务' style={{flex:1}}>

                        <View style={{padding:10,height:height-170,paddingHorizontal:0}}>
                            {serviceListView}
                        </View>


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
    onFresh:state.notification.onFresh,
    notifications:state.notification.notifications
    })
)(Notification);

