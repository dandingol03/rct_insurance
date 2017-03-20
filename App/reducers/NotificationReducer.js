

import {
    MAKE_MESSAGE_POP
} from '../constants/JpushConstants';

const initialState = {
    num:1,
    msg:null
};

let NotificationReducer = (state = initialState, action) => {

    switch (action.type) {

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
