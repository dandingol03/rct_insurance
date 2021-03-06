
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

import Config from '../../config';
import Proxy from '../proxy/Proxy';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera from 'react-native-camera';
var ImagePicker = require('react-native-image-picker');
import {
    downloadPortrait,
    updatePortrait
} from '../action/UserActions';

class Portrait extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showImagePicker(){

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
                this.setState({portrait: source.uri});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    storePicture(){

        var {accessToken}=this.props;
        var {portrait}=this.state;

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

                    this.goBack();
                    this.props.setPortrait(this.state.portrait);

                }

            }, (err) =>{
                Alert.alert(
                    'error',
                    err
                );
            });

        }else{
            Alert.alert(
                '错误',
                '请先进行拍照'
            );
        }
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            portrait:props.portrait!==undefined&&props.portrait!==null?props.portrait:null,
            info:{},
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
            cameraModalVisible:false
        };
    }

    render(){

        var props=this.props;
        var state=this.state;

        return (

            <View style={{flex:1}}>

                <View style={[{padding: 3,paddingHorizontal:12,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                        backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                    <TouchableOpacity style={{width:60}} onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>

                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:15,color:'#fff'}}>
                            个人头像
                        </Text>
                    </View>

                    <TouchableOpacity style={{width:60,height:27,borderRadius:4,backgroundColor:'#444',justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>{
                                          this.storePicture()
                    }}>
                        <Text style={{color:'#fff'}}>保存</Text>
                    </TouchableOpacity>

                </View>


                {/*头像*/}
                <View style={[styles.row,{height:80,padding:5,backgroundColor:'#fff'}]}>

                    <View style={{width:100,flexDirection:'row',justifyContent:'center',alignItems:'center',
                        backgroundColor:'transparent',}}>
                        {
                            state.portrait!==undefined&&state.portrait!==null?
                                <Image resizeMode="stretch" style={{height:76,width:76,borderWidth:1,borderColor:'#888',borderRadius:38}}
                                       source={{uri:state.portrait}}/>:
                                <Image resizeMode="stretch" style={{height:76,width:76,borderWidth:1,borderColor:'#888',borderRadius:38}}
                                       source={require('../img/person.jpg')}/>

                        }
                    </View>

                    <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>{
                        //this.setState({cameraModalVisible:true});
                         this.showImagePicker()
                    }}
                    >
                        <Text style={{color:'#ff5026',fontSize:16,fontWeight:'bold'}}>更换头像</Text>
                    </TouchableOpacity>
                </View>


                <View style={{width:width,flex:1,backgroundColor:'#ccc'}}></View>



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
                                    source={require('../../assets/ic_photo_camera_36pt.png')}
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
                                    source={require('../../assets/ic_videocam_36pt.png')}
                                />
                            </TouchableOpacity>
                            ||
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={this.stopRecording}
                            >
                                <Image
                                    source={require('../../assets/ic_stop_36pt.png')}
                                />
                            </TouchableOpacity>
                        }
                    </View>

                </Modal>

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


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        portrait:state.user.portrait
    })
)(Portrait);

