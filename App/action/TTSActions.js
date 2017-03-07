import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {UPDATE_TTS_TOKEN} from '../constants/TTSConstants';


export let updateTTSToken=(payload)=>{
    return {
        type:UPDATE_TTS_TOKEN,
        payload:payload
    }
}

export let activeTTSToken=(payload)=>{

    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            var accessToken=null;
            if(payload&&payload.accessToken)
                accessToken=payload.accessToken;
            else
                accessToken=state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getTTSToken'
                }
            }).then(function (json) {
                if(json.re==1)
                {
                    dispatch(updateTTSToken({ttsToken:json.data}));
                    resolve({re:1});
                }else{
                    reject(json.data);
                }
            })



        });
    }
}
