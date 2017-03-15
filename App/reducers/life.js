/**
 * Created by dingyiming on 2017/2/20.
 */

import {
    SET_LIFE_HISTORY_ORDERS,
    SET_LIFE_PRICED_ORDERS,
    SET_LIFE_APPLYED_ORDERS,
    ENABLE_LIFEORDERS_ONFRESH,
    DISABLE_LIFEORDERS_ONFRESH,
    SET_LIFE_PLANS,
    SET_LIFE_PLAN_DETAIL
} from '../constants/LifeConstants';

const initialState = {
    historyOrders:[],
    pricedOrders:[],
    applyedOrders:[],
    onFresh:true,
    plans:[],
    planDetail:{},

};

let life = (state = initialState, action) => {
    switch (action.type) {
        case SET_LIFE_HISTORY_ORDERS:
            return Object.assign({}, state, {
                historyOrders:action.orders
            })
        case SET_LIFE_PRICED_ORDERS:
            return Object.assign({}, state, {
                pricedOrders:action.orders
            })
        case SET_LIFE_APPLYED_ORDERS:
            return Object.assign({}, state, {
                applyedOrders:action.orders
            })
        case ENABLE_LIFEORDERS_ONFRESH:
            return Object.assign({}, state, {
                onFresh:true
            })
        case DISABLE_LIFEORDERS_ONFRESH:
            return Object.assign({}, state, {
                onFresh:false
            })

        case SET_LIFE_PLANS:
            return Object.assign({}, state, {
                plans:action.plans
            })
        case SET_LIFE_PLAN_DETAIL:
            return Object.assign({}, state, {
                planDetail:action.planDetail
            })

        default:
            return state;
    }
}

export default life;