import {
    PAGE_REGISTER,
    PAGE_LOGIN,
    UPDATE_PAGE_STATE
} from '../constants/PageStateConstants';

const initialState = {
    state:PAGE_LOGIN
};

let pageState = (state = initialState, action) => {

    switch (action.type) {

        case UPDATE_PAGE_STATE:
            return Object.assign({}, state, {
                state:action.payload.state
            })
        default:
            return state;
    }
}

export default pageState;
