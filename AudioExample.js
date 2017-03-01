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

    constructor(props) {
        super(props);

        Sound.setCategory('Ambient', true); // true = mixWithOthers

        this.playSoundBundle = () => {
            const s = new Sound('serviceAudio.mp3', Sound.MAIN_BUNDLE, (e) => {
                if (e) {
                    console.log('error', e);
                } else {
                    s.setSpeed(1);
                    console.log('duration', s.getDuration());
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
