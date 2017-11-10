/**
 * Created by dingyiming on 2017/5/8.
 */
/**
 * Created by dingyiming on 2017/2/15.
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
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import Life from '../life/Life.js';
import Maintain from '../maintain/Maintain.js';
import Insurance from './Insurance';
import AddedService from './AddedService';
import VipHome from '../vip/VipHome';

import Config from '../../../config';
import Proxy from '../../proxy/Proxy';

import ViewPager from 'react-native-viewpager';

var IMGS = [
    require('../../img/newBanner@3x.png'),
    require('../../images/banner1.jpeg'),
    require('../../images/banner2.jpeg'),
];

class Home extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    sendNotification(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.props.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'sendNotification',
            }
        },(json)=> {
            if(json.re==1){
                console.log('发送成功');
            }
            else{
                console.log('发送失败');
            }
        }, (err) =>{
        });
    }

    navigate2Insurance(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'car_manage',
                component: Insurance,
                params: {
                }
            })
        }
    }

    navigate2AddedService(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'added_service',
                component: AddedService,
                params: {
                }
            })
        }
    }

    navigate2Maintain(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'maintain',
                component: Maintain,
                params: {
                }
            })
        }
    }

    navigate2VipHome()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'vip_home',
                component: VipHome,
                params: {
                }
            })
        }
    }

    getUserCounters(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.props.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchUserCounters',

            }
        },(json)=> {
            if(json.re==1){
                this.setState({userCounters:json.data});
            }
            else{

            }
        }, (err) =>{
        });
    }

    getOrderCounters(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.props.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchOrderCounters',
            }
        },(json)=> {
            if(json.re==1){
                this.setState({orderCounters:json.data});
            }
            else{

            }
        }, (err) =>{
        });
    }


    _renderPage(data,pageID){
        return (

        <View style={{width:width}}>
            <Image
                source={data}
                style={{width:width,flex:3}}
                resizeMode={"stretch"}
            />
        </View>

        );
    }

    constructor(props)
    {
        super(props);
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        this.state = {
            goodInfo:{},
            relatedGoods:null,
            selectAll:false,
            alerts:[],
            dataSource:ds.cloneWithPages(IMGS),
            userCounters:null,
            orderCounters:null,

    };
    }

    render(){

        if(this.state.userCounters==null){
            this.getUserCounters();
        }
        if(this.state.userCounters==null){
            this.getOrderCounters();
        }

        return (
            <View style={{flex:1}}>

                {/* header bar */}
                {/*<Image style={{ width:width,flex:2}} source={require('../../img/newBanner@3x.png')} />*/}
                <View style={{width:width,flex:2}}>
                    <ViewPager
                        style={this.props.style}
                        dataSource={this.state.dataSource}
                        renderPage={this._renderPage}
                        isLoop={true}
                        autoPlay={true}
                    />
                </View>

                <View style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center',position:'absolute',top:parseInt(height*200/736),
                backgroundColor:'rgba(255, 255, 255, 0.5)',margin:5,padding:5}}>
                    <View style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center',paddingRight:10,}}>
                        <Text>注册人数:</Text>
                        <Text>{this.state.userCounters}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center',paddingRight:10,}}>
                        <Text>成交订单数:</Text>
                        <Text>{this.state.userCounters}</Text>
                    </View>
                </View>

                {/* body*/}
                <Image style={{width:width,flex:3,padding:15}} source={require('../../img/bkg1@3x.png')}>

                    <View  style={{flexDirection:'row',flex:1}}>
                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',padding:8}}
                                          onPress={ ()=>{
                                                       this.navigate2Insurance();

                                              }}>
                            <Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/home-insurance@3x.png')}/>
                            <View style={{marginTop:0,padding:12}}>
                                <Text style={{fontSize:18,color:'#222'}}>保险</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',padding:8}}
                                          onPress={ ()=>{
                                                   this.navigate2AddedService();
                                                }}>
                            <Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/drivingService@3x.png')}/>
                            <View style={{marginTop:0,padding:12}}>
                                <Text style={{fontSize:18,color:'#222'}}>服务</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View  style={{flexDirection:'row',flex:1}}>

                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',padding:8}}
                                          onPress={ ()=>{
                                                   console.log('保单贷款');
                                                }}>
                            <Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/home-loan@3x.png')}/>
                            <View style={{marginTop:0,padding:12}}>
                                <Text style={{fontSize:18,color:'#222'}}>保单贷款</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',padding:8}}
                                          onPress={ ()=>{
                                                    this.navigate2VipHome();
                                                }}>
                            <Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/home-vip@3x.png')}/>
                            <View style={{marginTop:0,padding:12}}>
                                <Text style={{fontSize:18,color:'#222'}}>会员专属</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

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
    card: {
        borderBottomWidth: 0,
        shadowColor: '#eee',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    logo:{
        width:width,
        flex:2
    },
    module:{
        width:width*1/2,
        height:height*3/10
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        flex:1
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        notification:state.notification
    })
)(Home);
