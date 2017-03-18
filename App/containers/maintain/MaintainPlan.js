/**
 * Created by dingyiming on 2017/3/1.
 */
import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');


class MaintainPlan extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props)
    {
        super(props);
        this.state={
            miles:this.props.miles,
            routineName:this.props.routineName,
        }
    }

    render(){

        return (
            <View style={{height:height*0.5,width:width*0.8,margin:30,marginTop:100,
                         backgroundColor:'#fff',borderWidth:1,borderColor:'#aaa',borderRadius:6}}>
                <View style={{flex:1}}>
                    <TouchableOpacity onPress={
                            ()=>{
                                this.goBack();
                            }
                        }>
                        <Icon name="times-circle" size={25} color="#0A9DC7" />
                    </TouchableOpacity>
                </View>

                <View style={{flex:1,padding:12,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                    <Text>推荐保养计划</Text>
                </View>

                <View  style={{flex:30,margin:10}}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                        <Icon name="circle" size={10} color="#e99d23"/>
                        <Text style={{padding:5,fontSize:13,color:'#343434'}}>{this.props.routineName}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-start',}}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Icon name="circle" size={10} color="#e99d23"/>
                            <Text style={{padding:5,fontSize:13,color:'#343434'}}>蓄电池和防冻液建议每两年更换一次,</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Text style={{paddingLeft:15,fontSize:13,color:'#343434'}}>每年入冬前为检查更换时间;</Text>
                        </View>
                    </View>

                    <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-start',}}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Icon name="circle" size={10} color="#e99d23"/>
                            <Text style={{padding:5,fontSize:13,color:'#343434'}}>空调滤芯每6个月更换一次，</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Text style={{paddingLeft:15,fontSize:13,color:'#343434'}}>每年入冬前为检查更换时间;</Text>
                        </View>
                    </View>

                </View>

                <View  style={{flex:3,margin:15}}>

                </View>


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
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderTopColor:'#fff'
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(MaintainPlan);
