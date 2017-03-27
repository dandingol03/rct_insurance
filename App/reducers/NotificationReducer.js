

import {
    MAKE_MESSAGE_POP,
    UPDATE_NOTIFICATIONS
} from '../constants/JpushConstants';

const initialState = {
    num:1,
    msg:null,
    notifications:null,
    onFresh:true
};

let maintainReducer = (state = initialState, action) => {

    switch (action.type) {

        case MAKE_MESSAGE_POP:

            var {msg}=action.payload;

            return Object.assign({}, state,{
                num:state.num++,
                msg:msg,
                validate:true
            })
            break;
        case UPDATE_NOTIFICATIONS:

            var {notifications,onFresh}=action.payload;
            return Object.assign({}, state,{
                notifications:notifications,
                onFresh:onFresh
            })
            break;
        default:
            return state;
    }
}

export default maintainReducer;
