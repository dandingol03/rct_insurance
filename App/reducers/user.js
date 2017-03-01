/**
 * Created by dingyiming on 2017/2/15.
 */
import * as types from '../action/types';
import {UPDATE_PERSON_INFO,UPDATE_SCORE} from '../constants/UserConstants';

const initialState = {
    accessToken: null,
    auth:false,
    personInfo:null,
    contactInfo:null,
    score:null
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
        default:
            return state;
    }
}

export default user;
