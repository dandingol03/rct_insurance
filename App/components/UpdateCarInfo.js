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
            city:this.props.city!==undefined&&this.props.city!==null?this.props.city:null,
            carNum:this.props.carNum!==undefined&&this.props.carNum!==null?this.props.carNum:null,
            modalVisible:false,
            issueDate:null,
            factoryNum:null,
            engineNum:null,
            frameNum:null,
            uploadModalVisible:false
        };
    }


    render(){

        return (
            <View style={{flex:1}}>


                <View style={[{backgroundColor:'#444',padding: 4,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                        this.goBack();
                            }}>
                            <Icon name='chevron-left' size={30} color="#222"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#444'}}>
                        创建新车
                    </Text>
                    <TouchableOpacity style={{flex:2,marginRight:10,flexDirection:'row',justifyContent:'center',backgroundColor:'#ef473a',
                        padding:8,paddingLeft:6,paddingRight:6,borderRadius:12}}
                                      onPress={
                                          ()=>{
                                              this.appendCarNumPrefixByCity(!this.state.modalVisible)
                                          }}>
                        <Icon name="hand-pointer-o" size={18} color="#fff"></Icon>
                        <Text style={{color:'#fff'}}>保存车辆信息</Text>
                    </TouchableOpacity>
                </View>

                <View style={{padding:10}}>

                    {/*用车城市*/}
                    <View style={[styles.row,{alignItems:'center',padding:10,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:20,marginLeft:10}}>
                            <Icon name="map-marker" size={24} color="#222"/>
                        </View>
                        <View style={{flex:4,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':18,color:'#222'}}>用车城市:</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':18,color:'#222'}}>{this.state.city}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={
                                    ()=>{
                                        this.appendCarNumPrefixByCity(!this.state.modalVisible)
                                    }}>
                                <Icon name="chevron-right" size={29} color="#222"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/*车牌*/}
                    <View style={[styles.row,{alignItems:'center',padding:10,paddingLeft:0,paddingRight:0}]}>

                        <View style={{flex:1,marginRight:25,justifyContent:'center',marginLeft:5}}>
                            <Icon name="car" size={24} color="#222"/>
                        </View>

                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':18,color:'#222'}}>车牌:</Text>
                        </View>
                        <View style={{flex:6}}>
                            <TextInput
                                style={{height: 40,fontSize:18,color:'#222'}}
                                onChangeText={(carNum) => this.setState({carNum})}
                                value={this.state.carNum}
                                placeholder='请输入您的车牌号'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    {/*姓名*/}
                    <View style={[styles.row,{alignItems:'center',padding:10,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:25,justifyContent:'center',marginLeft:5}}>
                            <Icon name="id-card" size={24} color='#222'/>
                        </View>
                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':18,color:'#222'}}>姓名:</Text>
                        </View>
                        <View style={{flex:6}}>
                            <TextInput
                                style={{height: 40,fontSize:18,coloor:'#222'}}
                                onChangeText={(ownerName) => this.setState({ownerName})}
                                value={this.state.ownerName}
                                placeholder='请输入姓名'
                                placeholderTextColor="#888"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    {/*注册日期*/}
                    <View style={[styles.row,{alignItems:'center',padding:10,paddingLeft:0,paddingRight:0}]}>

                        <View style={{flex:1,marginRight:20,justifyContent:'center',marginLeft:5,marginRight:25}}>
                            <Icon name="calendar" size={24} color="#222"/>
                        </View>

                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':18,color:'#222'}}>注册日期:</Text>
                        </View>

                        <View style={{flex:6,flexDirection:'row',marginLeft:8}}>
                            <DatePicker
                                style={{width:200,marginLeft:10}}
                                date={this.state.issueDate}
                                mode="datetime"
                                placeholder="点击选择日期"
                                format="YYYY-MM-DD"
                                minDate="2016-05-01"
                                maxDate="2016-12-30"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconSource={require('../img/google_calendar.png')}
                                onDateChange={(date) => {this.setState({issueDate: date});}}
                            />
                        </View>
                    </View>

                    {/*是否过户*/}
                    <View style={[styles.row,{alignItems:'center',padding:10,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,justifyContent:'center',marginLeft:5,marginRight:30}}>
                            <Icon name="info-circle" size={28} color="#ef473a"/>
                        </View>
                        <View style={{flex:8}}>
                            <Text style={{'fontSize':18,color:'#222'}}>是一年内过户的二手车吗:</Text>
                        </View>
                        <View style={{flex:1,marginRight:20}}>
                            <TouchableOpacity onPress={
                                    ()=>{
                                        this.setState({carTransferred:!this.state.carTransferred});
                                    }}>
                                {
                                    this.state.carTransferred==true?
                                        <Icon name="check-circle" size={34} color='#00c9ff'/>:<Icon name="circle-o" size={34}/>
                                }
                            </TouchableOpacity>
                        </View>
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
                    <ScrollableTabView style={{flex:1}}
                                       renderTabBar={() => <DefaultTabBar style={{borderBottomWidth:0}} activeTextColor="#00c9ff"  inactiveTextColor="#222" underlineStyle={{backgroundColor:'#00c9ff'}}/>}
                    >
                        <View tabLabel='填写信息' style={{flex:1,padding:12}}>

                            {/*厂牌型号*/}
                            <View style={[styles.row,{alignItems:'center',padding:8,paddingLeft:0,paddingRight:0}]}>

                                <View style={{flex:2,flexDirection:'row',alignItems:'center',marginLeft:10}}>
                                    <Text style={{'fontSize':17,color:'#222'}}>厂牌型号:</Text>
                                </View>
                                <View style={{flex:1}}></View>
                                <View style={{flex:6}}>
                                    <TextInput
                                        style={{height: 40,borderWidth:0,fontSize:16}}
                                        onChangeText={(factoryNum) => this.setState({factoryNum})}
                                        value={this.state.factoryNum}
                                        placeholder='请输入厂牌型号'
                                        placeholderTextColor="#888"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>


                            {/*发动机号*/}
                            <View style={[styles.row,{alignItems:'center',padding:8,paddingLeft:0,paddingRight:0}]}>
                                <View style={{flex:2,flexDirection:'row',alignItems:'center',marginLeft:10}}>
                                    <Text style={{'fontSize':17,color:'#222'}}>发动机号:</Text>
                                </View>
                                <View style={{flex:1}}></View>
                                <View style={{flex:6}}>
                                    <TextInput
                                        style={{height: 40,fontSize:16}}
                                        onChangeText={(engineNum) => this.setState({engineNum})}
                                        value={this.state.engineNum}
                                        placeholder='请输入发动机号'
                                        placeholderTextColor="#888"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>


                            {/*车架号*/}
                            <View style={[styles.row,{alignItems:'center',padding:8,paddingLeft:0,paddingRight:0}]}>
                                <View style={{flex:2,flexDirection:'row',alignItems:'center',marginLeft:10}}>
                                    <Text style={{'fontSize':17,color:'#222'}}>车架号:</Text>
                                </View>
                                <View style={{flex:1}}></View>
                                <View style={{flex:6}}>
                                    <TextInput
                                        style={{height: 40,fontSize:16}}
                                        onChangeText={(frameNum) => this.setState({frameNum})}
                                        value={this.state.frameNum}
                                        placeholder='请输入车架号'
                                        placeholderTextColor="#888"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>

                        </View>
                        <View tabLabel='上传行驶证' style={{padding:12,flex:1}}>
                            <View style={{padding:10,marginTop:10,width:width/2,marginLeft:width/4,flexDirection:'row',justifyContent:'center'}}>

                                <TouchableOpacity style={{flex:2,flexDirection:'row',justifyContent:'center',backgroundColor:'#ef473a',
                                        padding:12,paddingLeft:6,paddingRight:6,borderRadius:12,height:50}}
                                                  onPress={
                                          ()=>{
                                               this.uploadLicenseCard(!this.state.uploadModalVisible);
                                          }}>
                                    <Icon name="hand-pointer-o" size={23} color="#fff"></Icon>
                                    <Text style={{color:'#fff',fontSize:16,marginLeft:5}}>上传行驶证</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ScrollableTabView>
                </View>


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
        backgroundColor: '#fff',
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

