/**
 * Created by danding on 17/3/27.
 */
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
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput,
    ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');



class Loading extends Component{

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }


    }

    constructor(props)
    {
        super(props);
        const {accessToken}=this.props;
        this.state={
            visible:props.visible,
            text:props.text
        }
    }

    componentWillReceiveProps(nextProps)
    {
        var ob={};
        if(nextProps.visible!=this.props.visible)
        {
            ob.visible=nextProps.visible;
            this.setState({visible:ob.visible});
        }


    }

    render(){

        var props=this.props;
        var state=this.state;



        return (

                <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                  onPress={()=>{
                                            //TODO:cancel this behaviour

                                          }}>


                    <View style={{width:width*2/3,height:80,backgroundColor:'rgba(40,40,40,0.5)',position:'relative',
                                        justifyContent:'center',alignItems:'center',borderRadius:6}}>
                        <ActivityIndicator
                            animating={true}
                            style={[styles.loader, {height: 40,position:'absolute',top:8,right:20,transform: [{scale: 1.6}]}]}
                            size="large"
                            color="#00BFFF"
                        />
                        <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                            <Text style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>
                                {this.state.text}
                            </Text>

                        </View>
                    </View>
                </TouchableOpacity>

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
        borderTopColor:'#fff',
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
        paddingTop:8,
        paddingBottom:8,
    }
});


module.exports = Loading;
