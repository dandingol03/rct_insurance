/**
 * Created by dingyiming on 2017/5/8.
 */
import React,{Component} from 'react';

import  {
    ScrollView,
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

import Config from '../../../config';
import Proxy from '../../proxy/Proxy';

import Market from './Market';
import ExchangeDetail from './ExchangeDetail'


class VipHome extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2Market(goods){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'market',
                component: Market,
                params: {
                    goods:goods
                }
            })
        }
    }

    navigate2ExchangeDetail(good){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'exchange_detail',
                component: ExchangeDetail,
                params: {
                    good:good
                }
            })
        }
    }


    // navigate2Travel()
    // {
    //     const { navigator } = this.props;
    //     if(navigator) {
    //         navigator.push({
    //             name: 'travel',
    //             component: Travel,
    //             params: {
    //             }
    //         })
    //     }
    // }


    renderRow(rowData,sectionId,rowId){

        var image = rowData.image;
        var row=
            <TouchableOpacity style={{flex:1,flexDirection:'row',padding:8,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#ddd'}}
                              onPress={()=>{
                                      //this.navigate2ExchangeDetail(rowData);
                                     }
                }>
                <View style={{flex:1,margin:5}}>
                    <Image resizeMode="stretch" source={require('../../images/cucumber.jpg')} style={{width:100,height:80}}></Image>
                </View>

                <View style={{flex:3,justifyContent:'center',alignItems:'flex-start',margin:10,paddingLeft:30}}>
                    <Text style={{fontSize:18,margin:5}}>{rowData.name}</Text>
                    <Text style={{fontSize:15,margin:5,marginTop:15,color:'#e24d14'}}>{rowData.price}积分</Text>

                </View>

                <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:5,margin:15,borderWidth:1,borderColor:'#e24d14',borderRadius:10,}}>

                    <Text style={{fontSize:16,color:'#e24d14'}}>兑换</Text>
                </View>

            </TouchableOpacity>;
        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {

            goodInfo:{},
            relatedGoods:null,
            dataSource : new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            }),
            userCounters:null,

        };
    }

    render(){

        var goods = [
            {name:'清新田园水果黄瓜',type:'10',price:300,image:'../../img/my_gift@2x.png'},{name:'新鲜多汁西红柿',type:'10',price:500,image:'../../img/my_info@2x.png'},
            {name:'爽口莴苣',type:'0',price:300,image:'../../img/my_gift@2x.png'},{name:'健康西兰花',type:'0',price:500,image:'../../img/my_info@2x.png'},
            {name:'清新田园水果黄瓜',type:'0',price:300,image:'../../img/my_gift@2x.png'},{name:'新鲜多汁西红柿',type:'0',price:500,image:'../../img/my_info@2x.png'},
            {name:'清新田园水果黄瓜',type:'0',price:300,image:'../../img/my_gift@2x.png'},{name:'新鲜多汁西红柿',type:'0',price:500,image:'../../img/my_info@2x.png'},
            {name:'最相思小红豆',type:'11',price:300,image:'../../img/my_gift@2x.png'},{name:'金灿灿小米',type:'11',price:500,image:'../../img/my_info@2x.png'},
            {name:'泰国香米',type:'1',price:300,image:'../../img/my_gift@2x.png'},{name:'大黑豆',type:'1',price:500,image:'../../img/my_info@2x.png'},
            {name:'清新田园水果黄瓜',type:'1',price:300,image:'../../img/my_gift@2x.png'},{name:'新鲜多汁西红柿',type:'1',price:500,image:'../../img/my_info@2x.png'},
            {name:'清新田园水果黄瓜',type:'1',price:300,image:'../../img/my_gift@2x.png'},{name:'新鲜多汁西红柿',type:'1',price:500,image:'../../img/my_info@2x.png'},
            {name:'海南三亚五日游',type:'13',price:300,image:'../../img/my_gift@2x.png'},{name:'华东五市七日游',type:'13',price:500,image:'../../img/my_info@2x.png'},
            {name:'北海道温泉之旅',type:'3',price:300,image:'../../img/my_gift@2x.png'},{name:'迪士尼双飞五日游',type:'3',price:500,image:'../../img/my_info@2x.png'},
            {name:'清新田园水果黄瓜',type:'12',price:300,image:'../../img/my_gift@2x.png'},{name:'新鲜多汁西红柿',type:'12',price:500,image:'../../img/my_info@2x.png'},
            {name:'清新田园水果黄瓜',type:'2',price:300,image:'../../img/my_gift@2x.png'},{name:'新鲜多汁西红柿',type:'2',price:500,image:'../../img/my_info@2x.png'}
            ];

        var vegetable = [];
        var crop = [];
        var travel = [];
        var indexGoods = [];

        goods.map((good,index)=>{
            if(good.type==0|good.type==10)
                vegetable.push(good);
            if(good.type==1|good.type==11)
                crop.push(good);
            if(good.type==3|good.type==13)
                travel.push(good);
            if(good.type==10|good.type==11|good.type==12|good.type==13)
                indexGoods.push(good);
        })


        var generalListView=null;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(indexGoods!==undefined&&indexGoods!==null&&indexGoods.length>0)
        {
            generalListView=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(indexGoods)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>);
        }

        return (
            <View style={{flex:1,backgroundColor:'#ddd'}}>

                {/* header bar */}
                <View style={{flex:1,padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',
                flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                    <TouchableOpacity onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{fontSize:18,flex:3,textAlign:'center',color:'#fff'}}>
                        会员专属
                    </Text>
                </View>

                <Image style={{width:width,flex:6}} source={require('../../images/scoreExchange.jpeg')} />

                <View style={{flex:2,padding:5,flexDirection:'row',justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff'}}>
                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent: 'center',alignItems: 'center',borderRightWidth:1,borderColor:'#ddd'}}>
                       <Icon name="diamond" size={20} color="#aaa"></Icon>
                        <Text style={{fontSize:16,padding:5,color:'#343434'}}>积分:</Text>
                        <Text style={{fontSize:16,color:'#e24d14'}}>{this.props.score}</Text>
                    </View>
                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Icon name="file-text-o" size={20} color="#aaa"></Icon>
                        <Text style={{fontSize:16,padding:5,color:'#343434'}}>兑换记录</Text>
                    </View>
                </View>

                {/* body*/}
                {/*<Image style={{width:width,flex:3,padding:15}} source={require('../../img/bkg1@3x.png')}>*/}

                <View  style={{flexDirection:'row',flex:4,marginTop:10,padding:5,backgroundColor:'#fff'}}>
                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                      onPress={ ()=>{
                                         this.navigate2Market(vegetable);
                                         console.log('绿色蔬菜');
                                       }}>
                        {/*<Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/car@3x.png')}/>*/}
                        <Icon name="shopping-basket" size={35} style={{justifyContent:'center',alignItems:'center'}} color="#2bde73" />
                        <View style={{marginTop:0,padding:5,paddingTop:10}}>
                            <Text style={{fontSize:15,color:'#343434'}}>绿色蔬菜</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                      onPress={ ()=>{
                                          this.navigate2Market(crop);
                                          console.log('有机杂粮');
                                      }}>
                        {/*<Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/life@3x.png')}/>*/}
                        <Icon name="shopping-cart" size={35} style={{justifyContent:'center',alignItems:'center'}} color="#8a6d3b" />
                        <View style={{marginTop:0,padding:5,paddingTop:10}}>
                            <Text style={{fontSize:15,color:'#343434'}}>有机杂粮</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                      onPress={ ()=>{
                                         this.setState({tab:2});
                                         console.log('家庭医生');
                                      }}>
                        {/*<Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/maintain@3x.png')}/>*/}
                        <Icon name="medkit" size={35} style={{justifyContent:'center',alignItems:'center'}} color="#d9534f" />
                        <View style={{marginTop:0,padding:5,paddingTop:10}}>
                            <Text style={{fontSize:15,color:'#343434'}}>家庭医生</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                      onPress={ ()=>{
                                         this.setState({tab:3});
                                         console.log('旅游');
                                      }}>
                        {/*<Image style={{ width:height*100/736,height:height*100/736}} source={require('../../img/drivingService.png')}/>*/}
                        <Icon name="plane" size={35} style={{justifyContent:'center',alignItems:'center'}} color="#2752ff" />
                        <View style={{marginTop:0,padding:5,paddingTop:10}}>
                            <Text style={{fontSize:15,color:'#343434'}}>旅游</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{flex:15,marginTop:10,backgroundColor:'#fff'}}>
                    <View style={{borderBottomWidth:1,borderColor:'#ddd'}}>
                        <Text style={{fontSize:14,padding:10,color:'#343434'}}>大家都在兑</Text>
                    </View>
                    <View>
                        {generalListView}
                    </View>


                </View>

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
        notification:state.notification,
        score:state.user.score,
    })
)(VipHome);
