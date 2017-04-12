/**
 * Created by danding on 17/3/31.
 */
import React from 'react';
import {
    Linking,
    MapView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Sound from 'react-native-sound';
const Sound = require('react-native-sound');

import Video from 'react-native-video';


export default class ChatView extends React.Component {


    playAudioMessage(path){

            setTimeout(() => {
                console.log('++++path===='+path);

                try{
                    this.state.sound = new Sound(path, '', (error) => {
                        if (error) {
                            console.log('failed to load the sound', error);
                        }else{
                            setTimeout(() => {
                                this.state.sound.setVolume(10);

                                this.setState({isPlaying:true});
                                this.state.sound.play((success) => {
                                    if (success) {
                                        console.log('successfully finished playing');
                                        this.setState({isPlaying:false});
                                    } else {
                                        console.log('playback failed due to audio decoding errors');
                                        this.setState({isPlaying:false});
                                    }
                                });

                            }, 100);

                        }
                    });


                }catch(e)
                {
                    this.setState({isPlaying:false});
                    alert(e)
                }
            }, 100);

    }


    constructor(props) {
        super(props);
        Sound.setCategory('Playback', true); // true = mixWithOthers
        const { accessToken } = this.props;
        const { navigator } = this.props;

        this.state = {
            audioFlag:false,
            videoPlayVisible:false,
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

            sound:null,
            isPlaying:false,
        };
    }

    render() {
        if (this.props.currentMessage.location)
        {
            return (
                <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
                      const url = Platform.select({
                        ios: `http://maps.apple.com/?ll=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`,
                        android: `http://maps.google.com/?q=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`
                      });
                      Linking.canOpenURL(url).then(supported => {
                        if (supported) {
                          return Linking.openURL(url);
                        }
                      }).catch(err => {
                        console.error('An error occurred', err);
                      });
                }}>
                    <MapView
                        style={[styles.mapView, this.props.mapViewStyle]}
                        region={{
              latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude,
            }}
                        annotations={[{
              latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude,
            }]}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    />
                </TouchableOpacity>
            );
        }
        else if (this.props.currentMessage.audio)
        {
            return (
                <TouchableOpacity style={{borderTopLeftRadius:6,borderTopRightRadius:6,padding:4,justifyContent: 'center',alignItems: 'center',flexDirection:'row',}}
                                  onPress={() => {
                                      if(this.state.isPlaying==false){
                                         this.playAudioMessage(this.props.currentMessage.audio.path);
                                      }
                                      if(this.state.sound!==undefined&&this.state.sound!==null&&this.state.isPlaying==true){
                                         this.state.sound.stop();
                                         this.state.sound.release();
                                         this.setState({isPlaying:false});
                                      }

                                  }}>
                    <Icon name="volume-up" size={25} color="#fff" />
                    <Text style={{marginLeft:10,color:'#fff'}}>{this.props.currentMessage.audio.duration}s</Text>
                </TouchableOpacity>);
        }
        else if (this.props.currentMessage.video)
        {
            return (
                <View style={[styles.container, this.props.containerStyle]}>

                    <View style={{borderTopLeftRadius:6,borderTopRightRadius:6,padding:4,justifyContent: 'center',alignItems: 'center',flexDirection:'row'}}>

                        <Icon name="video-camera" size={25} color="#fff" />
                        <Text style={{marginLeft:10,color:'#fff'}}>视频消息</Text>
                    </View>

                    <TouchableOpacity  style={[styles.mapView, this.props.mapViewStyle]}
                                       onPress={() => {this.setState({paused: !this.state.paused})}}>
                        <Video
                            source={{uri:this.props.currentMessage.video.path}}
                            style={[styles.mapView, this.props.mapViewStyle]}
                            rate={this.state.rate}
                            paused={this.state.paused}
                            volume={this.state.volume}
                            muted={this.state.muted}
                            resizeMode={this.state.resizeMode}

                            onEnd={() => { Alert.alert('Done!');}}
                            repeat={true}
                            controls={this.state.controls}
                        />
                    </TouchableOpacity>

                </View>
            );
        }

        else if (this.props.currentMessage.dym)
        {
            return (
                <View style={{borderTopLeftRadius:6,borderTopRightRadius:6,padding:4}}>
                    <Text>hi ,dingyiming dingyiming</Text>
                </View>);
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
    nativeVideoControls: {
        top: 184,
        height: 300
    }
});

ChatView.defaultProps = {
    currentMessage: {},
    containerStyle: {},
    mapViewStyle: {},
};

ChatView.propTypes = {
    currentMessage: React.PropTypes.object,
    containerStyle: View.propTypes.style,
    mapViewStyle: View.propTypes.style,
};

module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(ChatView);

