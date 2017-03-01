/**
 * Created by danding on 17/2/26.
 */
/**
 * Created by dingyiming on 2017/2/15.
 */


import UPDATE_SCORE_INFO from '../constants/ScoreConstants';

const initialState = {
    score:null
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case UPDATE_SCORE_INFO:

            const {data}=action.payload;
            return Object.assign({}, state, {
                score:data
            })
        default:
            return state;
    }
}

export default user;
