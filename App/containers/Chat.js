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
    TouchableOpacity,
    Platform,
} from 'react-native';

import { connect } from 'react-redux';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import ChatActions from './ChatActions';
import ChatView from './ChatView';

import CustomView from './chat/CustomView';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';

import WebSocket from '../components/utils/WebSocket';
import {
    uploadAudio,
    uploadVideo
} from '../action/ServiceActions';

import AudioExample from '../../AudioExample'

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


    navigate2AudioExample(audioPath){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'AudioExample',
                component: AudioExample,
                params: {
                    path:audioPath
                }
            })
        }
    }


    //上传音频
    uploadAudio(payload){

        var {path}=payload;
        var audio = payload;
        this.props.dispatch(uploadAudio(audio))
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
        const { navigator } = this.props;
        this.state = {
            messages: [],
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,

        };

        this._isMounted = false;
        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);

        this._isAlright = null;
    }

    componentWillMount() {
        this._isMounted = true;
        this.setState(() => {
            return {
                messages: require('./chat/data/messages.js'),
            };
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });

        setTimeout(() => {
            if (this._isMounted === true) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.prepend(previousState.messages, require('./chat/data/old_messages.js')),
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    };
                });
            }
        }, 1000); // simulating network
    }

    onSend(messages = []) {

        messages[0].dym=true;
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });

        // for demo purpose
        this.answerDemo(messages);
    }

    answerDemo(messages) {
        if (messages.length > 0) {
            if ((messages[0].image || messages[0].location) || !this._isAlright) {
                this.setState((previousState) => {
                    return {
                        typingText: 'React Native is typing'
                    };
                });
            }
        }

        setTimeout(() => {
            if (this._isMounted === true) {
                if (messages.length > 0) {
                    if (messages[0].image) {
                        this.onReceive('Nice picture!');
                    } else if (messages[0].location) {
                        this.onReceive('My favorite place');
                    } else {
                        if (!this._isAlright) {
                            this._isAlright = true;
                            this.onReceive('Alright');
                        }
                    }
                }
            }

            this.setState((previousState) => {
                return {
                    typingText: null,
                };
            });
        }, 1000);
    }

    onReceive(text) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, {
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        // avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                }),
            };
        });
    }

    renderCustomActions(props) {
        if (Platform.OS === 'ios') {
            return (
                <ChatActions
                    {...props}
                    navigator={this.props.navigator}
                />
            );
        }
        const options = {
            'Action 1': (props) => {
                alert('option 1');
            },
            'Action 2': (props) => {
                alert('option 2');
            },
            'Cancel': () => {},
        };
        return (
            <Actions
                {...props}
                options={options}
            />
        );
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
            />
        );
    }

    renderCustomView(props) {
        return (
            <CustomView
                {...props}
            />
        );
    }

    renderChatView(props) {
        return (
            <ChatView
                {...props}
            />
        );
    }

    renderFooter(props) {
        if (this.state.typingText!==null) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }

    render() {
        return (
              <GiftedChat
                  messages={this.state.messages}
                  onSend={this.onSend}
                  loadEarlier={this.state.loadEarlier}
                  onLoadEarlier={this.onLoadEarlier}
                  isLoadingEarlier={this.state.isLoadingEarlier}

                  user={{
                     _id: 1, // sent messages should have same user._id
                  }}

                  renderActions={this.renderCustomActions}
                  renderBubble={this.renderBubble}
                  //renderCustomView={this.renderChatView}
                  renderCustomView={this.renderChatView}
                  renderFooter={this.renderFooter}
              />

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

