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
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import CameraUtil from '../modal/CameraUtil';
var {height, width} = Dimensions.get('window');

var ImagePicker = require('react-native-image-picker');

class UploadLicenseCardModal extends Component{


    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
        //TODO:关闭时同步数据

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
                    case 'licenseCard1_img':
                        this.setState({licenseCard1_img: source});
                        console.log('licenseCard1_img.uri = ', response.uri);
                        break;
                    case 'licenseCard2_img':
                        this.setState({licenseCard2_img: source});
                        console.log('licenseCard2_img.uri = ', response.uri);
                        break;
                    case 'licenseCard3_img':
                        this.setState({licenseCard3_img: source});
                        console.log('licenseCard3_img.uri = ', response.uri);
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
            city:null,
            hasPhoto:false,
            cameraModalVisible:false,
            assetsBundle:{},
            licenseCard1_img:null,
            licenseCard2_img:null,
            licenseCard3_img:null,
        }
    }


    render(){

        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>

                {/*header bar*/}
                <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                    height:parseInt(height*54/667),backgroundColor:'rgba(17, 17, 17, 0.6)'}}>

                    <TouchableOpacity style={{flex:1}} onPress={
                            ()=>{
                                this.close();
                            }
                    }>
                        <Icon name="times-circle" size={30} color="#fff" />
                    </TouchableOpacity>

                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        上传行驶证照片
                    </Text>
                    <TouchableOpacity style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}
                                      onPress={
                            ()=>{
                                this.props.setLicenseCard(this.state.licenseCard1_img,this.state.licenseCard2_img,this.state.licenseCard3_img);
                                this.close();
                            }
                    }>

                        <Icon name="check" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView>

                    <View style={{padding:10}}>


                        {/*行驶证1面*/}
                        <View style={[{padding:20,paddingBottom:10,justifyContent: 'center',alignItems: 'center',
                            flexDirection:'row',borderRadius:8,borderWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                {
                                    this.state.assetsBundle['licenseCard1_img']!==undefined&&this.state.assetsBundle['licenseCard1_img']!==null?
                                        <Image source={this.state.assetsBundle['licenseCard1_img']}
                                               style={{width:width-90,height:200,borderRadius:16}}/>:
                                        <Image source={require('../../img/licenseCard1.jpg')}
                                               style={{width:width-90,height:200,borderRadius:16}}/>
                                }

                                <Text style={{fontSize:18,color:'#33c6cd',marginTop:20}}>上传行驶证1面</Text>

                                <View style={{position:'absolute',left:width/3,top:60}}>
                                    <TouchableOpacity style={{width:80,height:80,borderRadius:80,borderWidth:3,borderColor:'#fff',
                                        justifyContent:'center',alignItems:'center',borderStyle:'dashed',position:'relative'}}
                                                      onPress={()=>{
                                                      this.showImagePicker('licenseCard1_img');
                                                  }}>
                                        <Icon name="id-card-o" size={40} color="#fff"></Icon>
                                        <View style={{position:'absolute',bottom:10,right:6}}>
                                            <Icon name="camera" size={20} color="#fff"></Icon>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>



                        {/*行驶证2面*/}
                        <View style={[{padding:20,paddingBottom:10,justifyContent: 'center',alignItems: 'center',
                            flexDirection:'row',borderRadius:8,borderWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                {
                                    this.state.assetsBundle['licenseCard2_img']!==undefined&&this.state.assetsBundle['licenseCard2_img']!==null?
                                        <Image source={this.state.assetsBundle['licenseCard2_img']}
                                               style={{width:width-90,height:200,borderRadius:16}}/>:
                                        <Image source={require('../../img/licenseCard2.jpg')}
                                               style={{width:width-90,height:200,borderRadius:16}}/>
                                }

                                <Text style={{fontSize:18,color:'#33c6cd',marginTop:20}}>上传行驶证2面</Text>

                                <View style={{position:'absolute',left:width/3,top:60}}>
                                    <TouchableOpacity style={{width:80,height:80,borderRadius:80,borderWidth:3,borderColor:'#fff',
                                        justifyContent:'center',alignItems:'center',borderStyle:'dashed',position:'relative'}}
                                                      onPress={()=>{
                                                      this.showImagePicker('licenseCard2_img');
                                                  }}>
                                        <Icon name="id-card-o" size={40} color="#fff"></Icon>
                                        <View style={{position:'absolute',bottom:10,right:6}}>
                                            <Icon name="camera" size={20} color="#fff"></Icon>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>



                        {/*行驶证3面*/}
                        <View style={[{padding:20,paddingBottom:10,justifyContent: 'center',alignItems: 'center',
                            flexDirection:'row',borderRadius:8,borderWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                {
                                    this.state.assetsBundle['licenseCard3_img']!==undefined&&this.state.assetsBundle['licenseCard3_img']!==null?
                                        <Image source={this.state.assetsBundle['licenseCard3_img']}
                                               style={{width:width-90,height:200,borderRadius:16}}/>:
                                        <Image source={require('../../img/licenseCard3.jpg')}
                                               style={{width:width-90,height:200,borderRadius:16}}/>
                                }

                                <Text style={{fontSize:18,color:'#33c6cd',marginTop:20}}>上传行驶证3面</Text>

                                <View style={{position:'absolute',left:width/3,top:60}}>
                                    <TouchableOpacity style={{width:80,height:80,borderRadius:80,borderWidth:3,borderColor:'#fff',
                                        justifyContent:'center',alignItems:'center',borderStyle:'dashed',position:'relative'}}
                                                      onPress={()=>{
                                                      this.showImagePicker('licenseCard3_img');
                                                  }}>
                                        <Icon name="id-card-o" size={40} color="#fff"></Icon>
                                        <View style={{position:'absolute',bottom:10,right:6}}>
                                            <Icon name="camera" size={20} color="#fff"></Icon>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>


                    </View>
                </ScrollView>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >

                    <CameraUtil
                        onClose={(path)=>{
                            //alert(path);
                            this.closeCamera(path);
                        }}
                    />
                </Modal>
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
    listView: {
        paddingTop: 20,
        backgroundColor: 'transparent',
    }
});


module.exports = UploadLicenseCardModal;
