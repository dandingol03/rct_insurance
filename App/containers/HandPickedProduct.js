/**
 * Created by dingyiming on 2017/4/9.
 */

import React,{Component} from 'react';

import  {
    Modal,
    ActivityIndicator,
    ListView,
    AppRegistry,
    Animated,
    Easing,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import Config from '../../config';
import Proxy from '../proxy/Proxy';


class HandPickedProduct extends Component{


    //拉取寿险产品
    fetchProducts() {

        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.props.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchLifeProduct',
            }
        },(json)=> {
            if(json.re==1) {
                if(json.data!==undefined&&json.data!==null)
                {
                    this.state.products=json.data;
                    this.setState({products:json.data});

                }
            }

        }, (err) =>{
            for(var field in err)
                str+=err[field];
            console.error('err=\r\n'+str);
        });
    }


    renderRow(rowData,sectionId,rowId){

        var row=
            <View style={{padding:10}}>
                <View>
                    <Image style={styles.logo} source={require('../img/lifeBetter.jpg')} />
                </View>

                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{margin:10,}}>{rowData.productName}</Text>

                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',margin:10}}>
                        <Text style={{color:'#e2511c'}}>保额：$</Text>
                        <Text style={{color:'#e2511c'}}>{rowData.insuranceQuota}</Text>
                    </View>

                </View>
            </View>;

        return row;
    }

    sendNotification(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.props.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'sendNotification',
            }
        },(json)=> {
            if(json.re==1){
                console.log('发送成功');
            }
            else{
                console.log('发送失败');
            }
        }, (err) =>{
        });
    }

    constructor(props) {
        super(props);
        this.state={
            products:null,
            doingFetch:false,

        };
    }

    render() {

        var listView=null;
        const products=this.state.products;
        if(products!==undefined&&products!==null&&Object.prototype.toString.call(products)=='[object Array]')
        {
            var data=products;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}

                    />
                </ScrollView>;
        }else{
            if(this.state.doingFetch==false)
                this.fetchProducts();
        }


        return (
            <View style={{flex:1}}>

                <View style={{flex:1,backgroundColor:'rgba(17, 17, 17, 0.6)',justifyContent: 'center',alignItems: 'center',}}>
                    <Text style={{color:'#fff',fontSize:15,paddingTop:10}}>精选产品</Text>
                </View>

                {/*<TouchableOpacity style={{flex:1,backgroundColor:'rgba(17, 17, 17, 0.6)',justifyContent: 'center',alignItems: 'center',}}*/}
                                  {/*onPress={()=>{*/}
                                    {/*this.sendNotification();*/}
                                  {/*}}>*/}
                    {/*<Text>测推送:</Text>*/}
                    {/*<Text>{this.state.userCounters}</Text>*/}
                {/*</TouchableOpacity>*/}


                <View style={{flex:12,justifyContent: 'center',alignItems: 'center'}}>

                    <View style={{padding:8,paddingLeft:0,paddingRight:0,height:height-100}}>
                        {listView}
                    </View>
                </View>

                {/*loading模态框*/}
                <Modal animationType={"fade"} transparent={true} visible={this.state.doingFetch}>

                    <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                      onPress={()=>{
                                            //TODO:cancel this behaviour
                                          }}>

                        <View style={{width:width*2/3,height:80,backgroundColor:'rgba(60,60,60,0.9)',position:'relative',
                                        justifyContent:'center',alignItems:'center',borderRadius:6}}>
                            <ActivityIndicator
                                animating={true}
                                style={[styles.loader, {height: 40,position:'absolute',top:8,right:20,transform: [{scale: 1.6}]}]}
                                size="large"
                                color="#00BFFF"
                            />
                            <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                <Text style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>
                                    拉取精选产品...
                                </Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

            </View>
        )
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer:{
        marginTop: 30
    },
    logo:{
        width:width-20,
        height:230
    },
});


const mapStateToProps = (state, ownProps) => {

    var {personInfo,accessToken,score}=state.user;

    return {
        personInfo,
        score,
        accessToken,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps
)(HandPickedProduct);

