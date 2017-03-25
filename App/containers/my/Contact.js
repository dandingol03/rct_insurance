
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
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Prompt from 'react-native-prompt';
import {saveContactInfo} from '../../action/UserActions';



class Contact extends Component{


    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }


    onSubmit(val)
    {
        var {field,personInfo}=this.state;
        //TODO:make a check of val
        switch(field)
        {
            case 'perName':
                //不能含有英文
                var reg=/\w|\s/;
                if(reg.exec(val)!==null)
                {
                    this.setState({promptVisible:false});
                    setTimeout(function () {
                        Alert.alert(
                            '错误',
                            '用户名不能包含英文或者数字'
                        );
                    },300);
                    return ;
                }
                break;
        }
        personInfo[field]=val;
        this.setState({promptVisible: false, personInfo: personInfo});
    }

    onApply()
    {
        var {dispatch}=this.props;
        dispatch(saveContactInfo(this.state.personInfo));
    }


    constructor(props) {
        super(props);
        this.state={
            promptVisible:false,
            prompt:null,
            personInfo:props.personInfo
        };
    }

    render() {

        var props=this.props;
        var state=this.state;




        return (
            <View style={styles.container}>

                {/*need to finish*/}
                <View style={{flex:1,padding: 10,paddingTop:20,height:40,width:width,backgroundColor:'rgba(17, 17, 17, 0.6)',flexDirection:'row',
                    alignItems:'center',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#aaa'}}>
                    <TouchableOpacity style={{width:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:10}}
                                      onPress={()=>{
                                          this.goBack();
                                      }}>

                        <Icon name="angle-left" size={40} color="#fff"></Icon>
                    </TouchableOpacity>

                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:17,color:'#fff'}}>个人信息</Text>
                    </View>

                    <View style={{width:80,justifyContent:'center',marginTop:20,paddingLeft:10}}>
                    </View>
                </View>

                {/*body*/}
                <Image resizeMode="stretch" source={require('../../img/flowAndMoutain@2x.png')} style={{flex:25,width:width}}>
                    <View style={{flex:8,padding:10}}>

                        {/*title part*/}
                        <View style={{height:50,width:width,paddingLeft:12,paddingRight:12,flexDirection:'row',
                        alignItems:'center',marginTop:20}}>

                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Icon name="wpforms" size={20} color="#bf530c"></Icon>
                                <Text style={{color:'#bf530c',fontSize:14,marginLeft:12}}>
                                    信息维护:
                                </Text>
                            </View>

                            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:20}}>
                                <Icon name="angle-down" size={30} color="#bf530c"></Icon>
                            </View>
                        </View>

                        {/*用户名*/}
                        <View style={[{height:40,width:width,paddingLeft:20,paddingRight:20}]}>
                            <View style={[styles.row,{flex:1,borderBottomWidth:1,borderColor:'#ccc'}]}>

                                <View style={{flex:1,alignItems:'flex-start',paddingLeft:8}}>
                                    <Text style={{color:'#444',fontSize:16}}>用户名:</Text>
                                </View>

                                <TouchableOpacity style={{flex:1,alignItems:'flex-end',paddingRight:12}}
                                                  onPress={()=>{
                                              this.setState({field:'perName',prompt:'编辑您的用户名',promptVisible:true});
                                          }}
                                >
                                    {
                                        props.personInfo.perName!==undefined&&props.personInfo.perName!==null?
                                            <Text style={{color:'#bf530c',fontSize:16}}>{state.personInfo.perName}</Text>:
                                            <Text style={{color:'#888',fontSize:16}}>编辑</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/*身份证*/}
                        <View style={[{height:40,width:width,paddingLeft:20,paddingRight:20}]}>
                            <View style={[styles.row,{flex:1,borderBottomWidth:1,borderColor:'#ccc'}]}>

                                <View style={{flex:1,alignItems:'flex-start',paddingLeft:8}}>
                                    <Text style={{color:'#444',fontSize:16}}>身份证:</Text>
                                </View>

                                <TouchableOpacity style={{flex:2,alignItems:'flex-end',paddingRight:12}}
                                                  onPress={()=>{
                                              this.setState({field:'perIdCard',prompt:'编辑您的身份证号',promptVisible:true});
                                          }}
                                >
                                    {
                                        props.personInfo.perIdCard!==undefined&&props.personInfo.perIdCard!==null?
                                            <Text style={{color:'#bf530c',fontSize:16}}>{state.personInfo.perIdCard}</Text>:
                                            <Text style={{color:'#888',fontSize:16}}>编辑</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/*电话*/}
                        <View style={[{height:40,width:width,paddingLeft:20,paddingRight:20}]}>
                            <View style={[styles.row,{flex:1,borderBottomWidth:1,borderColor:'#ccc'}]}>

                                <View style={{flex:1,alignItems:'flex-start',paddingLeft:8}}>
                                    <Text style={{color:'#444',fontSize:16}}>电话:</Text>
                                </View>

                                <TouchableOpacity style={{flex:2,alignItems:'flex-end',paddingRight:12}}
                                                  onPress={()=>{
                                              this.setState({field:'mobilePhone',prompt:'编辑您的电话号码',promptVisible:true});
                                          }}
                                >
                                    {
                                        props.personInfo.mobilePhone!==undefined&&props.personInfo.mobilePhone!==null?
                                            <Text style={{color:'#bf530c',fontSize:16}}>{state.personInfo.mobilePhone}</Text>:
                                            <Text style={{color:'#888',fontSize:16}}>编辑</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/*邮箱*/}
                        <View style={[{height:40,width:width,paddingLeft:20,paddingRight:20}]}>
                            <View style={[styles.row,{flex:1,borderBottomWidth:1,borderColor:'#ccc'}]}>

                                <View style={{flex:1,alignItems:'flex-start',paddingLeft:8}}>
                                    <Text style={{color:'#444',fontSize:16}}>邮箱:</Text>
                                </View>

                                <TouchableOpacity style={{flex:2,alignItems:'flex-end',paddingRight:12}}
                                                  onPress={()=>{
                                              this.setState({field:'EMAIL',prompt:'编辑您的邮箱地址',promptVisible:true});
                                          }}
                                >
                                    {
                                        props.personInfo.EMAIL!==undefined&&props.personInfo.EMAIL!==null?
                                            <Text style={{color:'#bf530c',fontSize:16}}>{state.personInfo.EMAIL}</Text>:
                                            <Text style={{color:'#888',fontSize:16}}>编辑</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/*地址*/}
                        <View style={[{height:40,width:width,paddingLeft:20,paddingRight:20}]}>
                            <View style={[styles.row,{flex:1,borderBottomWidth:1,borderColor:'#ccc'}]}>

                                <View style={{flex:1,alignItems:'flex-start',paddingLeft:8}}>
                                    <Text style={{color:'#444',fontSize:16}}>地址:</Text>
                                </View>

                                <TouchableOpacity style={{flex:2,alignItems:'flex-end',paddingRight:12}}
                                                  onPress={()=>{
                                              this.setState({field:'perAddress',prompt:'编辑您的地址',promptVisible:true});
                                          }}
                                >
                                    {
                                        props.personInfo.perAddress!==undefined&&props.personInfo.perAddress!==null&&
                                        props.personInfo.perAddress!=''?
                                            <Text style={{color:'#bf530c',fontSize:16}}>{state.personInfo.perAddress}</Text>:
                                            <Text style={{color:'#888',fontSize:16}}>编辑</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                {/*保存提交*/}
                <View style={{ flex:3,width:width,alignItems:'center',marginTop:40}}>

                    <TouchableOpacity style={{width:width/2,borderRadius:8,
                            backgroundColor:'#11c1f3',padding:12,alignItems:'center'}}
                          onPress={()=>{
                             this.onApply();
                          }}>
                        <Text style={{color:'#fff'}}>点击提交</Text>
                    </TouchableOpacity>

                </View>

                </Image>



                {/*prompt*/}
                <Prompt
                    title={state.prompt}
                    visible={this.state.promptVisible}
                    onCancel={() => this.setState({ promptVisible: false })}
                    onSubmit={(value) =>{
                        this.onSubmit(value);
                    }}/>



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
    }

});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo;
    var score=state.user.score;
    return {
        personInfo,
        score,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps)(Contact);
