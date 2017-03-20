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
import Ionicons from 'react-native-vector-icons/Ionicons';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import MapAdministrateConfirm from './MapAdministrateConfirm';
import MapDailyConfirm from './MapDailyConfirm';
import MapAirportConfirm from './MapAirportConfirm';
import MapParkCarConfirm from './MapParkCarConfirm';
import{
    updateMapCenter,doRegionSearch
} from '../../action/ServiceActions';


const wholeHeight=Dimensions.get('window').height-80;

class MapRegionLocate extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2OrderConfirm(payload)
    {


        const { navigator } = this.props;

        if(navigator) {
        }
        var {plot}=payload;

        var {service,mode,carInfo}=this.state;
        var params=null;
        switch(service)
        {
            case 'administrator':
                params= {
                    contentInfo: {detectUnit: plot}
                };
                navigator.push({
                    name: 'MapAdministrateConfirm',
                    component: MapAdministrateConfirm,
                    params: params
                })
                break;
            case 'airport':
                var serviceName=null;
                switch(mode)
                {
                    case 'pickUp':
                        serviceName='接机服务';
                        break;
                    case 'seeOff':
                        serviceName='送机服务';
                        break;
                }
                Alert.alert(
                    '信息',
                    '您目前选择的是'+serviceName+'，确认之后按下OK',
                    [
                        {text: '取消'},
                        {text: '确认', onPress: () => {
                        params={
                            contentInfo:{
                                mode:mode,
                                unit:plot,
                                carInfo:carInfo
                            }
                        };
                            navigator.push({
                                name: 'MapAirportConfirm',
                                component: MapAirportConfirm,
                                params: params
                            })
                        }},
                    ]
                )

                break;
            case 'park_car':
                var serviceName=null;
                switch(mode)
                {
                    case 'pickUp':
                        serviceName='接站服务';
                        break;
                    case 'seeOff':
                        serviceName='送站服务';
                        break;
                }
                Alert.alert(
                    '信息',
                    '您目前选择的是'+serviceName+'，确认之后按下OK',
                    [
                        {text: '取消'},
                        {text: '确认', onPress: () => {
                            params={
                                contentInfo:{
                                    mode:mode,
                                    unit:plot,
                                    carInfo:carInfo
                                }
                            };
                            navigator.push({
                                name: 'MapParkCarConfirm',
                                component: MapParkCarConfirm,
                                params: params
                            })
                        }},
                    ]
                )
                break;
            case 'maintain':
                params= {
                    contentInfo: {unit: plot}
                };
                navigator.push({
                    name: 'MapDailyConfirm',
                    component: MapDailyConfirm,
                    params: params
                })
                break;


        }



    }


    //周边搜索
    fetchPopulationsByRegion()
    {
        var {service}=this.state;
        var props=this.props;
        var cmd=null;
        switch(service)
        {
            case 'administrator':
                cmd='fetchDetectUnitsInArea';
                break;
            case 'paper_validate':
                cmd='fetchServicePlacesInArea';
                break;
            case 'airport':
                cmd='fetchMaintenanceInArea';
                break;
            case 'park_car':
                cmd='fetchMaintenanceInArea';
                break;
            case 'maintain':
                cmd='fetchMaintenanceInArea';
                break;
            default:
                cmd='fetchDetectUnitsInArea';
                break;
        }


        this.props.dispatch(doRegionSearch({cmd:cmd,town:props.town,center:this.props.center,})).then( (json) =>{
            if(json.re==1)
            {
                var {populations,places}=json.data;
                var tag=null;
                if(populations.B)
                    tag='A';
                var center={
                    latitude:populations.A.center.lat,
                    longitude:populations.A.center.lng
                }
                var markers=[];
                places.map(function (place,i) {
                    markers.push({
                        latitude: place.latitude,
                        longitude: place.longitude,
                        title:place.name
                    });
                })
                this.setState({populations:populations,places:places,tag:tag,center:center,markers:markers});
            }
        })

    }

    scaffoldToggle()
    {
        var {isScaffold}=this.state;
        this.setState({isScaffold:!isScaffold});
    }

    constructor(props) {
        super(props);
        this.state={
            mayType: MapTypes.NORMAL,
            zoom: 14,
            center: props.center,
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            town:props.town!==undefined&&props.town!==null?props.town:null,
            service:props.service!==undefined&&props.service!==null?props.service:null,
            places:null,
            populations:null,
            isScaffold:false,
            tag:null,
            mode:props.service=='airport'||props.service=='park_car'?'pickUp':null

        }

    }

    render() {

        var props=this.props;
        var state=this.state;
        var title=''
        var unSelectedModeBackgroundStyle={backgroundColor:'#fff'};
        var selectedModeBackgroundStyle={backgroundColor:'rgb(17, 193, 243)'};
        var unSelectedModeFontStyle={color:'#222'};
        var selectedModeFontStyle={color:'#fff'};
        switch(state.service)
        {
            case 'administrator':
                title='审车';
                break;
            case 'paper_validate':
                title='审证';
                break;
            case 'airport':
                title='接送机';

                break;
            case 'park_car':
                title='取送站';
                break;
            case 'maintain':
                title='维修服务'
                break;

        }


        var tags=null;
        var results=null;


        var mapWholeStyle=null;
        var panelScaffoldedStyle=null;
        if(state.isScaffold)
        {
            mapWholeStyle={height:wholeHeight};
            panelScaffoldedStyle={height:0};
        }

        if(state.populations!==undefined&&state.populations!==null)
        {

            if(state.populations.B!==undefined&&state.populations.B!==null)
                tags=[];

            //当群体分布大于1个
            if(state.populations.B)
            {
                for(let tag in state.populations)
                {
                    tags.push(
                        <TouchableOpacity style={{width:30,marginRight:10,justifyContent:'center',alignItems:'center'}} key={tag}
                                          onPress={()=>{

                                        var center=state.populations[tag].center;
                                        this.setState({tag:tag,center:{latitude:center.lat,longitude:center.lng}})
                                      }}
                        >
                            {
                                state.tag==tag?
                                    <View style={{width:25,height:25,padding:4,backgroundColor:'#328bff',justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{color:'#fff'}}>
                                            {tag}
                                        </Text>
                                    </View>:
                                    <View style={{width:25,height:25,padding:4,backgroundColor:'#fff',justifyContent:'center',
                                            alignItems:'center',borderWidth:1,borderColor:'#ddd'}}>
                                        <Text style={{color:'#666'}}>
                                            {tag}
                                        </Text>
                                    </View>
                            }
                        </TouchableOpacity>);
                }

                var population=state.populations[state.tag];
                var plots=[];
                population.plots.map( (plot, i) =>{

                    plots.push(
                      <TouchableOpacity style={{width:width,flexDirection:'row',alignItems:'center',padding:10,
                            borderBottomWidth:1,borderColor:'#ddd'}} key={i}
                                        onPress={()=>{
                                            this.navigate2OrderConfirm({plot:plot});
                                      }}>

                          <View style={{flex:3,justifyContent:'center',alignItems:'flex-start'}}>
                              <Text style={{color:'#222'}}>
                                  {i}.{plot.name}
                              </Text>

                              <Text style={{color:'#222',fontSize:12,marginTop:5}}>
                                  距离:{(plot.distance/1000).toFixed(2)}km
                              </Text>

                              <Text style={{color:'#222',fontSize:12,marginTop:5}}>
                                  地址:{plot.address}
                              </Text>

                              <Text style={{color:'#222',fontSize:12,marginTop:5}}>
                                  电话:{plot.phone}
                              </Text>

                          </View>

                          <View style={{width:110,justifyContent:'center',alignItems:'center'}}>
                              <View style={{width:80,height:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                    borderRadius:4,padding:4,paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:'#f00'}}>
                                   <Icon name="hand-pointer-o" size={17} color="#222"/>
                                    <Text style={{color:'#222',fontSize:13}}>选择这里</Text>
                              </View>
                          </View>

                      </TouchableOpacity>
                    );
                });


                results=(
                    <View style={{flex:1}}>
                        {plots}
                    </View>);

            }




        }else{
            this.fetchPopulationsByRegion();
        }



        return (
            <View style={styles.container}>

                <View style={{ flex: 1,justifyContent: 'flex-start',alignItems: 'center',
                        backgroundColor: '#F5FCFF',position:'relative',}}>

                    {/*header part*/}
                    <TouchableOpacity style={[styles.card,{height:34,width:width*4/5,marginLeft:width/10,
                            position:'absolute',top:25,zIndex:1000}]}
                                      onPress={()=>{
                                         this.goBack();
                                      }}
                    >
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                            <Icon name="angle-left" size={30} color="#222" style={{width:100}}></Icon>
                            <View style={{flex:1,height:30,justifyContent:'center'}}>
                                <Text style={{color:'#222',fontWeight:'bold',fontSize:14}}>
                                    {title}
                                </Text>
                            </View>

                        </View>
                    </TouchableOpacity>


                    {/*mode part*/}
                    {
                        state.service=='airport'?
                            <TouchableOpacity style={[styles.card,{height:40,width:40,padding:0,right:10,
                            position:'absolute',top:125,zIndex:1000},state.mode=='pickUp'?selectedModeBackgroundStyle:unSelectedModeBackgroundStyle]}
                                              onPress={()=>{
                                         this.goBack();
                                      }}
                            >
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {
                                        state.mode=='pickUp'?
                                            <Icon name="plane" size={12} color="#fff"></Icon>:
                                            <Icon name="plane" size={12} color="#222"></Icon>
                                    }

                                    {
                                        state.mode=='pickUp'?
                                            <Text style={{color:'#fff',fontWeight:'bold',fontSize:11}}>
                                                接机
                                            </Text>:
                                            <Text style={{color:'#222',fontWeight:'bold',fontSize:11}}>
                                                接机
                                            </Text>
                                    }

                                </View>
                            </TouchableOpacity>:null

                    }
                    {
                        state.service=='airport'?
                            <TouchableOpacity style={[styles.card,{height:40,width:40,padding:0,right:10,
                            position:'absolute',top:165,zIndex:1000},state.mode=='seeOff'?selectedModeBackgroundStyle:unSelectedModeBackgroundStyle]}
                                              onPress={()=>{
                                         this.goBack();
                                      }}
                            >
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>


                                    {
                                        state.mode=='seeOff'?
                                            <Icon name="car" size={12} color="#fff"></Icon>:
                                            <Icon name="car" size={12} color="#222"></Icon>
                                    }

                                    {
                                        state.mode=='seeOff'?
                                            <Text style={{color:'#fff',fontWeight:'bold',fontSize:11}}>
                                                送机
                                            </Text>:
                                            <Text style={{color:'#222',fontWeight:'bold',fontSize:11}}>
                                                送机
                                            </Text>
                                    }

                                </View>
                            </TouchableOpacity>:null
                    }



                    <MapView
                        trafficEnabled={this.state.trafficEnabled}
                        baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                        zoom={this.state.zoom}
                        mapType={this.state.mapType}
                        center={this.state.center}
                        marker={this.state.marker}
                        markers={this.state.markers}
                        style={[styles.map,mapWholeStyle]}
                        onMapClick={(e) => {
                    }}
                    >
                    </MapView>

                    {/*result panel*/}
                    {
                        state.isScaffold==false?
                            <View style={[styles.panel,{width:width},panelScaffoldedStyle]}>
                                {/*result header*/}
                                <View style={{width:width,height:31,backgroundColor:'rgba(120,120,120,0.6)',flexDirection:'row'}}>

                                    <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center',marginLeft:50}}
                                                      onPress={()=>{
                                                  this.scaffoldToggle();
                                              }}
                                    >
                                        <Icon name="angle-down" size={30} color="#fff" ></Icon>
                                    </TouchableOpacity>

                                    <View style={{width:80,alignItems:'center',justifyContent:'center'}}>
                                        <View style={{backgroundColor:'#2b984a',padding:4,paddingLeft:15,paddingRight:15,borderRadius:4}}>
                                            <Text style={{color:'#fff',fontSize:12}}>
                                                全选
                                            </Text>
                                        </View>
                                    </View>

                                </View>

                                {/*scroll here*/}
                                <ScrollView style={{flex:1,width:width}}>

                                    {results}
                                </ScrollView>

                                <View style={{width:width,height:30}}>
                                    <View style={[styles.row,{flex:1,alignItems:'center',padding:4}]}>
                                        {tags}
                                    </View>
                                </View>

                            </View>:null
                    }

                    {/*scaffold popup*/}
                    {
                        state.isScaffold==true?
                            <TouchableOpacity style={{width:width,height:30,alignItems:'center',justifyContent:'center',
                                backgroundColor:'rgba(120,120,120,0.6)'}}
                                              onPress={()=>{
                                                  this.scaffoldToggle();
                                              }}
                            >
                                <Icon name="angle-up" size={30} color="#fff" ></Icon>
                            </TouchableOpacity>:null
                    }



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
    }


});


const mapStateToProps = (state, ownProps) => {


    var center=state.service.center;
    return {
        center,
        ...ownProps,
    }
}


module.exports = connect(mapStateToProps)(MapRegionLocate);

