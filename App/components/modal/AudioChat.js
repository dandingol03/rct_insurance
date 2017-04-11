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
    TextInput,
    Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var {height, width} = Dimensions.get('window');
var Proxy = require('../../proxy/Proxy');
var Config = require('../../../config');
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';


class AudioChat extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
        //TODO:关闭时同步数据
    }

    sendAudio(){
        // this.state.audio={path:'file:///var/mobile/Containers/Data/Application/54E4BFED-8439-4938-9045-D6E478CCC532/Documents/test.aac',
        // duration:3};
        if(this.state.audio!==undefined&&this.state.audio!==null){
            this.props.setAudio(this.state.audio);
            this.close();
        }
        else{
            alert('您还未录音，请先录音再发送');
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
        var audio = {path:filePath,duration:this.state.currentTime};
        this.setState({finished:didSucceed,audio:audio});
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }

    constructor(props)
    {
        super(props);
        this.state={
            accessToken:this.props.accessToken,
            audio:null,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
            currentTime: 0.0,
            recording: false,
            stoppedRecording: false,
            finished: false,
            hasPermission: undefined,
        }
    }

    render(){

        return (
            <View style={{flex:1}}>

                <View style={[{flex:1,backgroundColor:'rgba(17, 17, 17, 0.6)',padding: 10,height:54,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                        this.close();
                            }}>
                            <Icon name="angle-left" size={40} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:10,textAlign:'center',color:'#fff'}}>
                        发送音频
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
                    {/*音频描述*/}
                    <View style={{flex:1,margin:10}}>
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
                                                     this._record();
                                                  }}>
                                    <View>
                                        <Image resizeMode="cover" source={require('../../img/maike-@2x.png')}></Image>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity  onPress={
                                                ()=>{
                                                    this._play();
                                                }
                                            }>
                                    <View>
                                        <Image resizeMode="cover" source={require('../../img/playAudio@2x.png')}></Image>
                                    </View>
                                </TouchableOpacity>


                            </View>
                        </View>

                    </View>
                </View>

                <TouchableOpacity style={{flex:2,justifyContent: 'center',alignItems: 'center',borderRadius:6,backgroundColor:'#3385ff',margin:30}}
                                  onPress={()=>{this.sendAudio();}}>
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
    }
});


module.exports = AudioChat;
