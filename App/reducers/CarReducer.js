
import {
    SET_CAR_ORDERS_REFRESH,
    UPDATE_CAR_HISTORY_ORDERS,
    UPDATE_APPLIED_CAR_ORDERS,
    DISABLE_CARORDERS_ONFRESH,
    UPDATE_CAR_ORDER_MODIFY
} from '../constants/OrderConstants';
import {
    SET_CAR_MANAGE_REFRESH
} from '../constants/CarManageConstants';


const initialState = {
    historyOrders:null,
    appliedOrders:null,
    onFresh:true,
    carManage:{
        onFresh:true
    },
    carOrdermodify:{
        flag:false
    }
};

let car = (state = initialState, action) => {

    switch (action.type) {

        case SET_CAR_ORDERS_REFRESH:

            return Object.assign({}, state, {
                onFresh:true
            })
            break;
        case SET_CAR_MANAGE_REFRESH:
            return Object.assign({}, state, {
                carManage:Object.assign(state.carManage,{refresh:true})
            })
            break;

        case UPDATE_CAR_HISTORY_ORDERS:

            var {historyOrders}=action.payload;
            return Object.assign({}, state, {
                historyOrders:historyOrders
            })
            break;
        case UPDATE_APPLIED_CAR_ORDERS:
            var {appliedOrders}=action.payload;
            return Object.assign({}, state, {
                appliedOrders:appliedOrders
            })
            break;
        case DISABLE_CARORDERS_ONFRESH:
            return Object.assign({}, state, {
                onFresh:false
            })
            break;

        case UPDATE_CAR_ORDER_MODIFY:
            return Object.assign({}, state, {
                carOrdermodify:Object.assign(state.carOrdermodify,action.payload)
            })
            break;
        default:
            return state;
    }
}

export default car;
