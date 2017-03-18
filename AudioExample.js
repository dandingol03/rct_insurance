/**
 * Created by danding on 17/2/28.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Sound = require('react-native-sound');

const Button = ({title, onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <Text style={styles.button}>{title}</Text>
    </TouchableOpacity>
);

const Header = ({children}) => (<Text style={styles.header}>{children}</Text>);

const Feature = ({title, onPress, description, buttonLabel = "PLAY"}) => (
    <View style={styles.feature}>
        <Header>{title}</Header>
        <Button title={buttonLabel} onPress={onPress}/>
    </View>);

const requireAudio = require('./serviceAudio.mp3');

class MainView extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    constructor(props) {
        super(props);
        var path = this.props.path;
        alert('path='+path);

        Sound.setCategory('Ambient', true); // true = mixWithOthers

        this.playSoundBundle = () => {
            const s = new Sound(path, (e) => {
                if (e) {
                    console.log('error', e);
                } else {
                    s.setSpeed(1);
                    console.log('duration',s.getDuration());
                    s.setVolume(1);
                    s.play(() => s.release()); // Release when it's done so we're not using up resources
                }
            });
        };

        this.playSoundFromRequire = () => {
            const s = new Sound(requireAudio, (e) => {
                if (e) {
                    alert('error', e);
                    return;
                }

                s.setVolume(1);
                s.play(() => s.release());
            });
        };

    }

    renderiOSOnlyFeatures() {
        return [
            <Feature key="require" title="Audio via 'require' statement" onPress={this.playSoundFromRequire}/>,
        ]
    }

    render() {
        return <View style={styles.container}>
            <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:50,
                    backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                <TouchableOpacity style={{flex:1,color:'#fff'}} onPress={()=>{
                        this.goBack();
                             }}>
                    <Icon name="angle-left" size={40} color="#fff"/>

                </TouchableOpacity>
                <Text style={{fontSize:17,flex:5,textAlign:'center',color:'#fff'}}>

                </Text>
                <View style={{flex:1,padding:0}}></View>
            </View>

            <Feature title="Main bundle audio" onPress={this.playSoundBundle}/>
            { Platform.OS === 'ios' ? this.renderiOSOnlyFeatures() : null }
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        fontSize: 20,
        backgroundColor: 'silver',
        padding: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    feature: {
        padding: 20,
        alignSelf: 'stretch',
    }
});

export default MainView;
