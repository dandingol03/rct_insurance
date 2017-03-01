/**
 * Created by danding on 17/2/27.
 */
/**
 * Created by dingyiming on 2017/2/15.
 */

import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {
    UPDATE_PERSON_INFO,
    UPDATE_SCORE,
    SAVE_CONTACT_INFO
} from '../constants/UserConstants';


export let updatePersonInfo=(payload)=>{
    return {
        type:UPDATE_PERSON_INFO,
        payload:payload
    }
}


export let updateScore=(payload)=>{
    return {
        type:UPDATE_SCORE,
        payload:payload
    }
}

export let saveContactInfo=(payload)=>{

    return (dispatch,getState)=> {

        const state=getState();
        var accessToken=state.user.accessToken;

        Proxy.postes({
            url: Config.server + '/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request: 'saveContactInfo',
                info:{
                    info:payload
                }
            }
        }).then(function (json) {

            if(json.re==1) {
                dispatch(updatePersonInfo({data:json.data}));
            }

        }).catch(function (err) {
            alert(err);
        })

    }
}





