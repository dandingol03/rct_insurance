/**
 * Created by danding on 17/4/6.
 */
import {
    PAGE_REGISTER,
    PAGE_LOGIN,
    PAGE_PASSWORDFORGET,
    UPDATE_PAGE_STATE,
    UPDATE_NAVIGATOR
} from '../constants/PageStateConstants';

const initialState = {
    navigators:{
        home:null,
        my:null,
        chat:null
    }
};

let navigatorState = (state = initialState, action) => {

    switch (action.type) {


        case UPDATE_NAVIGATOR:
            var {route,navigator}=action.payload;
            var _navigators=state.navigators;
            _navigators[route]=navigator;
            return Object.assign({}, state, {
                navigators:_navigators
            })
            break;
        default:
            return state;
    }
}

export default navigatorState;
