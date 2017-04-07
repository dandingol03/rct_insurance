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
    TextInput,
    ScrollView,
    Alert,
    Modal,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';
import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import NewCarBind from '../../components/modal/NewCarBind';
import UpdateCarInfo from '../../components/UpdateCarInfo';
import CarInsurance from './CarInsurance';
import CarInfoDetail from './CarInfoDetail';



class CarOrderPrices extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    toggleAll(){
        if(this.state.relatedGoods!==undefined&&this.state.relatedGoods!==null)
        {
            var relatedGoods=_.cloneDeep(this.state.relatedGoods);
            if(this.state.selectAll!=true)
            {
                relatedGoods.map(function (good, i){
                    good.checked=true;
                });
            }else{
                relatedGoods.map(function (good, i){
                    good.checked=false;
                });
            }
            var dataSource = this.state.dataSource.cloneWithRows(relatedGoods);
            this.setState({
                relatedGoods: relatedGoods,
                selectAll:!this.state.selectAll,
                dataSource:dataSource
            });
        }
    }



    navigate2NewCarCreate(carNum,city)
    {

        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'updateCarInfo',
                component: UpdateCarInfo,
                params: {
                    carNum: carNum,
                    city:city
                }
            })
        }
    }


    renderProductRow(rowData,sectionId,rowId){
        var row= (
            <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                <View style={{flex:2,justifyContent:'center',alignItems:'flex-start'}}>
                    <Text style={{color:'#222',fontSize:13}}>
                        {rowData.productName}
                    </Text>
                </View>

                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#222',fontSize:14}}>
                        {rowData.insuranceType}
                    </Text>
                </View>

                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <Text style={{color:'#222',fontSize:14}}>
                        ￥{rowData.insuranceFee}
                    </Text>
                </View>

            </View>);

        return row;
    }


    renderRow(rowData,sectionId,rowId){


        var lineStyle={flexDirection:'row',padding:4,height:60,justifyContent:'flex-start'}

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource= ds.cloneWithRows(rowData.items);
        var productList=(
            <ListView
                automaticallyAdjustContentInsets={false}
                dataSource={dataSource}
                renderRow={(rowData)=>{
                   return  this.renderProductRow(rowData)
                }}
            />);

        var row=
            <View style={{borderColor:'#ccc',borderWidth:1,backgroundColor:'transparent',
                marginBottom:10,borderRadius:5,paddingBottom:10}}>

                <View style={lineStyle}>
                    <View style={{borderRadius:6,width:100,justifyContent:'center',alignItems:'center'}}>
                        <View style={{height:28,borderColor:'#aaa',borderRadius:6,borderWidth:1,paddingHorizontal:15,
                                justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#222',fontSize:12}}>点击选中</Text>
                        </View>

                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start',paddingLeft:20}}>
                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                            ￥<Text style={{color:'#f00',fontSize:26}}>{rowData.insuranceFeeTotal}</Text>
                        </Text>
                    </View>
                </View>

                {/*公司名称*/}
                <View style={[styles.row,{justifyContent:'center',alignItems:'center',marginBottom:4}]}>
                    <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                        {rowData.companyName.replace('股份有限公司','')}
                    </Text>
                </View>

                <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                    <View style={{flex:1,alignItems:'flex-start'}}>
                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            车牌号
                        </Text>
                    </View>

                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            {this.state.order.carNum}
                        </Text>
                    </View>

                </View>

                {productList}




            </View>;

        return row;
    }



    fetchData(){


    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        var order=props.order;
        if(order.prices&&order.pricedCount>0)
        {
            order.prices.map((price,i)=>{
                price.insuranceFeeTotal=parseFloat(price.contractFee.toFixed(2));
                if(price.carTax!==undefined&&price.carTax!==null)
                    price.insuranceFeeTotal+=price.carTax;
            })
            if(order.prices.length==1)
                order.prices[0].checked=true;
        }
        this.state = {
            order:order,
            selectAll:false,
            dataSource : null,
            modalVisible:false,
            doingFetch:false
        };
    }


    render(){


        var props=this.props;
        var state=this.state;

        var listView=null;
        if(props.order.prices&&props.order.prices.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource= ds.cloneWithRows(props.order.prices);
            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }



        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>

                    <View style={[{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:54,backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>

                        <TouchableOpacity style={{width:80}} onPress={()=>{
                            this.goBack();
                        }}>

                            <Icon name="angle-left" size={40} color="#fff"></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize:17,flex:1,paddingLeft:10,textAlign:'center',color:'#fff'}}>
                            车险估价列表
                        </Text>
                        <View style={{width:80}}>

                        </View>

                    </View>



                    {/*估价列表*/}
                    <View style={{padding:8,paddingHorizontal:4,height:height-274}}>
                        {listView}
                    </View>

                    <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                            padding:10,borderRadius:10,justifyContent:'center'}]}
                                      onPress={()=>{
                                             this.setState({modalVisible:true});
                                          }}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:15}}>提交已选方案</Text>
                        </View>
                    </TouchableOpacity>


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
        height:290
    },
    module:{
        width:90,
        height:90
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row'
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'rgba(0,0,0,0.3)'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(CarOrderPrices);

