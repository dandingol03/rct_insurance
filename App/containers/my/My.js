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


class My extends Component{


    constructor(props) {
        super(props);
        this.state={
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>My</Text>
            </View>
        )

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer:{
        marginTop: 30
    },

});


module.exports = connect(state=>({

    })
)(My);

