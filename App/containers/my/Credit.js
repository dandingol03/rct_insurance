
import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    View,
    Alert,
    ListView,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import FacebookTabBar from '../../components/toolbar/FacebookTabBar';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import DateFilter from '../../filter/DateFilter';

class Credit extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    fetchData()
    {

        const {accessToken}=this.props;


        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceFeePayInfoHistory'
            }
        },(json)=> {
            if(json.re==1) {
                if(json.data!==undefined&&json.data!==null)
                {
                    this.setState({feePayInfo: json.data});
                }
            }

        }, (err) =>{
            Alert.alert(
                'error',
                err
            );
        });



    }

    //积分收入列表项
    incomeRender(rowData,sectionId,rowId) {
        var lineStyle=null;

        lineStyle={flex:1,backgroundColor:'transparent',paddingLeft:12,paddingRight:12}

        var row=

                <View style={lineStyle}>

                    <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'rgba(210,210,210,0.4)',borderLeftWidth:1,borderRightWidth:1,
                            justifyContent:'flex-start',padding:10}}>
                        <View style={{flex:1,alignItems:'center'}}>
                            {
                                rowData.feeType==1?
                                    <Text style={{color:'#222'}}>车险</Text>:
                                    <Text style={{color:'#222'}}>寿险</Text>
                            }
                        </View>

                        <View style={{flex:1,alignItems:'center'}}>
                            {
                                rowData.feeTime !== undefined && rowData.feeTime !== null && rowData.feeTime !== '' ?
                                    <Text style={{color:'#222'}}>
                                        {DateFilter.filter(rowData.feeTime, 'yyyy-mm-dd') }
                                    </Text>:
                                    <Text style={{color:'#222'}}>
                                        ----
                                    </Text>
                            }
                        </View>

                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={{color:'#222'}}>
                                {rowData.fee}
                            </Text>
                        </View>
                    </View>
                </View>;

        return row;
    }

    //积分支出列表项
    outcomeRender(rowData,sectionId,rowId)
    {
        var lineStyle=null;

        lineStyle={flex:1,backgroundColor:'transparent',paddingLeft:12,paddingRight:12};

        var row=

                <View style={lineStyle}>

                    <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'rgba(210,210,210,0.4)',borderLeftWidth:1,borderRightWidth:1,
                            justifyContent:'flex-start',padding:10}}>

                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={{color:'#222'}}>服务订单</Text>
                        </View>

                        <View style={{flex:1,alignItems:'center'}}>
                            {
                                rowData.feeTime !== undefined && rowData.feeTime !== null && rowData.feeTime !== '' ?
                                    <Text style={{color:'#222'}}>
                                        {DateFilter.filter(rowData.feeTime, 'yyyy-mm-dd') }
                                    </Text>:
                                    <Text style={{color:'#222'}}>
                                        ----
                                    </Text>
                            }
                        </View>

                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={{color:'#222'}}>
                                {rowData.fee}
                            </Text>
                        </View>
                    </View>
                </View>;

        return row;
    }

    constructor(props) {
        super(props);
        this.state={
            personInfo:props.personInfo,
            selectedTab:0,
            feePayInfo : null
        }

    }

    render() {

        var props=this.props;
        var state=this.state;


        var incomeList=null;
        var outcomeList=null;

        if(this.state.feePayInfo!==undefined&&this.state.feePayInfo!==null)
        {

            var feePayInfo=this.state.feePayInfo;
            var incomes=[];
            var outcomes=[];

            feePayInfo.map(function (pay) {
                if(pay.feeType!=3)
                    incomes.push(pay);
                else
                    outcomes.push(pay);
            });


            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            incomeList=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(incomes)}
                        renderRow={this.incomeRender.bind(this)}
                    />
                </ScrollView>);

            outcomeList=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(outcomes)}
                        renderRow={this.outcomeRender.bind(this)}
                    />
                </ScrollView>);



        }else{
            this.fetchData();
        }



        return (
            <View style={styles.container}>

                {/*need to finish*/}
                <View style={{height:60,width:width,backgroundColor:'rgba(120,120,120,0.2)',borderBottomWidth:1,borderBottomColor:'#aaa'}}>

                    <View style={[styles.row,{marginTop:20}]}>

                        <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                          onPress={()=>{
                                          this.goBack();
                                      }}
                        >
                            <Icon name="angle-left" size={40} color="#fff"></Icon>
                        </TouchableOpacity>

                        <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12}}>
                            <Text style={{color:'#888'}}>我的积分</Text>
                        </View>

                        <View style={{width:80,alignItems:'center',marginRight:20,backgroundColor:'#aaa',
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}>
                            <Text style={{fontSize:12}}>积分提现</Text>
                        </View>

                    </View>
                </View>



                <View style={[styles.row,{width:width,height:60,marginTop:10}]}>

                    <Image resizeMode="stretch" style={{width:55,height:55,marginLeft:20,borderRadius:27}}
                           source={require('../../img/person.jpg')}></Image>

                    <View style={{padding:10,alignItems:'flex-start',marginLeft:15,justifyContent:'center'}}>
                        <View style={[styles.row]}>
                            <Text style={{color:'#222',marginRight:10,fontWeight:'bold'}}>
                                用户:
                            </Text>
                            <Text style={{color:'#222',fontWeight:'bold'}}>
                                {state.personInfo.perName}
                            </Text>
                        </View>

                        <View style={[styles.row,{marginTop:2}]}>
                            <Text style={{color:'#222',marginRight:10,fontWeight:'bold'}}>
                                手机:
                            </Text>
                            <Text style={{color:'#222',fontWeight:'bold'}}>
                                {state.personInfo.mobilePhone}
                            </Text>
                        </View>

                    </View>

                </View>


                {/*scroll tab pages*/}
                <ScrollableTabView
                    style={{marginTop: 20, }}
                    initialPage={1}
                    renderTabBar={() =>  <FacebookTabBar />}
                >
                    <View tabLabel="积分收入">

                        {/*list header*/}
                        <View style={{height:25,width:width,paddingLeft:12,paddingRight:12,marginTop:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(210,210,210,0.4)',padding:6,
                                    borderTopLeftRadius:4,borderTopRightRadius:4}}>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>收入类型</Text>
                                </View>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>获取日期</Text>
                                </View>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>积分数量</Text>
                                </View>

                            </View>
                        </View>

                        {incomeList}
                    </View>
                    <View tabLabel="积分支出">

                        {/*list header*/}
                        <View style={{height:25,width:width,paddingLeft:12,paddingRight:12,marginTop:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(210,210,210,0.4)',padding:6,
                                    borderTopLeftRadius:4,borderTopRightRadius:4}}>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>支出类型</Text>
                                </View>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>支出日期</Text>
                                </View>

                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'rgba(9, 76, 158, 0.8)',fontSize:12,fontWeight:'bold'}}>积分支出</Text>
                                </View>

                            </View>
                        </View>

                        {outcomeList}
                    </View>

                </ScrollableTabView>




            </View>
        )

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer:{
        marginTop: 30
    },
    popoverContent: {
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText:{
        color:'#444',
        marginLeft:14,
        fontWeight:'bold'
    },
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        height: 150,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },


});


const mapStateToProps = (state, ownProps) => {


    var personInfo=state.user.personInfo;
    var accessToken=state.user.accessToken;
    return {
        personInfo,
        accessToken,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps)(Credit);

