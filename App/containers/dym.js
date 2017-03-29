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
var ImagePicker = require('react-native-image-picker');

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

    showImagePicker(){
        var options = {
            title: 'Select Avatar',
            customButtons: [
                {name: 'fb', title: 'Choose Photo from Facebook'},
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                console.log('Response.uri = ', response.uri);
                this.setState({
                    avatarSource: source
                });
            }
        });
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

        var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6'+
            'QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnh'+
                'KpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2ai'+
                'b1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOo'+
                'VbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwr'+
                'Ma+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGV'+
                'vlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtL'+
                'WLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU1'+
                '2WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kD'+
                'anhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUB'+
                'ywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcS'+
                'Kgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjf'+
                'htafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eI'+
                'QAAAABJRU5ErkJggg==';

        return (
          <View style={{flex:1}}>

              <View style={{flex:1,backgroundColor:'rgba(17, 17, 17, 0.6)',justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={{color:'#fff',fontSize:15,paddingTop:10}}>客服咨询</Text>
              </View>

              <View style={{flex:10,justifyContent: 'center',alignItems: 'center'}}>

                  <TouchableOpacity style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'white',}} onPress={()=>{
                        this.showImagePicker();
                             }}>
                      <View>
                          <Text style={{fontSize: 30}}>Image-Picker</Text>
                      </View>

                  </TouchableOpacity>
                  {
                      this.state.avatarSource==undefined||this.state.avatarSource==null?null:
                      <Image source={this.state.avatarSource} style={styles.imageStyle} />
                  }

                  <TouchableOpacity style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'white',}} onPress={()=>{
                        this.navigate2AudioExample();
                             }}>
                      <View>
                          <Text style={{fontSize: 30}}>AudioExample</Text>
                      </View>

                  </TouchableOpacity>
                  <TouchableOpacity style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'white',}} onPress={()=>{
                        this.sendNotification();
                             }}>
                      <View>
                          <Text style={{fontSize: 30}}>sendNotification</Text>
                      </View>

                  </TouchableOpacity>

                  <View style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'white',}}>
                      <Image style={styles.imageStyle} source={{uri: base64Icon, scale: 3}}/>
                  </View>

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

