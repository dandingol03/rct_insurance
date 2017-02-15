/**
 * Created by dingyiming on 2017/2/15.
 */
import * as types from '../action/types';

const initialState = {
    accessToken: null,
    auth:false,
    personInfo:null
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case types.ACCESS_TOKEN_ACK:

            return Object.assign({}, state, {
                accessToken: action.accessToken,
                validate:action.validate,
                auth:action.auth
            })
        case types.GET_PERSON_INFO:
            return Object.assign({}, state, {
                personInfo:action.personInfo
            })

        default:
            return state;
    }
}

export default user;