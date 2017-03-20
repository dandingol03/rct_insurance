

import {
    UPDATE_MAINTAIN_BUSINESS
} from '../constants/MaintainConstants';

const initialState = {
    description:{},
    accident:null,
    serviceType:null,
    subServiceTypes:null
};

let maintainReducer = (state = initialState, action) => {

    switch (action.type) {

        case UPDATE_MAINTAIN_BUSINESS:

            return Object.assign({}, state, action.payload)
        default:
            return state;
    }
}

export default maintainReducer;
