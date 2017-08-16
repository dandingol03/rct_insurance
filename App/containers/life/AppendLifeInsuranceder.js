/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    ActivityIndicator,
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

import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';
var ImagePicker = require('react-native-image-picker');
import ActionSheet from 'react-native-actionsheet';


class AppendLifeInsuranceder extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    _handlePress1(index) {

        if(index!==0){
            var relationShip = this.state.relationShipButtons[index];
            var insuranceder ={perTypeCode:'I',perName:this.state.perName,relationShip:null};
            insuranceder.relationShip = relationShip;
            this.setState({relationShip:relationShip,insuranceder:insuranceder});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    showImagePicker(perIdCard_img){
        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            title:'请选择',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'图库',
            cancelButtonTitle:'取消',

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

                switch(perIdCard_img)
                {
                    case 'perIdCard1_img':
                        this.setState({perIdCard1_img: source});
                        console.log('perIdCard1_img.uri = ', response.uri);
                        break;
                    case 'perIdCard2_img':
                        this.setState({perIdCard2_img: source});
                        console.log('perIdCard2_img.uri = ', response.uri);
                        break;
                    default:
                        break;
                }

            }
        });
    }

    selectInsuranceder(insuranceder){
        if(this.state.selectedTab==0)
        {
            if(insuranceder!==undefined&&insuranceder!==null&&
                insuranceder.personId!==null&&insuranceder.personId!==undefined)
            {
                this.props.setLifeInsuranceder(insuranceder);
                this.goBack();
            }
        }
    }

    uploadNew(){
        this.setState({doingUploading:true});
        var insuranceder = {perTypeCode:'I'};
        insuranceder.perName = this.state.perName;
        insuranceder.relationShip = this.state.relationShip;
        var personId=null;
        var person = null;
        var perIdCard1_img = this.state.perIdCard1_img.uri;
        var perIdCard2_img = this.state.perIdCard2_img.uri;
        var accessToken = this.state.accessToken;

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
                        request:'createRelativePerson',
                        info:insuranceder,
                    }
                }).then((json)=>{
                    if(json.re==1) {
                        personId = json.data.personId;
                        //('personId=' + personId);
                        insuranceder.personId = personId;
                        var suffix = '';
                        var imageType = 'perIdCard';
                        if (perIdCard1_img.indexOf('.jpg') != -1)
                            suffix = 'jpg';
                        else if (perIdCard1_img.indexOf('.png') != -1)
                            suffix = 'png';
                        else {
                        }

                        var perIdAttachId1=null;
                        var perIdAttachId2=null;

                        var data = new FormData();
                        data.append('file', {uri: perIdCard1_img, name: 'perIdAttachId1', type: 'multipart/form-data'});

                       // alert('data.append====='+data);

                        Proxy.post({
                            url: Config.server + '/svr/request?request=uploadPhoto' +
                            '&imageType=' + imageType + '&suffix=' + suffix +
                            '&filename=' + 'perIdAttachId1' + '&personId=' + personId,
                            headers: {
                                'Authorization': "Bearer " + accessToken,
                                'Content-Type': 'multipart/form-data',
                            },
                            body: data,
                        },(json)=> {
                           // alert('upload perIdCard1 success');
                            for(var field in json) {
                               // alert('field=' + field + '\r\n' + json[field]);
                            }
                            var su=null
                            if(perIdCard1_img.indexOf('.jpg')!=-1)
                                su='jpg';
                            else if(perIdCard1_img.indexOf('.png')!=-1)
                                su='png';
                           // alert('suffix=' + su);
                            return Proxy.postes({
                                url:Config.server+'/svr/request',
                                headers: {
                                    'Authorization': "Bearer " + accessToken,
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
                            }).then((json)=>{
                                if(json.re==1)
                                {
                                    perIdAttachId1=json.data;
                                    //alert('perIdAttachId1=' + perIdAttachId1);
                                    var su=null;
                                    if(perIdCard2_img.indexOf('.jpg')!=-1)
                                        su='jpg';
                                    else if(perIdCard2_img.indexOf('.png')!=-1)
                                        su='png';

                                    var data = new FormData();
                                    data.append('file', {uri:perIdCard2_img, name: 'perIdCard2_img', type: 'multipart/form-data'});

                                    Proxy.post({
                                        url: Config.server + '/svr/request?request=uploadPhoto' +
                                        '&imageType=' + imageType + '&suffix=' + suffix +
                                        '&filename=' + 'perIdAttachId2' + '&personId=' + personId,
                                        headers: {
                                            'Authorization': "Bearer " + accessToken,
                                            'Content-Type': 'multipart/form-data',
                                        },
                                        body: data,
                                    },(json)=> {
                                        if(json.re==1) {
                                           // alert('upload perIdCard2 success');
                                            for(var field in json) {
                                               // alert('field=' + field + '\r\n' + json[field]);
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
                                                        imageType:'perIdCard',
                                                        filename:'perIdAttachId2',
                                                        suffix:su,
                                                        docType:'I1' ,
                                                        personId:personId
                                                    }
                                                }
                                            }).then((json)=>{

                                                if(json.re==1){
                                                    perIdAttachId2=json.data;
                                                    return Proxy.postes({
                                                        url:Config.server+'/svr/request',
                                                        headers: {
                                                            'Authorization': "Bearer " + accessToken,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: {
                                                            request:'createInsuranceInfoPersonInfo',
                                                            info: {
                                                                perIdAttachId1:perIdAttachId1,
                                                                perIdAttachId2:perIdAttachId2,
                                                                personId:personId
                                                            }
                                                        }
                                                    });
                                                }
                                            }).then((json)=>{
                                               // alert('insuranceInfoPersonInfo create successfully');

                                                if(json.re==1) {
                                                    return Proxy.postes({
                                                        url:Config.server+'/svr/request',
                                                        headers: {
                                                            'Authorization': "Bearer " + accessToken,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: {
                                                            request:'getInfoPersonInfoByPersonId',
                                                            info: {
                                                                personId:personId
                                                            }
                                                        }
                                                    });

                                                }
                                            }).then((json)=>{
                                                if(json.re==1) {
                                                    person=json.data;
                                                    this.selectInsuranceder(person);
                                                    this.setState({doingUploading:false,insuranceder:insuranceder});
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

                    }else{}

                }).then(function(res) {

                }).catch((e)=>{
                    console.log('e='+e);
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
                             if(this.state.doingUploading==false)
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
                 this.setState({relativePersons:this.state.relativePersons,insuranceder:rowData});   }}>
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
            this.selectInsuranceder(this.state.insuranceder);
        }
        return row;
    }

    fetchData(personId){
        this.setState({doingFetch:true});
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

                    var insuranceder= null;
                    json.data.map(function (person,i) {

                        //当新增完被保险人后,自动刷新被保险人列表并选中
                        if(personId!==undefined&&personId!==null&&person.personId==personId)
                        {
                            person.checked=true;
                            insuranceder = person;
                        }
                    });
                    var  relativePersons=json.data;
                    this.setState({insuranceder: insuranceder, relativePersons: relativePersons,doingFetch:false});
                }
            }else{
                this.state.doingFetch = false;
            }

        }, (err) =>{
        });
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            setLifeInsuranceder:props.setLifeInsuranceder,
            relativePersons:null,
            selectedTab:0,
            accessToken: accessToken,
            insuranceder:{perTypeCode:'I',perName:null,relationShip:null},
            relationShip:null,
            perName:'',
            perIdCard1_img:null,
            perIdCard2_img:null,
            doingFetch:false,
            doingUploading:false,
            relationShipButtons:['取消','父母','子女','配偶','本人'],
        };
    }


    render(){

        var listView=null;

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;
        var relationShipButtons=['取消','父母','子女','配偶','本人'];

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
            if(this.state.doingFetch==false)
                this.fetchData();
        }


        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                    <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',
                flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)',height:parseInt(height*54/667),}}>
                    <TouchableOpacity style={{flex:1}}
                                      onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff"/>
                    </TouchableOpacity>

                    <View style={{flex:3,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:17,color:'#fff',marginLeft:10}}>
                            选择被保险人
                        </Text>
                    </View>

                    {this.getPlaceHolder(this.state.selectedTab)}

                </View>

                <ScrollableTabView style={{flex:1,padding:0,margin:0}} onChangeTab={(data)=>{
                        var tabIndex=data.i;
                        this.state.selectedTab=tabIndex;
                        this.setState({selectedTab:tabIndex});
                    }} renderTabBar={() =><FacebookTabBar/>}>
                    <View tabLabel='已有被保险人' style={{flex:1}}>
                        {/*body*/}
                        <View style={{padding:20,height:height-height*250/736}}>
                            {listView}
                        </View>

                    </View>

                    <View tabLabel='新建被保险人' style={{flex:1}}>

                        {/*输入被保险人姓名*/}
                        <View style={{flexDirection:'row', height:height*50/736,borderBottomWidth:1,borderBottomColor:'#aaa',margin:5}}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:15}}>
                                <Text style={{fontSize:14,flex:3,textAlign:'left',color:'#343434'}}>姓名:</Text>
                            </View>
                            <View style={{flex:8,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{height: 50,fontSize:13,color:'#343434'}}
                                    onChangeText={(name) =>
                                    {
                                       this.state.perName = name;
                                       this.setState({perName:name,});
                                    }}
                                    value={this.perName}
                                    placeholder='请填入寿险被保险人姓名'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        {/*与被保险人关系*/}
                        <View style={{flexDirection:'row', height:height*50/736,borderBottomWidth:1,borderBottomColor:'#aaa',margin:5}}>

                            <View style={{flex:4,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:15}}>
                                <Text style={{fontSize:14,flex:3,textAlign:'left',color:'#343434'}}>与保险人关系:</Text>
                            </View>
                            <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                {
                                    this.state.relationShip==undefined||this.state.relationShip==null?
                                        <Text style={{fontSize:13,color:"#aaa"}}>选择与保险人关系</Text>:
                                        <Text style={{fontSize:13}}>{this.state.relationShip}</Text>

                                }
                            </View>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity style={{justifyContent:'center'}}
                                                  onPress={()=>{ this.show('actionSheet1'); }}>
                                    <Icon name="chevron-circle-down" color="#aaa" size={30}></Icon>
                                    <ActionSheet
                                        ref={(o) => {
                                        this.actionSheet1 = o;
                                    }}
                                        title="请选择与被保险人关系"
                                        options={relationShipButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                        (data)=>{ this._handlePress1(data); }
                                    }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{height:20}}>

                        </View>

                        {/*身份证正面*/}
                        {
                            this.state.perIdCard1_img==null?
                                <TouchableOpacity style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:height*150/736,backgroundColor:'rgba(200,200,200,0.3)',
                                    borderRadius:8,position:'relative',margin:20}}
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
                                           style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:height*150/736,
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
                                <TouchableOpacity style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:height*150/736,backgroundColor:'rgba(200,200,200,0.3)',
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
                                           style={{width:width*2/3,marginLeft:width/6,marginTop:10,height:height*150/736,
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

                {/*loading模态框:拉取关联人*/}
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
                                    拉取关联人...
                                </Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>


                {/*loading模态框:新建关联人上传照片*/}
                <Modal animationType={"fade"} transparent={true} visible={this.state.doingUploading}>

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
                                    拉取关联人...
                                </Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>


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
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    loader: {
        marginTop: 10
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
)(AppendLifeInsuranceder);

