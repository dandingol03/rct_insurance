/**
 * Created by dingyiming on 2017/2/16.
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
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';
import ActionSheet from 'react-native-actionsheet';
import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import CarOrders from './CarOrders';
import{
    uploadPhoto,
} from '../../action/CarActions';

var ImagePicker = require('react-native-image-picker');



class AppendCarInsuranceder extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2CarOrders()
    {
        const {navigator} =this.props;
        this.setState({doingUploading:false});

        if(navigator) {
            navigator.push({
                name: 'car_orders',
                component: CarOrders,
                params: {
                }
            })
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
        var {carInfo,products,companys}=this.props;

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
                        //alert('personId=' + personId);
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
                           //  for(var field in json) {
                           //      alert('field=' + field + '\r\n' + json[field]);
                           //  }
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
                                  //  alert('perIdAttachId1=' + perIdAttachId1);
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
                                           //  for(var field in json) {
                                           //      alert('field=' + field + '\r\n' + json[field]);
                                           //  }
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
                                              //  alert('insuranceInfoPersonInfo create successfully');
                                                console.log('getInfoPersonInfoByPersonId=');

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
                                            })
                                                .then((json)=>{
                                                    console.log('bindCarInsurancederByPerName=');
                                                if(json.re==1) {

                                                    person=json.data;
                                                    this.setState({insuranceder:person,doingUploading:true});
                                                    //自动绑定该被保险人为亲属
                                                    Proxy.postes({
                                                        url:Config.server+'/svr/request',
                                                        headers: {
                                                            'Authorization': "Bearer " + this.state.accessToken,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: {
                                                            request:'bindCarInsurancederByPerName',
                                                            info: {
                                                                perName: this.state.perName,
                                                                relation: this.state.relationShip
                                                            }
                                                        }
                                                    }).then((json)=>{
                                                        console.log('generateCarInsuranceOrder=');
                                                        console.log(json.re);
                                                        if (json.re == 1) {
                                                            Alert.alert(
                                                                '提示',
                                                                '被保险人创建成功',
                                                                [
                                                                    {text: '确定', onPress: () => {

                                                                        Proxy.postes({
                                                                            url:Config.server+'/svr/request',
                                                                            headers: {
                                                                                'Authorization': "Bearer " + this.state.accessToken,
                                                                                'Content-Type': 'application/json'
                                                                            },
                                                                            body: {
                                                                                request:'generateCarInsuranceOrder',
                                                                                info: {
                                                                                    carId: carInfo.carId,
                                                                                    products:products,
                                                                                    companys:companys,
                                                                                    insurancederId:personId
                                                                                }
                                                                            }
                                                                        }).then((json)=>{
                                                                            //alert('generateCarInsuranceOrder=');
                                                                            var orderId=json.data;
                                                                            if (orderId !== undefined && orderId !== null) {

                                                                                Alert.alert(
                                                                                    '信息',
                                                                                    '订单已创建,请等待报价',
                                                                                    [
                                                                                        {text: 'OK', onPress: () =>this.navigate2CarOrders()},
                                                                                    ]
                                                                                )

                                                                            }
                                                                        });

                                                                    }
                                                                    },
                                                                ]
                                                            )

                                                        } else {

                                                            Alert.alert(
                                                                '提示',
                                                                '被保险人创建失败',
                                                                [
                                                                    {text: '确定', onPress: () => console.log('OK Pressed!')},
                                                                ]
                                                            )

                                                        }
                                                    });





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

                }).then((json)=>{

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



    applyCarInsurance()
    {
        //已有被保险人
        if(this.state.selectedTab==0)
        {
            if(this.state.insuranceder!==undefined&&this.state.insuranceder!==null&&
                this.state.insuranceder.personId!==null&&this.state.insuranceder.personId!==undefined)
            {
                var {carInfo,products,companys}=this.props;
                Proxy.postes({
                    url:Config.server+'/svr/request',
                    headers: {
                        'Authorization': "Bearer " + this.state.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request:'validateCarFree',
                        info: {
                            carId: carInfo.carId
                        }
                    }
                }).then(function (json) {
                    if(json.re==1) {
                        if(json.data==true)
                        {
                            Proxy.postes({
                                url:Config.server+'/svr/request',
                                headers: {
                                    'Authorization': "Bearer " + this.state.accessToken,
                                    'Content-Type': 'application/json'
                                },
                                body: {
                                    request:'generateCarInsuranceOrder',
                                    info: {
                                        carId: carInfo.carId,
                                        products:products,
                                        companys:companys,
                                        insurancederId:this.state.insuranceder.personId
                                    }
                                }
                            }).then(function (json) {
                                var orderId=json.data;
                                if (orderId !== undefined && orderId !== null) {


                                    Alert.alert(
                                        '信息',
                                        '订单已创建,请等待报价',
                                        [
                                            {text: 'OK', onPress: () =>this.navigate2CarOrders()},
                                        ]
                                    )

                                }
                            });
                        }
                    }
                }).catch(function (err) {
                    alert('error=\r\n'+err);
                });
            }else{
                Alert.alert(
                    '错误',
                    '请选择被保险人后再点击提交'
                );
            }
        }
        else{
            //新建被保险人,提交车险订单
            var reg = /\d|\w/;
            var flag = false;
            if (this.state.perName == undefined || this.state.perName == null
                || this.state.perName == '' || reg.exec(this.state.perName) !== null) {
                flag = true;
            }
            if (flag) {

                Alert.alert(
                    '提示',
                    '被保险人姓名输写不对,请重新输入后提交',
                    [
                        {text: '确定', onPress: () => console.log('Cancel Pressed!')},
                    ]
                )

            } else {
                if (this.state.relationShip !== undefined && this.state.relationShip !== null) {
                    var {carInfo,products,companys}=this.props;
                    Proxy.postes({
                        url:Config.server+'/svr/request',
                        headers: {
                            'Authorization': "Bearer " + this.state.accessToken,
                            'Content-Type': 'application/json'
                        },
                        body: {
                            request:'validateCarFree',
                            info: {
                                carId: carInfo.carId
                            }
                        }
                    }).then((json)=>{
                        if(json.re==1){
                            if (json.data == true) {

                                this.uploadNew();

                            } else {
                                Alert.alert(
                                    '提示',
                                    '您所选的车已在订单状态,\r\n不能重复提交订单',
                                    [
                                        {text: '确定', onPress: () => console.log('OK Pressed!')},
                                    ]
                                )
                            }
                        }
                    });
                } else {
                    Alert.alert(
                        '提示',
                        '被选择亲属关系后再点击提交',
                        [
                            {text: '确定', onPress: () => console.log('OK Pressed!')},
                        ]
                    )

                }

            }
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
                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',
                        padding:2,paddingLeft:12}}>
                    <View style={{flex:1}}>
                        <Text style={{color:'#000',fontSize:14}}>
                            {rowData.perName}
                        </Text>
                    </View>

                    {
                        rowData.abundant==true?
                            <View style={{paddingLeft:0,flex:3,flexDirection:'row'}}>
                                <Text style={{color:'rgba(220, 11, 35, 0.6)',fontSize:14,alignItems:'center'}}>
                                    身份证:
                                </Text>
                                <Text style={{color:'#222',fontSize:12,alignItems:'center',marginLeft:10}}>
                                    {rowData.perIdCard}
                                </Text>
                            </View>:
                            null

                    }
                </View>
                <View style={{width:40,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                    {
                        rowData.checked==true?
                            <Icon name="check-square-o" size={24} color="#00c9ff"/>:
                            <Icon name="square-o" size={24} color="#888"/>
                    }
                </View>
            </TouchableOpacity>
        );



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

                    var insuranceder= this.state.insuranceder;
                    //对于人员来说凡是重复的人员都显示身份证号
                    var abundant={};
                    json.data.map(function (person,i) {

                        if(abundant[person.perName]!==undefined&&abundant[person.perName]!==null)
                            abundant[person.perName].count++;
                        else{
                            abundant[person.perName]={
                                count:1
                            };
                        }
                        person.abundant=false;

                        //当新增完被保险人后,自动刷新被保险人列表并选中
                        if(personId!==undefined&&personId!==null&&person.personId==personId)
                        {
                            person.checked=true;
                            insuranceder = person;
                        }
                    });

                    //迭代重复人员
                    json.data.map(function (person,i) {
                        if(abundant[person.perName].count>1)
                            person.abundant=true;
                    })

                    var relativePersons=json.data;
                    this.setState({insuranceder: insuranceder, relativePersons: relativePersons,doingFetch:false});
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
            companys:props.companys,
            products:props.products,
            relativePersons:null,

            insuranceder:{perTypeCode:'I',perName:null,relationShip:null},
            relationShip:null,
            perName:'',
            perIdCard1_img:null,
            perIdCard2_img:null,

            selectedTab:0,
            accessToken: accessToken,
            relationShipButtons:['取消','所有人','管理人','使用人'],

            doingFetch:false,
            doingUploading:false,

        };
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
                                          this.applyCarInsurance();
                                      }}>
                        <Icon name="hand-pointer-o" size={18} color="#fff"></Icon>
                        <Text style={{color:'#fff'}}>保存</Text>
                    </TouchableOpacity>);
                break;
        }

    }

    render(){

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;
        var relationShipButtons=['取消','所有人','管理人','使用人'];

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
            if(this.state.doingFetch==false)
               this.fetchData();
        }

        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                <View style={[{padding: 10,paddingTop:20,flexDirection:'row',height:54,backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                    <TouchableOpacity style={{width:20,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',
                        padding:10,paddingLeft:0,paddingRight:0}}
                                      onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff"/>
                    </TouchableOpacity>

                    <View style={{flex:3,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                        <Text style={{fontSize:17,color:'#fff',marginLeft:5}}>
                            选择被保险人
                        </Text>
                    </View>


                    {this.getPlaceHolder(this.state.selectedTab)}


                </View>

                <ScrollableTabView style={{flex:1,padding:0,margin:0}} onChangeTab={(data)=>{
                        var tabIndex=data.i;
                        this.setState({selectedTab:tabIndex});
                        //this.state.selectedTab=tabIndex;
                    }} renderTabBar={() => <FacebookTabBar/>}
                >
                    <View tabLabel='已有被保险人' tabIcon="user" style={{flex:1}}>
                        {/*body*/}
                        <View style={{padding:20,paddingLeft:0,paddingRight:0,height:height-height*234/736}}>
                            {listView}
                        </View>

                        <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/6,marginLeft:width/4,
                                    padding:8,borderRadius:10,justifyContent:'center'}]}
                                          onPress={()=>{
                                        this.applyCarInsurance();
                                      }}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:15}}>提交车险意向</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View tabLabel='新建被保险人' tabIcon="user-plus" style={{flex:1}}>

                        {/*输入被保险人姓名*/}
                        <View style={{flexDirection:'row', height:height*50/736,borderBottomWidth:1,borderBottomColor:'#aaa',margin:5}}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:15}}>
                                <Text style={{fontSize:14,flex:3,textAlign:'left',color:'#343434'}}>姓名:</Text>
                            </View>

                            <View style={{flex:8,padding:5,justifyContent:'center'}}>
                                <TextInput
                                    style={{flex:1,height: 35,paddingLeft:10,paddingRight:10,paddingTop:2,
                                            paddingBottom:2,fontSize:13,alignItems:'center',flexDirection:'row'}}
                                    onChangeText={(perName) => {
                                      this.state.insuranceder.perName=perName;
                                      this.setState({insuranceder:this.state.insuranceder,perName:perName});
                                    }}
                                    value={this.state.insuranceder.perName}
                                    placeholder='输入被保险人姓名'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        {/*被保险人与车辆关系*/}
                        <View style={{flexDirection:'row', height:40,borderBottomWidth:1,borderBottomColor:'#aaa',margin:5}}>

                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:15}}>
                                <Text style={{fontSize:14,flex:3,textAlign:'left',color:'#343434'}}>与车辆关系:</Text>
                            </View>

                            <View style={{flex:5,padding:5,justifyContent:'center'}}>
                                {
                                    this.state.relationShip==undefined||this.state.relationShip==null?
                                        <Text style={{fontSize:13,color:"#aaa"}}>被保险人与车辆关系</Text>:
                                        <Text style={{marginLeft:20,fontSize:13,}}>{this.state.relationShip}</Text>

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
                                        title="请选择被保险人与车辆关系"
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
                                    上传照片...
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
)(AppendCarInsuranceder);

