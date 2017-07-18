/**
 * Created by dingyiming on 2017/2/15.
 */
import * as types from '../action/types';
import {
    UPDATE_PERSON_INFO,
    UPDATE_SCORE,
    UPDATE_CERTIFICATE,
    UPDATE_PORTRAIT
} from '../constants/UserConstants';

import {
    UPDATE_TTS_TOKEN
} from '../constants/TTSConstants';

const initialState = {
    accessToken: null,
    auth:false,
    personInfo:null,
    contactInfo:null,
    score:null,
    ttsToken:null,
    portrait:null
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case types.ACCESS_TOKEN_ACK:

            return Object.assign({}, state, {
                accessToken: action.accessToken,
                validate:action.validate,
                auth:action.auth
            })
        case UPDATE_PERSON_INFO:
            var  {data}=action.payload;
            return Object.assign({}, state, {
                personInfo:data
            })
            break;
        case UPDATE_SCORE:
            var {data}=action.payload;
            return Object.assign({}, state, {
                score:data
            })
            break;
        case UPDATE_CERTIFICATE:
            var {username,password}=action.payload;
            return Object.assign({}, state, {
                username:username,
                password:password
            })
            break;
        case UPDATE_TTS_TOKEN:
            var {ttsToken}=action.payload;
            return Object.assign({}, state, {
                ttsToken:ttsToken
            })
            break;

        case UPDATE_PORTRAIT:
            var data=action.payload;
            return Object.assign({}, state, {
                portrait:data
            })
            break;

        default:
            return state;
    }
}

export default user;
