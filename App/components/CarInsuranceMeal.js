/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    StyleSheet,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
var Proxy = require('../proxy/Proxy');
import { connect } from 'react-redux';
import NewCarBind from './modal/NewCarBind';
import {selectCarAction} from '../action/actionCreator';
import Config from '../../config';
var {height, width} = Dimensions.get('window');

class CarInsuranceMeal extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    refresh(){
        this.fetchData();
    }



    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    fetchData(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceCarInfoByCustomerId',

                info:{carNum:''}
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var data=res.data;
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({dataSource: ds.cloneWithRows(data),data:data});
            }
        }, (err) =>{
        });
    }


    renderRow(rowData){

        var tickOff=null;
        if(rowData.idle==true)
        {
            tickOff=
                <View style={{flex:2}}>
                    <TouchableOpacity onPress={
                            function() {
                          this.state.data.map(function(item,i) {
                              if(item.carId==rowData.carId)
                                  item.checked=!item.checked;
                            });
                              var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                            this.setState({dataSource: ds.cloneWithRows(this.state.data),data:this.state.data});
                        }.bind(this)}>
                        {
                            rowData.checked==true?<Icon name="check-square-o" size={30}></Icon>:<Icon name="square-o" size={30}></Icon>
                        }
                    </TouchableOpacity>
                </View>;

        }else{
            tickOff=
                <View style={{flex:2}}>
                    <Icon name="times" size={30}></Icon>
                </View>
        }

        var row=
            <View style={{flex:1,padding:10,borderBottomWidth:1,borderBottomColor:'#00f'}}>
                <View style={{flexDirection:'row',flex:1}}>
                    {tickOff}
                    <View style={{flex:6,flexDirection:'row',alignItems:'flex-end'}}>
                        <View>
                            <Text>{rowData.carNum}</Text>
                            <Text>{rowData.firstRegisterDate}</Text>
                        </View>
                    </View>
                    <View style={{flex:2,flexDirection:'row'}}>
                        <Text>详细</Text>
                        <Icon name="chevron-right" size={30}></Icon>
                    </View>
                </View>
            </View>;

        return row;
    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,modalVisible:false,carNum:null,
            filter:null
        };
    }

    render(){


        return (
            <View style={{flex:1}}>
            </View>)
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
        backgroundColor: '#fff',
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    row:{
        flexDirection:'row',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:8,
        paddingBottom:8,
        height:50,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(CarInsuranceMeal);
