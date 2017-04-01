
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
import _ from 'lodash';
import Config from '../../../config';
import {
    fetchDetectUnitsInArea,
    fetchMaintenance,
    fetchCarManageStation
} from '../../action/ServiceActions';
import MapRegionLocate from './MapRegionLocate';



class MapDistrictResult extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2MapRegionLocate(payload)
    {
        var {town}=payload;
        var {service}=this.state;

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MapRegionLocate',
                component: MapRegionLocate,
                params: {
                    town:town,
                    service:service
                }
            })
        }
    }


    //检测公司搜索
    fetchDistrictRecords()
    {
        var {service}=this.state;
        switch(service)
        {
            case 'administrator':
                this.props.dispatch(fetchDetectUnitsInArea({})).then((json) =>{
                    var data=json.data;
                    var {records,recordCount}=data;
                    this.setState({records:records,recordCount:recordCount});


                })
                break;
            case 'paper_validate':
                this.props.dispatch(fetchCarManageStation({})).then((json) =>{
                    var data=json.data;
                    var {records,recordCount}=data;
                    this.setState({records:records,recordCount:recordCount});


                })
                break;
            case 'airport':
                this.props.dispatch(fetchMaintenance()).then((json)=>{
                    var data=json.data;
                    var {records,recordCount}=data;
                    this.setState({records:records,recordCount:recordCount});
                }).catch((e)=>{
                    Alert.alert(
                        '错误',
                        e
                    );
                })
                break;

            case 'park_car':
                this.props.dispatch(fetchMaintenance()).then((json)=>{
                    var data=json.data;
                    var {records,recordCount}=data;
                    this.setState({records:records,recordCount:recordCount});
                }).catch((e)=>{
                    Alert.alert(
                        '错误',
                        e
                    );
                })
                break;
            case 'maintain':
                this.props.dispatch(fetchMaintenance()).then((json)=>{
                    var data=json.data;
                    var {records,recordCount}=data;
                    this.setState({records:records,recordCount:recordCount});
                }).catch((e)=>{
                    Alert.alert(
                        '错误',
                        e
                    );
                });
                break;
        }
    }


    constructor(props) {
        super(props);
        this.state={
            service:props.service!==undefined&&props.service!==null?props.service:null,
            records:null
        }

    }

    render() {

        var props=this.props;
        var state=this.state;
        var records=null;
        if(state.records)
        {
            //TODO:do something
            var items=[];
            if(state.records!==undefined&&state.records!==null&&state.records!==[])
            {
                for(let town in state.records)
                {

                    items.push(
                        <TouchableOpacity style={[{padding:8,paddingLeft:20,paddingRight:20}]} key={town}
                                          onPress={()=>{
                                          this.navigate2MapRegionLocate({town:town});
                                      }}
                        >

                            <View style={[styles.row,{height:30,justifyContent:'flex-start',borderBottomWidth:1,borderColor:'#eee'}]}>
                                <View style={{flex:7,alignItems:'flex-start',justifyContent:'center',padding:10,marginLeft:10}}>
                                    <Text style={{color:'#222',fontSize:13}}>{town}</Text>
                                </View>

                                <View style={[styles.row,{flex:3,alignItems:'center',justifyContent:'flex-start'}]}>
                                    <Text style={{color:'#222',paddingTop:4}}>
                                        共{state.records[town]['length']}条
                                    </Text>
                                    <Icon name="angle-right" size={33} color="#222"></Icon>
                                </View>
                            </View>

                        </TouchableOpacity>);
                }
                records=(
                    <View>
                        <View style={{padding:2,paddingLeft:20,paddingRight:20,width:width}}>
                            <View style={{borderBottomWidth:1,borderColor:'#eee',alignItems:'center',padding:8}}>
                                <Text style={{color:'#222',fontSize:12}}>您可以选择以下区或者县的搜索结果</Text>
                                {
                                    state.service=='paper_validate'?
                                        <Text style={{color:'#f00',fontSize:11,fontWeight:'bold',marginTop:7}}>
                                            * 审证业务只针对C以下的驾驶证 *
                                        </Text>:null
                                }
                            </View>
                        </View>
                        {items}
                    </View>);
            }



        }else{
            this.fetchDistrictRecords();
        }


        return (
            <View style={styles.container}>

                {/*need to finish*/}
                <View style={{height:40,width:width,backgroundColor:'rgba(17, 17, 17, 0.6)',borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                    <View style={[styles.row,{marginTop:0}]}>

                        <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                          onPress={()=>{
                                          this.goBack();
                                      }}
                        >
                            <Icon name="angle-left" size={40} color="#fff"></Icon>
                        </TouchableOpacity>

                        <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12,marginLeft:10}}>
                            <Text style={{color:'#fff',fontWeight:'bold'}}>
                                {
                                    state.service=='administrator'?
                                        '审车':state.service=='paper_validate'?
                                        '审证':state.service=='airport'?
                                        '接送机':state.service=='park_car'?
                                        '接送站':null
                                }
                            </Text>
                        </View>

                        <View style={{width:80,alignItems:'center',marginRight:10,
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}>
                            <Icon name="refresh" size={20} color="#fff"></Icon>
                        </View>

                    </View>
                </View>


                {/*body part*/}
                <View style={[styles.row,{padding:7,width:width,justifyContent:'center',backgroundColor:'#eee'}]}>
                    {
                        state.recordCount!==undefined&&state.recordCount!==null?
                            <Text style={{color:'#666',fontSize:11}}>
                                当前区域共搜索出
                                <Text style={{color:'#f00',fontSize:14}}>{state.recordCount}</Text>
                                条结果
                            </Text>:
                            <Text style={{color:'#ff2e21',fontSize:11}}>无检索结果</Text>
                    }
                </View>

                {/*records part*/}
                {records}




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
        height: Dimensions.get('window').height - 80,
        marginBottom: 0
    }


});




module.exports = connect()(MapDistrictResult);

