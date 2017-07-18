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

class CarManage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    navigate2CarInfoDetail(carInfo)
    {
        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'CarInfoDetail',
                component: CarInfoDetail,
                params: {
                    carInfo: carInfo
                }
            })
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

    navigate2CarInsurance(carInfo)
    {

        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'car_insurance',
                component: CarInsurance,
                params: {
                    carInfo: carInfo
                }
            })
        }
    }

    bindNewCar(carNum,cb)
    {
        var {accessToken}=this.props;
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'bindNewCar',
                info:{
                    carNum:carNum
                }
            }
        },(json)=> {
            if(json.error)
            {
                Alert.alert(
                    'error',
                    json.error_description
                );
            }else{
                if(cb!==undefined&&cb!==null)
                    cb(json.re,json.data);
            }
        }, (err) =>{
        });
    }

    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',padding:4,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'}

        var row=
            <View>
                <View style={lineStyle}>
                    {
                        rowData.idle==true?
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}
                                              onPress={()=>{
                                     this.navigate2CarInsurance(rowData);
                                }}>
                                <Icon name="circle-thin" size={27} color="#555"/>
                            </TouchableOpacity>:
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                            <Text style={{color:'#ff5c3c',fontSize:16}}>已申请</Text>
                        </View>
                    }

                    <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',
                                padding:2,paddingLeft:12}}
                                      onPress={()=>{
                                         if(rowData.idle==true)
                                           this.navigate2CarInsurance(rowData);
                                      }}>
                        <View>
                            <Text style={{color:'#343434',fontSize:16}}>
                                车牌号:{rowData.carNum}
                            </Text>
                            <Text style={{color:'#343434',fontSize:15}}>
                                车主姓名 :{rowData.ownerName}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{width:50,padding:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>{
                                           this.navigate2CarInfoDetail(rowData);
                                      }}>
                        <Icon name="angle-right" size={42} color="#343434"></Icon>
                    </TouchableOpacity>
                </View>


            </View>;

        return row;
    }

    fetchData(){

        setTimeout(()=>{
            this.setState({doingFetch:true});

            Proxy.post({
                url:Config.server+'/svr/request',
                headers: {
                    'Authorization': "Bearer " + this.state.accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request:'fetchInsuranceCarInfoByCustomerId',

                    info:{carNum:''}
                }
            },(res)=> {
                if(res.error)
                {
                    Alert.alert(
                        'error',
                        res.error_description
                    );
                    this.setState({doingFetch:false});
                }else{
                    var bindedCars=res.data;
                    if(bindedCars!==null){
                        bindedCars.map(function (car, i) {
                            car.checked = false;
                        });
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({dataSource: ds.cloneWithRows(bindedCars),bindedCars:bindedCars,doingFetch:false});
                    }else{
                        bindedCars=[];
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({dataSource: ds.cloneWithRows(bindedCars),bindedCars:bindedCars,doingFetch:false});
                    }
                }

            }, (err) =>{
                this.setState({doingFetch:false});
                alert(err)
            });
        },400)
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            query:{},
            bindedCars:[],
            selectAll:false,
            dataSource : null,
            accessToken: accessToken,
            modalVisible:false,
            doingFetch:false
        };
    }


    render(){

        var listView=null;

        if(this.state.dataSource!==undefined&&this.state.dataSource!==null)
        {

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }else{
            if(this.state.doingFetch==false)
                this.fetchData();
        }


        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                    <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                    height:parseInt(height*54/667),backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                        <TouchableOpacity onPress={()=>{
                            this.goBack();
                        }}>

                            <Icon name="angle-left" size={40} color="#fff"></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize:17,flex:3,paddingLeft:40,textAlign:'center',color:'#fff'}}>
                            车辆管理
                        </Text>
                        <TouchableOpacity onPress={()=>{
                            this.fetchData();
                            }}>
                            <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center',
                                        borderRadius:8,paddingTop:8,paddingBottom:8,paddingLeft:10,paddingRight:10,alignItems:'center'}}>
                                <Icon name="refresh" size={20} color="#fff"></Icon>
                            </View>
                        </TouchableOpacity>

                    </View>


                    {/*搜索框*/}
                    <View style={{padding:12,height:55}}>

                        <View style={[styles.row,{borderBottomWidth:0}]}>
                            <View style={{flex:1,borderWidth:1,borderColor:'#ddd',borderTopLeftRadius:8,borderBottomLeftRadius:8
                                    }}>
                                <TextInput
                                    style={{height: 40,paddingLeft:10,paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:16}}
                                    onChangeText={(carNum) => {
                                      this.state.query.carNum=carNum;
                                      this.setState({query:this.state.query});
                                    }}
                                    value={this.state.query.carNum}
                                    placeholder='请输入车牌号作为搜索条件'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="characters"
                                />
                            </View>
                            <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#00c9ff',
                                    borderTopRightRadius:8,borderBottomRightRadius:8}}>
                                <Icon size={21} color="#fff" name="search"></Icon>
                            </View>
                        </View>

                    </View>


                    {/*车辆列表*/}
                    <View style={{padding:8,paddingLeft:0,paddingRight:0,height:height-274}}>
                        {listView}
                    </View>

                    <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                            padding:10,borderRadius:10,justifyContent:'center'}]}
                                      onPress={()=>{
                                             this.setState({modalVisible:true});
                                          }}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:15}}>创建新车</Text>
                        </View>
                    </TouchableOpacity>


                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            console.log("Modal has been closed.");
                        }}
                    >

                        <NewCarBind
                            onClose={()=>{
                                this.setState({modalVisible:!this.state.modalVisible});
                            }}
                            bindNewCar={
                                (carNum,cb)=>{
                                       this.bindNewCar(carNum,cb);
                                }
                            }
                            navigate2NewCarCreate={
                                (carNum,city)=>{this.navigate2NewCarCreate(carNum,city);}
                            }
                            onRefresh={()=>{
                                this.fetchData();
                            }}
                            accessToken={this.props.accessToken}
                        />

                    </Modal>


                    {/*loading模态框*/}
                    <Modal animationType={"fade"} transparent={true} visible={this.state.doingFetch}>

                        <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                          onPress={()=>{
                                            //TODO:cancel this behaviour
                                          }}>

                            <View style={{width:width*2/3,height:80,backgroundColor:'rgba(60,60,60,0.9)',position:'relative',
                                        justifyContent:'center',alignItems:'center',borderRadius:6}}>
                                <ActivityIndicator
                                    animating={true}
                                    style={[styles.loader, {height: 40,position:'absolute',top:8,right:20,transform: [{scale: 1.6}]}]}
                                    size="large"
                                    color="#00BFFF"
                                />
                                <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                    <Text style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>
                                        拉取车辆管理列表...
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>



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
)(CarManage);

