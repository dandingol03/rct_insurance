
import {
    ON_WS_RECV
} from '../constants/WebsocketConstants';

import _ from 'lodash';


const initialState = {
    msg:null,
    messages:[]
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case ON_WS_RECV:

            var {msg}=action.payload;
            var _messages=_.cloneDeep(state.messages);
            _messages.push(msg);
            return Object.assign({}, state, {
                msg: msg,
                messages:_messages
            })

        default:
            return state;
    }
}

export default user;
