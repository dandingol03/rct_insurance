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
    ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
import {
    localSearch
} from '../../action/ServiceActions';

class AppendCustomPlace extends Component{

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }


    localSearch(keyword)
    {
        this.props.dispatch(localSearch({keyword:keyword})).then( (json) =>{
            if(json.re==1)
            {
                var results=json.data;

                this.setState({addresses:results});

            }else{
                Alert.alert('错误','无搜索结果返回')
            }
        });

    }


    rowRender(rowData,sectionId,rowId)
    {

        var lineStyle={flex:1,padding:7,paddingHorizontal:8,flexDirection:'row',height:45,backgroundColor:'transparent',
            borderBottomWidth:1,borderColor:'#ddd'};
        var row=

            <TouchableOpacity style={lineStyle}
                              onPress={()=>{
                                  var _address=_.cloneDeep(rowData);
                                  _address.title=rowData.name;
                                  if(this.props.onClose)
                                       this.props.onClose(_address);
                              }}>

                    <View style={{flex:1,alignItems:'flex-start'}}>
                        <Text style={{color:'#222',fontSize:13}}>
                            {rowData.name}
                        </Text>
                        <Text style={{color:'#aaa',fontSize:13,marginTop:4}}>
                            {rowData.address}
                        </Text>

                    </View>

            </TouchableOpacity>;

        return row;
    }


    constructor(props)
    {
        super(props);
        const {accessToken}=this.props;
        this.state={
            carInfo:{},
            accessToken:accessToken,
            query:{

            }
        }
    }

    render(){

        var props=this.props;
        var state=this.state;


        var {addresses}=state;

        var addrList=null;
        if(addresses)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            addrList=(
                <ScrollView >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(addresses)}
                        renderRow={this.rowRender.bind(this)}
                    />
                </ScrollView>);
        }


        return (
            <View style={{flex:1}}>


                <View style={[{backgroundColor:'#00c9ff',padding: 4,paddingHorizontal:10,height:40,marginTop:0,justifyContent: 'center',
                        alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <TouchableOpacity style={{width:50,justifyContent:'center'}}
                                      onPress={()=>{
                                    this.close();
                            }}>
                        <Icon name="angle-down" size={35} color="#fff"/>
                    </TouchableOpacity>

                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#fff',fontWeight:'bold'}}>
                            选择用户地址
                        </Text>
                    </View>

                    <TouchableOpacity style={{width:60,marginRight:5,padding:6,flexDirection:'row',justifyContent:'center',
                        borderRadius:6}}>
                    </TouchableOpacity>
                </View>


                <View style={{flex:1,backgroundColor:'#eee'}}>


                    <View style={{padding:0}}>



                        {/*目的地*/}
                        <View style={[styles.row,{alignItems:'center',height:35,paddingHorizontal:10,backgroundColor:'#fff',
                                marginTop:1,borderColor:'#ddd',borderBottomWidth:1}]}>

                            <View style={{flexDirection:'row',alignItems:'center',borderRightWidth:1,borderColor:'#aaa',
                                marginRight:10,paddingRight:10}}>
                                <Text style={{fontSize:14,color:'#343434'}}>目的地:</Text>
                            </View>

                            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',
                                backgroundColor:'transparent',paddingLeft:5}}>
                                <TextInput
                                    style={{borderBottomWidth:0,fontSize:13,flex:1,color:'#343434'}}
                                    editable = {true}
                                    height={40}
                                    onChangeText={
                                    (address)=>{
                                        this.setState({query:Object.assign(this.state.query,{address:address})})
                                    }
                                }
                                    value={this.state.query.address}
                                    placeholder='输入您的位置'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="characters"
                                />
                            </View>


                            {
                                this.state.query.address&&this.state.query.address!=''?
                                    <TouchableOpacity style={{width:35,alignItems:'center',height:35,justifyContent:'center'}}
                                                      onPress={()=>{
                                                          this.localSearch(this.state.query.address)
                                        }}>
                                        <Icon name="search" size={20} color="#222"/>
                                    </TouchableOpacity>:null

                            }

                            <TouchableOpacity style={{width:45,alignItems:'center',paddingVertical:8}}
                                              onPress={()=>{
                                    this.close();
                            }}>
                                <Text style={{color:'#f18000',fontSize:13}}>取消</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{padding:8,paddingLeft:0,paddingRight:0,height:height-90}}>
                            {addrList}
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


module.exports = AppendCustomPlace;
