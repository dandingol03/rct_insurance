
import {
    SET_CAR_ORDERS_REFRESH
} from '../constants/OrderConstants';

const initialState = {
    orders:null,
    refresh:true
};

let car = (state = initialState, action) => {

    switch (action.type) {

        case SET_CAR_ORDERS_REFRESH:

            return Object.assign({}, state, {
                refresh:true
            })
        default:
            return state;
    }
}

export default car;
