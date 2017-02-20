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
import LifeOrders from '../life/LifeOrders';



var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class My extends Component{


    navigate2LifeOrders(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'life_orders',
                component: LifeOrders,
                params: {

                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={
        };
    }

    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity onPress={()=>{
                                         this.navigate2LifeOrders();
                                      }}>
                    <Text>My</Text>

                </TouchableOpacity>

            </View>
        )

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer:{
        marginTop: 30
    },

});


module.exports = connect(state=>({

    })
)(My);

