import {
    UPDATE_SERVICE_ORDERS,
    SELECT_SERVICE_TAB,
    ENABLE_SERVICE_ORDERS_REFRESH,
    DISABLE_SERVICE_ORDERS_REFRESH,
    ENABLE_SERVICE_ORDERS_CLEAR
} from '../constants/ServiceConstants';

const initialState = {
    orders:null,
    center: {
        latitude: 36.67205,
        longitude: 117.14501
    },
    tabIndex:0,
    clear:false,
    onFresh:true
};

let service = (state = initialState, action) => {

    switch (action.type) {

        case UPDATE_SERVICE_ORDERS:
            var {orders}=action.payload;
            return Object.assign({}, state, {
                orders: orders
            })

        case SELECT_SERVICE_TAB:

            var {tabIndex}=action.payload;
            return Object.assign({}, state, {
                tabIndex: tabIndex
            });
            break;
        case ENABLE_SERVICE_ORDERS_REFRESH:

            return Object.assign({}, state, {
                onFresh: true
            });
            break;
        case DISABLE_SERVICE_ORDERS_REFRESH:
            return Object.assign({}, state, {
                onFresh: false
            })
            break;
        case ENABLE_SERVICE_ORDERS_CLEAR:
            return Object.assign({}, state, {
                clear: true
            });
            break;
        default:
            return state;
    }
}

export default service;
