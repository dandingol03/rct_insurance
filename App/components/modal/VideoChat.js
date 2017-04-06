/**
 * Created by dingyiming on 2017/3/31.
 */
/**
 * Created by dingyiming on 2017/3/31.
 */

import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var {height, width} = Dimensions.get('window');
var Proxy = require('../../proxy/Proxy');
var Config = require('../../../config');
import Camera from 'react-native-camera';
import VideoPlayer from '../../containers/maintain/VideoPlayer.js';
import {
    generateVideoThumbnail
} from '../../action/ServiceActions';

import Video from 'react-native-video';

class VideoChat extends Component{

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
        //TODO:关闭时同步数据
    }

    sendVideo(){
        if(this.state.video!==undefined&&this.state.video!==null){
            this.props.setVideo(this.state.video);
            this.close();
        }
        else{
            alert('您还未录制视频，请先录制再发送');
        }
    }

    //视频录制
    navigate2VideoPlayer(videoPath)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'videoPlayer',
                component: VideoPlayer,
                params: {
                    videoPath:videoPath
                }
            })
        }
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

    startVideoCapture = () => {

        if (this.camera) {
            this.camera.capture({mode: Camera.constants.CaptureMode.video})
                .then((data) => {
                    var path=data.path;
                    console.log(data);
                    this.state.videoPath=path;
                    console.log('video path='+path);
                    this.setState({cameraModalVisible:false,videoPath:path});
                    this.props.setVideoPath(path);

                    this.props.dispatch(generateVideoThumbnail(path)).then((json)=>{
                        var thumbnail=json.data;
                        console.log('this.state.thumbnail==========='+thumbnail);
                        var video = {path:path,thumbnail:thumbnail}
                        this.setState({thumbnail:thumbnail,video:video});
                    });

                })
                .catch(err => console.error(err));
            this.setState({
                isRecording: true
            });
        }
    }

    stopVideoCapture= () => {
        if (this.camera) {
            this.camera.stopCapture();
            this.setState({
                isRecording: false,cameraModalVisible:false
            });
        }
        //
        // this.props.dispatch(generateVideoThumbnail(this.state.videoPath)).then((json)=>{
        //     var thumbnail=json.data;
        //     console.log('thumbnail'+thumbnail);
        //     var video = {path:this.state.videoPath,thumbnail:thumbnail}
        //     this.setState({thumbnail:thumbnail,video:video});
        // });
    }


    constructor(props)
    {
        super(props);
        const {accessToken}=this.props;
        this.state={
            accessToken:accessToken,
             //video:{path:'/var/mobile/Containers/Data/Application/B9DE20B1-CEDD-4E00-ADE9-627352050CEF/Documents/A633F9E2-8CEA-4659-BAD0-2D9DA743FF62.mov',
             //    thumbnail:'/var/mobile/Containers/Data/Application/B9DE20B1-CEDD-4E00-ADE9-627352050CEF/Documents/video-thumbnail.png'},
            video:null,
            //videoPath:'/var/mobile/Containers/Data/Application/B9DE20B1-CEDD-4E00-ADE9-627352050CEF/Documents/A633F9E2-8CEA-4659-BAD0-2D9DA743FF62.mov',
            videoPath:'',
            cameraModalVisible:false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,
            },
            portrait:null,
           //thumbnail:'/var/mobile/Containers/Data/Application/B9DE20B1-CEDD-4E00-ADE9-627352050CEF/Documents/video-thumbnail.png',
            thumbnail:null,

            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'cover',
            duration: 0.0,
            currentTime: 0.0,
            controls: false,
            paused: true,
            skin: 'custom',
            isBuffering: false,
            videoPlayVisible:false,
        }
    }

    render(){

        return (
            <View style={{flex:1}}>
                <View style={[{backgroundColor:'rgba(17, 17, 17, 0.6)',padding: 10,height:54,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                        this.close();
                            }}>
                            <Icon name="angle-left" size={40} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:10,textAlign:'center',color:'#fff'}}>
                        发送视频
                    </Text>
                    <View style={{flex:1,marginRight:5,flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                            <Icon name="times-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{flex:10,padding:2,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        height:135,marginTop:10}}>
                    {/*视频描述*/}
                    <View style={{flex:1,margin:10}}>

                        {
                            this.state.thumbnail==null?
                                <View style={{padding:2,margin:2,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                                backgroundColor:'#444',borderRadius:8,height:110,}}>
                                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

                                        {
                                            this.state.videoPath==''?
                                                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                                                  onPress={() => {
                                                                  this.setState({cameraModalVisible:true})
                                                              }}>

                                                    <Image style={{height:30,width:30,borderRadius:15}} source={require('../../img/sas@2x.png')}/>

                                                </TouchableOpacity>:

                                                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                                                  onPress={()=>{
                                                                this.setState({videoPlayVisible:true});
                                                              }}>
                                                    <View>
                                                        <Icon name="play-circle" color="#fff" size={35}></Icon>
                                                    </View>
                                                </TouchableOpacity>
                                        }

                                    </View>
                                </View>:
                                <View>
                                    <Image resizeMode="stretch" source={{uri:this.state.thumbnail}}
                                           style={{padding:2,margin:2,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                                borderRadius:8,height:110,}}>
                                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

                                            {
                                                this.state.videoPath==''?
                                                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                                                      onPress={() => {
                                                                  this.setState({cameraModalVisible:true})
                                                              }}>

                                                        <Image style={{height:30,width:30,borderRadius:15}} source={require('../../img/sas@2x.png')}/>

                                                    </TouchableOpacity>:

                                                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                                                      onPress={()=>{
                                                                this.setState({videoPlayVisible:true});

                                                              }}>
                                                        <View>
                                                            <Icon name="play-circle" color="#fff" size={35}></Icon>
                                                        </View>
                                                    </TouchableOpacity>
                                            }

                                        </View>
                                    </Image>
                                </View>

                        }


                    </View>
                </View>


                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.videoPlayVisible}
                    onRequestClose={() => {
                        this.setState({videoPlayVisible:false});
                    }}
                >
                    <VideoPlayer
                        onClose={()=>{
                            this.setState({videoPlayVisible:!this.state.videoPlayVisible});
                        }}

                        videoPath={this.state.videoPath}

                    />
                </Modal>


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
                                onPress={this.startVideoCapture}
                            >
                                <Image
                                    source={require('../../../assets/ic_videocam_36pt.png')}
                                />
                            </TouchableOpacity>
                            ||
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={this.stopVideoCapture}
                            >
                                <Image
                                    source={require('../../../assets/ic_stop_36pt.png')}
                                />
                            </TouchableOpacity>
                        }
                    </View>

                </Modal>

                <TouchableOpacity style={{flex:2,justifyContent: 'center',alignItems: 'center',borderRadius:6,backgroundColor:'#3385ff',margin:30}}
                                  onPress={()=>{this.sendVideo();}}>
                    <Text style={{flex:1,color:'#fff',padding:10}}>发送</Text>
                </TouchableOpacity>

                <View style={{flex:10}}></View>


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
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderTopColor:'#fff',
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
        paddingTop:8,
        paddingBottom:8,
        borderBottomWidth:1,
        borderBottomColor:'#222'
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
    imageStyle: {
        width: 70,
        height: 70,
        marginTop: 10,
        borderWidth:2,
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
});


module.exports = VideoChat;
