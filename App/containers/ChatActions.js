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
} from 'react-native';

import { connect } from 'react-redux';

import AudioChat from '../components/modal/AudioChat';
import VideoChat from '../components/modal/VideoChat';

class ChatActions extends Component{

    constructor(props) {
        super(props);
        const { accessToken } = this.props;

        this.state = {
            audioChatVisible: false,
            videoChatVisible: false,
            audioPatn:null,
            videoPath:null,

        };
        this.onActionsPress = this.onActionsPress.bind(this);
    }

    setAudioPath(audio){
        this.setState({audioPath: audio});
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
        const options = ['发送音频', '发送视频','Cancel'];
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
                        setAudioPath={(audio)=>{
                            this.setAudioPath(audio);
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