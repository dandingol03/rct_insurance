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
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CustomView extends React.Component {

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
                <View style={{borderTopLeftRadius:6,borderTopRightRadius:6,padding:4,justifyContent: 'center',alignItems: 'center',flexDirection:'row',}}>
                    <Icon name="volume-up" size={25} color="#fff" />
                    <Text style={{marginLeft:10,color:'#fff'}}>{this.props.currentMessage.audio.duration}s</Text>
                </View>);
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
});

CustomView.defaultProps = {
    currentMessage: {},
    containerStyle: {},
    mapViewStyle: {},
};

CustomView.propTypes = {
    currentMessage: React.PropTypes.object,
    containerStyle: View.propTypes.style,
    mapViewStyle: View.propTypes.style,
};
