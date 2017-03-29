/**
 * Created by dingyiming on 2017/2/15.
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
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
var ImagePicker = require('react-native-image-picker');

class AppendLifeInsurer extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showImagePicker(perIdCard_img){
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

                switch(perIdCard_img)
                {
                    case 'perIdCard1_img':
                        this.setState({perIdCard1_img: source});
                        break;
                    case 'perIdCard2_img':
                        this.setState({perIdCard2_img: source});
                        break;
                    default:
                        break;
                }

            }
        });
    }

    selectInsurer(insurer){
        if(this.state.selectedTab==0)
        {
            if(insurer!==undefined&&insurer!==null&&
                insurer.personId!==null&&insurer.personId!==undefined)
            {
                this.props.setLifeInsurer(insurer);
                this.goBack();
            }
        }

    }

    uploadNew(cmd,item){

        if(this.state.perIdCard1_img!==undefined&&this.state.perIdCard1_img!==null){
            if(this.state.perIdCard2_img!==undefined&&this.state.perIdCard2_img!==null)
            {
                var personId=null;
                Proxy.postes({
                    url: Config.server + '/svr/request',
                    headers: {
                        'Authorization': "Bearer " + accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request:cmd,
                        info:item
                    }
                }).then((json)=>{
                    if(json.re==1) {
                        personId = json.data.personId;
                        alert('personId=' + personId);
                        this.state.insurer.personId = personId;
                        var suffix = '';
                        var imageType = 'perIdCard';
                        if (this.state.perIdCard1_img.indexOf('.jpg') != -1)
                            suffix = 'jpg';
                        else if (this.state.perIdCard1_img.indexOf('.png') != -1)
                            suffix = 'png';
                        else {
                        }

                        var perIdAttachId1=null;
                        var perIdAttachId2=null;

                        var data = new FormData();
                        data.append('file', {uri: portrait, name: 'portrait.jpg', type: 'multipart/form-data'});

                        Proxy.postes({
                            url: Config.server + '/svr/request?request=uploadPhoto' +
                            '&imageType=' + imageType + '&suffix=' + suffix +
                            '&filename=' + 'perIdCard1_img' + '&personId=' + personId,
                            headers: {
                                'Authorization': "Bearer " + accessToken,
                                'Content-Type': 'multipart/form-data',
                            },
                            body: data,
                        }).then(function(res) {
                            alert('upload perIdCard1 success');
                            for(var field in res) {
                                alert('field=' + field + '\r\n' + res[field]);
                            }
                            var su=null
                            if(this.state.perIdCard1_img.indexOf('.jpg')!=-1)
                                su='jpg';
                            else if(this.state.perIdCard1_img.indexOf('.png')!=-1)
                                su='png';
                            alert('suffix=' + su);
                            return Proxy.post({
                                url:Config.server+'/svr/request',
                                headers: {
                                    'Authorization': "Bearer " + this.state.accessToken,
                                    'Content-Type': 'application/json'
                                },
                                body: {
                                    request:'createPhotoAttachment',
                                    info: {
                                        imageType:'perIdCard',
                                        filename:'perIdAttachId1',
                                        suffix:su,
                                        docType:'I1' ,
                                        personId:personId
                                    }
                                }
                            });
                        }).then(function(res) {
                                var json=res.data;
                                if(json.re==1) {
                                    perIdAttachId1=json.data;
                                    alert('perIdAttachId1=' + perIdAttachId1);
                                    var su=null;
                                    if(this.state.perIdCard2_img.indexOf('.jpg')!=-1)
                                        su='jpg';
                                    else if(this.state.perIdCard2_img.indexOf('.png')!=-1)
                                        su='png';

                                    var data = new FormData();
                                    data.append('file', {uri: portrait, name: 'portrait.jpg', type: 'multipart/form-data'});

                                    return Proxy.postes({
                                        url: Config.server + '/svr/request?request=uploadPhoto' +
                                        '&imageType=' + imageType + '&suffix=' + suffix +
                                        '&filename=' + 'perIdCard2_img' + '&personId=' + personId,
                                        headers: {
                                            'Authorization': "Bearer " + accessToken,
                                            'Content-Type': 'multipart/form-data',
                                        },
                                        body: data,
                                    }).then(function(res) {
                                            alert('upload perIdCard2 success');
                                            for(var field in res) {
                                                alert('field=' + field + '\r\n' + res[field]);
                                            }
                                            return Proxy.post({
                                                url:Config.server+'/svr/request',
                                                headers: {
                                                    'Authorization': "Bearer " + this.state.accessToken,
                                                    'Content-Type': 'application/json'
                                                },
                                                body: {
                                                    request:'createPhotoAttachment',
                                                    info: {
                                                        imageType:'perIdCard',
                                                        filename:'perIdAttachId1',
                                                        suffix:su,
                                                        docType:'I1' ,
                                                        personId:personId
                                                    }
                                                }
                                            });
                                        }) .then(function(res) {
                                            var json=res.data;
                                            if(json.re==1){
                                                perIdAttachId2=json.data;
                                                return $http({
                                                    method: "POST",
                                                    url: Proxy.local()+"/svr/request",
                                                    headers: {
                                                        'Authorization': "Bearer " + $rootScope.access_token,
                                                    },
                                                    data:
                                                        {
                                                            request:'createInsuranceInfoPersonInfo',
                                                            info:{
                                                                perIdAttachId1:perIdAttachId1,
                                                                perIdAttachId2:perIdAttachId2,
                                                                personId:personId
                                                            }
                                                        }
                                                });
                                            }
                                        }).then(function(res) {
                                            alert('insuranceInfoPersonInfo create successfully');
                                            var json=res.data;
                                            if(json.re==1) {
                                                return $http({
                                                    method: "POST",
                                                    url: Proxy.local()+"/svr/request",
                                                    headers: {
                                                        'Authorization': "Bearer " + $rootScope.access_token,
                                                    },
                                                    data:
                                                        {
                                                            request:'getInfoPersonInfoByPersonId',
                                                            info:{
                                                                personId:personId
                                                            }
                                                        }
                                                });
                                            }
                                        }).then(function(res) {
                                            var json=res.data;
                                            if(json.re==1) {
                                                var person=json.data;
                                                $scope.insurer=person;
                                                $rootScope.life_insurance.insurer=person;
                                                $state.go('life');
                                            }
                                        });
                                }
                            })

                    }else{}

                }).then(function(res) {

                }).catch((e)=>{
                    reject(e);
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

    getPlaceHolder()
    {
        switch(this.state.selectedTab)
        {
            case 0:
                return (
                    <View style={{flex:1}}>
                    </View>);
                break;
            case 1:
                return (
                    <TouchableOpacity style={{width:70,flexDirection:'row',alignItems:'center',borderRadius:6,
                                            backgroundColor:'#ef473a',padding:2,justifyContent:'center'}}
                        onPress={()=>{
                            this.uploadNew();

                    }}>
                        <Icon name="hand-pointer-o" size={18} color="#fff"></Icon>
                        <Text style={{color:'#fff'}}>保存</Text>
                    </TouchableOpacity>);
                break;
        }

    }

    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',padding:4,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};

        var row=(
            <TouchableOpacity style={lineStyle} onPress={()=>{
                 rowData.checked=!rowData.checked;
                 var relativePersons=this.state.relativePersons;
                 if(rowData.checked==true)
                 {
                    relativePersons.map(function(person,i) {
                       if(person.personId!=rowData.personId)
                           person.checked=false;
                    });

                 }
                 this.setState({relativePersons:this.state.relativePersons,insurer:rowData});

            }}>
                <View style={{flex:2,padding:2}}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
                        <Text style={{color:'#343434',fontSize:15}}>
                           姓名:
                        </Text>
                        <Text style={{color:'#343434',fontSize:15}}>
                            {rowData.perName}
                        </Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Text style={{color:'#aaa',fontSize:14}}>
                           证件号:
                        </Text>
                        <Text style={{color:'#aaa',fontSize:14}}>
                            {rowData.perIdCard}
                        </Text>
                    </View>
                </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                    {
                        rowData.checked==true?
                            <Icon name="check-square-o" size={25} color="#00c9ff"/>:
                            <Icon name="hand-pointer-o" size={25} color="#888"/>
                    }
                </View>
            </TouchableOpacity>
        );

        if(rowData.checked==true){
            this.selectInsurer(this.state.insurer);
        }
        return row;
    }

    fetchData(personId){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'getRelativePersonsWithinPerName',
                info: {
                    perName: ''
                }
            }
        },(json)=> {
            if(json.re==1) {
                if(json.data!==undefined&&json.data!==null)
                {

                    var insurer= null;
                    json.data.map(function (person,i) {

                        //当新增完被保险人后,自动刷新被保险人列表并选中
                        if(personId!==undefined&&personId!==null&&person.personId==personId)
                        {
                            person.checked=true;
                            insurer = person;
                        }
                    });
                    var  relativePersons=json.data;
                    this.setState({insurer:insurer,relativePersons:relativePersons});
                }
            }

        }, (err) =>{
        });
    }

    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            setLifeInsurer:props.setLifeInsurer,
            relativePersons:null,
            selectedTab:0,
            accessToken: accessToken,
            insurer:{perName:''},
            perName:'',
            perIdCard1_img:null,
            perIdCard2_img:null,

        };
    }

    render(){

        var listView=null;
        if(this.state.relativePersons!==undefined&&this.state.relativePersons!==null)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource=ds.cloneWithRows(this.state.relativePersons);

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }else{
            this.fetchData();
        }


        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                <View style={[{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)',height:50},styles.card]}>
                    <TouchableOpacity style={{flex:1}}
                                      onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff"/>
                    </TouchableOpacity>

                    <View style={{flex:3,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:17,color:'#fff',marginLeft:10}}>
                            选择投保人
                        </Text>
                    </View>

                    {this.getPlaceHolder(this.state.selectedTab)}

                </View>

                <ScrollableTabView style={{flex:1,padding:0,margin:0}} onChangeTab={(data)=>{
                        var tabIndex=data.i;
                        this.state.selectedTab=tabIndex;
                        this.setState({selectedTab:tabIndex});
                    }} renderTabBar={() =><FacebookTabBar/>}>
                    <View tabLabel='已有投保人' style={{flex:1}}>
                        {/*body*/}
                        <View style={{padding:20,height:height-250}}>
                            {listView}
                        </View>

                    </View>

                    <View tabLabel='新建投保人' style={{flex:1}}>

                        {/*输入投保人姓名*/}
                        <View style={{flexDirection:'row', height: 50,borderBottomWidth:1,borderBottomColor:'#aaa',margin:10}}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:15}}>
                                <Text style={{fontSize:15,flex:3,textAlign:'left',color:'#343434'}}>姓名:</Text>
                            </View>
                            <View style={{flex:8,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 50,fontSize:13,color:'#343434'}}
                                    onChangeText={(name) =>
                                    {
                                       this.state.perName=name;
                                       this.setState({perName:name});
                                }}
                                    value={this.state.perName}
                                    placeholder='请填入寿险投保人姓名'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        {/*身份证正面*/}
                        {
                            this.state.perIdCard1_img==null?
                                <TouchableOpacity style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}
                                                  onPress={()=>{
                                    this.showImagePicker('perIdCard1_img')
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
                                        <Text style={{fontSize:13,color:'#666'}}>上传身份证正面</Text>
                                    </View>
                                </TouchableOpacity> :
                            <View>
                                <Image resizeMode="stretch" source={this.state.perIdCard1_img}
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
                                    <Text style={{fontSize:13,color:'#666'}}>上传身份证正面</Text>
                                </View>
                                </Image>
                            </View>
                        }

                        {/*身份证反面*/}
                        {
                            this.state.perIdCard2_img==null?
                                <TouchableOpacity style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:110,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative'}}
                                                  onPress={()=>{
                                    this.showImagePicker('perIdCard2_img')
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
                                        <Text style={{fontSize:13,color:'#666'}}>上传身份证反面</Text>
                                    </View>
                                </TouchableOpacity> :
                                <View>
                                    <Image resizeMode="stretch" source={this.state.perIdCard2_img}
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
                                            <Text style={{fontSize:13,color:'#666'}}>上传身份证反面</Text>
                                        </View>
                                    </Image>
                                </View>
                        }


                    </View>



                </ScrollableTabView>
                </Image>

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
        flexDirection:'row'
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(AppendLifeInsurer);
