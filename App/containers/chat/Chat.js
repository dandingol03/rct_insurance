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

import CustomView from './CustomView';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';

import WebSocket from '../../components/utils/WebSocket';
import {
    uploadAudioChat,
    uploadVideoChat
} from '../../action/ServiceActions';


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
                    _id:WebSocket.getMsgId(),
                    type:'plain',
                    content:text,
                    user:{_id:1},
                    createdAt:new Date(),
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
        var audio = payload;
        this.props.dispatch(uploadAudioChat(audio)).then((json)=>{
            if(json.re==1)
            {
                var attachId=json.data;
                this.sendWav(attachId);

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

    sendWav=(attachId) =>{

        var {audio}=this.state;

        if(audio.path!==undefined&&audio.path!==null&&
            audio.duration!==null&&audio.duration!==undefined)
        {
            var msg={
                action:'msg',
                msgid:WebSocket.getMsgId(),
                timems:new Date().getTime(),
                msg:{
                    type:'audio',
                    content:attachId,
                    audioLength:audio.duration,
                    path:audio.path
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
        var video = payload;

        this.props.dispatch(uploadVideoChat(path)).then((json)=>{
            if(json.re==1)
            {
                var attachId=json.data;
                this.sendVideo(attachId,video.path,video.thumbnail);

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

        this.state = {
            messages:[],
            storeMessages:this.props.messages,
            msg:this.props.msg,
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
            txt:'666',

        };

        this._isMounted = false;
        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);

        this.renderSend=this.renderSend.bind(this);

        this._isAlright = null;
    }

    componentWillMount() {
        this._isMounted = true;
        this.setState(() => {
            return {
                messages: require('./data/messages.js'),
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
                        messages: GiftedChat.prepend(previousState.messages,this.state.storeMessages),
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    };
                });
            }
        }, 1000); // simulating network
    }

    onSend(messages = []) {

        if(messages[0].text!=undefined&&messages[0].text!=null){
            var text = messages[0].text;
            this.state.txt=text;
            this.sendTxt(this.state.txt);
        }

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
                    uploadAudio={(audio)=>{this. uploadAudio(audio);}}
                    uploadVideo={(video)=>{this. uploadVideo(video);}}
                />
            );
        }
        // const options = {
        //     'Action 1': (props) => {
        //         alert('option 1');
        //     },
        //     'Action 2': (props) => {
        //         alert('option 2');
        //     },
        //     'Cancel': () => {},
        // };
        // return (
        //     <Actions
        //         {...props}
        //         options={options}
        //     />
        // );
        return (
            <ChatActions
                {...props}
                uploadAudio={(audio)=>{this. uploadAudio(audio);}}
                uploadVideo={(video)=>{this. uploadVideo(video);}}
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

    renderLoadEarlier(props){
        if(this.state.loadEarlier==true){
         return(
             <View>
                 <Text>
                     查看更早的消息
                 </Text>
             </View>
         )
        }

    }



    renderSend(){

        return (
            <TouchableOpacity style={{padding:10}}
                              onPress={()=>{
                                  this.sendTxt(this.state.txt);
                              }}>
                <Icon name="send-o" size={25} color="#aaa" />
            </TouchableOpacity>
        );

    }


    componentWillReceiveProps(nextProps)
    {
        var length = nextProps.messages.length ;

        if(nextProps.messages!==this.state.messages){

            switch (nextProps.messages[length-1].type) {
                case 'plain':
                    this.setState((previousState) => {

                        return {
                            messages: GiftedChat.append(previousState.messages, {
                                _id:nextProps.messages[length-1]._id,
                                text: nextProps.messages[length-1].content,
                                createdAt:nextProps.messages[length-1].createdAt,
                                user: {
                                    _id: nextProps.messages[length-1].source=='fromMe'?1:2,
                                },
                            }),
                        };
                    });
                    break;
                case 'audio':
                    this.setState((previousState) => {
                            return {
                                messages: GiftedChat.append(previousState.messages,{
                                    _id:nextProps.messages[length-1]._id,
                                    createdAt:nextProps.messages[length-1].createdAt,
                                    user: {
                                        _id: nextProps.messages[length-1].source=='fromMe'?1:2,
                                    },
                                    audio: {
                                        path:nextProps.messages[length-1].path,
                                        duration:nextProps.messages[length-1].audioLength,
                                    },
                                }),
                            };
                        });

                    break;
                case 'video':
                    this.setState((previousState) => {
                        return {
                            messages: GiftedChat.append(previousState.messages,{
                                _id:nextProps.messages[length-1]._id,
                                createdAt:nextProps.messages[length-1].createdAt,
                                user: {
                                    _id: nextProps.messages[length-1].source=='fromMe'?1:2,
                                },
                                video: {
                                    path:nextProps.messages[length-1].path,
                                    thumbnail:nextProps.messages[length-1].thumb,
                                },
                            }),
                        };
                    });

                    break;
                default:
                    break;
            }


            // if(nextProps.messages[length-1].type=='plain'){
            //     this.setState((previousState) => {
            //
            //         return {
            //             messages: GiftedChat.append(previousState.messages, {
            //                 _id:nextProps.messages[length-1]._id,
            //                 text: nextProps.messages[length-1].content,
            //                 createdAt:nextProps.messages[length-1].createdAt,
            //                 user: {
            //                     _id: nextProps.messages[length-1].source=='fromMe'?1:2,
            //                 },
            //             }),
            //         };
            //     });
            // }

        }

    }

    render() {
        return (
              <GiftedChat
                  messages={this.state.messages}
                  onSend={this.onSend}
                  //loadEarlier={this.state.loadEarlier}
                  onLoadEarlier={this.onLoadEarlier}
                  isLoadingEarlier={this.state.isLoadingEarlier}

                  user={{
                     _id: 1, // sent messages should have same user._id
                  }}

                  renderActions={this.renderCustomActions}
                  renderBubble={this.renderBubble}
                  renderCustomView={this.renderChatView}
                  renderFooter={this.renderFooter}
                  //renderLoadEarlier={this.renderLoadEarlier}
                  placeholder='请输入...'

              />

        )
    }

    componentDidMount()
    {

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
    },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
});


const mapStateToProps = (state, ownProps) => {

    var {personInfo,accessToken,score}=state.user;
    var {msg,messages} =state.ws;

    return {
        personInfo,
        score,
        accessToken,
        msg,
        messages,
        ...ownProps,

    }
}

module.exports = connect(mapStateToProps
)(Chat);

