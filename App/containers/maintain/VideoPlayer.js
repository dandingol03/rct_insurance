/**
 * Created by dingyiming on 2017/2/16.
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
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

class VideoPlayer extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onBuffer = this.onBuffer.bind(this);

        this.state = {
            accessToken: accessToken,
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            controls: false,
            paused: true,
            skin: 'custom',
            isBuffering: false,
        };
    }

    onLoad(data) {
        console.log('On load fired!');
        this.setState({duration: data.duration});
    }

    onProgress(data) {
        this.setState({currentTime: data.currentTime});
    }

    onBuffer({ isBuffering }: { isBuffering: boolean }) {
        this.setState({ isBuffering });
    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }

    renderSkinControl(skin) {
        const isSelected = this.state.skin == skin;
        const selectControls = skin == 'native' || skin == 'embed';
        return (
            <TouchableOpacity onPress={() => { this.setState({
          controls: selectControls,
          skin: skin
        }) }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {skin}
                </Text>
            </TouchableOpacity>
        );
    }

    renderRateControl(rate) {
        const isSelected = (this.state.rate == rate);

        return (
            <TouchableOpacity onPress={() => { this.setState({rate: rate}) }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {rate}x
                </Text>
            </TouchableOpacity>
        )
    }

    renderResizeModeControl(resizeMode) {
        const isSelected = (this.state.resizeMode == resizeMode);

        return (
            <TouchableOpacity onPress={() => { this.setState({resizeMode: resizeMode}) }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {resizeMode}
                </Text>
            </TouchableOpacity>
        )
    }

    renderVolumeControl(volume) {
        const isSelected = (this.state.volume == volume);

        return (
            <TouchableOpacity onPress={() => { this.setState({volume: volume}) }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {volume * 100}%
                </Text>
            </TouchableOpacity>
        )
    }

    renderCustomSkin() {
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

        return (
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <View style={[{padding: 10,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:60,backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                        <TouchableOpacity style={{flex:1,justifyContent: 'center',alignItems: 'center',}}
                                          onPress={()=>{
                                            this.goBack();
                                          }}>
                            <Icon size={26} name="chevron-left" color="#fff" ></Icon>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex:1,justifyContent: 'center',alignItems: 'center',}}
                            onPress={()=>{
                            if( this.props.onClose!==undefined){
                                this.props.onClose();
                            }

                        }}>
                            <Icon size={26} name="times-circle" color="#fff" ></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.fullScreen} onPress={() => {this.setState({paused: !this.state.paused})}}>
                    <Video
                        source={{uri:this.props.videoPath}}
                        style={styles.fullScreen}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        onLoad={this.onLoad}
                        onBuffer={this.onBuffer}
                        onProgress={this.onProgress}
                        onEnd={() => { Alert.alert('Done!') }}
                        repeat={false}
                    />
                </TouchableOpacity>

                <View style={styles.controls}>
                    <View style={styles.generalControls}>
                        <View style={styles.skinControl}>
                            {this.renderSkinControl('custom')}
                            {this.renderSkinControl('native')}
                            {this.renderSkinControl('embed')}
                        </View>
                    </View>
                    <View style={styles.generalControls}>
                        <View style={styles.rateControl}>
                            {this.renderRateControl(0.5)}
                            {this.renderRateControl(1.0)}
                            {this.renderRateControl(2.0)}
                        </View>

                        <View style={styles.volumeControl}>
                            {this.renderVolumeControl(0.5)}
                            {this.renderVolumeControl(1)}
                            {this.renderVolumeControl(1.5)}
                        </View>

                        <View style={styles.resizeModeControl}>
                            {this.renderResizeModeControl('cover')}
                            {this.renderResizeModeControl('contain')}
                            {this.renderResizeModeControl('stretch')}
                        </View>
                    </View>

                    <View style={styles.trackingControls}>
                        <View style={styles.progress}>
                            <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
                            <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderNativeSkin() {
        const videoStyle = this.state.skin == 'embed' ? styles.nativeVideoControls : styles.fullScreen;
        return (
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <View style={[{padding: 10,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                    height:60,backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                        <TouchableOpacity style={{flex:1,justifyContent: 'center',alignItems: 'center',}} onPress={()=>{
                        this.goBack();
                    }}>
                            <Icon size={26} name="chevron-left" color="#fff" ></Icon>
                        </TouchableOpacity>

                        {
                            this.props.onClose!==undefined&&this.props.onClose!==null?
                            <TouchableOpacity style={{flex:1,justifyContent: 'center',alignItems: 'center',}}
                                              onPress={()=>{
                                                    this.props.onClose();
                             }}>
                                <Icon size={26} name="times-circle" color="#fff" ></Icon>
                            </TouchableOpacity>:null

                        }

                    </View>
                </View>

                <View style={styles.fullScreen}>
                    <Video

                        source={{uri:this.props.videoPath}}
                        style={videoStyle}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        onLoad={this.onLoad}
                        onBuffer={this.onBuffer}
                        onProgress={this.onProgress}
                        onEnd={() => {  Alert.alert('Done!'); }}
                        repeat={false}
                        controls={this.state.controls}
                    />
                </View>
                <View style={styles.controls}>
                    <View style={styles.generalControls}>
                        <View style={styles.skinControl}>
                            {this.renderSkinControl('custom')}
                            {this.renderSkinControl('native')}
                            {this.renderSkinControl('embed')}
                        </View>
                    </View>
                    <View style={styles.generalControls}>
                        <View style={styles.rateControl}>
                            {this.renderRateControl(0.5)}
                            {this.renderRateControl(1.0)}
                            {this.renderRateControl(2.0)}
                        </View>

                        <View style={styles.volumeControl}>
                            {this.renderVolumeControl(0.5)}
                            {this.renderVolumeControl(1)}
                            {this.renderVolumeControl(1.5)}
                        </View>

                        <View style={styles.resizeModeControl}>
                            {this.renderResizeModeControl('cover')}
                            {this.renderResizeModeControl('contain')}
                            {this.renderResizeModeControl('stretch')}
                        </View>
                    </View>
                </View>

            </View>
        );
    }


    render(){

        var videoPath = this.props.videoPath;

        return this.state.controls ? this.renderNativeSkin() : this.renderCustomSkin();
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    fullScreen: {
        position: 'absolute',
        top: 60,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        backgroundColor: "transparent",
        borderRadius: 5,
        position: 'absolute',
        bottom: 44,
        left: 4,
        right: 4,
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 20,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 20,
        backgroundColor: '#2C2C2C',
    },
    generalControls: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        paddingBottom: 10,
    },
    skinControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    rateControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    volumeControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resizeModeControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    controlOption: {
        alignSelf: 'center',
        fontSize: 11,
        color: "white",
        paddingLeft: 2,
        paddingRight: 2,
        lineHeight: 12,
    },
    nativeVideoControls: {
        top: 184,
        height: 300
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(VideoPlayer);

