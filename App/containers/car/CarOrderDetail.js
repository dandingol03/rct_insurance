

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
    TouchableOpacity,
    ListView,
    TextInput
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import DateFilter from '../../filter/DateFilter';
import {saveContactInfo} from '../../action/UserActions';
import {
    fetchRecvAddresses,
    fetchApplyedCarOrderByOrderId
} from '../../action/CarActions';

class CarOrderDetail extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    onApply()
    {
        var {dispatch}=this.props;
        dispatch(saveContactInfo(this.state.personInfo));
    }


    renderProductRow(rowData,sectionId,rowId){

        var lineStyle={flex:1,flexDirection:'row',padding:8,paddingHorizontal:12,borderBottomWidth:1,
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
                        保费:￥{rowData.insuranceType}
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
        var {orderId}=this.state;
        this.props.dispatch(fetchApplyedCarOrderByOrderId({orderId:orderId})).then((json)=>{
            if(json.re==1)
            {
                this.setState({order:json.data,fetched:true})
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
            orderId:props.orderId,
            personInfo:props.personInfo,
            fetched:false
        };
    }

    render() {

        var props=this.props;
        var state=this.state;



        var productList=null;
        if(state.order&&state.order.products&&state.order.products.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            productList=(
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(state.order.products)}
                    renderRow={this.renderProductRow.bind(this)}
                />
            );
        }

        if(state.fetched==false)
        {
            this.fetchData()
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
                            车险订单详情
                        </Text>
                    </View>

                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    </View>
                </View>



                {/*body*/}
                <ScrollView>
                    <View style={{padding:0}}>

                        <View style={[styles.row,{padding:8,paddingHorizontal:12,backgroundColor:'#eee'}]}>
                            <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>编号</Text>
                        </View>
                        <View style={[styles.row,{padding:8,paddingHorizontal:12,borderBottomWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:3,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'#222'}}>车牌号:</Text>
                            </View>
                            <View style={{flex:2,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'#222'}}>{state.order.carInfo.carNum}</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{padding:8,paddingHorizontal:12,borderBottomWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:3,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'#222'}}>订单号:</Text>
                            </View>
                            <View style={{flex:2,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'#222'}}>{state.order.orderNum}</Text>
                            </View>
                        </View>


                        {/*订单产品*/}
                        <View style={[styles.row,{padding:8,paddingHorizontal:12,backgroundColor:'#eee',marginTop:10}]}>
                            <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>订单产品</Text>
                        </View>

                        {productList}



                        <View style={[styles.row,{padding:8,paddingHorizontal:12,borderBottomWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:3,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'rgba(228, 93, 46, 0.87)'}}>被保险人:</Text>
                            </View>
                            <View style={{flex:2,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'rgba(228, 93, 46, 0.87)'}}>{state.order.insuranceder.perName}</Text>
                            </View>
                        </View>


                        <View style={[styles.row,{padding:8,paddingHorizontal:12,borderBottomWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:3,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'rgba(228, 93, 46, 0.87)'}}>申请日期:</Text>
                            </View>
                            <View style={{flex:3,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{color:'rgba(228, 93, 46, 0.87)'}}>
                                    {DateFilter.filter(state.order.applyTime,'yyyy-mm-dd hh:mm')}
                                </Text>
                            </View>
                        </View>


                    </View>
                </ScrollView>




                {/*保存提交*/}
                <View style={{ flex:3,width:width,alignItems:'center',marginTop:20}}>

                    <TouchableOpacity style={{width:width/2,borderRadius:8,
                        backgroundColor:'#28a54c',padding:12,alignItems:'center'}}
                                      onPress={()=>{
                         this.onApply();
                      }}>
                        <Text style={{color:'#fff'}}>修改订单</Text>
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
    return {
        personInfo,
        score,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps)(CarOrderDetail);
