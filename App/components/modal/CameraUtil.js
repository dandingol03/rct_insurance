/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Camera from 'react-native-camera';
var {height, width} = Dimensions.get('window');

class CameraUtil extends Component{

    close(path){
        alert('invoke self close function');

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose(path);
        }
    }

    takePicture() {

        var onClose=this.props.onClose;
        this.camera.capture()
            .then((json)=>{
                var data=json.data;
                var path=json.path;
                Alert.alert(
                    'info',
                    'photo path='+path);

                if(onClose!==undefined&&onClose!==null)
                    onClose(path);
            })
            .catch(err => console.error(err));
    }

    constructor(props)
    {
        super(props);


        this.state={
            city:null,
            hasPhoto:false,

        }
    }


    render(){

        return (
            <View style={{flex:1}}>
                <Camera
                    ref={(cam) => {
                                    this.camera = cam;
                                  }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}>
                    <Text style={styles.capture} onPress={this.takePicture.bind(this)}>
                        [CAPTURE]
                    </Text>
                </Camera>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height/2,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});

module.exports = CameraUtil;
