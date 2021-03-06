/**
 * Created by danding on 17/4/7.
 */

import React,{Component} from 'react';

import  {
    Modal,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ListView,
    TextInput
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import CarOrders from '../../containers/car/CarOrders';
import {
    fetchRecvAddresses,
    getOrderStateByOrderId,
    getCarValidateState,
    applyCarOrderPrice,
    updateInsuranceCarOrder,
    enableCarOrderRefresh
} from '../../action/CarActions';
import UploadCarAttachModal from '../../components/modal/UploadCarAttachModal';

import {
    updateRootTab
}  from '../../action/TabActions';


class CarOrderPay extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    applyCarOrderPrice()
    {
        var {price,order}=this.state;
        var invoiceTitle=order.invoiceTitle;
        this.props.dispatch(applyCarOrderPrice({price:price,invoiceTitle:invoiceTitle})).then((json)=>{
            price.discount=1;
            if(json.re==1)
            {
                this.props.dispatch(updateInsuranceCarOrder({order:order,price:price})).then((json)=>{
                    if(json.re==1)
                    {


                        Alert.alert('信息','核保已通过,请至就近网点刷卡或银行转账:'+'\r\n'+'户名:青岛海纳汽车保险销售有限公司济南分公司高新营业部'+'\r\n'+
                            '开户行:招商银行济南分行济南高新支行'+'\r\n'+'帐号:531904581010801',[
                            {
                                text:'确认',onPress:()=>{
                                    this.props.dispatch(enableCarOrderRefresh());
                                    this.props.dispatch(updateRootTab({tab:'my'}));

                                    var {navigator} =this.props;
                                    if(navigator) {
                                        navigator.popToTop();
                                    }

                                }
                            }
                        ]);


                    }
                })
            }
        }).catch((e)=>{
            alert(e)
        })


    }

    checkCarNeedValidateWhetherOrNot()
    {
        var {order}=this.state;
        var carId=order.carId;
        this.props.dispatch(getCarValidateState({carId:carId})).then((json)=>{
            if(json.re==1)
            {
                //不需要验车
                this.applyCarOrderPrice();
            }else if(json.re==2)
            {
                //TODO:verify carAttachId
                Proxy.postes({
                    url: Config.server + '/svr/request',
                    headers: {
                        'Authorization': "Bearer " + this.props.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request: 'verifyCarAttachComplete',
                        info:{
                            carId:this.props.order.carId,
                        }
                    }
                }).then((json)=>{

                    if(json.re==1) {
                        if(json.data==true)
                            this.applyCarOrderPrice();
                        else
                        {
                            Alert.alert('信息','提交订单需要上传验车照片，是否现在上传',[
                                {
                                    text:'确认',onPress:()=>{ this.setState({carAttachModal:true})}
                                }
                            ])

                        }
                    }else{
                        Alert.alert('信息',json.data,[
                            {
                                text:'确认',onPress:()=>{}
                            }
                        ])
                    }
                });

            }else{
                alert('返回信息不正确');
            }
        }).catch((e)=>{
            alert(e)
        })
    }


    //购买车险
    apply()
    {
        var {order}=this.state;
        if(order.invoiceTitle&&order.invoiceTitle!='')
        {
            this.props.dispatch(getOrderStateByOrderId({orderId:order.orderId})).then((json)=>{
                if(json.re==1)
                {
                    var confirmed=json.data;
                    if(confirmed==true)
                    {

                        Alert.alert(
                            '错误',
                            '您已支付过一次'
                        );
                        return ;
                    }else{

                        this.checkCarNeedValidateWhetherOrNot();
                    }
                }else{
                    Alert.alert(
                        '错误',
                        '无效的orderId'
                    );
                }
            }).catch((e)=>{
                alert(e)
            })
        }
    }


    renderProductRow(rowData,sectionId,rowId){

        var lineStyle={flex:1,flexDirection:'row',padding:8,paddingHorizontal:4,borderBottomWidth:1,
            borderColor:'#aaa',justifyContent:'flex-start',backgroundColor:'transparent'};


        var row=(
            <View style={lineStyle}>

                <View style={{flex:3,justifyContent:'center',alignItems:'flex-start'}}>
                    <Text style={{color:'#222',fontSize:13}}>
                        {rowData.productName}
                    </Text>
                </View>


                <View style={{flex:2,justifyContent:'center',alignItems:'flex-start'}}>
                    <Text style={{color:'#222',fontSize:14}}>
                        保费:￥{rowData.insuranceFee}
                    </Text>
                </View>

            </View>
        );
        return row;
    }


    renderRow(rowData,sectionId,rowId){

        var lineStyle={flex:1,flexDirection:'row',padding:2,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};

        var row=(
            <TouchableOpacity style={lineStyle} onPress={()=>{

                  }}>

                <View style={{flex:1,justifyContent:'center',alignItems:'flex-start',padding:6,paddingTop:10,
                        borderColor:'#ddd'}}>

                    <Text style={{fontSize:13,paddingTop:2,justifyContent:'flex-start',alignItems:'flex-start',color:'#222'}}>
                        {rowData.address}
                    </Text>
                </View>

                {
                    rowData.checked==true?
                        <View style={{width:50,alignItems:'center',justifyContent:'center'}}>
                            <Icon name="check" size={24} color="#d6730d"/>
                        </View>:null
                }

            </TouchableOpacity>
        );
        return row;
    }

    fetchData()
    {
        //TODO:拉取邮箱地址
        this.props.dispatch(fetchRecvAddresses()).then((json)=>{
            if(json.re==1)
            {
                var addresses=[];
                json.data.map(function(add,i) {
                    if(i==0)
                    {
                        add.checked=true;
                    }
                    addresses.push(add);
                });
                this.setState({addresses:addresses,fetched:true})
            }else{
                this.setState({fetched:true});
            }
        }).catch((e)=>{
           alert(e)
        });
    }


    constructor(props) {
        super(props);
        this.state={
            price:props.price,
            order:props.order,
            personInfo:props.personInfo,

            carAttachModal:false,
            nv:props.nv,
            fetched:false,

        };
    }

    render() {

        var props=this.props;
        var state=this.state;

        var {fetched}=state;
        var addrList=null;
        if(this.state.addresses&&this.state.addresses.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            addrList=(
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(this.state.addresses)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            if(fetched==false)
                this.fetchData()
        }

        var productList=null;
        if(state.price.items&&state.price.items.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            productList=(
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(state.price.items)}
                    renderRow={this.renderProductRow.bind(this)}
                />
            );
        }


        return (
            <View style={styles.container}>

                <View style={[{width:width,height:40,padding:10,paddingTop:10,alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'}]}>
                    <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}
                                      onPress={()=>{
                            this.goBack();
                        }}>
                        <Icon name="angle-left" size={40} color="#fff"/>
                    </TouchableOpacity>

                    <View style={{flex:4,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:17,color:'#fff',marginLeft:4}}>
                            车险支付页面
                        </Text>
                    </View>

                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    </View>
                </View>



                {/*body*/}
                <ScrollView>
                    <View style={{padding:2}}>

                        {/*邮件地址*/}
                        <View style={[styles.card,{borderWidth:1,borderBottomColor:'#ddd',borderTopColor:'#eee',borderLeftWidth:0,
                        borderRightWidth:0}]}>

                            <View style={[styles.row,{padding:4,paddingHorizontal:4}]}>

                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                    <Icon name="envelope-o" size={20} color="#d6730d"/>
                                    <Text style={{color:'#d6730d',fontSize:13,marginLeft:10}}>收件信息</Text>
                                </View>

                                <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}
                                                  onPress={()=>{
                                    //TODO:
                            }}>
                                    <Icon name="plus" size={20} color="#0f0fff"/>
                                    <Text style={{color:'#0f0fff',fontSize:13,marginLeft:5}}>新增收件地址</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{padding:4,paddingHorizontal:4}}>
                                {addrList}
                            </View>

                        </View>

                        {/*发票抬头*/}
                        <View style={[styles.card,{borderWidth:1,borderBottomColor:'#ddd',borderTopColor:'#eee',borderLeftWidth:0,
                        borderRightWidth:0}]}>

                            <View style={[styles.row,{padding:8,paddingHorizontal:4}]}>

                                <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                    <Icon name="tag" size={20} color="#d6730d"/>
                                    <Text style={{color:'#d6730d',fontSize:13,marginLeft:10}}>发票抬头</Text>
                                </View>

                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                    <View style={{borderBottomWidth:1,borderBottomColor:'#00f',flex:1}}>
                                        <TextInput
                                            style={{height: 30,fontSize:13,color:'#222',flex:1}}
                                            onChangeText={(invoiceTitle) => {
                                                this.setState({order:Object.assign(state.order,{invoiceTitle:invoiceTitle})});
                                            }}
                                            value={this.state.order.invoiceTitle}
                                            placeholder={props.personInfo.perName}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="characters"
                                        />
                                    </View>
                                </View>

                            </View>
                        </View>


                        {/*车险险别*/}
                        <View style={[styles.card,{borderWidth:1,borderBottomColor:'#ddd',borderTopColor:'#eee',borderLeftWidth:0,
                        borderRightWidth:0,padding:6}]}>
                            {productList}

                            {
                                state.price.nonDeductibleInsurance&&state.price.nonDeductibleInsurance!=0?
                                    <View style={[styles.row,{padding:8,paddingHorizontal:4,borderColor:'#aaa',borderBottomWidth:1}]}>
                                        <View style={{flex:3,justifyContent:'center',alignItems:'flex-start'}}>
                                            <Text style={{color:'#222',fontSize:13}}>
                                                不计免赔
                                            </Text>
                                        </View>


                                        <View style={{flex:2,justifyContent:'center',alignItems:'flex-start'}}>
                                            <Text style={{color:'#222',fontSize:13}}>
                                                保费:{state.price.nonDeductibleInsurance}
                                            </Text>
                                        </View>
                                    </View>:null
                            }

                            {
                                state.price.carTax&&state.price.carTax!=0?
                                    <View style={[styles.row,{padding:8,paddingHorizontal:4,borderColor:'#aaa',borderBottomWidth:1}]}>

                                        <View style={{flex:3,justifyContent:'center',alignItems:'flex-start'}}>
                                            <Text style={{color:'#222',fontSize:13}}>
                                                车船税
                                            </Text>
                                        </View>

                                        <View style={{flex:2,justifyContent:'center',alignItems:'flex-start'}}>
                                            <Text style={{color:'#222',fontSize:14}}>
                                                保费:￥{state.price.carTax}
                                            </Text>
                                        </View>
                                    </View>:null
                            }

                            <View style={[styles.row,{padding:8,paddingHorizontal:4,borderColor:'#aaa',borderBottomWidth:1}]}>

                                <View style={{flex:3,justifyContent:'center',alignItems:'flex-start'}}>
                                    <Text style={{color:'#804400',fontSize:15}}>
                                        总额
                                    </Text>
                                </View>

                                <View style={{flex:2,justifyContent:'center',alignItems:'flex-start'}}>
                                    <Text style={{color:'#804400',fontSize:15}}>
                                        {state.price.insuranceFeeTotal}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </ScrollView>




                {/*保存提交*/}
                <View style={{ flex:3,width:width,alignItems:'center',marginTop:20}}>

                    <TouchableOpacity style={{width:width/2,borderRadius:8,
                        backgroundColor:'#28a54c',padding:12,alignItems:'center'}}
                                      onPress={()=>{
                         this.apply();
                      }}>
                        <Text style={{color:'#fff'}}>确认购买</Text>
                    </TouchableOpacity>

                </View>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.carAttachModal}
                    onRequestClose={() => {
                            console.log("Modal has been closed.");
                        }}
                >

                    <UploadCarAttachModal
                        onClose={()=>{
                                this.setState({carAttachModal:!this.state.carAttachModal});
                            }}
                        accessToken={this.props.accessToken}
                        order={this.props.order}
                        dispatch={this.props.dispatch}
                    />

                </Modal>


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
    }

});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo;
    var score=state.user.score;
    var accessToken=state.user.accessToken;
    return {
        personInfo,
        score,
        accessToken,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps)(CarOrderPay);
