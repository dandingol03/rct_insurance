/**
 * Created by danding on 17/3/25.
 */

import React,{Component} from 'react';
import _ from 'lodash';
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



class UserBrochure extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    toggle(field)
    {


        var pictureExample=_.cloneDeep(this.state.pictureExample);
        if(pictureExample[this.props.type][field]==true)
            pictureExample[this.props.type][field]=false;
        else
            pictureExample[this.props.type][field]=true;
        this.setState({pictureExample:pictureExample})

    }

    constructor(props) {
        super(props);
        this.state={
            pictureExample:{
                whiteList:{

                },
                keepAlive:{

                }
            }
        };
    }

    render() {

        var props=this.props;
        var state=this.state;

        var body=null;

        if(props.type=='whiteList')
        {
            //内存白名单
            body=(
                <View style={{padding:10}}>

                    <View style={{height:44,alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderColor:'#ddd'}}>

                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            如何设置推送在后台也能接收?
                        </Text>
                    </View>


                    <View style={{height:40,alignItems:'flex-start',justifyContent:'center',
                        paddingHorizontal:10}}>

                        <Text style={{color:'#555',fontWeight:'bold',fontSize:13}}>
                            首先打开手机桌面或者应用程序中的手机管家，如下图
                        </Text>
                    </View>

                    {/*查看图例*/}
                    <TouchableOpacity style={{height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#ddd',borderRadius:4,
                                marginTop:10,borderWidth:1,borderColor:'#bbb'}}
                                      onPress={()=>{
                                          this.toggle('phoneManager');
                                      }}>
                        <Text style={{color:'#222',fontWeight:'bold'}}>查看图例</Text>
                    </TouchableOpacity>


                    {/*图例部分*/}
                    {
                        state.pictureExample.whiteList.phoneManager==true?
                            <View style={{alignItems:'center',marginTop:10}}>
                                <Image resizeMode="stretch" source={require('../../img/guideNotification3.png')} style={{width:width-80,height:400}}/>
                            </View>:null
                    }

                    <View style={{marginTop:10,paddingHorizontal:10,alignItems:'center'}}>
                        <Text style={{fontSize:13,fontWeight:'bold',color:'#555'}}>接着，打开手机管家的设置，找到内存加速白名单的入口</Text>
                    </View>


                    {/*查看图例*/}
                    <TouchableOpacity style={{height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#ddd',borderRadius:4,
                                marginTop:10,borderWidth:1,borderColor:'#bbb'}}
                                      onPress={()=>{
                                          this.toggle('memoryWhiteList');
                                      }}>
                        <Text style={{color:'#222',fontWeight:'bold'}}>查看图例</Text>
                    </TouchableOpacity>

                    {/*图例部分*/}
                    {
                        state.pictureExample.whiteList.memoryWhiteList==true?
                            <View style={{alignItems:'center',marginTop:10}}>
                                <Image resizeMode="stretch" source={require('../../img/guideNotification1.png')} style={{width:width-80,height:400}}/>
                            </View>:null
                    }


                    <View style={{marginTop:10,paddingHorizontal:10,alignItems:'center'}}>
                        <Text style={{fontSize:13,fontWeight:'bold',color:'#555'}}>
                            在内存白名单中，勾选rct_insurance，使其在后台中也能存活
                        </Text>
                    </View>

                    {/*查看图例*/}
                    <TouchableOpacity style={{height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#ddd',borderRadius:4,
                                marginTop:10,borderWidth:1,borderColor:'#bbb'}}
                                      onPress={()=>{
                                          this.toggle('toggleProject');
                                      }}>
                        <Text style={{color:'#222',fontWeight:'bold'}}>查看图例</Text>
                    </TouchableOpacity>

                    {/*图例部分*/}
                    {
                        state.pictureExample.whiteList.toggleProject==true?
                            <View style={{alignItems:'center',marginTop:10}}>
                                <Image resizeMode="stretch" source={require('../../img/guideNotification2.png')} style={{width:width-80,height:400}}/>
                            </View>:null
                    }



                </View>
            );
        }else{
            //后台保活
            body=(
                <View style={{padding:10}}>

                    <View style={{height:44,alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderColor:'#ddd'}}>

                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            如何设置应用程序在后台保持存活?
                        </Text>
                    </View>


                    <View style={{height:40,alignItems:'flex-start',justifyContent:'center',
                        paddingHorizontal:10}}>

                        <Text style={{color:'#555',fontWeight:'bold',fontSize:13}}>
                            首先打开手机管家,点击权限管理,如下图
                        </Text>
                    </View>

                    {/*查看图例*/}
                    <TouchableOpacity style={{height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#ddd',borderRadius:4,
                                marginTop:10,borderWidth:1,borderColor:'#bbb'}}
                                      onPress={()=>{
                                          this.toggle('authorityConfig');
                                      }}>
                        <Text style={{color:'#222',fontWeight:'bold'}}>查看图例</Text>
                    </TouchableOpacity>


                    {/*图例部分*/}
                    {
                        state.pictureExample.keepAlive.authorityConfig==true?
                            <View style={{alignItems:'center',marginTop:10}}>
                                <Image resizeMode="stretch" source={require('../../img/keepAlive_guide1.png')} style={{width:width-80,height:400}}/>
                            </View>:null
                    }

                    <View style={{marginTop:10,paddingHorizontal:10,alignItems:'center'}}>
                        <Text style={{fontSize:13,fontWeight:'bold',color:'#555'}}>在权限管理的应用标签中点选rct_insurance应用</Text>
                    </View>


                    {/*查看图例*/}
                    <TouchableOpacity style={{height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#ddd',borderRadius:4,
                                marginTop:10,borderWidth:1,borderColor:'#bbb'}}
                                      onPress={()=>{
                                          this.toggle('selectProject');
                                      }}>
                        <Text style={{color:'#222',fontWeight:'bold'}}>查看图例</Text>
                    </TouchableOpacity>

                    {/*图例部分*/}
                    {
                        state.pictureExample.keepAlive.selectProject==true?
                            <View style={{alignItems:'center',marginTop:10}}>
                                <Image resizeMode="stretch" source={require('../../img/keepAlive_projectSelect.png')} style={{width:width-80,height:400}}/>
                            </View>:null
                    }


                    <View style={{marginTop:10,paddingHorizontal:10,alignItems:'center'}}>
                        <Text style={{fontSize:13,fontWeight:'bold',color:'#555'}}>
                            在rct_insurance应用内,打开应用自动启动
                        </Text>
                    </View>

                    {/*查看图例*/}
                    <TouchableOpacity style={{height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#ddd',borderRadius:4,
                                marginTop:10,borderWidth:1,borderColor:'#bbb'}}
                                      onPress={()=>{
                                          this.toggle('openAutoStart');
                                      }}>
                        <Text style={{color:'#222',fontWeight:'bold'}}>查看图例</Text>
                    </TouchableOpacity>

                    {/*图例部分*/}
                    {
                        state.pictureExample.keepAlive.openAutoStart==true?
                            <View style={{alignItems:'center',marginTop:10}}>
                                <Image resizeMode="stretch" source={require('../../img/keepAlive_openAutoStart.png')} style={{width:width-80,height:400}}/>
                            </View>:null
                    }



                </View>
            );
        }



        return (
            <View style={styles.container}>
                <ScrollView>
                    {/*need to finish*/}
                    <View style={{height:40,width:width,flexDirection:'row',
                        alignItems:'center',justifyContent:'flex-start',borderBottomWidth:1,borderColor:'#ccc'}}>
                        <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                          onPress={()=>{
                                          this.goBack();
                                      }}>

                            <Icon name="angle-left" size={40} color="#222"></Icon>
                        </TouchableOpacity>


                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#222',fontSize:16,fontWeight:'bold'}}>用户手册</Text>
                        </View>

                        <View style={{width:80,justifyContent:'center',marginTop:20,paddingLeft:10}}>
                        </View>
                    </View>


                    <View style={{height:20,width:width,paddingLeft:12,paddingRight:12,flexDirection:'row',backgroundColor:'#eee',
                        alignItems:'center',borderTopWidth:0,borderBottomWidth:1,borderColor:'#ccc'}}>
                    </View>

                    {body}

                </ScrollView>

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



module.exports = connect()(UserBrochure);
