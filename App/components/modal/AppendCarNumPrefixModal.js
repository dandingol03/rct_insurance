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
import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');


class AppendCarNumPrefixModal extends Component{

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
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            city:null,
            dataSource:ds.cloneWithRows(['济南','青岛','淄博','枣庄','东营','烟台','潍坊','滨州','德州','济宁','泰安',
                '威海','日照','聊城','临沂','菏泽','莱芜'])
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
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                    <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                    height:parseInt(height*54/667),backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                        <TouchableOpacity style={{flex:1,paddingLeft:5}} onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                            <Icon name="times-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <Text style={{fontSize:17,flex:8,paddingLeft:12,textAlign:'center',color:'#fff'}}>
                            选择城市
                        </Text>
                        <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                        </View>
                    </View>

                    <View style={{flex:1,backgroundColor:'#fff',flexDirection:'row',padding:8}}>
                        <View style={{flex:4,padding:10}}>
                            <Text>当前选择城市</Text>
                        </View>
                        <View style={{flex:2,justifyContent:'center',backgroundColor:'#f0f0f0',padding:5}}>
                            <Text style={{color:'#222',textAlign:'center'}}>{this.state.city}</Text>
                        </View>
                        <View style={{flex:1}}>

                        </View>

                    </View>

                    <View style={{flex:9,padding:10}}>
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            contentContainerStyle={styles.listViewStyle}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow.bind(this)}
                            pageSize={3}

                        />
                    </View
                    >

                    <TouchableOpacity style={{flex:1,margin:8,width:width*0.6,marginLeft:width*0.2,backgroundColor:'#ff591a',
                                flexDirection:'row',justifyContent:'center',borderRadius:8}}
                                      onPress={this.confirm.bind(this)}>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>
                            <Text style={{color:'#fff'}}>确认</Text>
                        </View>
                    </TouchableOpacity>
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
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
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
    listViewStyle:{
        // 主轴方向
        flexDirection:'row',
        // 一行显示不下,换一行
        flexWrap:'wrap',
        // 侧轴方向
        alignItems:'center', // 必须设置,否则换行不起作用
        justifyContent:'center',
    },
});


module.exports = AppendCarNumPrefixModal;
