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
import DateFilter from '../../filter/DateFilter';

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

    constructor(props)
    {
        super(props);
        const {accessToken}=this.props;
        this.state={
            carInfo:props.carInfo,
            accessToken:accessToken,
        }
    }

    render(){

        var props=this.props;
        var state=this.state;

        var {carInfo}=this.state;

        return (
            <View style={{flex:1}}>

                <View style={{padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',
                    height:parseInt(height*54/667),backgroundColor:'rgba(17, 17, 17, 0.6)'}}>
                    <TouchableOpacity style={{width:50,justifyContent:'center'}}
                                      onPress={()=>{
                                    this.close();
                            }}>
                            <Icon name="angle-down" size={35} color="#fff"/>
                    </TouchableOpacity>

                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#fff'}}>
                            填写车辆信息
                        </Text>
                    </View>

                    <TouchableOpacity style={{width:60,marginRight:5,padding:6,flexDirection:'row',justifyContent:'center',
                        backgroundColor:'#ef473a',borderRadius:6}}
                                      onPress={()=>{
                                          if(this.props.postCarInfo)
                                          {
                                              this.props.postCarInfo(carInfo)
                                          }else{
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
                                          }

                            }}>
                        <Text style={{color:'#fff',fontSize:13}}>保存</Text>
                    </TouchableOpacity>
                </View>


                <View style={{flex:1,backgroundColor:'#eee'}}>

                    <View style={{padding:0}}>

                        {/*厂牌型号*/}
                        <View style={{flexDirection:'row',paddingTop:2,paddingBottom:2,alignItems:'center',paddingHorizontal:10,backgroundColor:'#fff'}}>

                            <View style={{width:80,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>厂牌型号:</Text>
                            </View>

                            <View style={{width:120,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:'transparent'}}>
                                <TextInput
                                    style={{borderBottomWidth:0,fontSize:14,flex:1,color:'#343434'}}
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
                        <View style={{flexDirection:'row',paddingTop:2,paddingBottom:2,alignItems:'center',paddingHorizontal:10,backgroundColor:'#fff',marginTop:1}}>

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
                                        if(engineNum=='')
                                        {
                                             this.setState({carInfo:  Object.assign(carInfo,{engineNum:engineNum,engineNum_error:false})});
                                        }
                                        else if(reg.exec(engineNum)!=null)
                                        {
                                            this.setState({carInfo:  Object.assign(carInfo,{engineNum:engineNum,engineNum_error:false})});
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
                        <View style={{flexDirection:'row',paddingTop:2,paddingBottom:2,alignItems:'center',paddingHorizontal:10,backgroundColor:'#fff',marginTop:1}}>

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
                                            this.setState({carInfo:  Object.assign(carInfo,{frameNum:frameNum,frameNum_error:false})});
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
                        <View style={{flexDirection:'row',paddingTop:8,paddingBottom:8,alignItems:'center',paddingHorizontal:10,
                        backgroundColor:'#fff',marginTop:1}}>

                            <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>注册日期:</Text>
                            </View>


                            <View style={{flex:3,justifyContent:'center',alignItems:'center',marginRight:20}}>
                                {
                                    carInfo.firstRegisterDate!==undefined&&carInfo.firstRegisterDate!==null?
                                        <Text>{DateFilter.filter(carInfo.firstRegisterDate,'yyyy-mm-dd')}</Text>:null
                                }
                            </View>

                            <View style={{flex:2,justifyContent:'center',alignItems:'center',
                                padding:0,marginLeft:30,paddingHorizontal:12}}>

                                <DatePicker
                                    style={{width:100,marginLeft:0,borderRadius:6,borderWidth:0,}}
                                    customStyles={{
                                        placeholderText:{color:'#fff',fontSize:12},
                                        dateInput:{height:24},
                                        dateTouchBody:{marginLeft:10,marginRight:10,height:22,borderWidth:0,backgroundColor:'#f79916'}
                                    }}
                                    mode="date"
                                    placeholder="注册日期"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    showIcon={false}
                                    onDateChange={(date) => {
                                         this.setState({carInfo:Object.assign(carInfo,{firstRegisterDate:date})});
                                    }}
                                />

                            </View>

                        </View>

                        {/*发证日期*/}
                        <View style={{flexDirection:'row',paddingTop:8,paddingBottom:8,alignItems:'center',paddingHorizontal:10,backgroundColor:'#fff',marginTop:1}}>

                            <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:14,color:'#343434'}}>发证日期:</Text>
                            </View>


                            <View style={{flex:3,justifyContent:'center',alignItems:'center',marginRight:20}}>
                                {
                                    carInfo.issueDate!==undefined&&carInfo.issueDate!==null?
                                        <Text>{DateFilter.filter(carInfo.issueDate,'yyyy-mm-dd')}</Text>:null
                                }
                            </View>

                            <View style={{flex:2,justifyContent:'center',alignItems:'center',
                            padding:0,marginLeft:30,paddingHorizontal:12}}>

                                <DatePicker
                                    style={{width:100,marginLeft:0,borderRadius:6,borderWidth:0,}}
                                    customStyles={{
                                        placeholderText:{color:'#fff',fontSize:12},
                                        dateInput:{height:24},
                                        dateTouchBody:{marginLeft:10,marginRight:10,height:22,borderWidth:0,backgroundColor:'#f79916'}
                                    }}
                                    mode="date"
                                    placeholder="发证日期"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
                                    onDateChange={(date) => {
                                         this.setState({carInfo:Object.assign(carInfo,{issueDate:date})});
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
