/**
 * Created by danding on 17/3/31.
 */
import React,{Component} from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Platform,
    Alert,
} from 'react-native';

import { connect } from 'react-redux';

import AudioChat from '../../components/modal/AudioChat';
import VideoChat from '../../components/modal/VideoChat';
import {
    uploadAudio,
    uploadVideo
} from '../../action/ServiceActions';

class ChatActions extends Component{

    constructor(props) {
        super(props);
        const { navigator } = this.props;
        const { accessToken } = this.props;

        this.state = {
            audioChatVisible: false,
            videoChatVisible: false,
            audioPath:null,
            videoPath:null,
            audioDuration:null,

        };
        this.onActionsPress = this.onActionsPress.bind(this);
    }

    //上传音频
    uploadAudio(payload){

        var {path}=payload;
        var audio = payload;
        this.props.dispatch(uploadAudio(audio)).then((json)=>{
            console.log('uploadAudio.json,re======'+json.re);
            if(json.re==1)
            {
                // var attachId=json.data;
                // this.sendWav(attachId);
                this.props.onSend({
                    audio: {
                        path:audio.path,
                        duration:audio.duration,
                    },
                });
            }
        }).catch((e)=>{
            Alert.alert(
                'error',
                e
            );
        });
    }


    //上传视频
    uploadVideo(payload){

        var {path}=payload;
        var video = payload;

        this.props.dispatch(uploadVideo(path)).then((json)=>{
            if(json.re==1)
            {
                // var attachId=json.data;
                // this.sendVideo(attachId);
                this.props.onSend({
                    video: {
                        path:video.path,
                        thumbnail:video.thumbnail,
                    },
                });
            }
        }).catch((e)=>{
            Alert.alert(
                'error',
                e
            );
        })
    }

    setAudio(audio){
        this.setState({audioPath:audio.path,audioDuration:audio.duration});
        this.uploadAudio(audio);

    }

    setVideo(video){
        this.setState({videoPath:video.path});
        this.uploadVideo(video);

    }


    setVideoPath(video){
        this.setState({videoPath: video});
    }

    setAudioChatVisible(visible = false) {
        this.setState({audioChatVisible: visible});
    }

    setVideoChatVisible(visible = false) {
        this.setState({videoChatVisible: visible});
    }

    onActionsPress() {
        const options = ['发送音频','发送视频','发送位置','Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.setAudioChatVisible(true);
                        break;
                    case 1:
                        this.setVideoChatVisible(true);
                        break;
                    case 2:
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                this.props.onSend({
                                    location: {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                    },
                                });
                            },
                            (error) => alert(error.message),
                            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
                        );
                        break;
                    default:
                }
            });
    }

    renderIcon() {
        if (this.props.icon) {
            return this.props.icon();
        }
        return (
            <View
                style={[styles.wrapper, this.props.wrapperStyle]}
            >
                <Text
                    style={[styles.iconText, this.props.iconTextStyle]}
                >
                    +
                </Text>
            </View>
        );
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.containerStyle]}
                onPress={this.onActionsPress}
            >
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.audioChatVisible}
                    onRequestClose={() => {
                        this.setAudioChatVisible(false);
                    }}
                >
                    <AudioChat
                        onClose={()=>{
                            this.setState({audioChatVisible:!this.state.audioChatVisible});
                        }}
                        accessToken={this.props.accessToken}
                        dispatch={this.props.dispatch}
                        setAudio={(audio)=>{
                            this.setAudio(audio);
                        }}

                    />
                </Modal>

                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.videoChatVisible}
                    onRequestClose={() => {
                        this.setVideoChatVisible(false);
                    }}
                >
                    <VideoChat
                        onClose={()=>{
                            this.setState({videoChatVisible:!this.state.videoChatVisible});
                        }}
                        accessToken={this.props.accessToken}
                        dispatch={this.props.dispatch}
                        setVideoPath={(video)=>{
                            this.setVideoPath(video);
                        }}
                        setVideo={(video)=>{
                            this.setVideo(video);
                        }}
                        navigator={this.props.navigator}

                    />
                </Modal>
                {this.renderIcon()}
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

ChatActions.contextTypes = {
    actionSheet: React.PropTypes.func,
};

ChatActions.defaultProps = {
    onSend: () => {},
    options: {},
    icon: null,
    containerStyle: {},
    wrapperStyle: {},
    iconTextStyle: {},
};

ChatActions.propTypes = {
    onSend: React.PropTypes.func,
    options: React.PropTypes.object,
    icon: React.PropTypes.func,
    containerStyle: View.propTypes.style,
    wrapperStyle: View.propTypes.style,
    iconTextStyle: Text.propTypes.style,
};


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(ChatActions);
