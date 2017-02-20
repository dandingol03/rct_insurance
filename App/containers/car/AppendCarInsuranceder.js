/**
 * Created by dingyiming on 2017/2/16.
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
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import CarOrders from './CarOrders';




class AppendCarInsuranceder extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2CarOrders()
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'car_orders',
                component: CarOrders,
                params: {
                }
            })
        }
    }

    applyCarInsurance()
    {
        //已有被保险人
        if(this.state.selectedTab==0)
        {
            if(this.state.insuranceder!==undefined&&this.state.insuranceder!==null&&
                this.state.insuranceder.personId!==null&&this.state.insuranceder.personId!==undefined)
            {
                var {carInfo,products,companys}=this.props;
                Proxy.postes({
                    url:Config.server+'/svr/request',
                    headers: {
                        'Authorization': "Bearer " + this.state.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request:'validateCarFree',
                        info: {
                            carId: carInfo.carId
                        }
                    }
                }).then(function (json) {
                    if(json.re==1) {
                        if(json.data==true)
                        {
                            Proxy.postes({
                                url:Config.server+'/svr/request',
                                headers: {
                                    'Authorization': "Bearer " + this.state.accessToken,
                                    'Content-Type': 'application/json'
                                },
                                body: {
                                    request:'generateCarInsuranceOrder',
                                    info: {
                                        carId: carInfo.carId,
                                        products:products,
                                        companys:companys,
                                        insurancederId:this.state.insuranceder.personId
                                    }
                                }
                            }).then(function (json) {
                                var orderId=json.data;
                                if (orderId !== undefined && orderId !== null) {


                                    Alert.alert(
                                        '信息',
                                        '订单已创建,请等待报价',
                                        [
                                            {text: 'OK', onPress: () =>this.navigate2CarOrders()},
                                        ]
                                    )

                                }
                            });
                        }
                    }
                }).catch(function (err) {
                    alert('error=\r\n'+err);
                });
            }else{
                Alert.alert(
                    '错误',
                    '请选择被保险人后再点击提交'
                );
            }
        }
    }

    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',padding:4,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};

        var row=(
            <TouchableOpacity style={lineStyle} onPress={()=>{
                 rowData.checked=!rowData.checked;
                 var relativePersons=this.state.relativePersons;
                 if(rowData.checked==true)
                 {
                      relativePersons.map(function(person,i) {
                          if(person.personId!=rowData.personId)
                              person.checked=false;
                      });
                 }
                 this.setState({relativePersons:this.state.relativePersons,insuranceder:rowData});   }}>
                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',
                        padding:2,paddingLeft:12}}>
                    <View style={{flex:1}}>
                        <Text style={{color:'#000',fontSize:14}}>
                            {rowData.perName}
                        </Text>
                    </View>

                    {
                        rowData.abundant==true?
                            <View style={{paddingLeft:0,flex:3,flexDirection:'row'}}>
                                <Text style={{color:'rgba(220, 11, 35, 0.6)',fontSize:14,alignItems:'center'}}>
                                    身份证:
                                </Text>
                                <Text style={{color:'#222',fontSize:12,alignItems:'center',marginLeft:10}}>
                                    {rowData.perIdCard}
                                </Text>
                            </View>:
                            null

                    }
                </View>
                <View style={{width:40,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                    {
                        rowData.checked==true?
                            <Icon name="check-square-o" size={24} color="#00c9ff"/>:
                            <Icon name="square-o" size={24} color="#888"/>
                    }
                </View>
            </TouchableOpacity>
        );



        return row;
    }



    fetchData(personId){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'getRelativePersonsWithinPerName',
                info: {
                    perName: ''
                }
            }
        },(json)=> {

            if(json.re==1) {
                if(json.data!==undefined&&json.data!==null)
                {

                    var insuranceder= null;
                    //对于人员来说凡是重复的人员都显示身份证号
                    var abundant={};
                    json.data.map(function (person,i) {

                        if(abundant[person.perName]!==undefined&&abundant[person.perName]!==null)
                            abundant[person.perName].count++;
                        else{
                            abundant[person.perName]={
                                count:1
                            };
                        }
                        person.abundant=false;

                        //当新增完被保险人后,自动刷新被保险人列表并选中
                        if(personId!==undefined&&personId!==null&&person.personId==personId)
                        {
                            person.checked=true;
                            insuranceder = person;
                        }
                    });

                    //迭代重复人员
                    json.data.map(function (person,i) {
                        if(abundant[person.perName].count>1)
                            person.abundant=true;
                    })


                    var relativePersons=json.data;
                    this.setState({insuranceder: insuranceder, relativePersons: relativePersons});
                }
            }

        }, (err) =>{
        });
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            companys:props.companys,
            products:props.products,
            relativePersons:null,
            insuranceder:null,
            selectedTab:0,
            accessToken: accessToken
        };
    }

    getPlaceHolder()
    {

        switch(this.state.selectedTab)
        {
            case 0:
                return (
                    <View style={{flex:1}}>
                    </View>);
                break;
            case 1:
                return (
                    <TouchableOpacity style={{width:70,flexDirection:'row',alignItems:'center',borderRadius:6,
                                            backgroundColor:'#ef473a',padding:2,justifyContent:'center'}}>
                        <Icon name="hand-pointer-o" size={18} color="#fff"></Icon>
                        <Text style={{color:'#fff'}}>保存</Text>
                    </TouchableOpacity>);
                break;
        }


    }


    render(){




        var listView=null;


        if(this.state.relativePersons!==undefined&&this.state.relativePersons!==null)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource=ds.cloneWithRows(this.state.relativePersons);

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }else{
            this.fetchData();
        }



        return (
            <View style={{flex:1}}>
                <View style={[{padding: 10,marginTop:20,flexDirection:'row',height:50},styles.card]}>
                    <TouchableOpacity style={{width:20,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',
                        padding:10,paddingLeft:0,paddingRight:0}}
                                      onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={45} color="#222"/>
                    </TouchableOpacity>

                    <View style={{flex:3,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                        <Text style={{fontSize:16,color:'#222',marginLeft:5}}>
                            选择被保险人
                        </Text>
                    </View>


                    {this.getPlaceHolder(this.state.selectedTab)}


                </View>

                <ScrollableTabView style={{flex:1,padding:0,margin:0}} onChangeTab={(data)=>{
                        var tabIndex=data.i;
                        this.setState({selectedTab:tabIndex});
                        //this.state.selectedTab=tabIndex;
                    }} renderTabBar={() => <DefaultTabBar style={{borderBottomWidth:0}} activeTextColor="#00c9ff"  inactiveTextColor="#222" underlineStyle={{backgroundColor:'#00c9ff'}}/>}
                >
                    <View tabLabel='已有被保险人' style={{flex:1}}>
                        {/*body*/}
                        <View style={{padding:20,paddingLeft:0,paddingRight:0,height:height-234}}>
                            {listView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/6,marginLeft:width/4,
                                    padding:8,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                        this.applyCarInsurance();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:15}}>提交车险意向</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View tabLabel='新建被保险人' style={{flex:1}}>

                    </View>



                </ScrollableTabView>


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
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(AppendCarInsuranceder);

