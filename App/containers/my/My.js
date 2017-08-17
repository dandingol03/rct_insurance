/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    View,
    Alert,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    BackAndroid
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Popover = require('react-native-popover');
import Contact from './Contact';
import Credit from './Credit';
import CarManage from '../car/CarManage';
import ServiceOrders from '../service/ServiceOrders';
import LifeOrders from '../life/LifeOrders';
import CarOrders from '../car/CarOrders';
import Camera from 'react-native-camera';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import HelpAndConfig from '../../components/Help/HelpAndConfig';
import PasswordModify from '../PasswordModify';
import Portrait from '../Portrait';
import WxShareModal from '../../components/modal/WxShareModal';
import Notification from '../Notification';
var WeChat = require('react-native-wechat');
var resolveAssetSource= require('resolveAssetSource');
import PreferenceStore from '../../components/utils/PreferenceStore';
var ImagePicker = require('react-native-image-picker');

import {
    downloadPortrait,
    updatePortrait
} from '../../action/UserActions';
var {height, width} = Dimensions.get('window');

class My extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showImagePicker(perIdCard_img){

        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            title:'请选择',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'图库',
            cancelButtonTitle:'取消',

        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                switch(perIdCard_img)
                {
                    case 'perIdCard1_img':
                        this.setState({perIdCard1_img: source});
                        console.log('perIdCard1_img.uri = ', response.uri);
                        break;
                    case 'perIdCard2_img':
                        this.setState({perIdCard2_img: source});
                        console.log('perIdCard2_img.uri = ', response.uri);
                        break;
                    default:
                        break;
                }

            }
        });
    }

    wxShare(shareType)
    {
        var imageResource = require('../../img/logo.png');
        switch (shareType) {
            case '好友':
               // WeChat.openWXApp();
                WeChat.shareToSession({
                    type: 'news',
                    title: '我正在使用捷惠宝App,想与您一起分享',
                    description: 'share resource image to time line',
                    mediaTagName: 'email signature',
                    messageAction: undefined,
                    messageExt: undefined,
                    webpageUrl:'http://139.129.96.231:3000/wx',
                    //webpageUrl:'http://192.168.1.127:3000/wx',
                });
                break;
            case '朋友圈':
                WeChat.shareToTimeline({
                    type: 'news',
                    title: '我正在使用捷惠宝App,想与您一起分享',
                    description: 'share resource image to time line',
                    mediaTagName: 'email signature',
                    messageAction: undefined,
                    messageExt: undefined,
                    webpageUrl:'http://139.129.96.231:3000/wx',
                    //webpageUrl:'http://192.168.1.127:3000/wx',
                });
                break;
            default:
                break;
        }

        this.setState({wxVisible:false});
    }

    navigate2Notification()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'Notification',
                component: Notification,
                params: {

                }
            })
        }
    }

    navigate2Portrait()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'Portrait',
                component: Portrait,
                params: {
                    getPortrait:this.getPortrait.bind(this),
                    setPortrait:this.setPortrait.bind(this)
                }
            })
        }
    }

    setPortrait(portrait){
        this.setState({portrait:portrait});
    }

    getPortrait(){
        this.props.dispatch(downloadPortrait())
            .then((json)=>{
                if(json.re==1){
                    var portrait=json.data;
                    this.setState({portrait:portrait});
                    this.props.dispatch(updatePortrait(portrait));

                }else{

                }

            });
    }

    navigate2HelpAndConfig()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'HelpAndConfig',
                component: HelpAndConfig,
                params: {

                }
            })
        }
    }

    navigate2PasswordModify()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'PasswordModify',
                component: PasswordModify,
                params: {

                }
            })
        }
    }

    navigate2ContactInfo()
    {

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'Contact',
                component: Contact,
                params: {

                }
            })
        }
    }

    navigate2Credit()
    {

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'Credit',
                component: Credit,
                params: {

                }
            })
        }
    }

    navigate2CarManage()
    {

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CarManage',
                component: CarManage,
                params: {

                }
            })
        }
    }

    navigate2CarOrders()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CarOrders',
                component: CarOrders,
                params: {

                }
            })
        }
    }

    navigate2ServiceOrders()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ServiceOrders',
                component: ServiceOrders,
                params: {

                }
            })
        }
    }

    navigate2LifeOrders()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'LifeOrders',
                component: LifeOrders,
                params: {

                }
            })
        }
    }

    showPopover(ref){
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            this.setState({
                menuVisible: true,
                buttonRect: {x: px+5, y: py+10, width: 200, height: height}
            });
        });
    }

    closePopover(){
        this.setState({menuVisible: false});
    }

    takePicture = () => {
        if (this.camera) {
            this.camera.capture()
                .then((json) => {
                    var data=json.data;
                    var path=json.path;
                    //the comment below is to make we can get path from the callback
                    setTimeout(function () {
                        Alert.alert(
                            'info',
                            'photo path='+path);
                    },1000)
                    this.setState({cameraModalVisible:false,portrait:path});
                    this.storePicture(path);
                })
                .catch(err => console.error(err));
        }
    }

    storePicture(portrait){

        var {accessToken}=this.props;

        if (portrait) {
            // Create the form data object
            var data = new FormData();
            data.append('file', {uri: portrait, name: 'portrait.jpg', type: 'multipart/form-data'});

            //限定为jpg后缀
            Proxy.post({
                url:Config.server+'/svr/request?request=uploadPortrait&suffix=jpg',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type':'multipart/form-data',
                },
                body: data,
            },(json)=> {
                if(json.re==1) {
                    if(json.data!==undefined&&json.data!==null)
                    {
                        console.log('...');
                    }
                }

            }, (err) =>{
                Alert.alert(
                    'error',
                    err
                );
            });

        }
    }

    startRecording = () => {
        if (this.camera) {
            this.camera.capture({mode: Camera.constants.CaptureMode.video})
                .then((data) => console.log(data))
                .catch(err => console.error(err));
            this.setState({
                isRecording: true
            });
        }
    }

    stopRecording = () => {
        if (this.camera) {
            this.camera.stopCapture();
            this.setState({
                isRecording: false
            });
        }
    }

    componentWillMount(){

        this.getPortrait();
    }

    constructor(props) {
        super(props);
        this.state={
            portrait:props.portrait!==undefined&&props.portrait!==null?props.portrait:null,
            wxVisible:false,
        };
    }

    render() {

        var props=this.props;
        var state=this.state;
        var x=5*width/360;
        var y=20*(height)/615;
        var displayArea = {x: x ,y: y, width:width-10, height: width-10};

        return (
            <View style={styles.container}>

                {/*top half*/}
                   <Image style={{flex:2,width:width,position:'relative'}} source={require('../../img/my_column.jpg')} >

                       <View style={{flex:3,marginTop:20,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>

                           <TouchableOpacity style={{position:'absolute',top:20,right:10,flex:1,alignItems:'flex-end'}}
                                             onPress={this.showPopover.bind(this, 'menu')}  ref="menu"
                           >
                               <Icon name="bars" size={25} color="#fff"></Icon>
                           </TouchableOpacity>


                           <TouchableOpacity   onPress={() => {
                               this.navigate2Portrait();
                           }}>
                               {
                                   state.portrait!==undefined&&state.portrait!==null?
                                       <Image resizeMode="stretch" style={{height:height*150/736,width:height*150/736,borderRadius:height*75/736}}
                                              source={{uri:state.portrait}}/>:
                                       <Image resizeMode="stretch" style={{height:height*150/736,width:height*150/736,borderRadius:height*75/736}}
                                              source={require('../../img/zack.png')}/>
                               }

                           </TouchableOpacity>

                       </View>

                       <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:24}}>{props.personInfo.perName}</Text>
                       </View>

                       <View style={{flex:1,position:'absolute',bottom:0,left:0,flexDirection:'row',alignItems:'center',
                            justifyContent:'flex-start'}}>
                            <View style={{flex:3,padding:8,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'#eee',fontWeight:'bold',fontSize:15,marginRight:4}}>
                                    积分:
                                </Text>
                                <Text style={{color:'#961b1b',fontSize:20}}>
                                    {props.score}
                                </Text>
                            </View>

                            <View style={{flex:1}}></View>

                            <TouchableOpacity style={{flex:1,padding:8,justifyContent:'center',alignItems:'center',flexDirection:'row'}}
                                              onPress={() => {
                               this.navigate2Notification();
                           }}>
                                <Icon name="comments" size={20} color="#eee"></Icon>
                                <Text style={{marginLeft:5,color:'#fff',fontSize:15}}>通知</Text>
                            </TouchableOpacity>

                       </View>

                   </Image>

                {/*bottom half*/}

                <View style={{flex:3,}}>

                    <View style={{flex:2,borderBottomWidth:1,borderColor:'#ddd',width:width-6,flexDirection:'row',alignItems:'center',marginLeft:3}}>
                        {/*个人信息*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:height*130/736,borderLeftWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2ContactInfo();
                                          }}>
                                <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_info@2x.png')}
                                       onPress={()=>{
                                                   Alert.alert(
                                                'error',
                                                'DW'
                                            );
                                          }}
                                />

                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                个人信息
                            </Text>
                        </TouchableOpacity>

                        {/*我的红包*/}
                        <View style={{flex:1,alignItems:'center',height:height*130/736,borderLeftWidth:1,borderRightWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}>
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_redBag@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                我的红包
                            </Text>
                        </View>

                        {/*我的积分*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:height*130/736,borderRightWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2Credit();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_credit@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                我的积分
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:2,borderBottomWidth:1,borderColor:'#ddd',width:width-6,flexDirection:'row',alignItems:'center',marginTop:1,marginLeft:3}}>
                        {/*车险订单*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:height*130/736,borderLeftWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2CarOrders();
                                          }}>
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_carInsurance@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                车险订单
                            </Text>
                        </TouchableOpacity>

                        {/*寿险订单*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:height*130/736,borderLeftWidth:1,borderRightWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2LifeOrders();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_life@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                寿险订单
                            </Text>
                        </TouchableOpacity>
                        {/*服务订单*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:height*130/736,borderRightWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2ServiceOrders();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_serviceOrder@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                服务订单
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:2,borderBottomWidth:1,borderColor:'#ddd',width:width-6,flexDirection:'row',alignItems:'center',marginTop:1,marginLeft:3}}>
                        {/*推荐有礼*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:height*130/736,borderLeftWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.setState({wxVisible:true});
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_gift@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                推荐有礼
                            </Text>
                        </TouchableOpacity>

                        {/*关于我们*/}
                        <View style={{flex:1,alignItems:'center',height:height*130/736,borderLeftWidth:1,borderRightWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}>
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_aboutUs@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                关于我们
                            </Text>
                        </View>

                        {/*车辆管理*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:height*130/736,borderRightWidth:1,borderColor:'#ddd',
                        justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2CarManage();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:height*35/736,height:height*35/736}} source={require('../../img/my_carManage@2x.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                车辆管理
                            </Text>
                        </TouchableOpacity>
                    </View>


                    {/*rest*/}

                </View>


                {/*popover part*/}
                <Popover
                    isVisible={this.state.menuVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={displayArea}
                    onClose={()=>{this.closePopover()
                        }}
                    style={{backgroundColor:'transparent'}}
                >

                    <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd',flexDirection:'row',justifyContent:'flex-start'}]}
                                      onPress={()=>{
                                              this.closePopover();
                                              setTimeout(()=>{
                                                   BackAndroid.exitApp();
                                                   PreferenceStore.delete('username');
                                                   PreferenceStore.delete('password');
                                              },300);

                                          }}>
                        <Icon name="power-off" size={20} color="#444"></Icon>
                        <Text style={[styles.popoverText]}>退出</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd',flexDirection:'row'}]}
                                      onPress={()=>{
                                              this.closePopover();
                                                 setTimeout(()=>{
                                                  this.navigate2PasswordModify();
                                              },300);
                                          }}>
                        <Icon name="gear" size={20} color="#444"></Icon>
                        <Text style={[styles.popoverText]}>修改密码</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.popoverContent,{flexDirection:'row',justifyContent:'flex-start'}]}
                                      onPress={()=>{
                                              this.closePopover();
                                              setTimeout(()=>{
                                                  this.navigate2HelpAndConfig();
                                              },300);
                                          }}>
                        <Icon name="exclamation-circle" size={20} color="#444"></Icon>
                        <Text style={[styles.popoverText]}>帮助</Text>
                    </TouchableOpacity>

                </Popover>

                {/*Wechat share*/}
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.wxVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.");
                    }}
                >

                    <WxShareModal
                        onClose={()=>{
                            this.setState({wxVisible:false});
                        }}
                        wxShare={(shareType)=>{
                            this.wxShare(shareType);
                        }}
                        accessToken={this.props.accessToken}
                    />

                </Modal>

            </View>
        )

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer:{
        marginTop: 30
    },
    popoverContent: {
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText:{
        color:'#444',
        marginLeft:14,
        fontWeight:'bold'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    typeButton: {
        padding: 5,
    },
    flashButton: {
        padding: 5,
    },
    buttonsSpace: {
        width: 10,
    },

});


const mapStateToProps = (state, ownProps) => {

    var {personInfo,accessToken,score,portrait}=state.user;
    return {
        personInfo,
        score,
        accessToken,
        portrait,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps)(My);

