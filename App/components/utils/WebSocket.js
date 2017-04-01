/**
 * Created by danding on 17/3/27.
 * 1.直接获取store内核
 * 2.对于每个消息添加队列进行保存，将send promise化
 */


import Store from '../../store/index'
import {
    recvWSMessage
} from '../../action/WebsocketActions';


var ob={
    cbs:[],
    tmpMsg:null,
    msgId:1,
    ws:null,
    getMsgId:function () {
        return this.msgId++;
    },
    connect:function () {
        this.ws = new window.WebSocket('ws://139.129.96.231:3010');
        this.ws.onopen=this.onopen.bind(this);
        this.ws.onmessage=this.onmessage.bind(this);
    },
    onopen:function(message) {
        console.log('=============websocket connection is established=============');

        this.cbs.map(function(item,i) {
            item(message);
        });

    },
    onerr:function(err) {
        console.log('connect error');
    },
    onclose:function(event) {
        console.log('websocket shutdown from server' + event.code);
    },
    onmessage:function(event) {
        var json=event.data;
        if(Object.prototype.toString.call(json)=='[object String]')
            json=JSON.parse(json);
        switch (json.type) {
            case 'ack':
                if(json.result=='ok')
                {
                    if(this.tmpMsg!==undefined&&this.tmpMsg!==null)
                    {
                        //TODO:make a dispatch
                        Store.dispatch(recvWSMessage(Object.assign({type:'fromMe'},this.tmpMsg)));
                        //$rootScope.msg.push(Object.assign({type:'fromMe'},self.tmpMsg));
                        //$rootScope.$emit('MSG_NEW');
                    }
                }else if(json.result=='error')
                {
                    if(json.reason=='no waiter online')
                    {
                        // var myPopup = $ionicPopup.alert({
                        //     template: '现在没有可进行咨询的工作人员',
                        //     title: '错误'
                        // });
                    }
                }else{}
                break;
            case 'notify':
                console.log('msg come from '+json.from);
                console.log('msg ='+json.msg);
                Store.dispatch(recvWSMessage(Object.assign({type:'fromThem'},json.msg)));
                //$rootScope.msg.push(Object.assign({type:'fromThem'},json.msg));
                //$rootScope.$emit('MSG_NEW');
                break;
            default:
                break;
        }
    },
    login:function (username,password,accessToken) {
        var info= {
            action:'login',
            msgid: this.getMsgId(),
            timems:new Date().getTime(),
            token:accessToken,
            username:username,
            password:password
        };
        if(Object.prototype.toString.call(info)!='[object String')
            info=JSON.stringify(info);
        this.ws.send(info);
    },
    send:function(msg) {
        var info=msg;
        this.tmpMsg=msg;
        if(Object.prototype.toString.call(info)!='[object String')
            info=JSON.stringify(info);
        this.ws.send(info);
    }
}
module.exports=ob;
