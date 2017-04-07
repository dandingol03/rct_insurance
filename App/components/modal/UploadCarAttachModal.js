/**
 * Created by dingyiming on 2017/4/7.
 */
import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

var {height, width} = Dimensions.get('window');

var ImagePicker = require('react-native-image-picker');
import{
    uploadPhoto,
} from '../../action/CarActions';

class UploadCarAttachModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    showImagePicker(assetId){
        this.setState({assetId:assetId});
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
                this.setState({assetsBundle:Object.assign(this.state.assetsBundle,{[this.state.assetId]:source})});
                switch(assetId)
                {
                    case 'carAttachId1_img':
                        this.setState({carAttachId1_img: source});
                        console.log('carAttachId1_img.uri = ', response.uri);
                        break;
                    case 'carAttachId2_img':
                        this.setState({carAttachId3_img: source});
                        console.log('carAttachId3_img.uri = ', response.uri);
                        break;
                    case 'carAttachId3_img':
                        this.setState({carAttachId3_img: source});
                        console.log('carAttachId3_img.uri = ', response.uri);
                        break;
                    case 'carAttachId4_img':
                        this.setState({carAttachId4_img: source});
                        console.log('carAttachId4_img.uri = ', response.uri);
                        break;
                    case 'carAttachId5_img':
                        this.setState({carAttachId5_img: source});
                        console.log('carAttachId5_img.uri = ', response.uri);
                        break;
                    case 'carAttachId6_img':
                        this.setState({carAttachId6_img: source});
                        console.log('carAttachId6_img.uri = ', response.uri);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    constructor(props)
    {
        super(props);

        this.state={

            carAttachId1_img:null,
            carAttachId2_img:null,
            carAttachId3_img:null,
            carAttachId4_img:null,
            carAttachId5_img:null,
            carAttachId6_img:null,

        }
    }


    render(){

        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>

                {/*header bar*/}

                <View style={[{backgroundColor:'rgba(17, 17, 17, 0.6)',padding: 10,height:54,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }}>
                            <Icon name="angle-left" size={40} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:10,textAlign:'center',color:'#fff'}}>
                        上传验车照片
                    </Text>
                    <View style={{flex:1,marginRight:5,flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                            <Icon name="times-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{flex:8}}>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        {/*左前照片*/}
                        {
                            this.state.carAttachId1_img==null?
                                <TouchableOpacity
                                                  onPress={()=>{
                                    this.showImagePicker('carAttachId1_img')
                                }}>
                                    <Image style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}} resizeMode="stretch" source={require('../../img/11@2x.png')}
                                           >
                                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                        <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                            <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                        </View>
                                    </View>
                                    <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                        <Text style={{fontSize:13,color:'#fff'}}>左前照片</Text>
                                    </View>
                                    </Image>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.carAttachId1_img}
                                           style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>左前照片</Text>
                                        </View>
                                    </Image>
                                </View>
                        }
                        {/*右前照片*/}
                        {
                            this.state.carAttachId2_img==null?
                                <TouchableOpacity
                                    onPress={()=>{
                                    this.showImagePicker('carAttachId2_img')
                                }}>
                                    <Image style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}} resizeMode="stretch" source={require('../../img/22@2x.png')}
                                    >
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>右前照片</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.carAttachId2_img}
                                           style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>右前照片</Text>
                                        </View>
                                    </Image>
                                </View>
                        }
                    </View>

                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        {/*左后照片*/}
                        {
                            this.state.carAttachId3_img==null?
                                <TouchableOpacity
                                    onPress={()=>{
                                    this.showImagePicker('carAttachId3_img')
                                }}>
                                    <Image style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}} resizeMode="stretch" source={require('../../img/33@2x.png')}
                                    >
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>左后照片</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.carAttachId3_img}
                                           style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>左后照片</Text>
                                        </View>
                                    </Image>
                                </View>
                        }

                        {/*右后照片*/}
                        {
                            this.state.carAttachId4_img==null?
                                <TouchableOpacity
                                    onPress={()=>{
                                    this.showImagePicker('carAttachId4_img')
                                }}>
                                    <Image style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}} resizeMode="stretch" source={require('../../img/44@2x.png')}
                                    >
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>右后照片</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.carAttachId4_img}
                                           style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>右后照片</Text>
                                        </View>
                                    </Image>
                                </View>
                        }
                    </View>

                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        {/*车架号照片*/}
                        {
                            this.state.carAttachId5_img==null?
                                <TouchableOpacity
                                    onPress={()=>{
                                    this.showImagePicker('carAttachId5_img')
                                }}>
                                    <Image style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}} resizeMode="stretch" source={require('../../img/55@2x.png')}
                                    >
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>车架号照片</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.carAttachId5_img}
                                           style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>车架号照片</Text>
                                        </View>
                                    </Image>
                                </View>
                        }

                        {/*其他*/}
                        {
                            this.state.carAttachId6_img==null?
                                <TouchableOpacity
                                    onPress={()=>{
                                    this.showImagePicker('carAttachId6_img')
                                }}>
                                    <Image style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}} resizeMode="stretch" source={require('../../img/66@2x.png')}
                                    >
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>其他</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.carAttachId6_img}
                                           style={{width:width*3/7,margin:10,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <View style={{width:70,height:70,borderWidth:2,borderColor:'#fff',borderRadius:35,
                                            borderStyle:'dashed',alignItems:'center',justifyContent:'center',position:'relative'}}>
                                                <Image style={{height:30,width:30}} source={require('../../img/camera@2x.png')}/>
                                            </View>
                                        </View>
                                        <View style={{position:'absolute',bottom:2,width:width*3/7,left:0,alignItems:'center'}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>其他</Text>
                                        </View>
                                    </Image>
                                </View>
                        }
                    </View>

                </View>

                <TouchableOpacity style={{flex:1,width:width-60,margin:50,marginLeft:30,marginBottom:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                  backgroundColor:'rgba(17, 17, 17, 0.6)',borderRadius:8}}
                                  onPress={()=>{
                                       this.uploadCarAttachConfirm();
                                      }}>
                    <View>
                        <Text style={{fontSize:15,color:'#fff'}}>提交验车照片</Text>
                    </View>

                </TouchableOpacity>


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

});


module.exports = UploadCarAttachModal;
