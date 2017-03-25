
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
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import UserBrochure from './UserBrochure';


class HelpAndConfig extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2UserBrochure(type)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'UserBrochure',
                component: UserBrochure,
                params: {
                    type:type
                }
            })
        }
    }


    constructor(props) {
        super(props);
        this.state={
        };
    }

    render() {

        var props=this.props;
        var state=this.state;




        return (
            <View style={styles.container}>

                {/*need to finish*/}
                <View style={{height:40,width:width,flexDirection:'row',
                    alignItems:'center',justifyContent:'flex-start'}}>
                    <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                      onPress={()=>{
                                          this.goBack();
                                      }}>

                        <Icon name="angle-left" size={40} color="#222"></Icon>
                    </TouchableOpacity>


                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#222',fontSize:16,fontWeight:'bold'}}>帮助</Text>
                    </View>

                    <View style={{width:80,justifyContent:'center',marginTop:20,paddingLeft:10}}>
                    </View>
                </View>

                {/*App推送设置指导*/}
                <View style={{height:40,width:width,paddingLeft:12,paddingRight:12,flexDirection:'row',backgroundColor:'#ddd',
                        alignItems:'center',borderTopWidth:0,borderBottomWidth:1,borderColor:'#ccc'}}>

                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>

                        <Text style={{color:'#222',fontSize:14,marginLeft:12,fontWeight:'bold'}}>
                            App推送设置指导:
                        </Text>
                    </View>
                </View>

                <View style={{padding:3,paddingHorizontal:12,height:37}}>
                    <TouchableOpacity style={{borderColor:'#aaa',borderBottomWidth:1,flexDirection:'row',flex:1}}
                                      onPress={()=>{
                                          this.navigate2UserBrochure('whiteList');
                                      }}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>1.如何设置内存白名单</Text>
                        </View>

                        <View style={{width:60,justifyContent:'center',alignItems:'center'}}>
                            <Icon name="angle-right" size={30} color="#222"></Icon>
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={{padding:3,paddingHorizontal:12,height:37,marginTop:5}}>
                    <TouchableOpacity style={{borderColor:'#aaa',borderBottomWidth:1,flexDirection:'row',flex:1}}
                                      onPress={()=>{
                                          this.navigate2UserBrochure('keepAlive');
                                      }}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={{color:'#222',fontWeight:'bold'}}>2.设置App在后台也能收到推送消息</Text>
                        </View>

                        <View style={{width:60,justifyContent:'center',alignItems:'center'}}>
                            <Icon name="angle-right" size={30} color="#222"></Icon>
                        </View>
                    </TouchableOpacity>

                </View>


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
    }

});




module.exports = connect()(HelpAndConfig);
