/**
 * Created by dingyiming on 2017/2/16.
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
import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import AppendCarInsuranceder from './AppendCarInsuranceder';

class CarCompany extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2AppendCarInsuranceder(companys)
    {
        const {navigator,carInfo,products} =this.props;

        if(navigator) {
            navigator.push({
                name: 'append_car_insuranceder',
                component: AppendCarInsuranceder,
                params: {
                    companys: companys,
                    carInfo:carInfo,
                    products:products
                }
            })
        }
    }

    companyConfirm()
    {
        var companys=[];
        this.state.companys.map(function (company, i) {
            if(company.checked==true)
                companys.push(company);
        });
        if(companys.length>0)
        {
            this.navigate2AppendCarInsuranceder(companys);
        }else{
            Alert.alert(
                '错误',
                '请先勾选公司再点击确认'
            );
        }
    }

    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',padding:4,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'};


        var row=
            <View>

                <TouchableOpacity style={lineStyle} onPress={()=>{
                    rowData.checked=!rowData.checked;
                    this.setState({companys:this.state.companys});
                }}>
                    <View style={{width:50,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:4}}>
                        {
                            rowData.checked==true?
                                <Icon name="check-square-o" size={30} color="#00c9ff"/>:
                                <Icon name="circle-o" size={30} color="#888"/>
                        }
                    </View>

                    <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:2}}>
                        <View>
                            <Text style={{color:'#000',fontSize:15}}>
                                {rowData.companyName}
                            </Text>
                        </View>
                    </View>

                </TouchableOpacity>


            </View>;

        return row;
    }



    fetchData(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'getInsuranceCompany'
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var arr=res.data;
                var companys=[];
                arr.map(function (company, i) {
                    if(company.isCar==1)
                    {
                        company.checked = false;
                        companys.push(company);
                    }
                });

                this.setState({companys:companys});
            }
        }, (err) =>{
        });
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            products:props.products,
            carInfo:props.carInfo,
            dataSource : null,
            accessToken: accessToken,
            companys:null
        };
    }


    render(){




        var listView=null;


        if(this.state.companys!==undefined&&this.state.companys!==null)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource=ds.cloneWithRows(this.state.companys);

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
                <View style={[{padding: 10,marginTop:20,flexDirection:'row',height:50},styles.card]}>
                    <TouchableOpacity style={{width:50,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}
                                      onPress={()=>{
                        this.goBack();
                    }}>
                        <Icon name="angle-left" size={40} color="#444"/>
                    </TouchableOpacity>

                    <View style={{flex:3,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:21,color:'#222',marginLeft:20}}>
                            车险公司选择
                        </Text>
                    </View>

                    <View style={{flex:1}}></View>

                </View>

                {/*body*/}
                <View style={{padding:15,height:height-220,paddingLeft:0,paddingRight:0}}>
                    {listView}
                </View>

                <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                        padding:10,borderRadius:10,justifyContent:'center'}]}
                                  onPress={()=>{
                                         this.companyConfirm();
                                      }}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#fff',fontSize:16}}>确认公司选择</Text>
                    </View>
                </TouchableOpacity>


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
)(CarCompany);

