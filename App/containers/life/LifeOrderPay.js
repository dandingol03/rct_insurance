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
var ImagePicker = require('react-native-image-picker');

class LifeOrderPay extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showImagePicker(creditCard_img){
        var options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                console.log('Response.uri = ', response.uri);

                switch(creditCard_img)
                {
                    case 'creditCard1_img':
                        this.setState({creditCard1_img: source});
                        break;
                    case 'creditCard2_img':
                        this.setState({creditCard2_img: source});
                        break;
                    default:
                        break;
                }

            }
        });
    }

    uploadNew(){

        var creditCard1_img = this.state.creditCard1_img.uri;
        var creditCard2_img = this.state.creditCard2_img.uri;
        var accessToken = this.state.accessToken;

        if(this.state.creditCard1_img!==undefined&&this.state.creditCard1_img!==null){
            if(this.state.creditCard2_img!==undefined&&this.state.creditCard2_img!==null)
            {

                var personId=null;
                var orderId = null;
                var planIds = null;

                personId = this.props.insurerId;
                orderId = this.props.orderId;
                planIds = this.props.planIds;

                alert('orderId ='+orderId);

                var suffix='';
                var imageType='creditCard';
                if($scope.insurer.creditCard1_img.indexOf('.jpg')!=-1)
                    suffix='jpg';
                else if($scope.insurer.creditCard1_img.indexOf('.png')!=-1)
                    suffix='png';
                else{}

                var creditCardAttachId1=null;
                var creditCardAttachId2=null;

                var data = new FormData();
                data.append('file', {uri: perIdCard1_img, name: 'perIdAttachId1', type: 'multipart/form-data'});

                alert('data.append====='+data);

                Proxy.post({
                    url: Config.server + '/svr/request?request=uploadPhoto' +
                    '&imageType=' + imageType + '&suffix=' + suffix +
                    '&filename=' + 'creditCardAttachId1' + '&orderId=' + orderId,
                    headers: {
                        'Authorization': "Bearer " + accessToken,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data,
                },(json)=> {
                    alert('upload creditCard1 success');
                    for(var field in json) {
                        alert('field=' + field + '\r\n' + json[field]);
                    }
                    var su=null
                    if(creditCard1_img.indexOf('.jpg')!=-1)
                        su='jpg';
                    else if(creditCard1_img.indexOf('.png')!=-1)
                        su='png';
                    alert('suffix=' + su);
                    return Proxy.postes({
                        url:Config.server+'/svr/request',
                        headers: {
                            'Authorization': "Bearer " + accessToken,
                            'Content-Type': 'application/json'
                        },
                        body: {
                            request:'createPhotoAttachment',
                            info: {
                                imageType:'creditCard',
                                filename:'creditCardAttachId1',
                                suffix:su,
                                docType:'I5' ,
                                personId:personId,
                                orderId:orderId
                            }
                        }
                    }).then((json)=>{
                        if(json.re==1)
                        {
                            creditCardAttachId1=json.data;
                            alert('creditCardAttachId1=' + creditCardAttachId1);
                            var su=null;
                            if(creditCard2_img.indexOf('.jpg')!=-1)
                                su='jpg';
                            else if(creditCard2_img.indexOf('.png')!=-1)
                                su='png';

                            var data = new FormData();
                            data.append('file', {uri:creditCard2_img, name: 'creditCard2_img', type: 'multipart/form-data'});

                            Proxy.post({
                                url: Config.server + '/svr/request?request=uploadPhoto' +
                                '&imageType=' + imageType + '&suffix=' + suffix +
                                '&filename=' + 'creditCardAttachId2' + '&orderId=' + orderId,
                                headers: {
                                    'Authorization': "Bearer " + accessToken,
                                    'Content-Type': 'multipart/form-data',
                                },
                                body: data,
                            },(json)=> {
                                if(json.re==1) {
                                    alert('upload creditCardAttachId2 success');
                                    for(var field in json) {
                                        alert('field=' + field + '\r\n' + json[field]);
                                    }
                                    return Proxy.postes({
                                        url:Config.server+'/svr/request',
                                        headers: {
                                            'Authorization': "Bearer " + accessToken,
                                            'Content-Type': 'application/json'
                                        },
                                        body: {
                                            request:'createPhotoAttachment',
                                            info: {
                                                imageType:'creditCard',
                                                filename:'creditCardAttachId2',
                                                suffix:su,
                                                docType:'I5' ,
                                                personId:personId,
                                                orderId:orderId
                                            }
                                        }
                                    }).then((json)=>{
                                        if(json.re==1){
                                            creditCardAttachId2=json.data;
                                            return Proxy.postes({
                                                url:Config.server+'/svr/request',
                                                headers: {
                                                    'Authorization': "Bearer " + accessToken,
                                                    'Content-Type': 'application/json'
                                                },
                                                body: {
                                                    request:'updateLifeOrderBankAttachId',
                                                    info: {
                                                        bankAttachId1:creditCardAttachId1,
                                                        bankAttachId2:creditCardAttachId2,
                                                        planIds:planIds,
                                                        orderId:orderId
                                                    }
                                                }
                                            });
                                        }
                                    }).then((json)=>{
                                        if(json.re==1) {
                                            alert('上传银行卡成功!');
                                            this.goBack();
                                        }
                                    });
                                }

                            }, (err) =>{
                                Alert.alert(
                                    'error',
                                    err
                                );
                            })
                        }
                    })
                }, (err) =>{
                    Alert.alert(
                        'error',
                        err
                    );
                })

            }
            else{
                Alert.alert(
                    '提示',
                    '请拍入关联人的身份证反面再点击关联',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                    ]
                )
            }
        }
        else{
            Alert.alert(
                '提示',
                '请拍入关联人的身份证正面再点击关联',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                ]
            )
        }
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            creditCard1_img:null,
            creditCard2_img:null,
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

                        {/*银行卡正面*/}
                        {
                            this.state.creditCard1_img==null?
                                <TouchableOpacity style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}
                                                  onPress={()=>{
                                    this.showImagePicker('creditCard1_img')
                                }}>
                                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                        <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                            <Icon name="id-card-o" size={35} color="#fff"/>

                                            <View style={{position:'absolute',bottom:10,right:2}}>
                                                <Icon name="camera" size={20} color="#fff"/>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{position:'absolute',bottom:2,width:width*2/3,left:0,alignItems:'center'}}>
                                        <Text style={{fontSize:13,color:'#666'}}>上传银行卡正面</Text>
                                    </View>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.creditCard1_img}
                                           style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:110,
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Icon name="id-card-o" size={35} color="#fff"/>

                                                <View style={{position:'absolute',bottom:10,right:2}}>
                                                    <Icon name="camera" size={20} color="#fff"/>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*2/3,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#666'}}>上传银行卡正面</Text>
                                        </View>
                                    </Image>
                                </View>

                        }

                        {/*银行卡反面*/}
                        {
                            this.state.creditCard2_img==null?
                                <TouchableOpacity style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}
                                                  onPress={()=>{
                                    this.showImagePicker('creditCard2_img')
                                }}>
                                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                        <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                            <Icon name="id-card-o" size={35} color="#fff"/>

                                            <View style={{position:'absolute',bottom:10,right:2}}>
                                                <Icon name="camera" size={20} color="#fff"/>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{position:'absolute',bottom:2,width:width*2/3,left:0,alignItems:'center'}}>
                                        <Text style={{fontSize:13,color:'#666'}}>上传银行卡反面</Text>
                                    </View>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.creditCard2_img}
                                           style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:110,
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Icon name="id-card-o" size={35} color="#fff"/>

                                                <View style={{position:'absolute',bottom:10,right:2}}>
                                                    <Icon name="camera" size={20} color="#fff"/>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*2/3,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#666'}}>上传银行卡反面</Text>
                                        </View>
                                    </Image>
                                </View>
                        }



                    </View>

                    <TouchableOpacity style={{flex:1}}
                                      onPress={()=>{
                        this.uploadNew();
                    }}>
                       <Text>上传银行卡照片</Text>
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

