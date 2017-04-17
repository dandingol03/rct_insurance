
import {
    ON_WS_RECV
} from '../constants/WebsocketConstants';

import _ from 'lodash';


const initialState = {
    msg:null,
    messages:[]
};

let ws = (state = initialState, action) => {

    switch (action.type) {

        case ON_WS_RECV:

            if(action.payload.type=='fromThem'){

                var msg={};
                msg.content=action.payload.msg;
                msg.type='plain';
                msg.source=action.payload.type;
                msg.createdAt=new Date();
                msg._id=action.payload._id;
            }else{
                var {msg,type}=action.payload;
                msg.source=type;
            }

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

export default ws;
