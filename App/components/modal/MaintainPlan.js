/**
 * Created by danding on 17/3/17.
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
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import GridView from 'react-native-grid-view'
import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');


class MaintainPlan extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    confirm(){
        if(this.props.onConfirm!==undefined&&this.props.onConfirm!==null)
        {
            if(this.state.city!=null)
                this.props.onConfirm(this.state.city);
            else{
                Alert.alert(
                    'error',
                    'u should select a city first'
                );
            }
        }
    }

    constructor(props)
    {
        super(props);

        this.state={
            miles:props.miles
        }
    }


    renderRow(rowData)
    {
        //TODO:judge selectedStyle and unSelectedStyle

        if(this.state.city==rowData)
        {
            return  (
                <TouchableOpacity onPress={
                    ()=>{
                        this.setState({city:rowData});
                    }
                       }>
                    <View style={styles.selectedItem} key={rowData}>
                        <Text style={{color:'#fff'}}>{rowData}</Text>
                    </View>
                </TouchableOpacity>
            );
        }else{
            return  (
                <TouchableOpacity onPress={
                    ()=>{
                        this.setState({city:rowData});
                    }
                       }>
                    <View style={styles.item} key={rowData}>
                        <Text>{rowData}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render(){

        return (
            <View style={{flex:1,marginTop:20,height:height/2}}>

                <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:40,
                    backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{
                        this.close();
                             }}>
                        <Icon name="angle-down" size={40} color="#fff"/>

                    </TouchableOpacity>
                    <Text style={{fontSize:15,flex:5,textAlign:'center',color:'#fff'}}>
                        推荐保养计划
                    </Text>
                    <View style={{flex:1,padding:0}}></View>
                </View>



                <View  style={{margin:10}}>

                    <View style={[styles.row,{justifyContent:'flex-start',height:50}]}>
                        <Icon name="circle" size={10} color="#e99d23"/>
                        <Text style={{padding:5,fontSize:13,color:'#343434'}}>{this.props.routineName}</Text>
                    </View>

                    <View style={[styles.rpw,{height:50}]}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Icon name="circle" size={10} color="#e99d23"/>
                            <Text style={{padding:5,fontSize:13,color:'#343434'}}>蓄电池和防冻液建议每两年更换一次,</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Text style={{paddingLeft:15,fontSize:13,color:'#343434'}}>每年入冬前为检查更换时间;</Text>
                        </View>
                    </View>

                    <View style={[styles.row,{height:50}]}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Icon name="circle" size={10} color="#e99d23"/>
                            <Text style={{padding:5,fontSize:13,color:'#343434'}}>空调滤芯每6个月更换一次，</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                            <Text style={{paddingLeft:15,fontSize:13,color:'#343434'}}>每年入冬前为检查更换时间;</Text>
                        </View>
                    </View>

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
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems:'flex-start'
    },
    item: {
        backgroundColor: '#fff',
        borderRadius:4,
        margin: 3,
        width: 100,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10,
        marginRight:10
    },
    selectedItem:{
        backgroundColor: '#63c2e3',
        borderRadius:4,
        margin: 3,
        width: 100,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10,
        marginRight:10
    },
    listView: {
        paddingTop: 20,
        backgroundColor: 'transparent',
    }
});


module.exports = MaintainPlan;
