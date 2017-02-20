/**
 * Created by dingyiming on 2017/2/20.
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

import Icon from 'react-native-vector-icons/FontAwesome';

var {height, width} = Dimensions.get('window');


class ConfirmModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    confirm(){
        if(this.props.onConfirm!==undefined&&this.props.onConfirm!==null)
        {
            this.props.onConfirm(this.state.city);
        }
    }

    constructor(props)
    {
        super(props);
        this.state={
            confirmText:this.props.confirmText
        }
    }


    render(){
        return (
            <View style={{height:height*0.3,width:width*0.8,margin:30,marginTop:100,backgroundColor:'#f0f0f0',borderRadius:8}}>
                <View style={{flex:2}}>
                    <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                        <Icon name="times-circle" size={30} color="#0A9DC7" />
                    </TouchableOpacity>
                </View>

                <Text style={{flex:4,padding:12,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                    {this.state.confirmText}
                </Text>

                <View style={{flex:3,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                    <TouchableOpacity style={{flex:1,padding:2,margin:8,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#0A9DC7'}}
                                      onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                        <Text style={{color:'#fff',padding:4}}>取消</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1,padding:2,margin:8,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#0A9DC7'}}
                                      onPress={
                            ()=>{
                                this.confirm();
                            }
                        }>
                        <Text style={{color:'#fff',padding:4}}>确认</Text>
                    </TouchableOpacity>
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


module.exports = ConfirmModal;
