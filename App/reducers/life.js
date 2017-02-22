/**
 * Created by dingyiming on 2017/2/20.
 */

import * as types from '../action/types';

const initialState = {
    historyOrders:[],
    pricedOrders:[],
    applyedOrders:[],
    onFresh:true
};

let lifeOrders = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_LIFE_HISTORY_ORDERS:
            return Object.assign({}, state, {
                historyOrders:action.orders
            })
        case types.SET_LIFE_PRICED_ORDERS:
            return Object.assign({}, state, {
                pricedOrders:action.orders
            })
        case types.SET_LIFE_APPLYED_ORDERS:
            return Object.assign({}, state, {
                applyedOrders:action.orders
            })
        case types.ENABLE_LIFEORDERS_ONFRESH:
            return Object.assign({}, state, {
                onFresh:true
            })
        case types.DISABLE_LIFEORDERS_ONFRESH:
            return Object.assign({}, state, {
                onFresh:false
            })

        default:
            return state;
    }
}

export default lifeOrders;