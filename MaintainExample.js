/**
 * Created by dingyiming on 2017/3/31.
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
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

class MaintainExample extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


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
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

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

    _renderButton(title, onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
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

    async _play() {

        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            console.log(this.state.audioPath);
            try{
                var sound = new Sound(this.state.audioPath, '', (error) => {
                    if (error) {
                        console.log('failed to load the sound', error);
                    }
                });

                setTimeout(() => {
                    sound.play((success) => {
                        if (success) {
                            console.log('successfully finished playing');
                        } else {
                            console.log('playback failed due to audio decoding errors');
                        }
                    });
                }, 100);
            }catch(e)
            {
                alert(e)
            }
        }, 100);
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



    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            currentTime: 0.0,
            recording: false,
            stoppedRecording: false,
            finished: false,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
            hasPermission: undefined,
        };
    }

    render(){


        return (
            <View style={{flex:1}}>

                    {/*head*/}
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

                    {/*body*/}
                    <View style={{flex:1,width:width,position:'relative',marginTop:10}}>
                        <ScrollableTabView style={{flex:1}}
                                           renderTabBar={() => <DefaultTabBar style={{borderBottomWidth:0,backgroundColor:'#fff',height:30}} activeTextColor="#0A9DC7" inactiveTextColor="#323232" underlineStyle={{backgroundColor:'#0A9DC7'}}/>}
                        >

                            {/*故障维修*/}
                            <ScrollView tabLabel='故障维修' style={{flex:1,padding:10}}>

                                <View style={{flex:1,padding:2,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                        height:135,marginTop:10}}>
                                    {/*音频描述*/}
                                    <View style={{flex:1}}>
                                        <View style={{padding:2,margin:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#f96666',borderRadius:8}}>
                                            <View style={{flex:2}}>
                                                <View style={{flex:3,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                                                    <Image resizeMode="cover" source={require('./App/img/1@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('./App/img/2@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('./App/img/6@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('./App/img/9@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('./App/img/5@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('./App/img/3@2x.png')} style={{flex:1,padding:2}}></Image>
                                                    <Image resizeMode="cover" source={require('./App/img/8@2x.png')} style={{flex:1,padding:2}}></Image>
                                                </View>
                                                <Text style={{color:'#fff',flex:1,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                                                    {this.state.currentTime}s
                                                </Text>
                                            </View>
                                            <View style={{flex:1,paddingRight:4}}>
                                                <TouchableOpacity onPress={()=>{
                                                     this._record();
                                                  }}>
                                                    <View>
                                                        <Image resizeMode="cover" source={require('./App/img/maike-@2x.png')}></Image>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity  onPress={
                                                ()=>{
                                                    this._stop();
                                                }
                                            }>
                                                    <View>
                                                        <Image resizeMode="cover" source={require('./App/img/zanting@2x.png')}></Image>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity  onPress={
                                                ()=>{
                                                    this._play();
                                                }
                                            }>
                                                    <View>
                                                        <Image resizeMode="cover" source={require('./App/img/playAudio@2x.png')}></Image>
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

                                                                    <Image style={{height:30,width:30,borderRadius:15}} source={require('./App/img/sas@2x.png')}/>

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

                                                                        <Image style={{height:30,width:30,borderRadius:15}} source={require('./App/img/sas@2x.png')}/>

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
                                                    </Image>
                                                </View>




                                        }


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


                            </ScrollView>

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
    imageStyle: {
        width: 70,
        height: 70,
        marginTop: 10,
        borderWidth:2,
    },


});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(MaintainExample);
