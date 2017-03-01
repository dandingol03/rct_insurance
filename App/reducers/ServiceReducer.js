import {UPDATE_SERVICE_ORDERS} from '../constants/ServiceConstants';

const initialState = {
    orders:null
};

let service = (state = initialState, action) => {

    switch (action.type) {

        case UPDATE_SERVICE_ORDERS:
            var {orders}=action.payload;
            return Object.assign({}, state, {
                orders: orders
            })
        default:
            return state;
    }
}

export default service;
