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
import {setLifePlans,setLifePlanDetail} from '../../action/actionCreator';

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
        this.setState({selectedPlans:null});
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


    renderRow(rowData,sectionId,rowId){

        var boxStyle=null;

        boxStyle={flex:1,margin:10,borderWidth:1,borderColor:'#aaa',
            justifyContent:'flex-start',backgroundColor:'#fff'};

        var row=(
            <View style={boxStyle}>

                <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>

                    <Text style={{flex:9}}>{rowData.companyName}</Text>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{
                         console.log('...');
                     }}>
                        <Icon name="check-circle-o"  size={23}></Icon>
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
            selectedPlans:null,
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

                    <View style={{flex:1,margin:20,backgroundColor:'#ef473a',alignItems:'center',justifyContent:'center',borderRadius:8}}>
                        <Text style={{color:'#fff'}}>
                            提交已选方案
                        </Text>
                    </View>
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

