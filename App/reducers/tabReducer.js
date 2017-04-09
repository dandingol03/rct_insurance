/**
 * Created by danding on 17/4/8.
 */

import {
    UPDATE_ROOT_TAB
} from '../constants/TabConstants';



const initialState = {
    rootTab:'home',
};

let car = (state = initialState, action) => {

    switch (action.type) {

        case UPDATE_ROOT_TAB:
            var {tab}=action.payload;
            return Object.assign({}, state, {
                rootTab:tab
            })
            break;
        default:
            return state;
    }
}

export default car;
