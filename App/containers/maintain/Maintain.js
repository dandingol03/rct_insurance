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
    Platform,
    PermissionsAndroid,
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

import VideoPlayer from './VideoPlayer.js';
import Audio from './Audio.js';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import BaiduHome from '../map/BaiduHome';

import Camera from 'react-native-camera';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import {
    updateMaintainBusiness
} from '../../action/MaintainActions';
import MaintainPlan from '../../components/modal/MaintainPlan';



var whoosh = new Sound('advertising.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
});


class Maintain extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2MaintainPlan(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'maintain_plan',
                component: MaintainPlan,
                params: {
                    miles:this.state.miles,
                    routineName:this.state.routineName,
                }
            })
        }
    }

    navigate2VideoPlayer(videoPath){
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

    navigate2Audio(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'audio',
                component: Audio,
                params: {

                }
            })
        }
    }

    navigate2BaiduHome()
    {
        const { navigator } = this.props;
        if(navigator) {

            navigator.push({
                name: 'baiduHome',
                component: BaiduHome,
                params: {
                    service:'maintain'
                }
            })
        }
    }

    checkMaintainPlan(){

        var {miles} = this.state;
        var reg=/\D/;
        if(miles==undefined||miles==null||reg.exec(miles)!=null)
        {
            Alert.alert(
                '保养计划',
                '您输入的公里数格式有误',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                    {text: 'OK', onPress: () => console.log('OK Pressed!')},
                ]
            )
        }else{
            if(miles<5000||miles>200000){

                Alert.alert(
                    '保养计划',
                    '请输入5000至200000公里范围内的里程',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: () => console.log('OK Pressed!')},
                    ]
                )

            }else{
                var miles= parseInt(miles/5000)*5000;

                Proxy.post({
                    url:Config.server+'/svr/request',
                    headers: {
                        'Authorization': "Bearer " + this.state.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request:'getMaintainPlan',
                        info:{
                            miles:miles
                        }
                    }
                }, (res)=> {
                    var json=res;
                    if(json.re==1){
                        var routineName=json.data;
                        this.setState({routineName:routineName, maintainPlanModal:true});

                    }

                }, (err) =>{
                });

            }
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
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
                    console.log('======thumb nail=====')
                    ProcessingManager.getPreviewForSecond(path, 1)
                        .then((data) => console.log(data))
                })
                .catch(err => console.error(err));
            this.setState({
                isRecording: true
            });
        }
    }


    stopVideoCapture = () => {
        if (this.camera) {
            this.camera.stopCapture()
            this.setState({
                isRecording: false,cameraModalVisible:false
            });
        }
    }

    //音频录制
    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {


        this._checkPermission().then((hasPermission) => {
            this.setState({ hasPermission });

            if (!hasPermission) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL);
                }
            };
        });
    }

    _checkPermission() {

        return Promise.resolve(true);

        const rationale = {
            'title': 'Microphone Permission',
            'message': 'AudioExample needs access to your microphone so you can record audio.'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                console.log('Permission result:', result);
                return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
            });
    }

    async _pause() {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false});

        try {
            const filePath = await AudioRecorder.pauseRecording();

            // Pause is currently equivalent to stop on Android.
            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }


    recordAudio(){
        if(this.state.recording==true){
            this._stop();
        }
        else{
            this._record();
        }

    }

    async _record() {
        if (this.state.recording) {
            alert('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            alert('Can\'t record, no permission granted!');
            return;
        }

        if(this.state.stoppedRecording){
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _finishRecording(didSucceed, filePath) {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }



    //进行维修业务的保存
    updateMaintainBusiness(tabIndex)
    {

        switch(tabIndex) {
            case 0:
                var {dailyChecked}=this.state;
                var subServiceTypes=[];
                var dailys = [
                    {subServiceId: '1', subServiceTypes: '机油,机滤', serviceType: '11', checked: true},
                    {subServiceId: '2', subServiceTypes: '检查制动系统,更换刹车片', serviceType: '11', checked: false},
                    {subServiceId: '3', subServiceTypes: '雨刷片更换', serviceType: '11', checked: false},
                    {subServiceId: '4', subServiceTypes: '轮胎更换', serviceType: '11', checked: false},
                    {subServiceId: '5', subServiceTypes: '燃油添加剂', serviceType: '11', checked: false},
                    {subServiceId: '6', subServiceTypes: '空气滤清器', serviceType: '11', checked: false},
                    {subServiceId: '7', subServiceTypes: '检查火花塞', serviceType: '11', checked: false},
                    {subServiceId: '8', subServiceTypes: '检查驱动皮带', serviceType: '11', checked: false},
                    {subServiceId: '9', subServiceTypes: '更换空调滤芯', serviceType: '11', checked: false},
                    {subServiceId: '10', subServiceTypes: '更换蓄电池,防冻液', serviceType: '11', checked: false}
                ];

                dailyChecked.map(function (checked, i) {
                    if (checked == true)
                    {
                        subServiceTypes.push(dailys[i].subServiceId);
                    }
                });
                this.props.dispatch(updateMaintainBusiness({
                    serviceType:'11',
                    subServiceTypes:subServiceTypes
                }));
                break;
            case 1:

                this.props.dispatch(updateMaintainBusiness({
                    serviceType:'12',
                    description:this.state.maintain.description
                }));
                break;
            case 2:

                this.props.dispatch(updateMaintainBusiness({
                    serviceType:'13',
                    subServiceTypes:this.state.accidentType
                }));
                break;
        }

    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            dailyChecked:[true,false,false,false,false,false,false,false,false,false],
            accidentType:'',
            disabled: false,
            description:{

            },
            miles:0,
            routineName:'',
            maintain:{},
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
            currentTime: 0.0,
            recording: false,
            stoppedRecording: false,
            finished: false,
            hasPermission: true,

            videoPath:'',
            cameraModalVisible:false,
            maintainPlanModal:false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,

            },
            portrait:null,
        };
    }

    render(){

        var dailyChecked = [];


        var miles = this.state.miles;

        var props=this.props;
        var state=this.state;
        var displayArea = {x: 5, y: 20, width:width, height: height - 25};

        var selectedStyle={backgroundColor:'#ccc'};
        var unSelectedStyle={backgroundColor:'transparent'};
        var blackStyle={color:'#222'};
        var unblackStyle={color:'#888'};

        return (
            <View style={{flex:1}}>
                {/*body*/}
                <Image resizeMode="stretch" source={require('../../img/bkg_old@2x.png')} style={{width:width,height:height}}>

                    <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:50,
                    backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                        <TouchableOpacity style={{flex:1}} onPress={()=>{
                        this.goBack();
                             }}>
                            <Icon name="angle-left" size={40} color="#fff"/>

                        </TouchableOpacity>
                        <Text style={{fontSize:17,flex:5,textAlign:'center',color:'#fff'}}>
                            维修服务
                        </Text>
                        <View style={{flex:1,padding:0}}></View>
                    </View>

                    <View style={{flex:1,width:width,position:'relative',marginTop:10}}>
                        <ScrollableTabView style={{flex:1}}
                                           renderTabBar={() => <DefaultTabBar style={{borderBottomWidth:0,backgroundColor:'#fff',height:30}} activeTextColor="#0A9DC7" inactiveTextColor="#323232" underlineStyle={{backgroundColor:'#0A9DC7'}}/>}
                        >
                            <View tabLabel='日常保养' style={{flex:1,padding:5}}>

                                <ScrollView>
                                    <View style={{flex:8}}>
                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}}
                                                              onPress={()=>{
                                             dailyChecked = this.state.dailyChecked;
                                             dailyChecked[0] = !this.state.dailyChecked[0];
                                             this.setState({dailyChecked:dailyChecked});
                                            }}>

                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain1.png')} style={{flex:5}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>机油、机滤</Text>
                                                        {
                                                            this.state.dailyChecked[0]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[1] = !this.state.dailyChecked[1];

                                                this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain2.png')} style={{flex:5}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>更换刹车片</Text>
                                                        {
                                                            this.state.dailyChecked[1]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                     dailyChecked = this.state.dailyChecked;
                                                     dailyChecked[2] = !this.state.dailyChecked[2];

                                                     this.setState({dailyChecked:dailyChecked});
                                                 }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain3.png')} style={{flex:5}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>雨刷片更换</Text>
                                                        {
                                                            this.state.dailyChecked[2]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[3] = !this.state.dailyChecked[3];

                                                 this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain4.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>轮胎更换</Text>
                                                        {
                                                            this.state.dailyChecked[3]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[4] = !this.state.dailyChecked[4];

                                                 this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain5.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>燃油添加剂</Text>
                                                        {
                                                            this.state.dailyChecked[4]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[5] = !this.state.dailyChecked[5];

                                                 this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain6.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>空气滤清器</Text>
                                                        {
                                                            this.state.dailyChecked[5]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[6] = !this.state.dailyChecked[6];

                                                 this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                            <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain7.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>检查火花塞</Text>
                                                        {
                                                            this.state.dailyChecked[6]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[7] = !this.state.dailyChecked[7];

                                                 this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain8.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>检查驱动片</Text>
                                                        {
                                                            this.state.dailyChecked[7]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[8] = !this.state.dailyChecked[8];

                                                 this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain9.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>换空调滤芯</Text>
                                                        {
                                                            this.state.dailyChecked[8]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start',marginBottom:5}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:5}} onPress={()=>{
                                                 dailyChecked = this.state.dailyChecked;
                                                 dailyChecked[9] = !this.state.dailyChecked[9];

                                                 this.setState({dailyChecked:dailyChecked});
                                             }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain10.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:12,color:'#222',marginTop:5}}>更换蓄电池防冻液</Text>
                                                        {
                                                            this.state.dailyChecked[9]==true?<Text style={{flex:1,fontSize:12,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:12,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{flex:1,marginBottom:5,borderBottomWidth:1,borderColor:'#aaa'}}>
                                        <View style={{flex:1,padding:5,borderBottomWidth:1,borderColor:'#aaa',flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                            <Text style={{flex:1,fontSize:12,paddingLeft:5,color:'#343434'}}>里程：</Text>
                                            <TextInput
                                                style={{flex:2,fontSize:12,color:'#343434'}}
                                                onChangeText={(miles) =>
                                                    {
                                                      this.setState({miles:miles});
                                                    }}
                                                value={this.state.miles+''}

                                                placeholder='请输入里程...'
                                                placeholderTextColor="#aaa"
                                                underlineColorAndroid="transparent"
                                            />
                                            <TouchableOpacity style={{flex:2,height:25,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                                          borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                                              onPress={()=>{
                                                                this.checkMaintainPlan();
                                                                }}>
                                                <Text style={{color:'#fff',fontSize:12}}>查看保养计划</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>



                                    <TouchableOpacity style={{flex:2,height:35,width:width*2/3,marginLeft:50,padding:8,paddingHorizontal:12,flexDirection:'row',
                                       justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:10,backgroundColor:'rgba(14, 153, 193, 0.73)',borderRadius:6}}
                                                      onPress={()=>{
                                                        this.updateMaintainBusiness(0);
                                                        this.navigate2BaiduHome();
                                            }}>
                                        <Text style={{color:'#fff'}}>选择附近的维修厂</Text>
                                    </TouchableOpacity>



                                </ScrollView>

                                {/*maintainPlan modal*/}
                                <Modal
                                    animationType={"slide"}
                                    transparent={false}
                                    visible={this.state.maintainPlanModal}
                                    onRequestClose={() => {alert("Modal has been closed.")}}>

                                    <MaintainPlan
                                        miles={this.state.miles}
                                        routineName={this.state.routineName}
                                        onClose={()=>{
                                               this.setState({maintainPlanModal:false});
                                        }}
                                        onConfirm={(city)=>{
                                                this.cityConfirm(city);
                                        }}
                                    />

                                </Modal>


                            </View>

                            <ScrollView tabLabel='故障维修' style={{flex:1,padding:10}}>

                                {/*文本描述*/}
                                <View style={{flex:1,padding:4}}>
                                    <Text>文本描述</Text>
                                    <TextInput
                                        style={{height:100,borderWidth:1,padding:8,fontSize:13,marginTop:5}}
                                        onChangeText={(description) =>
                                        {
                                           this.state.description=description;
                                           var description =  this.description;
                                           this.setState({description:description});
                                        }}
                                        value={this.state.description}
                                        placeholder='请对故障进行文本描述...'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                    />
                                </View>

                                <View style={{flex:1,padding:2,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        height:135,marginTop:10}}>
                                    {/*音频描述*/}
                                    <View style={{flex:1}}>
                                        <View style={{padding:2,margin:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#f96666',borderRadius:8}}>
                                            <View style={{flex:2}}>
                                                <View style={{flex:3,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                                                    <Image resizeMode="cover" source={require('../../img/1@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('../../img/2@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('../../img/6@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('../../img/9@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('../../img/5@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('../../img/3@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('../../img/8@2x.png')} style={{flex:1,padding:2}}></Image>
                                                </View>
                                                <Text style={{color:'#fff',flex:1,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                                                    {this.state.currentTime}s
                                                </Text>
                                            </View>
                                            <View style={{flex:1,paddingRight:4}}>
                                                <TouchableOpacity onPress={()=>{
                                                     this.navigate2Audio();
                                                  }}>
                                                    <View>
                                                        <Image resizeMode="cover" source={require('../../img/maike-@2x.png')}></Image>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity  onPress={
                                                ()=>{
                                                   console.log('播放音频');
                                                }
                                            }>
                                                    <View>
                                                        <Image resizeMode="cover" source={require('../../img/playAudio@2x.png')}></Image>
                                                    </View>
                                                </TouchableOpacity>


                                            </View>
                                        </View>

                                        <View style={{alignItems:'center',marginTop:5}}>
                                            <Text style={{color:'#222'}}>音频描述</Text>
                                        </View>

                                    </View>

                                    {/*视频描述*/}
                                    <View style={{flex:1}}>

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
                                                                this.navigate2VideoPlayer(this.state.videoPath);
                                                              }}>
                                                            <View>
                                                                <Icon name="play-circle" color="#fff" size={35}></Icon>
                                                            </View>
                                                        </TouchableOpacity>
                                                }

                                            </View>
                                        </View>


                                        {
                                            this.state.videoPath==''?
                                                <View style={{alignItems:'center',marginTop:5}}>
                                                    <Text style={{color:'#222'}}>视频录制</Text>
                                                </View>:
                                                <View style={{alignItems:'center',marginTop:5}}>
                                                    <Text style={{color:'#222'}}>视频播放</Text>
                                                </View>
                                        }


                                    </View>


                                </View>


                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20}}>

                                    <TouchableOpacity style={{width:width*2/3,padding:8,paddingHorizontal:12,
                                        backgroundColor:'rgba(14, 153, 193, 0.73)',borderRadius:6,alignItems:'center'}}
                                                      onPress={() => {
                                                          this.updateMaintainBusiness(1);
                                                          this.navigate2BaiduHome()
                                                      }}>
                                        <Text style={{color:'#fff',fontWeight:'bold'}}>选择附近的维修厂</Text>
                                    </TouchableOpacity>
                                </View>


                            </ScrollView>

                            <View tabLabel='事故维修' style={{flex:1,padding:12}}>

                                {/*已报案*/}
                                <TouchableOpacity style={[{flexDirection:'row',alignItems:'center',padding:5,paddingHorizontal:12,
                                        borderRadius:6},this.state.accidentType=='已报案'?selectedStyle:unSelectedStyle]}
                                                  onPress={()=>{
                                                      this.setState({accidentType:'已报案'});
                                                }}>

                                    <View style={{width:50,height:27,alignItems:'center',justifyContent:'center',position:'relative'}}>
                                        <Icon name="circle-thin" size={27} color="rgba(156, 39, 176, 0.81)"/>
                                        {
                                            this.state.accidentType=='已报案'?
                                                <View style={{width:12,height:12,backgroundColor:'#00f',borderRadius:6
                                                ,position:'absolute',top:8,left:19}}></View>:null
                                        }

                                    </View>

                                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                                        <Text style={[{fontWeight:'bold'},this.state.accidentType=='已报案'?blackStyle:unblackStyle]}>
                                            已报案:
                                        </Text>
                                    </View>

                                </TouchableOpacity>

                                {/*未报案*/}
                                <TouchableOpacity style={[{flexDirection:'row',alignItems:'center',padding:5,paddingHorizontal:12,
                                    borderRadius:6},this.state.accidentType=='未报案'?selectedStyle:unSelectedStyle]}
                                                  onPress={()=>{
                                                      this.setState({accidentType:'未报案'});
                                                }}>

                                    <View style={{width:50,height:27,alignItems:'center',justifyContent:'center',position:'relative'}}>
                                        <Icon name="circle-thin" size={27} color="rgba(156, 39, 176, 0.81)"/>
                                        {
                                            this.state.accidentType=='未报案'?
                                                <View style={{width:12,height:12,backgroundColor:'#00f',borderRadius:6
                                                ,position:'absolute',top:8,left:19}}></View>:null
                                        }
                                    </View>

                                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                                        <Text style={[{fontWeight:'bold'},this.state.accidentType=='未报案'?blackStyle:unblackStyle]}>
                                            未报案:
                                        </Text>
                                    </View>

                                </TouchableOpacity>

                                {/*代索赔*/}
                                <TouchableOpacity style={[{flexDirection:'row',alignItems:'center',padding:5,paddingHorizontal:12,
                                    borderRadius:6},this.state.accidentType=='代索赔'?selectedStyle:unSelectedStyle]}
                                      onPress={()=>{
                                                      this.setState({accidentType:'代索赔'});
                                                }}>

                                    <View style={{width:50,height:27,alignItems:'center',justifyContent:'center',position:'relative'}}>
                                        <Icon name="circle-thin" size={27} color="rgba(156, 39, 176, 0.81)"/>
                                        {
                                            this.state.accidentType=='代索赔'?
                                                <View style={{width:12,height:12,backgroundColor:'#00f',borderRadius:6
                                                ,position:'absolute',top:8,left:19}}></View>:null
                                        }

                                    </View>

                                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                                        <Text style={[{fontWeight:'bold'},this.state.accidentType=='代索赔'?blackStyle:unblackStyle]}>
                                            代索赔:
                                        </Text>
                                    </View>

                                </TouchableOpacity>


                                {/*跳转按钮*/}
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:30}}>
                                    <TouchableOpacity style={{width:width*2/3,padding:10,paddingHorizontal:12,borderRadius:5,
                                        backgroundColor:'rgba(14, 153, 193, 0.73)',alignItems:'center',justifyContent:'center'}}
                                                      onPress={()=>{
                                                      this.updateMaintainBusiness(2);
                                                      this.navigate2BaiduHome();
                                                }}>
                                        <Text style={{color:'#fff'}}>选择附近的维修厂</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </ScrollableTabView>
                    </View>
                </Image>

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
        flexDirection:'row',
        height:130,
        borderBottomWidth:0,
        borderBottomColor:'#222'
    },
    row80:{
        flexDirection:'row',
        height:60,
        borderBottomWidth:0,
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


});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(Maintain);
