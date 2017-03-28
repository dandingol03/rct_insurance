

import {
    MAKE_MESSAGE_POP,
    NOTIFICATION_RECVED,
} from '../constants/JpushConstants';

const initialState = {
    num:1,
    msg:null,
    recved:false,
};

let NotificationReducer = (state = initialState, action) => {

    switch (action.type) {

        case NOTIFICATION_RECVED:
            return Object.assign({}, state,{
                recved:true
            })

        case MAKE_MESSAGE_POP:
            var {msg}=action.payload;
            return Object.assign({}, state,{
                num:state.num++,
                msg:msg
            })
        default:
            return state;
    }
}

export default NotificationReducer;
