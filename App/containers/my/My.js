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
    Modal
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
import Camera from 'react-native-camera';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';

class My extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
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





    constructor(props) {
        super(props);
        this.state={
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
            cameraModalVisible:false,
            portrait:null
        };
    }

    render() {

        var props=this.props;
        var state=this.state;
        var displayArea = {x: 5, y: 20, width:width, height: height - 25};



        return (
            <View style={styles.container}>

                {/*top half*/}
               <View style={{height:210}}>
                   <Image style={{flex:1,height:210,width:width,position:'relative'}} source={require('../../img/my_column.jpg')} >

                       <TouchableOpacity style={{position:'absolute',top:20,right:10,width:30,alignItems:'flex-end'}}
                                         onPress={this.showPopover.bind(this, 'menu')}  ref="menu"
                       >
                           <Icon name="bars" size={22} color="#fff"></Icon>
                       </TouchableOpacity>


                       <View style={{height:90,marginTop:40,width:width,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>

                           <TouchableOpacity   onPress={() => {this.setState({cameraModalVisible:true})}}>
                               {
                                   state.portrait!==undefined&&state.portrait!==null?
                                       <Image resizeMode="stretch" style={{height:76,width:76,borderWidth:1,borderColor:'#888',borderRadius:38}}
                                              source={{uri:state.portrait}}/>:
                                       <Image resizeMode="stretch" style={{height:76,width:76,borderWidth:1,borderColor:'#888',borderRadius:38}}
                                              source={require('../../img/zack.png')}/>
                               }

                           </TouchableOpacity>

                       </View>

                       <View style={{width:width,flexDirection:'row',justifyContent:'center'}}>
                            <Text style={{color:'#fff'}}>{props.personInfo.perName}</Text>
                       </View>

                       <View style={{width:width,height:50,position:'absolute',bottom:0,left:0,flexDirection:'row',alignItems:'center',
                            justifyContent:'flex-start'}}>
                            <View style={{padding:8,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'#eee',fontWeight:'bold',fontSize:12,marginRight:4}}>
                                    积分:
                                </Text>
                                <Text style={{color:'#961b1b',fontSize:20}}>
                                    {props.score}
                                </Text>
                            </View>
                       </View>

                   </Image>
               </View>

                {/*bottom half*/}


                <View style={{height:height-210,backgroundColor:'rgba(238, 238, 238, 0.6)'}}>

                    <View style={{height:100,width:width-6,flexDirection:'row',alignItems:'center',marginLeft:3}}>
                        {/*个人信息*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff',
                            marginRight:1}}
                                          onPress={()=>{
                                              this.navigate2ContactInfo();
                                          }}
                        >


                                <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_info.png')}
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
                        <View style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff',
                            marginRight:1}}>
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_redBag.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                我的红包
                            </Text>
                        </View>

                        {/*我的积分*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2Credit();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_credit.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                我的积分
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{height:100,width:width-6,flexDirection:'row',alignItems:'center',marginTop:1,marginLeft:3}}>
                        {/*车险订单*/}
                        <View style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff',
                            marginRight:1}}>
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_carInsurance.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                车险订单
                            </Text>
                        </View>

                        {/*寿险订单*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff',marginRight:1}}
                                          onPress={()=>{
                                              this.navigate2LifeOrders();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_life.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                寿险订单
                            </Text>
                        </TouchableOpacity>
                        {/*服务订单*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2ServiceOrders();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_serviceOrder.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                服务订单
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{height:100,width:width-6,flexDirection:'row',alignItems:'center',marginTop:1,marginLeft:3}}>
                        {/*推荐有礼*/}
                        <View style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff',marginRight:1}}>
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_gift.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                推荐有礼
                            </Text>
                        </View>

                        {/*关于我们*/}
                        <View style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff',marginRight:1}}>
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_aboutUs.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                关于我们
                            </Text>
                        </View>

                        {/*车辆管理*/}
                        <TouchableOpacity style={{flex:1,alignItems:'center',height:100,justifyContent:'center',backgroundColor:'#fff'}}
                                          onPress={()=>{
                                              this.navigate2CarManage();
                                          }}
                        >
                            <Image resizeMode="stretch" style={{width:22,height:22}} source={require('../../img/my_carManage.png')}></Image>
                            <Text style={{color:'#666',fontWeight:'bold',marginTop:14}}>
                                车辆管理
                            </Text>
                        </TouchableOpacity>
                    </View>


                    {/*rest*/}

                    <View style={{flex:1,width:width,backgroundColor:'#fff'}}></View>

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

                    <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd',flexDirection:'row'}]}
                                      onPress={()=>{

                                              this.closePopover();
                                              //this.navigateGoodAdd();
                                          }}>
                        <Icon name="power-off" size={20} color="#444"></Icon>
                        <Text style={[styles.popoverText]}>退出</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd',flexDirection:'row'}]}
                                      onPress={()=>{
                                              this.closePopover();

                                          }}>
                        <Icon name="gear" size={20} color="#444"></Icon>
                        <Text style={[styles.popoverText]}>设置</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.popoverContent,{flexDirection:'row'}]}
                                      onPress={()=>{
                                              this.closePopover();

                                          }}>
                        <Icon name="exclamation-circle" size={20} color="#444"></Icon>
                        <Text style={[styles.popoverText]}>帮助</Text>
                    </TouchableOpacity>

                </Popover>


                {/*camera part*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                >
                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                          }}
                        style={styles.preview}
                        aspect={this.state.camera.aspect}
                        captureTarget={this.state.camera.captureTarget}
                        type={this.state.camera.type}
                        flashMode={this.state.camera.flashMode}
                        defaultTouchToFocus
                        mirrorImage={false}
                    />
                    <View style={[styles.overlay, styles.topOverlay]}>
                        <TouchableOpacity
                            style={styles.typeButton}
                            onPress={this.switchType}
                        >
                            <Image
                                source={this.typeIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.flashButton}
                            onPress={this.switchFlash}
                        >
                            <Image
                                source={this.flashIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.overlay, styles.bottomOverlay]}>
                        {
                            !this.state.isRecording
                            &&
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={this.takePicture}
                            >
                                <Image
                                    source={require('../../../assets/ic_photo_camera_36pt.png')}
                                />
                            </TouchableOpacity>
                            ||
                            null
                        }
                        <View style={styles.buttonsSpace} />
                        {
                            !this.state.isRecording
                            &&
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={this.startRecording}
                            >
                                <Image
                                    source={require('../../../assets/ic_videocam_36pt.png')}
                                />
                            </TouchableOpacity>
                            ||
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={this.stopRecording}
                            >
                                <Image
                                    source={require('../../../assets/ic_stop_36pt.png')}
                                />
                            </TouchableOpacity>
                        }
                    </View>

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

    var {personInfo,accessToken,score}=state.user;

    return {
        personInfo,
        score,
        accessToken,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps)(My);

