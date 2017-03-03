/**
 * Created by dingyiming on 2017/3/2.
 */
import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import DateFilter from '../../filter/DateFilter';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';

class Evaluate extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    starSetter(index){
        var index=index;
        var stars = this.state.stars;

        for(var i=0;i<=index;i++) {
            stars[i].checked=true;
        }
        for(var i=index+1;i<=4;i++) {
            stars[i].checked=false;
        }
        var starCount=index+1;
        this.setState({stars:stars,starCount:starCount});

    }

    submit(){

        if(this.state.starCount==undefined||this.state.starCount==null)
        {
            Alert.alert(
                '信息',
                '请在评价一栏进行打分',
                [
                    {text: 'OK', onPress: () => {
                       console.log('请在评价一栏进行打分');
                    }},
                ]
            )
        }

        var evaluate =  this.state.starCount;

        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'updateServiceOrder',
                info: {
                    order:{
                        orderId:this.props.order.orderId,
                        evaluate: evaluate,
                        proposal:this.state.proposal,
                        evaluateTime:new Date()
                    }
                }
            }
        }, (res)=> {
            var json = res;
            if(json.re==1)
            {
                Alert.alert(
                    '信息',
                    '订单评价成功',
                    [
                        {text: 'OK', onPress: () => {
                           this.goBack();
                        }},
                    ]
                )
            }
        }, (err) =>{
            var str='';
            for(var field in err)
                str += field + ':' + err[field];
            alert('error=\r\n' + str);
        });

    }


    constructor(props) {
        super(props);
        const { accessToken } = this.props;
        this.state={
            accessToken: accessToken,
            proposal:'',
            stars:[
                {index:0,checked:false},
                {index:1,checked:false},
                {index:2,checked:false},
                {index:3,checked:false},
                {index:4,checked:false}
            ],
            starCount:null,
        };
    }

    render() {
        var order = this.props.order;

        return (
            <View style={{ flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor:'#f5f5f5'}}>

                <View style={{flex:1,paddingBottom:5,paddingTop:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                               backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                    <TouchableOpacity  style={{paddingLeft:10}} onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{fontSize:17,flex:4,paddingRight:20,textAlign:'center',color:'#fff'}}>
                        评价订单
                    </Text>
                </View>

                <View style={{flex:6,justifyContent: 'center',alignItems: 'center',padding:5,backgroundColor:'#fff'}}>
                    <View style={{flex:1,width:width*0.95,justifyContent: 'center',alignItems: 'flex-start',borderBottomWidth:1,borderColor:'#ddd'}}>
                        <Text style={{paddingLeft:10}}>订单信息</Text>
                    </View>

                    <View style={{flex:7,justifyContent: 'center',alignItems: 'center',padding:10}}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',marginTop:10}}>
                            <Text style={{flex:1,color:'#343434'}}>地点：</Text>
                            <Text style={{flex:3,color:'#343434'}}>{order.orderNum}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text style={{flex:1,color:'#343434'}}>预约时间：</Text>
                            <Text style={{flex:3,color:'#343434'}}>{DateFilter.filter(order.estimateTime, 'yyyy-mm-dd')}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text style={{flex:1,color:'#343434'}}>完成时间：</Text>
                            <Text style={{flex:3,color:'#343434'}}>{DateFilter.filter(order.orderFinishDate, 'yyyy-mm-dd')}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text style={{flex:1,color:'#343434'}}>服务费：</Text>
                            <Text style={{flex:3,color:'#343434'}}>{order.fee}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text style={{flex:1,color:'#343434'}}>服务类型：</Text>
                            <Text style={{flex:3,color:'#343434'}}>{order.serviceName}</Text>
                        </View>
                        <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text style={{flex:1,color:'#343434'}}>服务内容：</Text>
                            <Text style={{flex:3,justifyContent:'flex-start',alignItems:'center',color:'#343434'}}>{order.subServiceContent}</Text>
                        </View>
                    </View>
                </View>

                <View  style={[styles.card,{flex:6,width:width*0.95,marginBottom:10,marginTop:20,position:'relative',padding:0}]}>
                    <View style={{flex:1,padding:5,alignItems:'center',justifyContent:'center',backgroundColor:'#f5f5f5',borderBottomWidth:1,borderColor:'#ddd'}}>
                        <Text>评价</Text>
                    </View>
                   <View style={{flex:7,padding:5,alignItems:'flex-start',justifyContent:'flex-start'}}>
                       <View style={{flex:1,width:width*0.9,paddingLeft:10,flexDirection:'row',justifyContent: 'flex-start',alignItems: 'center',borderBottomWidth:1,borderColor:'#ddd'}}>
                           <TouchableOpacity  style={{paddingLeft:5}}
                                              onPress={()=>{
                                                 this.starSetter(0);}}>
                               {
                                   this.state.stars[0].checked==false?
                                       <Icon name="star-o" size={20} color="#343434" style={{paddingLeft:5}}></Icon>:
                                       <Icon name="star" size={20} color="#343434" style={{paddingLeft:5}}></Icon>

                               }
                           </TouchableOpacity>
                           <TouchableOpacity  style={{paddingLeft:5}}
                                              onPress={()=>{
                                                 this.starSetter(1);}}>
                               {
                                   this.state.stars[1].checked==false?
                                       <Icon name="star-o" size={20} color="#343434" style={{paddingLeft:5}}></Icon>:
                                       <Icon name="star" size={20} color="#343434" style={{paddingLeft:5}}></Icon>

                               }
                           </TouchableOpacity>
                           <TouchableOpacity  style={{paddingLeft:5}}
                                              onPress={()=>{
                                                 this.starSetter(2);}}>
                               {
                                   this.state.stars[2].checked==false?
                                       <Icon name="star-o" size={20} color="#343434" style={{paddingLeft:5}}></Icon>:
                                       <Icon name="star" size={20} color="#343434" style={{paddingLeft:5}}></Icon>

                               }
                           </TouchableOpacity>
                           <TouchableOpacity  style={{paddingLeft:5}}
                                              onPress={()=>{
                                                 this.starSetter(3);}}>
                               {
                                   this.state.stars[3].checked==false?
                                       <Icon name="star-o" size={20} color="#343434" style={{paddingLeft:5}}></Icon>:
                                       <Icon name="star" size={20} color="#343434" style={{paddingLeft:5}}></Icon>

                               }
                           </TouchableOpacity>
                           <TouchableOpacity  style={{paddingLeft:5}}
                                              onPress={()=>{
                                                 this.starSetter(4);}}>
                               {
                                   this.state.stars[4].checked==false?
                                       <Icon name="star-o" size={20} color="#343434" style={{paddingLeft:5}}></Icon>:
                                       <Icon name="star" size={20} color="#343434" style={{paddingLeft:5}}></Icon>

                               }
                           </TouchableOpacity>

                           {
                               this.state.starCount==1?<Text style={{paddingLeft:50}}>极差</Text>:null
                           }
                           {
                               this.state.starCount==2?<Text style={{paddingLeft:50}}>失望</Text>:null
                           }
                           {
                               this.state.starCount==3?<Text style={{paddingLeft:50}}>一般</Text>:null
                           }
                           {
                               this.state.starCount==4?<Text style={{paddingLeft:50}}>满意</Text>:null
                           }
                           {
                               this.state.starCount==5?<Text style={{paddingLeft:50}}>惊喜</Text>:null
                           }

                       </View>
                       <View style={{flex:4,width:width*0.9,padding:5}}>
                           <Text style={{flex:1,paddingLeft:10,paddingBottom:0,color:'#343434'}}>建议</Text>
                           <TextInput
                               style={{flex:4,borderWidth:1,padding:10,fontSize:13,marginTop:5,borderColor:'#ddd'}}
                               onChangeText={(proposal) =>
                                {
                                    var proposal = proposal;
                                  this.setState({proposal:proposal})
                                }}
                               value={this.state.proposal}
                               placeholder='请给出评价或建议...'
                               placeholderTextColor="#aaa"
                               underlineColorAndroid="transparent"
                               multiline='true'
                               />
                       </View>

                   </View>
                </View>

                <TouchableOpacity  style={{flex:1,width:width*0.5,margin:10,borderRadius:8,backgroundColor:'#11c1f3',justifyContent: 'center',alignItems: 'center'}}
                                   onPress={()=>{
                                                 this.submit();}}>
                <View>
                    <Text style={{color:'#fff'}}>提交</Text>
                </View>
                </TouchableOpacity>

            </View>

        )

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer:{
        marginTop: 30
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
});


module.exports = connect(state=>({
    accessToken:state.user.accessToken
    })
)(Evaluate);
