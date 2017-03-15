/**
 * Created by dingyiming on 2017/2/22.
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
import LifePlanDetail from './LifePlanDetail';
import LifeOrderPay from './LifeOrderPay'
import {setLifePlans,setLifePlanDetail} from '../../action/LifeActions';


class LifePlan extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    setLifePlans(plans){
        const {dispatch} = this.props;
        dispatch(setLifePlans(plans));
        this.setState({render:null});
    }

    navigate2LifePlanDetail(plan){
        const { navigator } = this.props;
        const {dispatch} = this.props;
        dispatch(setLifePlanDetail(plan));
        if(navigator) {
            navigator.push({
                name: 'life_plan_detail',
                component: LifePlanDetail,
                params: {
                    plan:plan,
                    order:this.props.order,
                    setLifePlans:this.setLifePlans.bind(this),
                }
            })
        }
    }

    navigate2LifeOrderPay(info){
        var info = info;
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'life_order_pay',
                component: LifeOrderPay,
                params: {
                    insurerId:info.insurerId,
                    planIds:info.plans,
                    orderId:info.orderId,
                }
            })
        }
    }


    apply(){

        var {plans}=this.props;
        var order = this.props.order;
        var selectedPlans = [];
        var selectedPlanIds = [];
        //var flag = false;
        plans.map(function (plan, i) {
            if (plan.userSelect == true) {
                selectedPlans.push(plan);
                selectedPlanIds.push(plan.planId);
                // if (plan.modified == true)
                //     flag = true;
            }
        });

        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'commitLifePlan',
                info:{
                    planIds:selectedPlanIds,
                    orderId:order.orderId
                }
            }
        }, (res)=> {
            var json=res;
            if(json.re==1){
                var info = {insurerId:order.insurerId,planIds:selectedPlanIds,orderId:order.orderId};
                Alert.alert(
                    '您的订单',
                    '下一步进入寿险支付页面',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: () =>  this.navigate2LifeOrderPay(info)},
                    ]
                )
            }
        }, (err) =>{
        });

    }


    renderRow(rowData,sectionId,rowId){

        var boxStyle=null;

        boxStyle={flex:1,margin:10,borderWidth:1,borderColor:'#aaa',
            justifyContent:'flex-start',backgroundColor:'#fff'};

        var row=(
            <View style={boxStyle}>

                <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>

                    <Text style={{flex:9}}>{rowData.companyName}</Text>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{
                         if(rowData.userSelect!==undefined&&rowData.userSelect!==null){
                             if(rowData.userSelect==0){
                                 rowData.userSelect=1;
                                 const {dispatch} = this.props;
                                 dispatch(setLifePlanDetail(rowData));
                                 this.setState({render:null});//selectedPlans无实际意义，只是为了重新刷新页面
                             }else{
                                 rowData.userSelect=0;
                                 const {dispatch} = this.props;
                                 dispatch(setLifePlanDetail(rowData));
                                 this.setState({render:null});
                             }
                         }
                     }}>
                        {
                            rowData.userSelect==1?
                                <Icon name="check-circle"  size={23}></Icon>:
                                <Icon name="check-circle-o"  size={23}></Icon>
                        }

                    </TouchableOpacity>

                </View>

                <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                    <Text style={{flex:1}}>合计保费：</Text>
                    <Text style={{flex:2}}>{rowData.insuranceFee}</Text>
                </View>

                <View style={{flex:1,padding:10,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>

                    <Text style={{flex:1}}>查看详情</Text>
                    <TouchableOpacity style={{flex:2}} onPress={()=>{
                          this.navigate2LifePlanDetail(rowData);
                         }}>
                        <Icon name="edit" size={20}></Icon>
                    </TouchableOpacity>

                </View>

            </View>

        );

        return row;
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            render:null,
        };
    }

    render(){

        var {plans}=this.props;
        var order = this.props.order;

        var listView=null;

        if(plans!==undefined&&plans!==null&&plans.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource=ds.cloneWithRows(plans);

            listView=
                <ScrollView style={{flex:8}}>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }else{

        }

        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                    <View style={[{flex:1,padding: 10,justifyContent: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                      <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}
                                      onPress={()=>{
                        this.goBack();
                      }}>
                        <Icon name="angle-left" size={30} color="#fff"/>
                      </TouchableOpacity>
                      <Text style={{flex:20,fontSize:15,marginTop:10,marginRight:10,alignItems:'flex-end',justifyContent:'flex-start',textAlign:'center',color:'#fff'}}>
                        寿险订单
                      </Text>
                    </View>

                    <View style={{flex:15}}>
                      {listView}
                    </View>

                    <TouchableOpacity style={{flex:1,margin:20,backgroundColor:'#ef473a',alignItems:'center',justifyContent:'center',borderRadius:8}}
                                      onPress={()=>{
                                          this.apply();
                                      }}>
                      <View>
                          <Text style={{color:'#fff'}}>
                              提交已选方案
                          </Text>
                      </View>
                    </TouchableOpacity>
                </Image>

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
        accessToken:state.user.accessToken,
        plans:state.life.plans,
    })
)(LifePlan);

