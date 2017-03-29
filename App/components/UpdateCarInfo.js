/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    StyleSheet,
    ScrollView,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
var Proxy = require('../proxy/Proxy');
import { connect } from 'react-redux';
import Config from '../../config';
var {height, width} = Dimensions.get('window');
import { AppRegistry, TextInput } from 'react-native';
import AppendCarNumPrefixModal from './modal/AppendCarNumPrefixModal';
import UploadLicenseCardModal from './modal/UploadLicenseCardModal';
import DatePicker from 'react-native-datepicker';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import FacebookTabBar from '../components/toolbar/FacebookTabBar';
import CarInfoEdit from '../components/modal/CarInfoEdit';



class UpdateCarInfo extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }

    }

    uploadLicenseCard(val){
        this.setState({uploadModalVisible:val})
    }

    appendCarNumPrefixByCity(val){
        this.setState({modalVisible:val})
    }


    getCarNumPrefixByCity(city)
    {
        var carNum=null;
        switch (city) {
            case '济南':
                carNum='鲁A';
                break;
            case '青岛':
                carNum='鲁B';
                break;
            case '淄博':
                carNum='鲁C';
                break;
            case '枣庄':
                carNum='鲁D';
                break;
            case '东营':
                carNum='鲁E';
                break;
            case '烟台':
                carNum='鲁F';
                break;
            case '潍坊':
                carNum='鲁G';
                break;
            case '济宁':
                carNum='鲁H';
                break;
            case '泰安':
                carNum='鲁J';
                break;
            case '威海':
                carNum='鲁K';
                break;
            case '日照':
                carNum='鲁L';
                break;
            case '滨州':
                carNum='鲁M';
                break;
            case '德州':
                carNum='鲁N';
                break;
            case '聊城':
                carNum='鲁P';
                break;
            case '临沂':
                carNum='鲁Q';
                break;
            case '菏泽':
                carNum='鲁R';
                break;
            case '莱芜':
                carNum='鲁S';
                break;
            default:
                break;
        }
        return carNum;
    }



    cityConfirm(city){
        //TODO:filter the city prefix
        var prefix=this.getCarNumPrefixByCity(city);
        this.setState({modalVisible: false,city:city,carNum:prefix});
    }

    fetchData(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceCarInfoByCustomerId'
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var data=res.data;
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({dataSource: ds.cloneWithRows(data)});
            }
        }, (err) =>{
        });
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            carInfo:{
                city:this.props.city!==undefined&&this.props.city!==null?this.props.city:null,
                carNum:this.props.carNum!==undefined&&this.props.carNum!==null?this.props.carNum:null,
                issueDate:null,
                factoryNum:null,
                engineNum:null,
                frameNum:null,
                carTransferred:false
            },
            uploadModalVisible:false,
            modalVisible:false,
            editModalVisible:false
        };
    }


    render(){


        var state=this.state;
        var props=this.props;
        var {carInfo}=state;


        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>

                <View style={[{height:36,backgroundColor:'rgba(17, 17, 17, 0.6)',padding:0,paddingHorizontal:10
                            ,alignItems:'center',flexDirection:'row'}]}>

                    <View style={{width:70}}>
                        <TouchableOpacity onPress={()=>{
                        this.goBack();
                            }}>
                            <Icon name="angle-left" size={34} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:15,flex:1,textAlign:'center',color:'#fff'}}>
                        创建新车
                    </Text>
                    <TouchableOpacity style={{width:100,flexDirection:'row',justifyContent:'center',backgroundColor:'#ef473a',
                        padding:6,paddingLeft:6,paddingRight:6,borderRadius:6,alignItems:'center'}}
                                      onPress={
                                          ()=>{
                                              this.appendCarNumPrefixByCity(!this.state.modalVisible)
                                          }}>
                        <Text style={{color:'#fff',fontSize:12}}>保存车辆信息</Text>
                    </TouchableOpacity>
                </View>

                <View style={{padding:10}}>

                    {/*用车城市*/}
                    <View style={[styles.row,{alignItems:'center',padding:6,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:20,marginLeft:10}}>
                            <Icon name="map-marker" size={17} color="#343434"/>
                        </View>
                        <View style={{flex:4,justifyContent:'center',marginLeft:3}}>
                            <Text style={{'fontSize':14,color:'#343434',fontWeight:'bold'}}>用车城市:</Text>
                        </View>
                        <View style={{flex:4,justifyContent:'center'}}>
                            <Text style={{'fontSize':13,color:'#343434'}}>{carInfo.city}</Text>
                        </View>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <TouchableOpacity onPress={
                                    ()=>{
                                        this.appendCarNumPrefixByCity(!this.state.modalVisible)
                                    }}>
                                <Icon name="chevron-right" size={20} color="#343434"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/*车牌*/}
                    <View style={[styles.row,{alignItems:'center',padding:6,paddingLeft:0,paddingRight:0}]}>

                        <View style={{flex:1,marginRight:25,justifyContent:'center',marginLeft:7}}>
                            <Icon name="car" size={15} color="#222"/>
                        </View>

                        <View style={{flex:3,justifyContent:'center'}}>
                            <Text style={{'fontSize':14,color:'#222',fontWeight:'bold'}}>车牌:</Text>
                        </View>
                        <View style={{flex:6}}>
                            <TextInput
                                style={{height: 30,fontSize:13,color:'#222'}}
                                onChangeText={(carNum) => {
                                    this.setState({carInfo:Object.assign(carInfo,{carNum:carNum})});
                                }}
                                value={carInfo.carNum}
                                placeholder='请输入您的车牌号'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    {/*姓名*/}
                    <View style={[styles.row,{alignItems:'center',padding:4,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:25,justifyContent:'center',marginLeft:10}}>
                            <Icon name="user" size={15} color='#222'/>
                        </View>
                        <View style={{flex:3,justifyContent:'center'}}>
                            <Text style={{'fontSize':14,color:'#222',fontWeight:'bold'}}>姓名:</Text>
                        </View>
                        <View style={{flex:6}}>
                            <TextInput
                                style={{height: 30,fontSize:13,color:'#222'}}
                                onChangeText={(ownerName) => {
                                    this.setState({carInfo:Object.assign(carInfo,{ownerName:ownerName})})
                                }}
                                value={carInfo.ownerName}
                                placeholder='请输入车主姓名'
                                placeholderTextColor="#888"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    {/*注册日期*/}
                    <View style={[styles.row,{alignItems:'center',padding:0,paddingLeft:0,paddingRight:0}]}>

                        <View style={{flex:1,justifyContent:'center',marginLeft:8,marginRight:25}}>
                            <Icon name="calendar" size={16} color="#222"/>
                        </View>

                        <View style={{flex:3,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':14,color:'#222',fontWeight:'bold'}}>注册日期:</Text>
                        </View>

                        <View style={{flex:6,flexDirection:'row',marginLeft:2}}>
                            <DatePicker
                                style={{width:150}}
                                date={carInfo.issueDate}
                                mode="datetime"
                                placeholder="点击选择日期"
                                format="YYYY-MM-DD"
                                minDate="2016-05-01"
                                maxDate="2016-12-30"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconSource={require('../img/google_calendar.png')}
                                onDateChange={(date) => {
                                    this.setState({carInfo:Object.assign(carInfo,{issueDate:date})});
                                }}
                            />
                        </View>
                    </View>

                    {/*是否过户*/}
                    <View style={[styles.row,{alignItems:'center',padding:9,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,justifyContent:'center',marginLeft:7,marginRight:30}}>
                            <Icon name="info-circle" size={20} color="#ef473a"/>
                        </View>
                        <View style={{flex:8}}>
                            <Text style={{'fontSize':14,color:'#222',fontWeight:'bold'}}>是一年内过户的二手车吗:</Text>
                        </View>
                        <TouchableOpacity style={{flex:1,marginRight:20}}
                                          onPress={
                                    ()=>{
                                        this.setState({carTransferred:!carInfo.carTransferred});
                                    }}>
                            {
                                carInfo.carTransferred==true?
                                    <Icon name="check-square-o" size={22} />:<Icon name="square-o" size={22}/>
                            }
                        </TouchableOpacity>
                    </View>


                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                    >

                        <AppendCarNumPrefixModal
                            onClose={()=>{
                            this.appendCarNumPrefixByCity(!this.state.modalVisible)
                        }}
                            onConfirm={(city)=>{
                            this.cityConfirm(city);
                        }}
                        />
                    </Modal>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.uploadModalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                    >

                        <UploadLicenseCardModal
                            navigator={this.props.navigator}
                            onClose={()=>{
                            this.uploadLicenseCard(!this.state.uploadModalVisible)
                        }}

                        />
                    </Modal>

                </View>

                <View style={{flex:1,width:width,position:'relative',marginTop:10}}>


                    <ScrollableTabView
                        style={{marginTop: 10, flex:1}}
                        initialPage={1}
                        renderTabBar={() =>  <FacebookTabBar />}
                    >

                        <View tabLabel='填写信息' style={{flex:1,padding:10}}>

                            <View style={{height:40,alignItems:'center',justifyContent:'center',marginTop:50}}>
                                <TouchableOpacity style={{width:width/2,backgroundColor:'#00c9ff',borderRadius:6,padding:6,paddingHorizontal:12
                                        ,alignItems:'center'}}
                                                  onPress={
                                          ()=>{
                                            this.setState({editModalVisible:!state.editModalVisible})
                                          }}>
                                    <Text style={{color:'#fff',fontSize:14}}>填写车辆信息</Text>
                                </TouchableOpacity>
                            </View>


                            {/*/!*厂牌型号*!/*/}
                            {/*<View style={[styles.row,{alignItems:'center',padding:8,paddingLeft:0,paddingRight:0}]}>*/}

                                {/*<View style={{flex:3,flexDirection:'row',alignItems:'center',marginLeft:10}}>*/}
                                    {/*<Text style={{fontSize:16,color:'#343434'}}>厂牌型号:</Text>*/}
                                {/*</View>*/}
                                {/*<View style={{flex:1}}></View>*/}
                                {/*<View style={{flex:6}}>*/}
                                    {/*<TextInput*/}
                                        {/*style={{height: 30,borderWidth:0,fontSize:15}}*/}
                                        {/*onChangeText={(factoryNum) => this.setState({factoryNum})}*/}
                                        {/*value={this.state.factoryNum}*/}
                                        {/*placeholder='请输入厂牌型号'*/}
                                        {/*placeholderTextColor="#888"*/}
                                        {/*underlineColorAndroid="transparent"*/}
                                    {/*/>*/}
                                {/*</View>*/}
                            {/*</View>*/}


                            {/*/!*发动机号*!/*/}
                            {/*<View style={[styles.row,{alignItems:'center',padding:8,paddingLeft:0,paddingRight:0}]}>*/}
                                {/*<View style={{flex:3,flexDirection:'row',alignItems:'center',marginLeft:10}}>*/}
                                    {/*<Text style={{fontSize:16,color:'#343434'}}>发动机号:</Text>*/}
                                {/*</View>*/}
                                {/*<View style={{flex:1}}></View>*/}
                                {/*<View style={{flex:6}}>*/}
                                    {/*<TextInput*/}
                                        {/*style={{height: 30,fontSize:15}}*/}
                                        {/*onChangeText={(engineNum) => this.setState({engineNum})}*/}
                                        {/*value={this.state.engineNum}*/}
                                        {/*placeholder='请输入发动机号'*/}
                                        {/*placeholderTextColor="#888"*/}
                                        {/*underlineColorAndroid="transparent"*/}
                                    {/*/>*/}
                                {/*</View>*/}
                            {/*</View>*/}


                            {/*/!*车架号*!/*/}
                            {/*<View style={[styles.row,{alignItems:'center',padding:8,paddingLeft:0,paddingRight:0}]}>*/}
                                {/*<View style={{flex:3,flexDirection:'row',alignItems:'center',marginLeft:10}}>*/}
                                    {/*<Text style={{fontSize:16,color:'#343434'}}>车架号:</Text>*/}
                                {/*</View>*/}
                                {/*<View style={{flex:1}}></View>*/}
                                {/*<View style={{flex:6}}>*/}
                                    {/*<TextInput*/}
                                        {/*style={{height: 30,fontSize:15}}*/}
                                        {/*onChangeText={(frameNum) => this.setState({frameNum})}*/}
                                        {/*value={this.state.frameNum}*/}
                                        {/*placeholder='请输入车架号'*/}
                                        {/*placeholderTextColor="#888"*/}
                                        {/*underlineColorAndroid="transparent"*/}
                                    {/*/>*/}
                                {/*</View>*/}
                            {/*</View>*/}

                        </View>
                        <View tabLabel='上传行驶证' style={{padding:12,flex:1}}>




                            <View style={{height:30,alignItems:'center',justifyContent:'center',marginTop:50}}>
                                <TouchableOpacity style={{width:width/2,backgroundColor:'#00c9ff',borderRadius:6,padding:6,paddingHorizontal:12
                                        ,alignItems:'center',justifyContent:'center'}}
                                                  onPress={
                                          ()=>{
                                             this.uploadLicenseCard(!this.state.uploadModalVisible);
                                          }}>
                                    <Text style={{color:'#fff',fontSize:14}}>上传行驶证</Text>
                                </TouchableOpacity>
                            </View>


                        </View>

                    </ScrollableTabView>
                </View>

                </Image>


                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.editModalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.");
                    }}
                >
                    <CarInfoEdit

                        carInfo={carInfo}
                        onClose={()=>{
                            this.setState({editModalVisible:!this.state.editModalVisible});
                        }}

                        onPopBack={
                            ()=>{
                                this.setState({editModalVisible:!this.state.editModalVisible});
                                this.goBack();
                            }
                        }

                        bindNewCar={
                            (carNum,cb)=>{
                                   this.bindNewCar(carNum,cb);
                            }
                        }
                        navigate2NewCarCreate={
                            (carNum,city)=>{this.navigate2NewCarCreate(carNum,city);}
                        }
                        onRefresh={()=>{
                            this.refresh();
                        }}
                        accessToken={this.props.accessToken}
                    />

                </Modal>


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
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
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
        borderBottomWidth:1,
        borderBottomColor:'#222'
    }



});



module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(UpdateCarInfo);

