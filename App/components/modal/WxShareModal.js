/**
 * Created by youli on 25/03/2017.
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
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';


var {height, width} = Dimensions.get('window');


class WxShareModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    wxShare(){
        if(this.props.wxShare!==undefined&&this.props.wxShare!==null)
        {
            this.props.wxShare(this.state.shareType);
        }
        this.close();
    }

    _handlePress1(index) {

        if(index!==0){
            var shareType = this.state.shareTypeButtons[index];
            this.setState({shareType:shareType});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
    }


    constructor(props)
    {
        super(props);
        this.state={
            shareType:null,
            shareTypeButtons:['取消','好友','朋友圈'],
        }
    }


    render(){

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const shareTypeButtons=['取消','好友','朋友圈'];

        return (
            <View>
                <Image resizeMode="stretch" source={require('../../img/login_background@2x.png')}
                       style={{height:height*0.4,width:width*0.8,padding:10,margin:30,marginTop:100,backgroundColor:'#fff',borderRadius:6}}>
                <View style={{flex:2,backgroundColor:'transparent',padding:5,borderWidth:1,borderColor:'#aaa'}}>
                    <Text style={{flex:2,padding:3,paddingBottom:0,color:'#343434'}}>
                        我正在使用捷惠宝App,想与您一起分享...
                    </Text>
                    <Text style={{flex:1,padding:3,paddingTop:0,color:'#888',fontSize:12}}>
                        来自：捷惠宝
                    </Text>
                </View>


                <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                borderBottomWidth:1,borderColor:'#aaa'}}>
                    <View style={{flex:4,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:15,flex:3,textAlign:'left',}}>分享类型:</Text>
                    </View>
                    <View style={{flex:5,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                        {
                            this.state.shareType=='好友'?
                                <TouchableOpacity
                                                  onPress={()=>{
                                                this.setState({shareType:null});
                                          }}>
                                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Icon name="weixin" size={20} color='#0b31ec' />
                                        <Text style={{color:'#0b31ec'}}>好友</Text>
                                    </View>
                                </TouchableOpacity>:
                                <TouchableOpacity
                                                  onPress={()=>{
                                                this.setState({shareType:'好友'});
                                          }}>
                                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Icon name="weixin" size={20} color="#343434" />
                                        <Text> 好友 </Text>
                                    </View>
                                </TouchableOpacity>

                        }

                        {
                            this.state.shareType=='朋友圈'?
                                <TouchableOpacity
                                                  onPress={()=>{
                                                this.setState({shareType:'null'});
                                          }}>
                                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Icon name="share-alt" size={20} color='#0b31ec' />
                                        <Text style={{color:'#0b31ec'}}> 朋友圈 </Text>
                                    </View>
                                </TouchableOpacity>:
                                <TouchableOpacity
                                                  onPress={()=>{
                                                this.setState({shareType:'朋友圈'});
                                          }}>
                                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Icon name="share-alt" size={20} color="#343434" />
                                        <Text> 朋友圈 </Text>
                                    </View>
                                </TouchableOpacity>

                        }


                    </View>

                    {/*<View style={{flex:5,padding:5,justifyContent:'center',alignItems:'flex-end'}}>*/}
                        {/*{*/}
                            {/*this.state.shareType==undefined||this.state.shareType==null?*/}
                                {/*<Text style={{fontSize:13,color:"#aaa"}}>选择分享类型</Text>:*/}
                                {/*<Text style={{fontSize:13}}>{this.state.shareType}</Text>*/}

                        {/*}*/}
                    {/*</View>*/}
                    {/*<View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',}}>*/}
                        {/*<TouchableOpacity style={{justifyContent:'center'}}*/}
                                          {/*onPress={()=>{ this.show('actionSheet1'); }}>*/}
                            {/*<Icon name="angle-down" color="#aaa" size={25}></Icon>*/}
                            {/*<ActionSheet*/}
                                {/*ref={(o) => {*/}
                                        {/*this.actionSheet1 = o;*/}
                                    {/*}}*/}
                                {/*title="请选择分享类型"*/}
                                {/*options={shareTypeButtons}*/}
                                {/*cancelButtonIndex={CANCEL_INDEX}*/}
                                {/*destructiveButtonIndex={DESTRUCTIVE_INDEX}*/}
                                {/*onPress={*/}
                                        {/*(data)=>{ this._handlePress1(data); }*/}
                                    {/*}*/}
                            {/*/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                </View>


                <View style={{flex:2,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                    <TouchableOpacity style={{flex:1,padding:2,margin:10,flexDirection:'row',justifyContent:'center',alignItems:'center',
                    backgroundColor:'#rgba(66, 56, 45, 0.9529)',borderRadius:6}}
                                      onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                        <Text style={{color:'#fff',padding:10}}>取消</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1,padding:2,margin:10,flexDirection:'row',justifyContent:'center',alignItems:'center',
                    backgroundColor:'#33cd5f',borderRadius:6}}
                                      onPress={
                            ()=>{
                                this.wxShare();
                            }
                        }>
                        <Text style={{color:'#fff',padding:10}}>确认</Text>
                    </TouchableOpacity>
                </View>
                </Image>
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
        borderTopColor:'#fff'
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = WxShareModal;
