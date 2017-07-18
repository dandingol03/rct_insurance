/**
 * Created by dingyiming on 2017/5/8.
 */

import React,{Component} from 'react';

import  {
    ScrollView,
    AppRegistry,
    StyleSheet,
    ListView,
    Image,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import Config from '../../../config';
import Proxy from '../../proxy/Proxy';



class Market extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    renderRow(rowData,sectionId,rowId){

        var image = rowData.image;
        var row=
            <View style={{flex:1,flexDirection:'row',padding:8,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#ddd'}}>
                <View style={{flex:1,margin:5}}>
                    <Image resizeMode="stretch" source={require('../../images/cucumber.jpg')} style={{width:100,height:80}}></Image>
                </View>

                <View style={{flex:3,justifyContent:'center',alignItems:'flex-start',margin:10,paddingLeft:30}}>
                    <Text style={{fontSize:18,margin:5}}>{rowData.name}</Text>
                    <Text style={{fontSize:15,margin:5,marginTop:15,color:'#e24d14'}}>{rowData.price}积分</Text>

                </View>

                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',padding:5,margin:15,borderWidth:1,borderColor:'#e24d14',borderRadius:10,}}>

                    <Text style={{fontSize:16,color:'#e24d14'}}>兑换</Text>
                </TouchableOpacity>

            </View>;
        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {
            goods:this.props.goods,

        };
    }

    render(){

        var goods = this.state.goods;
        var goodsListView=null;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(goods!==undefined&&goods!==null&&goods.length>0)
        {
            goodsListView=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(goods)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>);
        }

        return (
            <View style={{flex:1}}>

                {/* header bar */}
                <View style={{flex:1,padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',
                flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                    <TouchableOpacity onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{fontSize:18,flex:3,textAlign:'center',color:'#fff'}}>
                        绿色蔬菜
                    </Text>
                </View>

                {/* body*/}

                    <View  style={{flexDirection:'row',flex:20}}>
                        {goodsListView}
                    </View>

            </View>);
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
        flex:2
    },
    module:{
        width:width*1/2,
        height:height*3/10
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
        flex:1
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        notification:state.notification
    })
)(Market);
