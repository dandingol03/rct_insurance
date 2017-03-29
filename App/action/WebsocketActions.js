
import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {fetchAccessToken} from '../action/actionCreator';

import {
    ON_WS_RECV
} from '../constants/WebsocketConstants';


export let recvWSMessage=(payload)=>{
    return (dispatch,getState)=> {
        dispatch({
            type:ON_WS_RECV,
            payload:payload
        });
    }
}
