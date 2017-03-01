/**
 * Created by dingyiming on 2017/2/27.
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
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import Icon from 'react-native-vector-icons/FontAwesome';

class LifeOrderPay extends Component{

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
        this.state = {
            accessToken: accessToken,
            render:null,
        };
    }

    render(){

        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                    <View style={[{flex:1,padding: 10,justifyContent: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                        <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}
                                          onPress={()=>{
                        this.goBack();
                      }}>
                            <Icon name="angle-left" size={30} color="#fff"/>
                        </TouchableOpacity>
                        <Text style={{flex:20,fontSize:15,marginTop:10,marginRight:10,alignItems:'flex-end',justifyContent:'flex-start',textAlign:'center',color:'#fff'}}>
                            寿险订单支付页面
                        </Text>
                    </View>

                    <View style={{flex:15}}>

                    </View>
                </Image>

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
    card: {
        borderBottomWidth: 0,
        shadowColor: '#eee',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    logo:{
        width:width,
        height:290
    },
    module:{
        width:90,
        height:90
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        height: 50,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        plans:state.life.plans,
    })
)(LifeOrderPay);

