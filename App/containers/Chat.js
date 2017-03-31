/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    AppRegistry,
    Animated,
    Easing,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import AudioExample from '../../AudioExample';
import Config from '../../config';
import Proxy from '../proxy/Proxy';
var ImagePicker = require('react-native-image-picker');
import WebSocket from '../components/utils/WebSocket';
import {
    uploadAudio,
    uploadVideo
} from '../action/ServiceActions';

class Chat extends Component{

    sendTxt(text)
    {
        if(text&&text!='')
        {
            WebSocket.send({
                action:'msg',
                msgid:WebSocket.getMsgId(),
                timems:new Date().getTime(),
                msg:{
                    type:'plain',
                    content:text
                },
                to:{
                    userid: 14,
                    groupid:'presale'
                }
            });
        }
    }

    //上传音频
    uploadAudio(payload){

        var {path}=payload;
        this.props.dispatch(uploadAudio(path)).then((json)=>{
            if(json.re==1)
            {
                var attachId=json.data;
                this.sendWav(attachId);
            }
        }).catch((e)=>{
            Alert.alert(
                'error',
                e
            );
        })
    }


    sendWav=(attachId) =>{

        var {audio}=this.state;

        if(audio.startTime!==undefined&&audio.startTime!==null&&
                audio.endTime!==null&&audio.endTime!==undefined)
        {

            var msg={
                action:'msg',
                msgid:WebSocket.getMsgId(),
                timems:new Date().getTime(),
                msg:{
                    type:'audio',
                    content:attachId,
                    audioLength:((audio.endTime-audio.startTime)/1000).toFixed(2),
                    path: audio.path
                },
                to:{
                    userid: 14,
                    groupid:'presale'
                }
            };
            WebSocket.send(msg);
        }
    }

    //上传视频
    uploadVideo(payload){

        var {path}=payload;
        this.props.dispatch(uploadVideo(path)).then((json)=>{
            if(json.re==1)
            {
                var attachId=json.data;
                this.sendVideo(attachId);
            }
        }).catch((e)=>{
            Alert.alert(
                'error',
                e
            );
        })
    }

    sendVideo= (attachId,path,thumb) =>{

        var msg={
            action:'msg',
            msgid:WebSocket.getMsgId(),
            timems:new Date().getTime(),
            msg:{
                type:'video',
                content:attachId,
                path: path,
                thumb:thumb
            },
            to:{
                userid: 14,
                groupid:'presale'
            }
        };
        WebSocket.send(msg);
    }


    constructor(props) {
        super(props);
        this.state={
            mode:'text',
            audio:{mode:'stopped'},
            record:false,
            send:false,
            toolsShowFlag:false,
            fadeInOpacity: new Animated.Value(0), // 初始值
            text:null,
            avatarSource:null,
        };
    }

    render() {

        return (
          <View style={[styles.container]}>
          </View>
        )
    }

    componentDidMount()
    {
        this.sendTxt('hi,my name is danding');
    }



}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer:{
        marginTop: 30
    },
    imageStyle: {
        width: 70,
        height: 70,
        marginTop: 10,
        backgroundColor: 'gray'
    }
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

module.exports = connect(mapStateToProps
)(Chat);

