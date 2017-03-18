/**
 * Created by danding on 17/3/3.
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

import {
    MapView,
    MapTypes,
    Geolocation
} from 'react-native-baidu-map';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import _ from 'lodash';
import Demo from '../../../BaiduMapDemo';
import Config from '../../../config';
import MapServiceSelect from './MapServiceSelect';
import{
    updateMapCenter
} from '../../action/ServiceActions';



class BaiduHome extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2MapServiceSelect()
    {

        var isMaintainable=false;
        if(this.state.service=='maintain')
            isMaintainable=true;

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MapServiceSelect',
                component: MapServiceSelect,
                params: {
                    isMaintainable:isMaintainable
                }
            })
        }
    }




    constructor(props) {
        super(props);
        this.state={
            mayType: MapTypes.NORMAL,
            zoom: 14,
            center: {
                latitude: 36.67205,
                longitude: 117.14501
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            marker: {
                latitude: 36.67205,
                longitude: 117.14501,
                title: '您的位置'
            },
            service:props.service!==undefined&&props.service!==null?props.service:null
        }

    }

    render() {

        var props=this.props;
        var state=this.state;

        return (
            <View style={styles.container}>

                {/*need to finish*/}
                <View style={{height:60,width:width,backgroundColor:'rgba(120,120,120,0.2)',borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                    <View style={[styles.row,{marginTop:20}]}>

                        <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                          onPress={()=>{
                                          this.goBack();
                                      }}
                        >
                            <Icon name="angle-left" size={40} color="#222"></Icon>
                        </TouchableOpacity>

                        <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12,marginLeft:10}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>百度地图定位....</Text>
                        </View>

                        <View style={{width:80,alignItems:'center',marginRight:20,
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}>
                        </View>

                    </View>
                </View>


                {/*map part*/}

                <View style={{ flex: 1,justifyContent: 'flex-start',alignItems: 'center',
                        backgroundColor: '#F5FCFF',position:'relative'}}>
                    {/*header bar*/}
                    <TouchableOpacity style={[styles.card,{height:45,width:width*4/5,marginLeft:width/10,
                            position:'absolute',top:10,zIndex:1000,flexDirection:'row',justifyContent:'center'}]}
                                      onPress={()=>{
                                         this.navigate2MapServiceSelect();
                                      }}
                    >
                        {
                            state.service=='maintain'?
                                <Text style={{color:'#222',fontSize:11}}>
                                    选择维修服务
                                </Text>:
                                <Text style={{color:'#222',fontSize:11}}>
                                    选择审车、审证、接送机、接送站等服务
                                </Text>
                        }

                        <Icon name="hand-pointer-o" size={12} color="#222"></Icon>
                    </TouchableOpacity>


                    <MapView
                        trafficEnabled={this.state.trafficEnabled}
                        baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                        zoom={this.state.zoom}
                        mapType={this.state.mapType}
                        center={this.state.center}
                        marker={this.state.marker}
                        markers={this.state.markers}
                        style={styles.map}
                        onMapClick={(e) => {
                    }}
                    >
                    </MapView>

                </View>

            </View>
        )
    }

    componentDidMount() {
        //开始定位
        // BaiduLocation.startLocation();
        // //定位刷新回调
        // BaiduLocation.didUpdateBMKUserLocation(param=>{
        //     console.log('didUpdateBMKUserLocation======');
        //     console.log('lat='+param.latitude+',lng='+param.longitude);
        //     alert('lat='+param.latitude+',lng='+param.longitude);
        //     //获得的坐标是gps还需要转换一下
        //     this.setState({center:{
        //         longitude: param.longitude,
        //         latitude: param.latitude
        //     }});
        // })
        //
        // //定位失败的回调
        // BaiduLocation.didFailToLocateUserWithError(param=>{
        //     alert('didFailToLocateUserWithError',param);
        // })


        if(Config.debug==true)
        {}
        else{
            Geolocation.getCurrentPosition()
                .then(data => {
                    this.setState({
                        zoom: 15,
                        marker: {
                            latitude: data.latitude,
                            longitude: data.longitude,
                            title: '您的位置'
                        },
                        center: {
                            latitude: data.latitude,
                            longitude: data.longitude
                        }
                    });

                    //将地图中心更新到store
                    this.props.dispatch(updateMapCenter(
                        {
                            data:data
                        }));

                })
                .catch(e =>{
                    alert(e, 'error');
                })
        }


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




module.exports = connect()(BaiduHome);

