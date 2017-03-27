/**
 * Created by danding on 17/3/27.
 */
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
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import DateFilter from '../../filter/DateFilter';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
import CarInfoEdit from '../../components/modal/CarInfoEdit';



class CarInfoDetail extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }



    setLifeInsurer(insurer){
        var lifeInsurer = insurer;
        this.setState({insurer:lifeInsurer});


    }

    setLifeInsuranceder(insuranceder){
        var lifeInsuranceder = insuranceder;
        this.setState({insuranceder:lifeInsuranceder});


    }

    setLifeBenefiter(benefiter){

        var lifeBenefiter = benefiter;
        if(lifeBenefiter.perName!=='法定'){
            this.setState({benefiter:lifeBenefiter,isLegalBenefiter:0});
        }
        else{

            this.setState({benefiter:lifeBenefiter,isLegalBenefiter:1});
        }

    }


    constructor(props)
    {
        super(props);
        const { accessToken } = props;
        this.state = {
            accessToken: accessToken,
            carInfo:props.carInfo,
            modalVisible:false
        };
    }

    render(){

        var props=this.props;
        var state=this.state;
        var {carInfo}=this.props;


        return (

            <View style={{flex:1}}>
                <View style={[{flex:1,padding: 10,paddingTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                    <TouchableOpacity onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        车辆详情
                    </Text>
                </View>

                {/*body*/}
                <Image resizeMode="stretch" source={require('../../img/login_background@2x.png')} style={{flex:20,width:width}}>
                    <View style={{flex:10,padding:10}}>

                        {/*车牌*/}
                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:10}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:15,flex:3,textAlign:'left',}}>车牌:</Text>
                            </View>


                            <View style={{flex:4,padding:5,justifyContent:'center'}}>
                                <Text style={{fontSize:15}}>{carInfo.carNum}</Text>
                            </View>
                        </View>

                        {/*车主姓名*/}
                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:10}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:15,flex:3,textAlign:'left',}}>车主姓名:</Text>
                            </View>


                            <View style={{flex:4,padding:5,justifyContent:'center'}}>
                                <Text style={{fontSize:15}}>{carInfo.ownerName}</Text>
                            </View>
                        </View>

                        {/*注册日期*/}
                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:10}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:15,flex:3,textAlign:'left',}}>注册日期:</Text>
                            </View>


                            <View style={{flex:4,padding:5,justifyContent:'center'}}>
                                <Text style={{fontSize:15}}>
                                    {
                                        carInfo.issueDate!==undefined&&carInfo.issueDate!==null?
                                            DateFilter.filter(carInfo.issueDate,'yyyy-mm-dd'):null
                                    }
                                </Text>
                            </View>
                        </View>

                        {/*厂牌型号*/}
                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:10}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:15,flex:3,textAlign:'left',}}>厂牌型号:</Text>
                            </View>

                            <View style={{flex:4,padding:5,justifyContent:'center'}}>
                                <Text style={{fontSize:15}}>{carInfo.factoryNum}</Text>
                            </View>
                        </View>

                        {/*发动机号*/}
                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:10}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:15,flex:3,textAlign:'left',}}>发动机号:</Text>
                            </View>

                            <View style={{flex:4,padding:5,justifyContent:'center'}}>
                                <Text style={{fontSize:15}}>{carInfo.engineNum}</Text>
                            </View>
                        </View>

                        {/*车架号*/}
                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:10}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:15,flex:3,textAlign:'left',}}>车架号:</Text>
                            </View>

                            <View style={{flex:4,padding:5,justifyContent:'center'}}>
                                <Text style={{fontSize:15}}>{carInfo.frameNum}</Text>
                            </View>
                        </View>


                    </View>

                    <TouchableOpacity style={{flex:1,width:width-60,marginLeft:30,marginBottom:30,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                  backgroundColor:'rgba(17, 17, 17, 0.6)',borderRadius:8}}
                                      onPress={()=>{
                                          this.setState({modalVisible:!state.modalVisible});
                                      }}>
                        <View>
                            <Text style={{fontSize:15,color:'#fff'}}>编辑车辆信息</Text>
                        </View>

                    </TouchableOpacity>

                </Image>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.");
                    }}
                >

                    <CarInfoEdit

                        carInfo={carInfo}
                        onClose={()=>{
                            this.setState({modalVisible:!this.state.modalVisible});
                        }}

                        onPopBack={
                            ()=>{
                                this.setState({modalVisible:!this.state.modalVisible});
                                this.goBack();
                            }
                        }

                        bindNewCar={
                            (carNum,cb)=>{
                                   this.bindNewCar(carNum,cb);
                            }
                        }
                        navigate2NewCarCreate={
                            (carNum,city)=>{this.navigate2NewCarCreate(carNum,city);}
                        }
                        onRefresh={()=>{
                            this.refresh();
                        }}
                        accessToken={this.props.accessToken}
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
        height: 45,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(CarInfoDetail);

