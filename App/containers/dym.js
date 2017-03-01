/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Camera from 'react-native-camera';

class dym extends Component{

    constructor(props) {
        super(props);
        this.state={
            record:false,
            assetsBundle:{},
        };
    }

    render() {
        return (
          <View style={{ flex: 1,justifyContent: 'center',alignItems: 'center'}}>

             <Text>dym</Text>

          </View>


        )

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer:{
        marginTop: 30
    },
});


module.exports = connect(state=>({

    })
)(dym);

