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
    TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
var {height, width} = Dimensions.get('window');
import {
    postCarInfo
} from '../../action/CarActions';


class CarInfoEdit extends Component{

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
        //TODO:关闭时同步数据

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
        this.setState({carNumPrefixModal: false,city:city,carNum:prefix});
    }


    constructor(props)
    {
        super(props);
        const {accessToken}=this.props;
        this.state={
            carInfo:props.carInfo,
            accessToken:accessToken
        }
    }

    render(){

        var props=this.props;
        var state=this.state;

        var {carInfo}=this.state;

        return (
            <View style={{flex:1}}>


                <View style={[{backgroundColor:'#fff',padding: 4,paddingHorizontal:10,height:40,marginTop:20,justifyContent: 'center',
                        alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <TouchableOpacity style={{width:50,justifyContent:'center'}}
                                      onPress={()=>{
                                    this.close();
                            }}>
                            <Icon name="angle-left" size={35} color="#222"/>
                    </TouchableOpacity>

                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#222'}}>
                            填写车辆信息
                        </Text>
                    </View>

                    <TouchableOpacity style={{width:60,marginRight:5,padding:6,flexDirection:'row',justifyContent:'center',
                        backgroundColor:'#737373',borderRadius:6}}
                                      onPress={()=>{
                                    this.props.dispatch(postCarInfo({carInfo:carInfo})).then((json)=>{
                                        if(json.re==1)
                                        {

                                              Alert.alert('信息','车辆信息保存成功',[{text:'OK',onPress:()=>{
                                                if(this.props.onPopBack!==undefined&&this.props.onPopBack!==null)
                                                       this.props.onPopBack();
                                            }}])
                                        }
                                    }).catch((e)=>{
                                          Alert.alert(
                                            '错误',
                                            e
                                        );
                                    })
                            }}>
                        <Text style={{color:'#fff',fontSize:13}}>保存</Text>
                    </TouchableOpacity>
                </View>


                <View style={{flex:1,backgroundColor:'#eee'}}>


                    <View style={{padding:0}}>


                        {/*厂牌型号*/}
                        <View style={[styles.row,{alignItems:'center',height:35,paddingHorizontal:10,backgroundColor:'#fff'}]}>

                            <View style={{width:80,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>厂牌型号:</Text>
                            </View>

                            <View style={{width:120,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:'transparent'}}>
                                <TextInput
                                    style={{borderBottomWidth:0,fontSize:13,flex:1,color:'#343434'}}
                                    editable = {true}
                                    height={40}
                                    onChangeText={
                                    (factoryNum)=>{
                                        this.setState({carInfo:  Object.assign(carInfo,{factoryNum:factoryNum})});
                                    }
                                }
                                    value={carInfo.factoryNum}
                                    placeholder='请输入厂牌型号'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="characters"
                                />
                            </View>
                            <View style={{flex:2}}></View>
                        </View>

                        {/*发动机号*/}
                        <View style={[styles.row,{alignItems:'center',height:35,paddingHorizontal:10,backgroundColor:'#fff',marginTop:1}]}>

                            <View style={{width:80,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>发动机号:</Text>
                            </View>

                            <View style={{width:120,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:'transparent'}}>
                                <TextInput
                                    style={{borderBottomWidth:0,fontSize:13,flex:1,color:'#343434'}}
                                    editable = {true}
                                    height={40}
                                    onChangeText={
                                    (engineNum)=>{
                                        var reg=/[\w|\d]{6}/;
                                        if(reg.exec(engineNum)!=null)
                                        {
                                            this.setState({carInfo:  Object.assign(carInfo,{engineNum:engineNum})});
                                        }else{
                                            //输入格式错误
                                            this.setState({carInfo:  Object.assign(carInfo,{engineNum:engineNum,engineNum_error:true})});
                                        }

                                    }
                                }
                                    value={carInfo.engineNum}
                                    placeholder='请输入发动机号'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="characters"
                                />
                            </View>

                            <View style={{flex:2,alignItems:'center'}}>
                                {
                                    state.carInfo.engineNum_error==true?
                                        <Text style={{fontSize:12,color:'#ff2311'}}>发动机号至少6位</Text>:null
                                }
                            </View>
                        </View>

                        {/*车架号*/}
                        <View style={[styles.row,{alignItems:'center',height:35,paddingHorizontal:10,backgroundColor:'#fff',marginTop:1}]}>

                            <View style={{width:80,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>车架号:</Text>
                            </View>

                            <View style={{width:130,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:'transparent'}}>
                                <TextInput
                                    style={{borderBottomWidth:0,fontSize:13,flex:1,color:'#343434'}}
                                    editable = {true}
                                    height={40}
                                    onChangeText={
                                    (frameNum)=>{
                                        var reg=/^\w{17}$/;
                                        if(reg.exec(frameNum)!=null)
                                        {
                                            this.setState({carInfo:  Object.assign(carInfo,{frameNum:frameNum})});
                                        }else{
                                            //输入格式错误
                                            this.setState({carInfo:  Object.assign(carInfo,{frameNum:frameNum,frameNum_error:true})});
                                        }
                                    }
                                }
                                    value={carInfo.frameNum}
                                    placeholder='请输入车架号'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="characters"
                                />
                            </View>

                            <View style={{flex:2,alignItems:'center'}}>
                                {
                                    state.carInfo.frameNum_error==true?
                                        <Text style={{fontSize:12,color:'#ff2311'}}>17位车架号</Text>:null
                                }
                            </View>
                        </View>


                        {/*注册日期*/}
                        <View style={[styles.row,{alignItems:'center',height:35,paddingHorizontal:10,backgroundColor:'#fff',marginTop:1}]}>

                            <View style={{width:80,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>注册日期:</Text>
                            </View>

                            <View style={{flex:2,flexDirection:'row',marginLeft:2}}>
                                <DatePicker
                                    style={{width:220,justifyContent:'flex-start'}}
                                    date={carInfo.firstRegisterDate}
                                    mode="datetime"
                                    placeholder="选择您的注册日期"
                                    format="YYYY-MM-DD"
                                    minDate="2016-05-01"
                                    maxDate="2016-12-30"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    iconSource={require('../../img/google_calendar.png')}
                                    onDateChange={(date) => {
                                        this.setState({carInfo:  Object.assign(carInfo,{firstRegisterDate:date})});
                                    }}
                                />
                            </View>
                        </View>

                        {/*发证日期*/}
                        <View style={[styles.row,{alignItems:'center',height:35,paddingHorizontal:10,backgroundColor:'#fff',marginTop:1}]}>

                            <View style={{width:80,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>发证日期:</Text>
                            </View>

                            <View style={{flex:2,flexDirection:'row',marginLeft:2}}>
                                <DatePicker
                                    style={{width:220}}
                                    date={carInfo.issueDate}
                                    mode="datetime"
                                    placeholder="选择您的发证日期"
                                    format="YYYY-MM-DD"
                                    minDate="2016-05-01"
                                    maxDate="2016-12-30"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    iconSource={require('../../img/google_calendar.png')}
                                    onDateChange={(date) => {
                                        this.setState({carInfo:  Object.assign(carInfo,{issueDate:date})});
                                    }}
                                />
                            </View>
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


module.exports = CarInfoEdit;
