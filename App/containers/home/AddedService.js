/**
 * Created by dingyiming on 2017/5/8.
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
import CarManage from '../car/CarManage';
import BaiduHome from '../map/BaiduHome';

import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import {
    closeMessage
} from '../../action/JpushActions';


class AddedService extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
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

    navigate2BaiduHome()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'BaiduHome',
                component: BaiduHome,
                params: {
                }
            })
        }
    }

    renderRow(rowData,sectionId,rowId){
        var lineStyle=null;
        if(parseInt(rowId)%2==0)
        {
            lineStyle={flex:1,flexDirection:'row',padding:8,borderBottomWidth:1,borderLeftWidth:1,borderRightWidth:1,
                borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'#C4D9FF'};
        }else{
            lineStyle={flex:1,flexDirection:'row',padding:8,borderBottomWidth:1,borderLeftWidth:1,borderRightWidth:1,
                borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'#fff'}
        }

        var chebx=null;
        if(rowData.checked==true)
        {
            chebx=<CheckBox
                style={{flex: 1, padding: 2}}
                onClick={()=>{
                      var relatedGoods=_.cloneDeep(this.state.relatedGoods);
                      relatedGoods.map(function(good,i) {
                        if(good.priceId==rowData.priceId)
                            good.checked=false;
                      });
                       this.setState({relatedGoods: relatedGoods,dataSource:this.state.dataSource.cloneWithRows(relatedGoods)});
                }}
                isChecked={true}
                leftText={null}
            />;
        }else{
            chebx=<CheckBox
                style={{flex: 1, padding: 2}}
                onClick={()=>{
                      var relatedGoods=_.cloneDeep(this.state.relatedGoods);
                      relatedGoods.map(function(good,i) {
                        if(good.priceId==rowData.priceId)
                            good.checked=true;
                      });
                       this.setState({relatedGoods: relatedGoods,dataSource:this.state.dataSource.cloneWithRows(relatedGoods)});

                }}
                isChecked={false}
                leftText={null}
            />;
        }

        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                        //TODO:
                    }.bind(this)}>
                    <View style={lineStyle}>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                            {chebx}
                        </View>

                        <View style={{flex:10,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:8}}>
                            <Text style={{color:'#000',fontWeight:'bold',fontSize:18}}>{rowData.codigo+'\n'+rowData.goodName}</Text>
                        </View>

                    </View>
                </TouchableOpacity>

            </View>;
        return row;
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

    constructor(props)
    {
        super(props);
        this.state = {
            goodInfo:{},
            relatedGoods:null,
            selectAll:false,
            alerts:[],
            dataSource : new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            }),
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
                <Image style={{ width:width,flex:2}} source={require('../../img/newBanner@3x.png')} />

                <TouchableOpacity style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center',position:'absolute',top:parseInt(height*20/667),
              margin:5,padding:5}} onPress={ ()=>{
                                             this.goBack();}}>
                    <Icon name="angle-left" size={40} color="#fff" />
                </TouchableOpacity>

                {/* body*/}
                <Image style={{width:width,flex:3,padding:15}} source={require('../../img/bkg1@3x.png')}>

                    <View  style={{flexDirection:'row',flex:1}}>

                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',padding:8}}
                                          onPress={ ()=>{
                                                    this.navigate2Maintain();
                                                }}>
                            <Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/maintain@3x.png')}/>
                            <View style={{marginTop:0,padding:12}}>
                                <Text style={{fontSize:18,color:'#222'}}>维修</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',padding:8}}
                                          onPress={ ()=>{
                                                    this.navigate2BaiduHome();
                                                }}>
                            <Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/drivingService.png')}/>
                            <View style={{marginTop:0,padding:12}}>
                                <Text style={{fontSize:18,color:'#222'}}>增值服务</Text>
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
)(AddedService);
