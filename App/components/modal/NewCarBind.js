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
    TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import UpdateCarInfo from '../UpdateCarInfo';

var {height, width} = Dimensions.get('window');
import AppendCarNumPrefixModal from './AppendCarNumPrefixModal';
var Proxy = require('../../proxy/Proxy');
var Config = require('../../../config');

class NewCarBind extends Component{

    goBack(){
        const {navigator } =this.props;
        if(navigator){
            navigator.pop();
        }
    }
    closeModal(){
        this.props.onClose();
    }

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
        //TODO:关闭时同步数据

    }

    appendCarNumPrefixByCity(val){
        this.setState({carNumPrefixModal: val});
    }


    getCarNumPrefixByCity(city)
    {
        var carNum=null;
        switch (city) {
            case '济南':
                carNum='鲁A';
                break;
            case '青岛':
                carNum='鲁B';
                break;
            case '淄博':
                carNum='鲁C';
                break;
            case '枣庄':
                carNum='鲁D';
                break;
            case '东营':
                carNum='鲁E';
                break;
            case '烟台':
                carNum='鲁F';
                break;
            case '潍坊':
                carNum='鲁G';
                break;
            case '济宁':
                carNum='鲁H';
                break;
            case '泰安':
                carNum='鲁J';
                break;
            case '威海':
                carNum='鲁K';
                break;
            case '日照':
                carNum='鲁L';
                break;
            case '滨州':
                carNum='鲁M';
                break;
            case '德州':
                carNum='鲁N';
                break;
            case '聊城':
                carNum='鲁P';
                break;
            case '临沂':
                carNum='鲁Q';
                break;
            case '菏泽':
                carNum='鲁R';
                break;
            case '莱芜':
                carNum='鲁S';
                break;
            default:
                break;
        }
        return carNum;
    }


    cityConfirm(city){
        //TODO:filter the city prefix
        var prefix=this.getCarNumPrefixByCity(city);
        this.setState({carNumPrefixModal: false,city:city});
    }

    bindCar()
    {

        //TODO:validate carNum

        if(this.state.city!==undefined&&this.state.city!==null&&this.state.city!='')
        {
            if(this.state.carNum.length==7||this.state.carNum.length==8)
            {

                    //TODO:invoke a request
                    if(this.props.bindNewCar!==undefined&&this.props.bindNewCar!==null)
                    {
                        this.props.bindNewCar(this.state.carNum,function (re,data) {
                            switch (re)
                            {
                                case -1:
                                    Alert.alert(
                                        '信息',
                                        '数据库中未保存此车,是否要创建新车',
                                        [
                                            {
                                                text: 'OK', onPress: () => {

                                                if(this.props.navigate2NewCarCreate!==undefined&&this.props.navigate2NewCarCreate!==null)
                                                {
                                                    if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                                        this.props.onClose();
                                                    this.props.navigate2NewCarCreate(this.state.carNum,this.state.city);
                                                }
                                            }
                                            },
                                            {text: 'Cancel', onPress: () => console.log('OK Pressed!')},
                                        ]
                                    )
                                    break;

                                case -2:
                                    Alert.alert(
                                        '信息',
                                        '是否要创建新车',
                                        [
                                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                                            {text: 'OK', onPress: () =>{

                                                if(this.props.navigate2NewCarCreate!==undefined&&this.props.navigate2NewCarCreate!==null)
                                                {
                                                    if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                                        this.props.onClose();
                                                    this.props.navigate2NewCarCreate(this.state.carNum,this.state.city);
                                                }
                                            }},
                                        ]
                                    )
                                    break;
                                case -3:
                                    Alert.alert(
                                        '信息',
                                        '该车还在保险期内,是否要创建新车',
                                        [{text:'Cancel'},{text:'OK',onPress:()=>{
                                            if(this.props.navigate2NewCarCreate!==undefined&&this.props.navigate2NewCarCreate!==null)
                                            {
                                                if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                                    this.props.onClose();
                                                this.props.navigate2NewCarCreate(this.state.carNum,this.state.city);
                                            }
                                        }}]
                                    )
                                    break;
                                case 1:

                                    Alert.alert('信息','车辆绑定成功',[{text:'OK',onPress:()=>{
                                        if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                            this.props.onClose();
                                        if(this.props.onRefresh!==undefined&&this.props.onRefresh!==null)
                                            this.props.onRefresh();
                                    }}])
                                    break;
                                default:
                                    break;
                            }
                        }.bind(this));
                    }

                //}
            }else{
                Alert.alert(
                    '错误',
                    '您填入的车牌号位数不对,请重新填入车牌后点击绑定',
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed!')},
                    ]
                );
                return;
            }

        }else{
            Alert.alert(
                '错误',
                '请选择用车城市后再点击绑定',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed!')},
                ]
            )
        }

    }

    fetchData(){
        Proxy.post({
            url:'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceCarInfoByCustomerId'
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var data=res.data;
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({dataSource: ds.cloneWithRows(data)});
            }
        }, (err) =>{
        });
    }

    constructor(props)
    {
        super(props);
        const {accessToken}=this.props;
        this.state={
            city:null,
            carNum:null,
            carNumPrefixModal:false,
            accessToken:accessToken
        }
    }

    render(){

        return (
            <View style={{flex:1}}>
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:20,width:width}}>
                    <View style={{padding: 10,paddingTop:20,justifyContent: 'flex-start',alignItems:'center',flexDirection:'row',
                     height:parseInt(height*54/667),backgroundColor:'rgba(17,17,17,0.6)'}}>

                        <TouchableOpacity    onPress={()=>{
                            this.closeModal();
                        }}>
                            <View style={{paddingLeft:5,paddingBottom:10}}>
                            <Icon name="angle-left" size={40} color="fff"></Icon>
                            </View>

                        </TouchableOpacity>
                        <Text style={{fontSize:17,flex:3,paddingLeft:120,paddingBottom:10,stextAligin:'center',color:'#fff'}}>
                            绑定新车
                        </Text>
                    </View>

                <View style={{flex:2,padding:10}}>

                    <View style={{padding: 0,paddingTop:10,justifyContent: 'flex-start',alignItems:'center',flexDirection:'row',
                     height:parseInt(height*54/667),borderBottomWidth:1}}>

                        <View style={{marginRight:20,width:40,flexDirection:'row',alignItems:'center',paddingLeft:10}}>
                            <Icon name="address-card-o" size={24} color="#343434"/>
                        </View>

                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:16,color:'#343434',backgroundColor:'transparent'}}>车牌:</Text>
                        </View>

                        <View style={{flex:5,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}}>
                            <TextInput
                                style={{borderBottomWidth:0,fontSize:16,flex:1,color:'#343434'}}
                                editable = {true}
                                height={40}
                                onChangeText={
                                    (carNum)=>this.setState({carNum:carNum})
                                }
                                value={this.state.carNum}
                                placeholder='请输入将要创建的车牌号'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                                autoCapitalize="characters"

                            />
                        </View>

                    </View>

                    <View style={{padding: 0,paddingTop:10,justifyContent: 'flex-start',alignItems:'center',flexDirection:'row',
                     height:parseInt(height*54/667),borderBottomWidth:1}}>

                        <View style={{marginRight:20,width:40,flexDirection:'row',alignItems:'center',paddingLeft:10}}>
                            <Icon name="map-marker" size={24} color="#343434"/>
                        </View>

                        <View style={{flex:3,flexDirection:'row',alignItems:'center',backgroundColor:'transparent'}}>
                            <Text style={{fontSize:16,color:'#343434'}}>用车城市:</Text>
                        </View>

                        <View style={{flex:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'#343434',fontSize:16}}>{this.state.city}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}}>
                            <TouchableOpacity onPress={
                                    ()=>{
                                        this.appendCarNumPrefixByCity(true);
                                    }}>
                                <Icon name="angle-right" size={30} color="#343434"/>
                            </TouchableOpacity>
                        </View>

                    </View>


                    <View style={{padding:10,alignItems:'center',flexDirection:'row',
                     height:parseInt(height*54/667),justifyContent:'center',marginTop:20,borderBottomWitdth:1,borderBottomColor:'#fff'}}>
                        <View style={{width:width/3}}>
                            <Icon.Button name="hand-o-up" backgroundColor="#3b5998" onPress={
                            ()=>{
                                this.bindCar();
                            }
                        }>
                                <Text style={{fontFamily: 'Arial', fontSize: 15,textAlign:'center',color:'#fff'}}>
                                    绑定新车
                                </Text>
                            </Icon.Button>
                        </View>
                    </View>

                </View>

                <View style={{flex:2,padding:10}}>

                </View>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.carNumPrefixModal}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >

                    <AppendCarNumPrefixModal
                        onClose={()=>{
                            this.appendCarNumPrefixByCity(!this.state.carNumPrefixModal)
                        }}
                        onConfirm={(city)=>{
                            this.cityConfirm(city);
                        }}
                    />

                </Modal>

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
        borderBottomWidth:1,
        borderBottomColor:'#222'
    }
});


module.exports = NewCarBind;
