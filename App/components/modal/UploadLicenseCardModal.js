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

class UploadLicenseCardModal extends Component{

    useCamera(assetId)
    {
        this.setState({cameraModalVisible:true,assetId:assetId});
    }

    closeCamera(path)
    {
        this.state.assetsBundle[this.state.assetId]=path;
        this.setState({cameraModalVisible:false,assetsBundle:this.state.assetsBundle});
    }

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    constructor(props)
    {
        super(props);

        this.state={
            city:null,
            hasPhoto:false,
            cameraModalVisible:false,
            assetsBundle:{}
        }
    }


    render(){

        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>

                {/*header bar*/}
                <View style={[{backgroundColor:'#11c1f3',padding:4,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                            <Icon name="times-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        上传行驶证照片
                    </Text>
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>

                <ScrollView>

                    <View style={{padding:10}}>

                        {/*行驶证1面*/}
                        <View style={[{padding:20,paddingBottom:10,justifyContent: 'center',alignItems: 'center',
                        flexDirection:'row',borderRadius:8,borderWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                {
                                    this.state.assetsBundle['licenseCard1.jpg']!==undefined&&this.state.assetsBundle['licenseCard1.jpg']!==null?
                                        <Image source={require(this.state.assetsBundle['licenseCard1.jpg'])}
                                               style={{width:width-90,height:200,borderRadius:16}}/>:
                                        <Image source={require('../../img/licenseCard1.jpg')}
                                               style={{width:width-90,height:200,borderRadius:16}}/>
                                }

                                <Text style={{fontSize:18,color:'#33c6cd',marginTop:20}}>上传行驶证1面</Text>

                                <View style={{position:'absolute',left:width/3,top:60}}>
                                    <TouchableOpacity style={{width:80,height:80,borderRadius:80,borderWidth:3,borderColor:'#fff',
                                        justifyContent:'center',alignItems:'center',borderStyle:'dashed',position:'relative'}}
                                                      onPress={()=>{
                                                      this.useCamera('licenseCard1.jpg');
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
                        <View style={[{padding:20,paddingBottom:10,justifyContent: 'center',alignItems: 'center',marginTop:20,
                        flexDirection:'row',borderRadius:8,borderWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image source={require('../../img/licenseCard2.jpg')}
                                       style={{width:width-90,height:200,borderRadius:8,justifyContent:'center',alignItems:'center'}}>
                                    <TouchableOpacity style={{width:80,height:80,borderRadius:80,borderWidth:3,borderColor:'#fff',
                                        justifyContent:'center',alignItems:'center',borderStyle:'dashed',position:'relative'}}>
                                        <Icon name="id-card-o" size={40} color="#fff"></Icon>
                                        <View style={{position:'absolute',bottom:10,right:6}}>
                                            <Icon name="camera" size={20} color="#fff"></Icon>
                                        </View>
                                    </TouchableOpacity>
                                </Image>
                                <Text style={{fontSize:18,color:'#33c6cd',marginTop:20}}>上传行驶证2面</Text>
                            </View>
                        </View>



                        {/*行驶证3面*/}
                        <View style={[{padding:20,paddingBottom:10,justifyContent: 'center',alignItems: 'center',marginTop:20,
                        flexDirection:'row',borderRadius:8,borderWidth:1,borderColor:'#aaa'}]}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image source={require('../../img/licenseCard3.jpg')}
                                       style={{width:width-90,height:200,borderRadius:8,justifyContent:'center',alignItems:'center'}}>
                                    <TouchableOpacity style={{width:80,height:80,borderRadius:80,borderWidth:3,borderColor:'#fff',
                                        justifyContent:'center',alignItems:'center',borderStyle:'dashed',position:'relative'}}>
                                        <Icon name="id-card-o" size={40} color="#fff"></Icon>
                                        <View style={{position:'absolute',bottom:10,right:6}}>
                                            <Icon name="camera" size={20} color="#fff"></Icon>
                                        </View>
                                    </TouchableOpacity>
                                </Image>
                                <Text style={{fontSize:18,color:'#33c6cd',marginTop:20}}>上传行驶证3面</Text>
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
                            alert(path);
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
