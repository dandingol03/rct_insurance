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
    TouchableHighlight,
    Dimensions,
    TextInput,
    ScrollView,
    Alert,
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ActionSheet from 'react-native-actionsheet';
import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import NewCarBind from '../../components/modal/NewCarBind';
import UpdateCarInfo from '../../components/UpdateCarInfo';
import CarCompany from './CarCompany';
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;

class CarInsurance extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2CarCompany(products)
    {
        const {navigator} =this.props;
        const {carInfo}=this.props;
        if(navigator) {
            navigator.push({
                name: 'updateCarInfo',
                component: CarCompany,
                params: {
                    products: products,
                    carInfo:carInfo
                }
            })
        }
    }

    insuranceMealConfirm()
    {

        var meals=this.state.meals;
        var products=[];

        meals[this.state.selectedTab].products.map(function (product, i) {
            if(product.checked==true)
            {
                products.push(product);
            }
        });

        if(products.length>0)
        {
            this.navigate2CarCompany(products);
        }else{
            Alert.alert(
                'error',
                '请再勾选险种后再点击套餐确认'
            );
        }

    }

    _handlePress(index)
    {
        //如果回调队列不为空
        if(this.state.actionSheetCallbacks!==undefined&&this.state.actionSheetCallbacks!==null)
        {
            this.state.actionSheetCallbacks.map(function (callback,i) {
                callback(index-2);
            });
        }
        this.state.actionSheetCallbacks=[];
    }


    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',padding:4,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};



        var row=null;
        if(rowData.productId==30)
        {
            //交强险
            row=(
                <View>
                    <TouchableOpacity onPress={
                    function() {
                        var meals=_.cloneDeep(this.state.meals);
                        var products=meals[this.state.selectedTab].products;
                        products.map(function(product,i) {
                            if(product.productId==rowData.productId)
                                product.checked=!product.checked;
                        });
                        this.setState({meals:meals});
                    }.bind(this)}>
                        <View style={lineStyle}>
                            <View style={{flex:7,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:10}}>
                                <View>
                                    <Text style={{color:'#000',fontSize:18}}>
                                        {rowData.productName}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flex:3,padding:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                {
                                    rowData.checked==true?
                                        <Icon name="check-square-o" size={35} color="#11c1f3"/>:
                                        <Icon name="circle-thin" size={35} color="#555"/>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>);
        }else{
            row=
                <View>
                    <View>
                        <View style={lineStyle}>
                            <TouchableOpacity style={{width:40,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:4}}
                                              onPress={()=>{
                                    rowData.checked=!rowData.checked;
                                    this.setState({meals:this.state.meals})
                                }}>
                                {
                                    rowData.checked==true?
                                        <Icon name="check-square-o" size={27} color="#11c1f3"/>:
                                        <Icon name="circle-thin" size={27} color="#555"/>
                                }
                            </TouchableOpacity>

                            <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:2}}>
                                <View>
                                    <Text style={{color:'#000',fontSize:13}}>
                                        {rowData.productName}
                                    </Text>
                                </View>
                            </View>

                            {
                                rowData.isIrrespectable!=1?null:
                                    <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:4}}>
                                        {
                                            rowData.irrespective==true?
                                                <View style={{flex:1,borderWidth:1,borderRadius:6,borderColor:'red',justifyContent:'center',
                                                    flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{fontSize:14,color:'#222'}}>不计免赔</Text>
                                                </View>:
                                                <View style={{flex:1,borderWidth:1,borderRadius:6,borderColor:'#444',justifyContent:'center',
                                                    flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{fontSize:14,color:'#222'}}>不计免赔</Text>
                                                </View>
                                        }
                                    </View>
                            }


                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:4}}>
                                {
                                    rowData.insuranceTypes!==undefined&&rowData.insuranceTypes!==null?
                                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}
                                                          activeOpacity={0.7} onPress={
                                                              ()=>{
                                                                  this.setState({insuranceTypes:rowData.insuranceTypes});
                                                                  setTimeout(function() {
                                                                      this.state.actionSheetCallbacks.push(function(index) {

                                                                          if(index>=0)
                                                                          {
                                                                              rowData.insuranceType=rowData.insuranceTypes[index];
                                                                              rowData.productId=rowData.productIds[index];
                                                                              this.setState({meals:this.state.meals});
                                                                          }

                                                                      }.bind(this));
                                                                        this.ActionSheet.show();
                                                                  }.bind(this),300);
                                                              }}>
                                            <Text style={{fontSize:16,color:'#222'}}>{rowData.insuranceType}</Text>
                                            <Icon name="angle-down" color="#222" size={30}/>
                                        </TouchableOpacity>:
                                        <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                            <Text style={{fontSize:16,color:'#222'}}>{rowData.insuranceType}</Text>
                                        </View>
                                }
                            </View>

                        </View>
                    </View>
                </View>;
        }


        return row;
    }



    fetchData(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'getCarInsuranceMeals'
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{

                var meals=[];
                res.data.map(function(meal,i) {
                    var products=[];
                    meal.products.map(function(product,j) {
                        if(product.isIrrespectable==1)
                            product.irrespective=true;
                        product.checked=true;
                        var flag=false;
                        products.map(function (item,j) {
                            if(item.productName==product.productName)
                            {

                                if(item.productIds!==undefined&&item.productIds!==null)
                                {}else{
                                    //新创建productIds和insuranceTypes,默认选中第一个
                                    item.productIds=[];
                                    item.insuranceTypes=[];
                                    item.productIds.push(item.productId);
                                    item.insuranceTypes.push(item.insuranceType);
                                }
                                item.productIds.push(product.productId);
                                item.insuranceTypes.push(product.insuranceType);
                                flag=true;
                            }
                        })
                        if(flag==true)
                        {}
                        else{
                            products.push(product);
                        }

                    });
                    meals.push({mealName:meal.mealName,products:products});
                });
                this.setState({selectedTab:0,meals:meals});
            }
        }, (err) =>{
        });
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            selectAll:false,
            dataSource : null,
            accessToken: accessToken,
            carInfo:props.carInfo,
            selectedTab:null,
            insuranceTypes:[],
            actionSheetCallbacks:[]
        };
    }


    render(){


        var listView=null;
        var advisedListView=null;
        var customListView=null;

        if(this.state.meals!==undefined&&this.state.meals!==null)
        {

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var basicMeal=this.state.meals[0];
            listView=
                (<ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(basicMeal.products)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>);

            var advisedMeal=this.state.meals[1];
            advisedListView=
                (<ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(advisedMeal.products)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>);
            var customMeal=this.state.meals[2];
            customListView=
                (<ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(customMeal.products)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>);


        }else{
            this.fetchData();
        }


        return (

            <View style={{flex:1,position:'relative'}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                <View style={[{padding: 10,height:54,justifyContent: 'center',alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'}]}>

                    <View style={{flex:1,marginTop:14,flexDirection:'row'}}>
                        <TouchableOpacity
                                          onPress={()=>{
                            this.goBack();
                            }}>
                            <Icon name="angle-left" size={40}  color="#fff"/>
                        </TouchableOpacity>

                        <View style={{flex:10,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingLeft:15}}>
                            <Text style={{fontSize:17,color:'#fff'}}>
                                险种选择
                            </Text>
                        </View>

                        <View style={{flex:1}}></View>
                    </View>
                </View>


                <ActionSheet
                    ref={(o) => this.ActionSheet = o}
                    title="选择保额？"
                    options={['取消', '确认退出'].concat(this.state.insuranceTypes)}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this._handlePress.bind(this)}
                />


                <ScrollableTabView style={{flex:1,padding:0,margin:0}}
                                   onChangeTab={(data)=>{
                                        var tabIndex=data.i;
                                        this.state.selectedTab=tabIndex;}}
                                   renderTabBar={() =>  <FacebookTabBar />}>

                    <View tabLabel="建议套餐"  style={{flex:1,padding:12,paddingLeft:0,paddingRight:0}}>

                        <View style={{padding:15,paddingLeft:6,paddingRight:6,height:height-270}}>
                            {advisedListView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                                padding:10,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                          this.insuranceMealConfirm();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:16}}>确认套餐选择</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View tabLabel="自定义套餐"  style={{flex:1,padding:12,paddingLeft:0,paddingRight:0}}>

                        <View style={{padding:15,paddingLeft:6,paddingRight:6,height:height-270}}>
                            {customListView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                                padding:10,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                         this.insuranceMealConfirm();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:16}}>确认套餐选择</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View tabLabel='基础套餐' style={{flex:1,padding:12,paddingLeft:0,paddingRight:0}}>
                        {/*body*/}

                        <View style={{padding:15,paddingLeft:6,paddingRight:6,height:height-270}}>
                            {listView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                                padding:10,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                          this.insuranceMealConfirm();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:16}}>确认套餐选择</Text>
                            </View>
                        </TouchableOpacity>
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
)(CarInsurance);
