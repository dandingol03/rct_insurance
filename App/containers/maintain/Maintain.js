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
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import VideoPlayer from './VideoPlayer.js';
import Audio from './Audio.js';
var Sound = require('react-native-sound');

import {AudioRecorder, AudioUtils} from 'react-native-audio';

var whoosh = new Sound('advertising.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
});

class Maintain extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2VideoPlayer(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'videoPlayer',
                component: VideoPlayer,
                params: {

                }
            })
        }
    }

    navigate2Audio(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'audio',
                component: Audio,
                params: {

                }
            })
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    _onPress() {
        // Disable button while recording and playing back
        this.setState({disabled: true});

        // Start recording
        let rec = new Recorder("filename.mp4").record();

        // Stop recording after approximately 3 seconds
        setTimeout(() => {
            rec.stop((err) => {
                // NOTE: In a real situation, handle possible errors here

                // Play the file after recording has stopped
                new Player("filename.mp4")
                    .play()
                    .on('ended', () => {
                        // Enable button again after playback finishes
                        this.setState({disabled: false});
                    });
            });
        }, 3000);
    }


    record() {

        AudioRecorder.prepareRecordingAtPath(this.state.audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac"
        });

        var whoosh = new Sound(this.state.audioPath, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
        });


    }

    _onPress2() {

        // Play the sound with an onEnd callback,
        whoosh.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });

    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            dailyChecked:[true,false,false,false,false,false,false,false,false,false],
            selectedDailys:[],
            accidentType:'',
            disabled: false,
            description:'',
            audio:null,
            video:null,
            audioPath: 'AudioUtils.DocumentDirectoryPath'+ '/test.aac',
        };
    }

    render(){

        var dailyChecked = [];
        var selectedDailys = [];
        var description = '';
        return (
            <View style={{flex:1}}>
                {/*body*/}
                <Image resizeMode="stretch" source={require('../../img/bkg_old@2x.png')} style={{width:width,height:height}}>

                    <View style={[{padding: 10,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:60,backgroundColor:'rgba(17, 17, 17, 0.6)'},styles.card]}>
                        <TouchableOpacity style={{flex:1,textAlign:'center',color:'#fff',paddingLeft:8}} onPress={()=>{
                        this.goBack();
                    }}>
                            <Icon size={26} name="chevron-left" color="#fff" ></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize:20,flex:20,textAlign:'center',color:'#fff'}}>
                            维修服务
                        </Text>
                    </View>

                    <View style={{flex:1,width:width,position:'relative',marginTop:10}}>
                        <ScrollableTabView style={{flex:1}}
                                           renderTabBar={() => <DefaultTabBar style={{borderBottomWidth:0,backgroundColor:'#fff',height:30}} activeTextColor="#0A9DC7" inactiveTextColor="#323232" underlineStyle={{backgroundColor:'#0A9DC7'}}/>}
                        >
                            <View tabLabel='日常保养' style={{flex:1,padding:8,fontSize:20}}>
                                <ScrollView>
                                    <View style={{flex:1}}>
                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'center'}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}}
                                                              onPress={()=>{
                                             dailyChecked = this.state.dailyChecked;
                                             dailyChecked[0] = !this.state.dailyChecked[0];
                                             if( dailyChecked[0]==true){
                                               selectedDailys.push({subServiceId:'1',subServiceTypes:'机油,机滤',serviceType:'11',checked:true});
                                             }
                                             this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                            }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain1.png')} style={{flex:5}}/>
                                                        <Text style={{flex:1,fontSize:14,color:'#222',marginTop:5}}>机油、机滤</Text>
                                                        {
                                                            this.state.dailyChecked[0]==true?<Text style={{flex:1,fontSize:14,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontSize:14,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[1] = !this.state.dailyChecked[1];
                                         if(dailyChecked[1]==true){
                                          selectedDailys.push({subServiceId:'2',subServiceTypes:'检查制动系统,更换刹车片',serviceType:'11',checked:true});
                                         }
                                        this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain2.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontSize:14,color:'#222',marginTop:5}}>更换刹车片</Text>
                                                        {
                                                            this.state.dailyChecked[1]==true?<Text style={{flex:1,fontsize:14,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:14,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[2] = !this.state.dailyChecked[2];
                                         if(dailyChecked[2]==true){
                                           selectedDailys.push( {subServiceId:'3',subServiceTypes:'雨刷片更换',serviceType:'11',checked:false});
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain3.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontsize:15,color:'#222',marginTop:5}}>雨刷片更换</Text>
                                                        {
                                                            this.state.dailyChecked[2]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'center'}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[3] = !this.state.dailyChecked[3];
                                         if(dailyChecked[3]==true){
                                           selectedDailys.push({subServiceId:'4',subServiceTypes:'轮胎更换',serviceType:'11',checked:false},);
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain4.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontsize:15,color:'#222',marginTop:5}}>轮胎更换</Text>
                                                        {
                                                            this.state.dailyChecked[3]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[4] = !this.state.dailyChecked[4];
                                         if(dailyChecked[4]==true){
                                           selectedDailys.push( {subServiceId:'5',subServiceTypes:'燃油添加剂',serviceType:'11',checked:false});
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain5.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontsize:15,color:'#222',marginTop:5}}>燃油添加剂</Text>
                                                        {
                                                            this.state.dailyChecked[4]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[5] = !this.state.dailyChecked[5];
                                         if(dailyChecked[5]==true){
                                           selectedDailys.push( {subServiceId:'6',subServiceTypes:'空气滤清器',serviceType:'11',checked:false});
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain6.png')} style={{flex:4}}/>
                                                        <Text style={{fontsize:15,color:'#222',marginTop:5}}>空气滤清器</Text>
                                                        {
                                                            this.state.dailyChecked[5]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'center'}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[6] = !this.state.dailyChecked[6];
                                         if(dailyChecked[6]==true){
                                           selectedDailys.push({subServiceId:'7',subServiceTypes:'检查火花塞',serviceType:'11',checked:false});
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain7.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontsize:15,color:'#222',marginTop:5}}>检查火花塞</Text>
                                                        {
                                                            this.state.dailyChecked[6]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[7] = !this.state.dailyChecked[7];
                                         if(dailyChecked[7]==true){
                                           selectedDailys.push({subServiceId:'8',subServiceTypes:'检查驱动皮带',serviceType:'11',checked:false});
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain8.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontsize:15,color:'#222',marginTop:5}}>检查驱动片</Text>
                                                        {
                                                            this.state.dailyChecked[7]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[8] = !this.state.dailyChecked[8];
                                         if(dailyChecked[8]==true){
                                           selectedDailys.push({subServiceId:'9',subServiceTypes:'更换空调滤芯',serviceType:'11',checked:false});
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain9.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontsize:15,color:'#222',marginTop:5}}>换空调滤芯</Text>
                                                        {
                                                            this.state.dailyChecked[8]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex:1,padding:0,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                            <TouchableOpacity style={{flex:1,justifyContent:'center',padding:12}} onPress={()=>{
                                         dailyChecked = this.state.dailyChecked;
                                         dailyChecked[9] = !this.state.dailyChecked[9];
                                         if(dailyChecked[9]==true){
                                           selectedDailys.push({subServiceId:'10',subServiceTypes:'更换蓄电池,防冻液',serviceType:'11',checked:false});
                                         }
                                         this.setState({selectedDailys:selectedDailys,dailyChecked:dailyChecked});
                                     }}>
                                                    <View style={{flex:1,alignItems:'center'}}>
                                                        <Image resizeMode="contain" source={require('../../img/maintain10.png')} style={{flex:4}}/>
                                                        <Text style={{flex:1,fontsize:15,color:'#222',marginTop:5}}>更换蓄电池防冻液</Text>
                                                        {
                                                            this.state.dailyChecked[9]==true?<Text style={{flex:1,fontsize:15,color:'#fff',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#F56C00',borderRadius:2,backgroundColor:'#F56C00'}}>选择</Text>:
                                                                <Text style={{flex:1,fontsize:15,color:'#068E78',padding:2,paddingLeft:8,paddingRight:8,marginTop:5,borderWidth:1,borderColor:'#068E78',borderRadius:2}}>选择</Text>
                                                        }
                                                    </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </ScrollView>

                            </View>

                            <ScrollView tabLabel='故障维修' style={{flex:1,padding:10,fontSize:20}}>

                                {/*文本描述*/}
                                <View style={{flex:3,padding:4}}>
                                    <Text>文本描述</Text>
                                    <TextInput
                                        style={{height:100,borderWidth:1,padding:8,fontSize:13,marginTop:5}}
                                        onChangeText={(description) =>
                                        {
                                           this.state.description=description;
                                           var description =  this.description;
                                           this.setState({description:description});
                                        }}
                                        value={this.state.description}
                                        placeholder='请对故障进行文本描述...'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                        multiline='true'
                                    />
                                </View>

                                <View style={{flex:3,padding:2,flexDirection:'row',justifyContent:'center',alignItems:'center',height:110}}>
                                    {/*音频描述*/}
                                    <View style={{flex:1,padding:2,margin:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#f96666',borderRadius:8}}>
                                        <View style={{flex:2}}>
                                            <View style={{flex:3,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                                                <Image resizeMode="cover" source={require('../../img/1@2x.png')} style={{flex:1,padding:2}}></Image>
                                                <Image resizeMode="cover" source={require('../../img/2@2x.png')} style={{flex:1,padding:2}}></Image>
                                                <Image resizeMode="cover" source={require('../../img/6@2x.png')} style={{flex:1,padding:2}}></Image>
                                                <Image resizeMode="cover" source={require('../../img/9@2x.png')} style={{flex:1,padding:2}}></Image>
                                                <Image resizeMode="cover" source={require('../../img/5@2x.png')} style={{flex:1,padding:2}}></Image>
                                                <Image resizeMode="cover" source={require('../../img/3@2x.png')} style={{flex:1,padding:2}}></Image>
                                                <Image resizeMode="cover" source={require('../../img/8@2x.png')} style={{flex:1,padding:2}}></Image>
                                            </View>
                                            <Text style={{color:'#fff',flex:1,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'center',textAlign:'center'}}>00:00</Text>
                                        </View>
                                        <View style={{flex:1,paddingRight:4}}>
                                            <Image resizeMode="cover" source={require('../../img/maike-@2x.png')} style={{flex:1}}></Image>
                                            <Image resizeMode="cover" source={require('../../img/playAudio@2x.png')} style={{flex:1}}></Image>
                                        </View>
                                    </View>

                                    {/*视频描述*/}
                                    <View style={{flex:1,padding:2,margin:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#aaa',borderRadius:8}}>

                                        <Image resizeMode="cover" source={require('../../img/sas@2x.png')} style={{flex:1}}></Image>
                                    </View>


                                </View>

                            </ScrollView>

                            <View tabLabel='事故维修' style={{flex:1,padding:12,fontSize:20}}>
                                <View style={[styles.row80,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:12}]}>
                                    <View style={{flex:6,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:15,flex:3,textAlign:'left',}}>已报案:</Text>
                                        {
                                            this.state.accidentType == '' ?
                                                <TouchableOpacity
                                                    style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                                    onPress={()=>{
                                                                 this.setState({accidentType:'已报案'});
                                                }}>
                                                    <View>
                                                        <Icon name="check-circle-o" color="#aaa" size={30}></Icon>
                                                    </View>
                                                </TouchableOpacity> :
                                                <View  style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                    {
                                                        this.state.accidentType == '已报案' ?
                                                            <TouchableOpacity
                                                                onPress={()=>{
                                                                 this.setState({accidentType:''});
                                                }}>
                                                                <View>
                                                                    <Icon name="check-circle" color="#aaa" size={30}></Icon>
                                                                </View>
                                                            </TouchableOpacity> :

                                                            <View  style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                                <Icon name="check-circle-o" color="#aaa" size={30}></Icon>
                                                            </View>

                                                    }
                                                </View>
                                        }

                                    </View>
                                </View>
                                <View style={[styles.row80,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:12}]}>
                                    <View style={{flex:6,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:15,flex:3,textAlign:'left',}}>未报案:</Text>
                                        {
                                            this.state.accidentType == '' ?
                                                <TouchableOpacity
                                                    style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                                    onPress={()=>{
                                                                 this.setState({accidentType:'未报案'});
                                                }}>
                                                    <View>
                                                        <Icon name="check-circle-o" color="#aaa" size={30}></Icon>
                                                    </View>
                                                </TouchableOpacity> :
                                                <View  style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                    {
                                                        this.state.accidentType == '未报案' ?
                                                            <TouchableOpacity
                                                                onPress={()=>{
                                                                 this.setState({accidentType:''});
                                                }}>
                                                                <View>
                                                                    <Icon name="check-circle" color="#aaa" size={30}></Icon>
                                                                </View>
                                                            </TouchableOpacity> :

                                                            <View  style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                                <Icon name="check-circle-o" color="#aaa" size={30}></Icon>
                                                            </View>

                                                    }
                                                </View>
                                        }

                                    </View>
                                </View>
                                <View style={[styles.row80,{borderBottomWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',padding:12}]}>
                                    <View style={{flex:6,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:15,flex:3,textAlign:'left',}}>代索赔:</Text>
                                        {
                                            this.state.accidentType == '' ?
                                                <TouchableOpacity
                                                    style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                                    onPress={()=>{
                                                                 this.setState({accidentType:'代索赔'});
                                                }}>
                                                    <View>
                                                        <Icon name="check-circle-o" color="#aaa" size={30}></Icon>
                                                    </View>
                                                </TouchableOpacity> :
                                                <View  style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                    {
                                                        this.state.accidentType == '代索赔' ?
                                                            <TouchableOpacity
                                                                onPress={()=>{
                                                                 this.setState({accidentType:''});
                                                }}>
                                                                <View>
                                                                    <Icon name="check-circle" color="#aaa" size={30}></Icon>
                                                                </View>
                                                            </TouchableOpacity> :

                                                            <View  style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                                <Icon name="check-circle-o" color="#aaa" size={30}></Icon>
                                                            </View>

                                                    }
                                                </View>
                                        }

                                    </View>
                                </View>

                            </View>

                        </ScrollableTabView>
                    </View>


                </Image>

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
        flexDirection:'row',
        height:130,
        borderBottomWidth:0,
        borderBottomColor:'#222'
    },
    row80:{
        flexDirection:'row',
        height:60,
        borderBottomWidth:0,
        borderBottomColor:'#222'
    },


});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(Maintain);
