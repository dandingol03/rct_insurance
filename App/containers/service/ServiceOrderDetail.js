/**
 * Created by danding on 17/3/1.
 */
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
import {fetchAppliedOrderDetail} from '../../action/ServiceActions';
import _ from 'lodash';


class ServiceOrderDetail extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    fetchData()
    {
        this.props.dispatch(fetchAppliedOrderDetail({order:this.props.order})).then(function (json) {
            if(json.re==1)
            {

                if(json.data&&json.data.candidates)
                {
                    var _candidates=_.cloneDeep(json.data.candidates);
                    this.setState({detail:json.data,candidates:_candidates});
                }
                else
                    this.setState({detail:json.data});
            }
        }.bind(this))

    }


    renderRow(rowData,sectionId,rowId) {
        var lineStyle=null;

        if(rowData.checked==true)
            lineStyle={flex:1,backgroundColor:'rgb(106, 159, 220)'};
        else
            lineStyle={flex:1,backgroundColor:'#ccc'};

        var row=

            <View style={lineStyle}>

                <TouchableOpacity style={{flexDirection:'row',borderBottomWidth:1,borderColor:'rgba(210,210,210,0.4)',
                            justifyContent:'flex-start',padding:10}}
                                  onPress={()=>{
                                          //make this selected
                                          if(rowData.checked==true)
                                          {}
                                          else{
                                               var _candidates=_.cloneDeep(this.state.candidates);
                                               _candidates.map(function(candidate,i) {
                                                 if(candidate.candidateId==rowData.candidateId)
                                                     candidate.checked=true;
                                                 else
                                                     candidate.checked=false;
                                               });
                                               this.setState({candidates:_candidates});
                                          }
                                      }}>
                    <View style={{flex:1    ,alignItems:'flex-start'}}>


                        <Text style={{color:'#fff',marginBottom:10}}>
                            服务人员:{rowData.personInfo.perName}
                        </Text>

                        <Text style={{color:'#fff'}}>
                            地址:{rowData.unit.address}
                        </Text>

                    </View>


                    {
                        rowData.checked==true?
                            <View style={{width:80,alignItems:'center',justifyContent:'center'}}>
                                <Icon name="check" size={25} color="#fff"></Icon>
                            </View>:null
                    }
                </TouchableOpacity>
            </View>;

        return row;
    }

    constructor(props) {
        super(props);

        this.state={
            detail:null
        }
    }

    render() {

        var props=this.props;
        var state=this.state;


        var appliedList=null;
        var handlingList=null;
        var finishedList=null;

        var subServiceTypeMap={1:'机油,机滤',2:'检查制动系统,更换刹车片',3:'雨刷片更换',
            4:'轮胎更换',5:'燃油添加剂',6:'空气滤清器',7:'检查火花塞',8:'检查驱动皮带',9:'更换空调滤芯',10:'更换蓄电池,防冻液'};

        var serviceTypeMap={11:'维修-日常保养',12:'维修-故障维修',13:'维修-事故维修',
            21:'车驾管-审车',22:'车驾管-审证',23:'车驾管-接送机',24:'车驾管-接送站',
            31:'鈑喷'};

        var candidateList=null;


        if(this.props.order)
        {
            if(state.detail!==undefined&&state.detail!==null)
            {
                //渲染侯选列表
              if(state.candidates!==undefined&&state.candidates!==null)
              {
                  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

                  candidateList=(
                          <ListView
                              automaticallyAdjustContentInsets={false}
                              dataSource={ds.cloneWithRows(state.candidates)}
                              renderRow={this.renderRow.bind(this)}
                          />
                      );
              }

            }else {

                this.fetchData();
            }

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
                            <Text style={{color:'#888'}}>订单详情</Text>
                        </View>

                        <View style={{width:80,alignItems:'center',marginRight:20,backgroundColor:'#aaa',
                            padding:10,justifyContent:'center',borderRadius:8,marginBottom:1}}>
                            <Text style={{fontSize:12}}>订单取消</Text>
                        </View>

                    </View>
                </View>

                {/*body part*/}

                {
                    state.detail!==undefined&&state.detail!==null?
                        <View >
                            <View style={{height:45,width:width-40,marginLeft:20,marginTop:20}}>
                                <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                    <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14}}>
                                            服务类型:
                                        </Text>
                                    </View>

                                    <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                            {state.detail.serviceName}
                                        </Text>
                                    </View>
                                </View>
                            </View>


                            <View style={{height:45,width:width-40,marginLeft:20,marginTop:0}}>
                                <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                    <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14}}>
                                            预约时间:
                                        </Text>
                                    </View>

                                    <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                            {DateFilter.filter(state.detail.estimateTime, 'yyyy-mm-dd') }
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{height:45,width:width-40,marginLeft:20,marginTop:0}}>
                                <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                    <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14}}>
                                            服务费:
                                        </Text>
                                    </View>

                                    <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',padding:12}}>
                                        <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                            ${state.detail.fee}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {
                                state.detail.subServiceContent!==undefined&&state.detail.subServiceContent!==null&&state.detail.subServiceContent!=''?
                                    <View style={{height:45,width:width-40,marginLeft:20,marginTop:0}}>
                                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                            <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14}}>
                                                    服务内容:
                                                </Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                                    {state.detail.subServiceContent}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>:null
                            }


                            {
                                state.detail.servicePerson!==undefined&&state.detail.servicePerson!==null?
                                    <View style={{height:45,width:width-40,marginLeft:20,marginTop:0}}>
                                        <View style={[styles.row,{borderBottomWidth:1,borderColor:'#999'}]}>
                                            <View style={{width:100,paddingLeft:12,justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14}}>
                                                    服务人员:
                                                </Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',padding:12}}>
                                                <Text style={{color:'#222',fontSize:14,fontWeight:'bold'}}>
                                                    {state.detail.servicePerson.perName}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>:null
                            }

                        </View>:null
                }



                {/*侯选人员列表*/}
                {
                    state.detail&&state.detail.candidates!==undefined&&state.detail.candidates!==null?
                        <View style={[styles.card,{flex:1,marginBottom:20,position:'relative',padding:0}]}>

                            <ScrollView style={{marginBottom:50}}>
                                {candidateList}
                            </ScrollView>

                            {/*同意按钮*/}
                            <View style={[styles.row,{width:width,height:50,alignItems:'center',position:'absolute',bottom:10,justifyContent:'center'}]}>
                                <TouchableOpacity style={{width:140,backgroundColor:'#00f',borderRadius:8,padding:10,
                                        alignItems:'center'}}
                                                  onPress={()=>{
                                          this.goBack();
                                      }}
                                >
                                   <Text style={{color:'#fff'}}>同意</Text>
                                </TouchableOpacity>
                            </View>

                        </View>:null
                }




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
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    rotate:{
        transform:[{rotate:'12deg'}]
    }


});



module.exports = connect()(ServiceOrderDetail);

