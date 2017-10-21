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
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import FacebookTabBar from '../components/toolbar/FacebookTabBar';
import CarInfoEdit from '../components/modal/CarInfoEdit';
import Switch from 'react-native-switch-pro'
import{
    createCarInfo,
    enableCarManageRefresh,
    getCarInfoByCarNum,
    uploadCarAndOwnerInfo,
    uploadPhoto,
    updateCarInfo
} from '../action/CarActions';


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

    checkPhotoUploadOrNot()
    {   var {licenseCard1_img,licenseCard2_img,licenseCard3_img}=this.state;
        return new Promise((resolve, reject) => {
            var {assetsBundle}=this.state;
            // if((assetsBundle.licenseCard1_img!==undefined&&assetsBundle.licenseCard1_img!==null)
            //     ||(assetsBundle.licenseCard2_img!==undefined&&assetsBundle.licenseCard2_img!==null)
            //     ||(assetsBundle.licenseCard3_img!==undefined&&assetsBundle.licenseCard3_img!==null))
            // {

            if((licenseCard1_img==undefined&&licenseCard1_img==null)
                ||(licenseCard2_img==undefined&&licenseCard2_img==null)
                ||(licenseCard3_img==undefined&&licenseCard3_img==null))
            {

                Alert.alert('信息','您有未上传的行驶证照片,是否选择上传行驶证',[
                    {
                        text:'确认',onPress:()=>{
                            resolve({re:1,data:true});
                        }
                    },
                    {
                        text:'取消',onPress:()=>{
                        resolve({re:1,data:false});
                    }
                    }
                ])

            }else{
                resolve({re:1,data:true});
            }

        });
    }


    fillLicenseInfo(payload)
    {
        this.props.dispatch(updateCarInfo(payload)).then((json)=>{
            if(json.re==1)
            {

                Alert.alert('信息','车辆信息保存成功',[
                    {
                        text:'确认',onPress:()=>{
                       this.goBack();
                    }
                    }
                ])

                this.props.dispatch(enableCarManageRefresh());

            }
        }).catch((e)=>{
            alert(e)
        })
    }

    //上传行驶证
    licenseCardPhotoUpload(){
        var {carInfo,assetsBundle}=this.state;
        if(carInfo.licenseCard1_img!==undefined&&carInfo.licenseCard1_img!==null
            &&carInfo.licenseCard2_img!==undefined&&carInfo.licenseCard2_img!==null)
        {

            //var carInfo = null;

            // var licenseAttachId1 = null;
            // var licenseAttachId2 = null;
            // var licenseAttachId3 = null;
            var carId=null;
            var server=null;
            var imageType = 'licenseCard';

            this.props.dispatch(uploadCarAndOwnerInfo(carInfo)).then((json)=>{
                if(json.re==1)
                {
                    carInfo = json.data;
                    carId = carInfo.carId;

                    var {licenseCard1_img,licenseCard2_img,licenseCard3_img}=this.state;

                    this.props.dispatch(uploadPhoto({path:licenseCard1_img,filename:'licenseAttachId1',
                            imageType:'licenseCard',docType:'I3',carId:carId})).then((json)=>{
                        if(json.re==1)
                        {
                            licenseAttachId1=json.data;
                        }
                        return   this.props.dispatch(uploadPhoto({path:licenseCard2_img,filename:'licenseAttachId2',
                            imageType:'licenseCard',docType:'I3',carId:carId}));
                    }).then((json)=>{
                        if(json.re==1)
                        {
                            licenseAttachId2=json.data;
                        }
                        //如果有上传第3张
                        if(licenseCard3_img!==undefined&&licenseCard3_img!==null)
                        {
                            this.props.dispatch(uploadPhoto({path:licenseCard3_img,filename:'licenseAttachId3',
                                imageType:'licenseCard',docType:'I3',carId:carId})).then((json)=>{
                                if(json.re==1)
                                    licenseAttachId3=json.data;
                                this.fillLicenseInfo({carId:carId,licenseAttachId1:licenseAttachId1,licenseAttachId2:licenseAttachId2,
                                    licenseAttachId3:licenseAttachId3});
                            })
                        }else{
                            this.fillLicenseInfo({carId:carId,licenseAttachId1:licenseAttachId1,licenseAttachId2:licenseAttachId2});
                        }

                    })
                }
            }).catch((e)=>{
                alert(e)
            })



        }else{
            Alert.alert(
                '错误',
                '请完成行驶证的拍摄后再点击车辆创建'
            );

        }
    }

    //保存车辆信息
    postCarInfo(carInfo)
    {
        //这里的carInfo是回传过来的

        var {commitIndex}=this.state;
        var {personInfo}=this.props;
        //覆盖掉当前的车辆信息

        this.state.carInfo=carInfo;
        if(carInfo.carNum!==undefined&&carInfo.carNum!==null&&carInfo.carNum!=='')
        {
            if(carInfo.carNum.toString().length!=7)
            {
                Alert.alert(
                    '错误',
                    '请填入6位的车牌号'
                );
            }else{
                var {carNum,city}=carInfo;

                // var carNumPrefix=carNum.substring(0,2);
                // var prefix=this.getCarNumPrefixByCity(city);
                // if(prefix!=carNumPrefix)
                // {
                //     Alert.alert(
                //         '错误',
                //         '您输入的车牌号前缀不符合您选择的城市'
                //     );
                //
                // }else{
                    if(carInfo.ownerName!==undefined&&carInfo.ownerName!==null&&carInfo.ownername!=='')
                    {
                        if(carInfo.ownerName.toString().length<2)
                        {
                            Alert.alert(
                                '错误',
                                '您输入的车主姓名不能少于2位\r\n请重新输入'
                            );
                            return ;
                        }

                        //TODO:加入身份证的检测
                        if(carInfo.isOwner==true)
                        {
                            if(personInfo&&personInfo.perIdCard&&personInfo.perIdCard!='')
                            {
                            }else{
                                Alert.alert(
                                    '错误',
                                    '作为车主创建新车必须先填写身份证号码并提交'
                                );

                                return ;
                            }
                        }

                        //填入方式提交
                        if(commitIndex==0)
                        {

                            this.checkPhotoUploadOrNot().then((json)=>{

                              if(json.re==1)
                              {
                                  if(json.data==true)
                                  {

                                      this.setState({commitIndex:1});
                                      return ;
                                  }else{
                                      if(carInfo.factoryNum!==undefined&&carInfo.factoryNum!==null)
                                      {
                                          if(carInfo.engineNum!==undefined&&carInfo.engineNum!==null)
                                          {
                                              if(carInfo['engineNum_error']==true)
                                              {
                                                  Alert.alert(
                                                      '错误',
                                                      '请重新输入6位以上的发动机号再点击车辆创建'
                                                  );

                                              }else{
                                                  if(carInfo.frameNum!==undefined&&carInfo.frameNum!==null){
                                                      if(carInfo['frameNum_error']==true)
                                                      {

                                                          Alert.alert(
                                                              '错误',
                                                              '请重新输入17位的车架号再点击车辆创建'
                                                          );
                                                      }else{
                                                          if(carInfo.firstRegisterDate==undefined||carInfo.firstRegisterDate==null)
                                                          {
                                                              Alert.alert(
                                                                  '错误',
                                                                  '请选择注册日期后再点击保存'
                                                              );
                                                          }else{
                                                              if(carInfo.issueDate==undefined||carInfo.issueDate==null)
                                                              {
                                                                  Alert.alert(
                                                                      '错误',
                                                                      '请选择发证日期后再点击保存'
                                                                  );
                                                              }else{
                                                                  this.props.dispatch(createCarInfo({carInfo:carInfo})).then((json)=>{
                                                                      if(json.re==1)
                                                                      {
                                                                          var carInfo = json.data;

                                                                          Alert.alert('信息','车辆绑定成功',[{text:'确认',onPress:()=>{
                                                                              //TODO:make some dispatch
                                                                              this.props.dispatch(enableCarManageRefresh());
                                                                              this.goBack();
                                                                          }}])

                                                                      }else if(json.re==2)
                                                                      {
                                                                          alert(json.data)
                                                                      }

                                                                  }).catch((e)=>{
                                                                      alert(e)
                                                                  })
                                                              }
                                                          }
                                                      }
                                                  }else{
                                                      Alert.alert(
                                                          '错误',
                                                          '请填入车架号后再点击保存车辆信息'
                                                      );
                                                  }
                                              }
                                          }else{
                                              Alert.alert(
                                                  '错误',
                                                  '请填入发动机后再点击保存车辆信息'
                                              );
                                          }
                                      }else{
                                          Alert.alert(
                                              '错误',
                                              '请填入厂牌型号后再点击保存车辆信息'
                                          );
                                      }
                                  }
                              }
                            })
                        }else{
                            //上传方式提交
                            this.props.dispatch(getCarInfoByCarNum(carInfo)).then((json)=>{
                                if(json.re==1) {
                                    Alert.alert(
                                        '错误',
                                        '你提交的车牌号重复,请重新填入后提交'
                                    );

                                }else if(json.re==-1) {
                                    //上传行驶证
                                    this.licenseCardPhotoUpload();
                                }else{}
                            }).catch((e)=>{
                                alert(e)
                            })
                        }


                    }
              //  }
            }


        }else{
            Alert.alert(
                '错误',
                '请填入车牌号'
            );

        }
    }

    closeLicenseUploadModal(val){
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
        var carInfo = this.state.carInfo;
        carInfo.city = city;
        carInfo.carCity = city;
        this.setState({modalVisible: false,carInfo:carInfo});
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

    setLicenseCard(licenseCard1_img,licenseCard2_img,licenseCard3_img){
        var carInfo = this.state.carInfo;
        carInfo.licenseCard1_img = licenseCard1_img.uri;
        carInfo.licenseCard2_img = licenseCard2_img.uri;
        carInfo.licenseCard3_img = licenseCard3_img.uri;

        this.setState({licenseCard1_img:licenseCard1_img.uri,licenseCard2_img:licenseCard3_img.uri,licenseCard3_img:licenseCard3_img.uri,carInfo:carInfo});
    }

    setCarInfo(carInfo){
        this.setState({carInfo:carInfo});
    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            carInfo:{
                city:this.props.city!==undefined&&this.props.city!==null?this.props.city:null,
                carCity:this.props.city!==undefined&&this.props.city!==null?this.props.city:null,
                carNum:this.props.carNum!==undefined&&this.props.carNum!==null?this.props.carNum:null,
                issueDate:null,
                firstRegisterDate:null,
                factoryNum:null,
                engineNum:null,
                frameNum:null,
                carTransferred:false,
                licenseCard1_img:null,
                licenseCard2_img:null,
                licenseCard3_img:null,
            },
            uploadModalVisible:false,
            modalVisible:false,
            editModalVisible:false,
            commitIndex:0,
            assetsBundle:{},
            licenseCard1_img:null,
            licenseCard2_img:null,
            licenseCard3_img:null,
        };
    }


    render(){

        var state=this.state;
        var props=this.props;
        var {carInfo}=state;


        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>

                    <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                    height:parseInt(height*54/667),backgroundColor:'rgba(17, 17, 17, 0.6)'}}>


                    <TouchableOpacity style={{width:70}} onPress={()=>{
                       this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff"/>
                    </TouchableOpacity>

                    <Text style={{fontSize:17,flex:1,textAlign:'center',color:'#fff'}}>
                        创建新车
                    </Text>
                    <TouchableOpacity style={{width:100,flexDirection:'row',justifyContent:'center',backgroundColor:'#ef473a',
                        padding:6,paddingLeft:6,paddingRight:6,borderRadius:6,alignItems:'center'}}
                                      onPress={
                                          ()=>{
                                              var carInfo=this.state.carInfo;
                                              this.postCarInfo(carInfo);
                                          }}>
                        <Text style={{color:'#fff',fontSize:14}}>保存车辆信息</Text>
                    </TouchableOpacity>
                </View>

                <View style={{padding:10}}>

                    {/*用车城市*/}
                    <View style={[styles.row,{alignItems:'center',padding:6,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:10,marginLeft:10}}>
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

                        <View style={{flex:1,marginRight:15,justifyContent:'center',marginLeft:7}}>
                            <Icon name="car" size={15} color="#222"/>
                        </View>

                        <View style={{flex:3,justifyContent:'center'}}>
                            <Text style={{'fontSize':14,color:'#222',fontWeight:'bold'}}>车牌:</Text>
                        </View>
                        <View style={{flex:6,justifyContent:'center'}}>
                            <TextInput
                                style={{height: 30,fontSize:14,color:'#222',paddingTop:0,marginTop:10}}
                                onChangeText={(carNum) => {
                                    this.setState({carInfo:Object.assign(carInfo,{carNum:carNum})});
                                }}
                                value={carInfo.carNum}
                                placeholder='请输入您的车牌号'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    {/*姓名*/}
                    <View style={[styles.row,{alignItems:'center',padding:4,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,marginRight:15,justifyContent:'center',marginLeft:10}}>
                            <Icon name="user" size={15} color='#222'/>
                        </View>
                        <View style={{flex:3,justifyContent:'center'}}>
                            <Text style={{fontSize:14,color:'#222',fontWeight:'bold'}}>姓名:</Text>
                        </View>
                        <View style={{flex:6}}>
                            <TextInput
                                style={{height: 30,fontSize:14,color:'#222',paddingTop:0,marginTop:10}}
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


                    {/*是否为车主*/}
                    <View style={[styles.row,{padding:7,paddingHorizontal:7,alignItems:'center'},
                        carInfo.isOwner==true?{borderBottomWidth:0}:null]}>

                        <View style={{width:45,justifyContent:'flex-start',marginLeft:0,marginRight:0}}>
                            <Icon name="info-circle" size={20} color="#ef473a"/>
                        </View>

                        <View style={{paddingRight:12,alignItems:'flex-start',flex:1}}>
                            <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>是否为车主</Text>
                        </View>

                        <View style={{width:80,alignItems:'center',justifyContent:'center'}}>
                            <Switch
                                width={42}
                                height={25}
                                value={carInfo.isOwner}
                                backgroundActive="#00c9ff"
                                backgroundInactive="#666"
                                onSyncPress={value =>{
                                   this.setState({carInfo:Object.assign(this.state.carInfo,{isOwner:value})})
                                }}/>
                        </View>

                    </View>

                    {/*车主身份证填写*/}
                    {
                        carInfo.isOwner==true?
                            <View style={[styles.row,{alignItems:'center',padding:5,paddingLeft:0,paddingRight:0,borderWidth:2,
                                    borderColor:'#f00',borderBottomColor:'#f00',borderBottomWidth:2}]}>
                                <View style={{flex:1,marginRight:15,justifyContent:'center',marginLeft:10}}>
                                    <Icon name="drivers-license" size={15} color='#222'/>
                                </View>
                                <View style={{flex:3,justifyContent:'center'}}>
                                    <Text style={{fontSize:14,color:'#222',fontWeight:'bold'}}>车主身份证:</Text>
                                </View>
                                <View style={{flex:6}}>
                                    <TextInput
                                        style={{height:45,fontSize:13,color:'#222'}}
                                        onChangeText={(ownerIdCard) => {
                                    this.setState({carInfo:Object.assign(carInfo,{ownerIdCard:ownerIdCard})})
                                }}
                                        value={carInfo.ownerIdCard}
                                        placeholder='请输入车主身份证号码'
                                        placeholderTextColor="#888"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>:null
                    }


                    {/*是否过户*/}
                    <View style={[styles.row,{alignItems:'center',padding:9,paddingLeft:0,paddingRight:0}]}>
                        <View style={{flex:1,justifyContent:'center',marginLeft:7,marginRight:20}}>
                            <Icon name="info-circle" size={20} color="#ef473a"/>
                        </View>
                        <View style={{flex:8}}>
                            <Text style={{'fontSize':14,color:'#222',fontWeight:'bold'}}>是一年内过户的二手车吗:</Text>
                        </View>
                        <TouchableOpacity style={{flex:1,marginRight:20}}
                                          onPress={
                                    ()=>{

                                        var carInfo = this.state.carInfo;
                                        carInfo.carTransferred = !this.state.carInfo.carTransferred
                                        this.setState({carInfo:carInfo});

                                    }}>
                            {
                                carInfo.carTransferred==true?
                                    <Icon name="check-square-o" size={22} />:<Icon name="square-o" size={22}/>
                            }
                        </TouchableOpacity>
                    </View>

                    {/*选择城市模态框*/}
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

                    {/*上传行驶证模态框*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.uploadModalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                    >

                        <UploadLicenseCardModal
                            navigator={this.props.navigator}
                            onClose={(assetsBundle)=>{
                                if(assetsBundle)
                                    this.setState({uploadModalVisible:!this.state.uploadModalVisible,assetsBundle:assetsBundle})
                                else
                                    this.setState({uploadModalVisible:!this.state.uploadModalVisible});
                            }}

                            setLicenseCard={(licenseCard1_img,licenseCard2_img,licenseCard3_img)=>{
                                this.setLicenseCard(licenseCard1_img,licenseCard2_img,licenseCard3_img);
                            }}
                        />
                    </Modal>

                </View>

                <View style={{flex:1,width:width,position:'relative',marginTop:10}}>


                    <ScrollableTabView
                        style={{marginTop: 10, flex:1}}
                        initialPage={this.state.commitIndex}
                        renderTabBar={() =>  <FacebookTabBar />}
                        onChangeTab={({i})=>{
                            this.state.commitIndex=i;
                        }}
                        page={this.state.commitIndex}
                    >

                        <View tabLabel='填写信息' style={{flex:1,padding:10}}>

                            <View style={{height:40,alignItems:'center',justifyContent:'center',marginTop:50}}>
                                <TouchableOpacity style={{width:width/2,backgroundColor:'#00c9ff',borderRadius:6,padding:8,paddingHorizontal:12
                                        ,alignItems:'center'}}
                                                  onPress={
                                          ()=>{
                                            this.setState({editModalVisible:!state.editModalVisible})
                                          }}>
                                    <Text style={{color:'#fff',fontSize:14}}>填写车辆信息</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View tabLabel='上传行驶证' style={{padding:12,flex:1}}>

                            <View style={{height:30,alignItems:'center',justifyContent:'center',marginTop:50}}>
                                <TouchableOpacity style={{width:width/2,backgroundColor:'#00c9ff',borderRadius:6,padding:8,paddingHorizontal:12
                                        ,alignItems:'center',justifyContent:'center'}}
                                                  onPress={
                                          ()=>{
                                             {/*this.uploadLicenseCard(!this.state.uploadModalVisible);*/}
                                             this.setState({uploadModalVisible:!this.state.uploadModalVisible});
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

                        postCarInfo={(carInfo)=>{
                            this.setState({editModalVisible:!this.state.editModalVisible});
                            this.setState({carInfo:carInfo});
                        }}


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
        borderBottomColor:'#222',
        height:50
    }



});



module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo
    })
)(UpdateCarInfo);

