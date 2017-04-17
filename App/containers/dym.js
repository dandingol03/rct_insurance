/**
 * Created by dingyiming on 2017/2/15.
 */
import React,{Component} from 'react';

import  {
    AppRegistry,
    Animated,
    Easing,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import AudioExample from '../../AudioExample';
import Config from '../../config';
import Proxy from '../proxy/Proxy';
import MaintainExample from '../../MaintainExample';

class dym extends Component{

    navigate2AudioExample(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'audioExample',
                component: AudioExample,
                params: {

                }
            })
        }
    }

    navigate2MaintainExample(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'maintainExample',
                component: MaintainExample,
                params: {

                }
            })
        }
    }

    sendNotification(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.props.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'sendNotification',
            }
        },(json)=> {
            if(json.re==1){
                console.log('发送成功');
            }
            else{
                console.log('发送失败');
            }
        }, (err) =>{
        });
    }


    constructor(props) {
        super(props);
        this.state={
            mode:'text',
            audio:{mode:'stopped'},
            record:false,
            send:false,
            toolsShowFlag:false,
            fadeInOpacity: new Animated.Value(0), // 初始值
            text:null,
            avatarSource:null,
        };
    }

    render() {

        return (
          <View style={{flex:1}}>

              <View style={{flex:1,backgroundColor:'rgba(17, 17, 17, 0.6)',justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={{color:'#fff',fontSize:15,paddingTop:10}}>客服咨询</Text>
              </View>

              <View style={{flex:10,justifyContent: 'center',alignItems: 'center'}}>

                  <TouchableOpacity style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'white',}} onPress={()=>{
                        this.navigate2AudioExample();
                             }}>
                      <View>
                          <Text style={{fontSize: 30}}>AudioExample</Text>
                      </View>

                  </TouchableOpacity>

                  <TouchableOpacity style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'white',}} onPress={()=>{
                        this.navigate2MaintainExample();
                             }}>
                      <View>
                          <Text style={{fontSize: 30}}>MaintainExample</Text>
                      </View>

                  </TouchableOpacity>

                  <TouchableOpacity style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'white',}} onPress={()=>{
                        this.sendNotification();
                             }}>
                      <View>
                          <Text style={{fontSize: 30}}>sendNotification</Text>
                      </View>

                  </TouchableOpacity>

              </View>

              <View style={{flex:1,backgroundColor:'#ddd',justifyContent: 'center',alignItems: 'center',flexDirection:'row'}}>

                  <View style={{flex:9,justifyContent: 'center',alignItems: 'center',flexDirection:'row'}}>
                      {
                          this.state.mode=='audio'?
                              <View style={{justifyContent: 'center',alignItems: 'center',flexDirection:'row',padding:5}}>
                                  <TouchableOpacity style={{flex:1,marginRight:5,paddingTop:3,justifyContent: 'center',alignItems: 'center',}}
                                                    onPress={()=>{
                                                    var record = this.state.record;
                                                    this.setState({mode:'record'})
                                                }}>
                                      <Icon name="keyboard-o" size={25} color="#343434" />
                                  </TouchableOpacity>

                                  {
                                      this.state.audio.mode=='stopped'?
                                          <TouchableOpacity style={{flex:5,backgroundColor:'#fff',height:25,borderRadius:6,borderWidth:1,borderColor:'#ddd',
                                              justifyContent: 'center',alignItems: 'center'}}
                                                            onPress={()=>{
                                                    var audio = {mode:'recording'};
                                                    this.setState({audio:audio})
                                                }}>
                                          <View>
                                              <Text>按住我说话</Text>
                                          </View>
                                          </TouchableOpacity>:
                                          <TouchableOpacity style={{flex:5,backgroundColor:'#fff',height:25,borderRadius:6,borderWidth:1,borderColor:'#ddd',
                                 justifyContent: 'center',alignItems: 'center'}}
                                                            onPress={()=>{
                                                    var audio = {mode:'stopped'};
                                                    this.setState({audio:audio})
                                                }}>
                                          <View>
                                              <Text>正在录音...</Text>
                                          </View>
                                          </TouchableOpacity>

                                  }

                              </View>
                              :
                              <View style={{justifyContent: 'center',alignItems: 'center',flexDirection:'row',padding:5}}>
                                  <TouchableOpacity  style={{flex:1,marginLeft:5,paddingTop:3,justifyContent: 'flex-start',alignItems: 'flex-start'}}
                                             onPress={()=>{
                                                    var record = this.state.record;
                                                    this.setState({mode:'audio'})
                                                }
                                                }>
                                      <Icon name="microphone" size={25} color="#343434"/>
                                  </TouchableOpacity>
                                  <View style={{flex:8,backgroundColor:'#fff',height:25,borderRadius:6,borderWidth:1,borderColor:'#ddd',
                                  justifyContent: 'center',alignItems: 'center'}}>
                                      <TextInput
                                          style={{height:30,fontSize:15}}
                                          onChangeText={(planFee) =>
                              {

                              }}
                                          placeholderTextColor="#aaa"
                                          underlineColorAndroid="transparent"
                                      />
                                  </View>
                              </View>
                      }

                  </View>

                  <View style={{flex:1,padding:5}}>
                      {
                          this.state.send?
                              <Icon name="send" size={25} color="#343434" />:

                              <TouchableOpacity  style={{flex:1,marginLeft:5,paddingTop:3,justifyContent: 'flex-start',alignItems: 'flex-start'}}
                                             onPress={()=>{
                                                 if(this.state.toolsShowFlag==false){
                                                    var toolsShowFlag = this.state.toolsShowFlag;
                                                    this.setState({toolsShowFlag:!toolsShowFlag});
                                                    Animated.timing(this.state.fadeInOpacity, {
                                                    toValue: 1, // 目标值
                                                    duration: 2500, // 动画时间
                                                    easing: Easing.linear // 缓动函数
                                                    }).start();
                                                 }
                                                 if(this.state.toolsShowFlag==true){
                                                    Animated.timing(this.state.fadeInOpacity, {
                                                    toValue:0, // 目标值
                                                    duration: 2500, // 动画时间
                                                    easing: Easing.linear // 缓动函数
                                                    }).start(function(){
                                                    var toolsShowFlag = this.state.toolsShowFlag;
                                                    this.setState({toolsShowFlag:!toolsShowFlag});
                                                    });
                                                 }

                                                }
                                                }>
                                  <Icon name="plus-circle" size={25} color="#343434" />
                              </TouchableOpacity>

                      }
                  </View>

              </View>

              {
                  this.state.toolsShowFlag?
                  <Animated.View style={{flex:2,backgroundColor:'#ddd',justifyContent:'flex-start',alignItems: 'center',
                     flexDirection:'row',padding:8,opacity:this.state.fadeInOpacity}}>
                    <View style={{flex:2,backgroundColor:'#fff',justifyContent:'flex-start',alignItems: 'center',flexDirection:'row',
                          borderRadius:8,padding:8}}>
                        <View>
                            <Icon name="youtube-play" size={35} color="#343434" />
                            <Text style={{fontSize:12}}>小视频</Text>
                        </View>
                    </View>
                  </Animated.View>:null
              }

          </View>
        )
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer:{
        marginTop: 30
    },
    imageStyle: {
        width: 70,
        height: 70,
        marginTop: 10,
        backgroundColor: 'gray'
    }
});


const mapStateToProps = (state, ownProps) => {

    var {personInfo,accessToken,score}=state.user;

    return {
        personInfo,
        score,
        accessToken,
        ...ownProps,
    }
}

module.exports = connect(mapStateToProps
)(dym);

