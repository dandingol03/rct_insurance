
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
import Config from '../../../config';
import MapDistrictResult from './MapDistrictResult';

class MapServiceSelect extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2MapDistrictResult()
    {

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MapDistrictResult',
                component: MapDistrictResult,
                params: {
                    service:'administrator'
                }
            })
        }
    }


    constructor(props) {
        super(props);
        this.state={
            title:props.title!==undefined&&props.title!==null?props.title:'审车'
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
                            <Text style={{color:'#222',fontWeight:'bold'}}>服务选择</Text>
                        </View>

                        <View style={{width:80,alignItems:'center',marginRight:20,
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}>
                        </View>

                    </View>
                </View>


                {/*body part*/}
                <View style={[styles.row,{height:100,justifyContent:'center'}]}>

                    <TouchableOpacity style={{flex:1,alignItems:'center'}}
                                      onPress={()=>{
                                          this.navigate2MapDistrictResult();
                                      }}
                    >

                        <View style={{width:60,height:60,borderRadius:30,backgroundColor:'rgb(255, 124, 19)',
                            alignItems:'center',justifyContent:'center'}}>
                            <Icon name="car" size={30} color="#fff"></Icon>
                        </View>
                        <Text style={{color:'#222',fontWeight:'bold',marginTop:5}}>
                            审车
                        </Text>
                    </TouchableOpacity>


                    <View style={{flex:1,alignItems:'center'}}>

                        <View style={{width:60,height:60,borderRadius:30,backgroundColor:'rgb(50, 139, 255)',
                            alignItems:'center',justifyContent:'center'}}>
                            <Icon name="address-card-o" size={30} color="#fff"></Icon>
                        </View>
                        <Text style={{color:'#222',fontWeight:'bold',marginTop:5}}>
                            审证
                        </Text>
                    </View>


                    <View style={{flex:1,alignItems:'center'}}>

                        <View style={{width:60,height:60,borderRadius:30,backgroundColor:'rgb(64, 210, 116)',
                            alignItems:'center',justifyContent:'center'}}>
                            <Icon name="plane" size={30} color="#fff"></Icon>
                        </View>
                        <Text style={{color:'#222',fontWeight:'bold',marginTop:5}}>
                            接送机
                        </Text>
                    </View>


                    <View style={{flex:1,alignItems:'center'}}>

                        <View style={{width:60,height:60,borderRadius:30,backgroundColor:'rgb(225, 113, 255)',
                            alignItems:'center',justifyContent:'center'}}>
                            <Icon name="train" size={30} color="#fff"></Icon>
                        </View>
                        <Text style={{color:'#222',fontWeight:'bold',marginTop:5}}>
                            接送站
                        </Text>
                    </View>




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
        height: Dimensions.get('window').height - 80,
        marginBottom: 0
    }


});




module.exports = connect()(MapServiceSelect);

