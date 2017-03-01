/**
 * Created by dingyiming on 2017/2/21.
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
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import Icon from 'react-native-vector-icons/FontAwesome';

class ApplyedLifeOrderDetails extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            applyedOrder:this.props.applyedOrder,
        };
    }

    render(){

        var order = this.props.applyedOrder;

        return (
            <View style={{flex:1}}>
                <View style={[{flex:1,padding: 10,justifyContent: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                    <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}
                        onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={30} color="#fff"/>
                    </TouchableOpacity>
                    <Text style={{flex:20,fontSize:15,marginTop:10,marginRight:10,alignItems:'flex-end',justifyContent:'flex-start',textAlign:'center',color:'#fff'}}>
                        寿险订单详情
                    </Text>
                </View>

                <View style={{flex:2,marginTop:10,borderColor:'#aaa',alignItems:'flex-start',justifyContent: 'center'}}>

                    <View style={{flex:1,width:width,padding:5,paddingLeft:8,borderWidth:1,borderColor:'#ddd',flexDirection:'row',backgroundColor:'#f5f5f5',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text>编号</Text>
                    </View>
                    <View style={{flex:2,width:width,paddingLeft:8,flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text style={{flex:3,color:'#343434'}}>订单号：</Text>
                        <Text style={{flex:7,color:'#343434'}}>{order.orderNum}</Text>
                    </View>

                </View>

                <View style={{flex:7,marginTop:10,borderColor:'#ddd',alignItems:'flex-start',justifyContent: 'center'}}>
                    <View style={{flex:1,width:width,padding:5,paddingLeft:8,borderWidth:1,borderColor:'#ddd',flexDirection:'row',backgroundColor:'#f5f5f5',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text>订单信息</Text>
                    </View>
                    <View style={{flex:2,width:width,paddingLeft:8,flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text style={{flex:3,color:'#343434'}}>投保人：</Text>
                        <Text style={{flex:7,color:'#343434'}}>{order.insurer.perName}</Text>
                    </View>
                    <View style={{flex:2,width:width,paddingLeft:8,flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text style={{flex:3,color:'#343434'}}>被保险人：</Text>
                        <Text style={{flex:7,color:'#343434'}}>{order.insuranceder.perName}</Text>
                    </View>
                    <View style={{flex:2,width:width,paddingLeft:8,flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text style={{flex:3,color:'#343434'}}>受益人：</Text>
                        {
                            order.isLegalBenefiter==1?
                                <Text style={{flex:7,color:'#343434'}}>法定</Text>:
                                <Text style={{flex:7,color:'#343434'}}>{order.benefiter.perName}</Text>
                        }
                    </View>
                    <View style={{flex:2,width:width,paddingLeft:8,flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text style={{flex:3,color:'#343434'}}>保障类型：</Text>
                        <Text style={{flex:7,color:'#343434'}}>{order.insuranceType}</Text>
                    </View>
                    <View style={{flex:2,width:width,paddingLeft:8,flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text style={{flex:3,color:'#343434'}}>计划保费：</Text>
                        <Text style={{flex:7,color:'#343434'}}>{order.planInsuranceFee}</Text>
                    </View>

                </View>

                <View style={{flex:3,marginTop:15,paddingTop:5,paddingBottom:25,borderWidth:0,alignItems:'flex-start',justifyContent: 'center'}}>
                    <View style={{flex:1,width:width,flexDirection:'row',borderWidth:1,borderColor:'#ddd',alignItems:'center',justifyContent: 'flex-start'}}>
                        <Text style={{flex:3,color:'rgba(228, 93, 46, 0.87)'}}>申请日期：</Text>
                        <Text style={{flex:7,color:'rgba(228, 93, 46, 0.87)'}}>{order.applyTime}</Text>
                    </View>
                    <View style={{flex:1,width:width,flexDirection:'row'}}>
                    </View>
                </View>

            </View>
        );
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
        flexDirection:'row',
        height: 50,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(ApplyedLifeOrderDetails);

