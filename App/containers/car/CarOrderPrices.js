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
import _ from 'lodash';
import UpdateCarInfo from '../../components/UpdateCarInfo';
import CarOrderPay from './CarOrderPay';


class CarOrderPrices extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2CarOrderPay()
    {

        const {navigator} =this.props;
        if(navigator) {

            var {order}=this.state;
            var price=null;
            order.prices.map((item,i)=>{
                if(item.checked==true)
                    price=item
            })

            navigator.push({
                name: 'CarOrderPay',
                component: CarOrderPay,
                params: {
                    price:price,
                    order:order
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

        var selectedStyle={borderColor:'rgb(255, 59, 48)'};
        var unSelectedStyle={borderColor:'#ccc'};

        var row=(
            <TouchableOpacity style={[{borderWidth:1,backgroundColor:'transparent',
                marginBottom:10,borderRadius:5,paddingBottom:10},rowData.checked==true?selectedStyle:unSelectedStyle,styles.card]}
                              onPress={()=>{
                                  var _order=_.cloneDeep(this.state.order)
                                  _order.prices.map((price,i)=>{
                                      if(price.priceId==rowData.priceId)
                                      {
                                          if(price.checked==true)
                                              price.checked=false;
                                          else
                                              price.checked=true;
                                      }else{
                                          price.checked=false;
                                      }
                                  })
                                this.setState({order:_order})
                        }}
            >

                <View style={lineStyle}>
                    <View style={{borderRadius:6,width:100,justifyContent:'center',alignItems:'center'}}>
                        {
                            rowData.checked==true?
                                <View style={{height:28,borderColor:'rgb(255, 59, 48)',borderRadius:6,borderWidth:1,paddingHorizontal:15,
                                justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                    <Text style={{color:'rgb(255, 59, 48)',fontSize:12}}>已选中</Text>
                                    <Icon name="check" size={20} color="#f1c300"></Icon>
                                </View>:
                                <View style={{height:28,borderColor:'#aaa',borderRadius:6,borderWidth:1,paddingHorizontal:15,
                                justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'#222',fontSize:12}}>点击选中</Text>
                                </View>
                        }

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

                {
                    rowData.nonDeductibleInsurance&&rowData.nonDeductibleInsurance!=0?
                        <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                            <View style={{flex:1,alignItems:'flex-start'}}>
                                <Text style={{color:'#222',fontSize:13}}>
                                    不计免赔
                                </Text>
                            </View>

                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{color:'#222',fontSize:14}}>
                                    {rowData.nonDeductibleInsurance}
                                </Text>
                            </View>
                        </View>:null
                }

                {
                    rowData.carTax&&rowData.carTax>0?
                        <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                            <View style={{flex:1,alignItems:'flex-start'}}>
                                <Text style={{color:'#222',fontSize:13}}>
                                    车船税
                                </Text>
                            </View>

                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{color:'#222',fontSize:14}}>
                                    {rowData.carTax}
                                </Text>
                            </View>
                        </View>:null
                }

                <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                    <View style={{flex:1,alignItems:'flex-start'}}>
                        <Text style={{color:'#0a9dc7',fontWeight:'bold',fontSize:16}}>
                            积分
                        </Text>
                    </View>

                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <Text style={{color:'#0a9dc7',fontWeight:'bold',fontSize:16}}>
                            {rowData.score}
                        </Text>
                    </View>

                </View>




                <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                    <View style={{flex:1,alignItems:'flex-start'}}>
                    </View>

                    <View style={[styles.row,{flex:1,justifyContent:'flex-end'}]}>
                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            总计:
                        </Text>

                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            ￥{rowData.insuranceFeeTotal}
                        </Text>
                    </View>

                </View>

            </TouchableOpacity>);

        return row;
    }


    renderSelectedPrice(rowData)
    {
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

        var selectedStyle={borderColor:'rgb(255, 59, 48)'};
        var unSelectedStyle={borderColor:'#ccc'};

        var row=(
            <TouchableOpacity style={[{borderWidth:1,backgroundColor:'transparent',
                marginBottom:10,borderRadius:5,paddingBottom:10},rowData.checked==true?selectedStyle:unSelectedStyle,styles.card]}
                              onPress={()=>{
                                  var _order=_.cloneDeep(this.state.order)
                                  _order.prices.map((price,i)=>{
                                      if(price.priceId==rowData.priceId)
                                      {
                                          if(price.checked==true)
                                              price.checked=false;
                                          else
                                              price.checked=true;
                                      }else{
                                          price.checked=false;
                                      }
                                  })
                                this.setState({order:_order})
                        }}
            >

                <View style={lineStyle}>
                    <View style={{borderRadius:6,width:100,justifyContent:'center',alignItems:'center'}}>
                        {
                            rowData.checked==true?
                                <View style={{height:28,borderColor:'rgb(255, 59, 48)',borderRadius:6,borderWidth:1,paddingHorizontal:15,
                                justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                    <Text style={{color:'rgb(255, 59, 48)',fontSize:12}}>已选中</Text>
                                    <Icon name="check" size={20} color="#f1c300"></Icon>
                                </View>:
                                <View style={{height:28,borderColor:'#aaa',borderRadius:6,borderWidth:1,paddingHorizontal:15,
                                justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'#222',fontSize:12}}>点击选中</Text>
                                </View>
                        }

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

                {
                    rowData.nonDeductibleInsurance&&rowData.nonDeductibleInsurance!=0?
                        <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                            <View style={{flex:1,alignItems:'flex-start'}}>
                                <Text style={{color:'#222',fontSize:13}}>
                                    不计免赔
                                </Text>
                            </View>

                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{color:'#222',fontSize:14}}>
                                    {rowData.nonDeductibleInsurance}
                                </Text>
                            </View>
                        </View>:null
                }

                {
                    rowData.carTax&&rowData.carTax>0?
                        <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                            <View style={{flex:1,alignItems:'flex-start'}}>
                                <Text style={{color:'#222',fontSize:13}}>
                                    车船税
                                </Text>
                            </View>

                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{color:'#222',fontSize:14}}>
                                    {rowData.carTax}
                                </Text>
                            </View>
                        </View>:null
                }

                <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                    <View style={{flex:1,alignItems:'flex-start'}}>
                        <Text style={{color:'#0a9dc7',fontWeight:'bold',fontSize:16}}>
                            积分
                        </Text>
                    </View>

                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <Text style={{color:'#0a9dc7',fontWeight:'bold',fontSize:16}}>
                            {rowData.score}
                        </Text>
                    </View>

                </View>




                <View style={[styles.row,{alignItems:'center',padding:1,paddingHorizontal:15}]}>

                    <View style={{flex:1,alignItems:'flex-start'}}>
                    </View>

                    <View style={[styles.row,{flex:1,justifyContent:'flex-end'}]}>
                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            总计:
                        </Text>

                        <Text style={{color:'#222',fontWeight:'bold',fontSize:16}}>
                            ￥{rowData.insuranceFeeTotal}
                        </Text>
                    </View>

                </View>

            </TouchableOpacity>);

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
                if(price.isConfirm==1)
                    price.checked=true;
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
        if(state.order.orderState==1)
        {
            if(state.order.prices&&state.order.prices.length>0)
            {
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                var dataSource= ds.cloneWithRows(state.order.prices);
                listView=
                    <ScrollView>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={dataSource}
                            renderRow={this.renderRow.bind(this)}
                        />
                    </ScrollView>;
            }
        }else if(state.order.orderState==2)
        {
            var price=null;
            state.order.prices.map((function (item,i) {
                if(item.checked==true)
                    price=item;
            }))
            var selectedPrice=(
                this.renderSelectedPrice(price)
            );
        }else{}


        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>

                    <View style={[{padding: 10,paddingTop:10,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                            height:40,backgroundColor:'rgba(17, 17, 17, 0.6)'}]}>

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
                    {
                        state.order.orderState==1?
                            <View style={{padding:8,paddingHorizontal:4,height:height-200}}>
                                {listView}
                            </View>:null
                    }

                    {/*用户确认*/}
                    {
                        state.order.orderState==2?
                            <View style={{padding:8,paddingHorizontal:4}}>
                                {selectedPrice}
                            </View>:null
                    }

                    {
                        state.order.orderState==1?
                            <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                            padding:10,borderRadius:10,justifyContent:'center'}]}
                                              onPress={()=>{
                                             this.navigate2CarOrderPay();
                                          }}>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'#fff',fontSize:15}}>提交已选方案</Text>
                                </View>
                            </TouchableOpacity>:null
                    }


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
        borderWidth: 1,
        backgroundColor: '#fff',
        margin: 5,
        padding: 2,
        shadowColor: '#ccc',
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

