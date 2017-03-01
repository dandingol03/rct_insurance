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

import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
import {setLifePlanDetail,updateLifeModified} from '../../action/actionCreator';


class LifePlanDetails extends Component{

    goBack(){

        if(this.state.modefied ==true){
            const {dispatch} = this.props;
            dispatch(updateLifeModified(this.props.plans,this.state.plan));
        }
        this.props.setLifePlans(this.props.plans);
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }

    }

    _handlePress1(index,main) {
        if(index!==0){
            var feeYearType = index;
            this.state.feeYearType = feeYearType;
            this.state.plan.feeYearType = feeYearType;
            var plan = this.state.plan;
            this.setState({plan:plan,feeYearType:feeYearType,});

            this.changeInsuranceFee(main,feeYearType);
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    saveModified(plan,main,additions){
        var plan = plan;
        var main = main;
        var additions = additions;

        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'updateLifeOrderPlan',
                info:{
                    planId:plan.planId,
                    main:main,
                    additions:additions,
                    insuranceQuota:plan.insuranceQuota,
                    feeYearType:plan.feeYearType,
                    insuranceFee:plan.insuranceFee,
                }
            }
        }, (res)=> {
            var json=res;
            if(json.re==1){

                alert('寿险方案修改成功！');
                this.goBack();
            }

        }, (err) =>{
        });
    }

    changeInsuranceFee(main,feeYearType){

        var feeYear = null;
        var main = main;

        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'getPersonInfo',
                info:{
                    personId:this.props.order.insurancederId
                }
            }
        }, (res)=> {
            var json=res;
            if(json.re==1){
                var personInfo=json.data;
                var perBirthday=new Date(personInfo.perBirthday);
                var cur=new Date();
                age=cur.getFullYear()-perBirthday.getFullYear();

                feeYearType = parseInt(feeYearType);
                switch(feeYearType){
                    case 1:
                        feeYear=1;
                        break;
                    case 2:
                        feeYear=5;
                        break;
                    case 3:
                        feeYear=10;
                        break;
                    case 4:
                        feeYear=15;
                        break;
                    case 5:
                        feeYear=20;
                        break;
                    case 6:
                        feeYear=60-age;
                        break;
                    default:
                        break;
                }

                Proxy.post({
                    url:Config.server+'/svr/request',
                    headers: {
                        'Authorization': "Bearer " + this.state.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request:'getLifeInsuranceFee',
                        info:{
                            productId:main.productId,
                            feeYearType:feeYearType,
                            insurancederId:this.props.order.insurancederId
                        }
                    }
                }, (res)=> {
                    var json=res;
                    if(json.re==1){
                        var insuranceFee=json.data.insuranceFee;//基础年缴保费
                        var baseInsuranceQuota=json.data.insuranceQuota;//基础保额
                        var insuranceFeeTotal=
                            this.state.insuranceQuota/baseInsuranceQuota*insuranceFee*feeYear//主险保费
                        this.state.insurance = insuranceFeeTotal;
                        this.state.plan.insuranceFee = insuranceFeeTotal;
                        var plan =  this.state.plan;
                        this.setState({plan:plan,insurance:insuranceFeeTotal,modefied:true});

                        const {dispatch} = this.props;
                        dispatch(updateLifeModified(this.props.plans,this.state.plan));

                    }

                }, (err) =>{
                });

            }

        }, (err) =>{
        });

    }

    renderRow(rowData,sectionId,rowId){
        var row=(
            <View>
                <View style={{flex:2}}>
                    <Text style={{fontSize:12,color:'#343434'}}>{rowData.product.productName}</Text>
                </View>
                <View style={{flex:2,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                    <Text style={{fontSize:12,color:'#f00'}}>保费：</Text>
                    <Text style={{fontSize:12,color:'#f00'}}>{rowData.insuranceFee}</Text>
                </View>
                <View style={{flex:2,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                    <Text style={{fontSize:12,color:'#343434'}}>数量：</Text>
                    <TextInput
                        style={{flex:2,fontSize:12,color:'#343434'}}
                        onChangeText={(productCount) =>
                          {

                           }}
                        value={
                          rowData.productCount+''
                              }
                        placeholder='请输入...'
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent"
                    />
                </View>
            </View>
        );
        return row;
    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        var {planDetail}=this.props;

        this.state = {
            accessToken: accessToken,
            feeYearTypeButtons:['取消','趸交','5年','10年','15年','20年','缴至60岁'],
            plan: planDetail,
            insuranceQuota:planDetail.insuranceQuota,//保额
            insuranceFee:planDetail.insuranceFee, //主险保费
            feeYearType:planDetail.feeYearType,//缴费年限
            productCount:null,
            modefied:false,
        };
    }

    render(){
        var {planDetail}=this.props;
        var additions = [];
        var main = null;

        if(planDetail.items!==undefined&&planDetail.items!==null&&planDetail.items.length>0){
            planDetail.items.map(function(item,i){
                if(item.product.ownerId!==undefined&&item.product.ownerId!==null){
                    additions.push(item);
                }else{
                    main = item;
                }
            })
        }

        var listView=null;
        if(additions!==undefined&&additions!==null&&additions.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource=ds.cloneWithRows(additions);

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

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;
        const feeYearTypeButtons=['取消','趸交','5年','10年','15年','20年','缴至60岁'];

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
                    </Text>
                </View>

                <ScrollableTabView style={{flex:25,padding:0,margin:0}} onChangeTab={(data)=>{
                        var tabIndex=data.i;
                        this.state.selectedTab=tabIndex;
                    }} renderTabBar={() => <DefaultTabBar
                    style={{borderBottomWidth:0,padding:5}} activeTextColor="#00c9ff" inactiveTextColor="#222" underlineStyle={{backgroundColor:'#00c9ff'}}/>}
                >
                    <View tabLabel='产品简介' style={{flex:1}}>
                        {/*body*/}
                        <View style={{flex:3,padding:10,height:height-264}}>

                            <View style={{flex:3,margin:5}}>
                                <View style={{flex:1,padding:5}}>
                                    <Text>产品简介</Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                                    <Icon name="circle" size={10} color="#e99d23"/>
                                    <Text style={{paddingLeft:10,color:'#343434'}}>产品特色</Text>
                                </View>
                                <View style={{flex:3,margin:5}}>
                                    <Text style={{padding:5,fontSize:12,color:'#343434'}}>康运升级责任更全</Text>
                                    <Text style={{padding:5,fontSize:12,color:'#343434'}}>轻症责任保障更久</Text>
                                    <Text style={{padding:5,fontSize:12,color:'#343434'}}>轻症赔付保费豁免</Text>
                                    <Text style={{padding:5,fontSize:12,color:'#343434'}}>保费更低保障更多</Text>
                                </View>
                            </View>

                            <View style={{flex:2,margin:5,marginTop:20}}>
                                <View style={{flex:1,padding:5}}>
                                    <Text>保障范围</Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                                    <Icon name="circle" size={10} color="#e99d23"/>
                                </View>
                                <View style={{flex:3}}>
                                    <Text style={{padding:5,fontSize:12,color:'#343434'}}>含身故保险金、重大疾病保险金、</Text>
                                    <Text style={{padding:5,fontSize:12,color:'#343434'}}>轻症疾病保险金、轻症疾病豁免保险费</Text>
                                </View>

                            </View>

                            <View style={{flex:1}}>
                                <View style={{flex:1,padding:5}}>
                                    <Text>适用人群</Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                                    <Icon name="circle" size={10} color="#e99d23"/>
                                    <Text style={{fontSize:12,paddingLeft:10,color:'#343434'}}>为28 天-60 周岁（含）</Text>
                                </View>

                            </View>
                        </View>
                        <View style={{flex:1}}>

                        </View>

                    </View>

                    <View tabLabel='保费测算' style={{flex:1}}>
                        <View style={{flex:1,padding:10,height:height-264}}>
                            <View style={{flex:9,margin:6}}>
                                <View style={{flex:1}}>
                                    <Text>主险</Text>
                                </View>
                                <View style={{flex:8}}>
                                    <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                        <Icon name="circle" size={10} color="#e99d23"/>
                                        <Text style={{flex:1,fontSize:12,paddingLeft:5,color:'#343434'}}>产品名称：</Text>
                                        <Text style={{flex:2,fontSize:12,color:'#343434'}}>{planDetail.companyName}</Text>
                                    </View>
                                    <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                        <Icon name="circle" size={10} color="#e99d23"/>
                                        <Text style={{flex:1,fontSize:12,paddingLeft:5,color:'#343434'}}>每年缴费：</Text>
                                        <Text style={{flex:2,fontSize:12,color:'#343434'}}>{main.insuranceFeeYear}</Text>
                                    </View>
                                    <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                        <Icon name="circle" size={10} color="#e99d23"/>
                                        <Text style={{flex:2,fontSize:12,paddingLeft:5,color:'#343434'}}>缴费年限：</Text>
                                        <Text style={{flex:2,fontSize:12,color:'#343434'}}>{this.state.feeYearTypeButtons[this.state.feeYearType]}</Text>
                                        <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <TouchableOpacity style={{justifyContent:'flex-start'}}
                                                              onPress={()=>{ this.show('actionSheet1'); }}>
                                                <Icon name="chevron-circle-down" color="#aaa" size={20}></Icon>
                                                <ActionSheet
                                                    ref={(o) => {
                                        this.actionSheet1 = o;
                                    }}
                                                    title="请选择缴费年限"
                                                    options={feeYearTypeButtons}
                                                    cancelButtonIndex={CANCEL_INDEX}
                                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                                    onPress={
                                        (data)=>{ this._handlePress1(data,main); }
                                    }
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                        <Icon name="circle" size={10} color="#e99d23"/>
                                        <Text style={{flex:2,fontSize:12,paddingLeft:5,color:'#343434'}}>保额：</Text>

                                        <TextInput
                                            style={{flex:2,fontSize:12,color:'#343434'}}
                                            onChangeText={(insuranceQuota) =>
                                            {
                                              planDetail.insuranceQuota=insuranceQuota;
                                              this.setState({planDetail:planDetail,insuranceQuota:insuranceQuota});
                                            }}
                                            value={
                                                planDetail.insuranceQuota+''
                                            }
                                            placeholder='请输入...'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                        <View style={{flex:2,height:20,marginBottom:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                           borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                                            <TouchableOpacity onPress={()=>{
                                                                this.changeInsuranceFee(main,this.state.feeYearType);
                                            }}>
                                                <Text style={{color:'#fff',fontSize:12}}>更改</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flex:1,padding:10,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                        <Icon name="circle" size={10} color="#e99d23"/>
                                        <Text style={{flex:1,fontSize:12,paddingLeft:5}}>主险保费：</Text>
                                        <Text style={{flex:2,fontSize:12}}>{planDetail.insuranceFee}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{flex:4,margin:10}}>
                                <View style={{flex:1}}>
                                    <Text>附加险</Text>
                                </View>
                                <View style={{flex:5,margin:5}}>
                                    {listView}
                                </View>
                            </View>

                            <View style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                <Text style={{fontSize:13,color:'#f00'}}>主险保费合计：</Text>
                                <Text style={{fontSize:13,color:'#f00'}}>{planDetail.insuranceFee}</Text>

                            </View>

                            <View style={{flex:1,backgroundColor:'#387ef5',margin:20,borderRadius:8,alignItems:'center',justifyContent:'center'}}>
                               <TouchableOpacity onPress={()=>{
                                   this.saveModified(planDetail,main,additions);
                               }}>
                                   <Text style={{color:'#fff'}}>保存修改</Text>
                               </TouchableOpacity>
                            </View>

                        </View>

                    </View>

                </ScrollableTabView>
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
        planDetail:state.life.planDetail,
        plans:state.life.plans,
    })

)(LifePlanDetails);

