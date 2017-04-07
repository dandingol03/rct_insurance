
import {
    SET_CAR_ORDERS_REFRESH
} from '../constants/OrderConstants';
import {
    SET_CAR_MANAGE_REFRESH
} from '../constants/CarManageConstants';


const initialState = {
    orders:null,
    refresh:true,
    carManage:{
        onFresh:true
    }
};

let car = (state = initialState, action) => {

    switch (action.type) {

        case SET_CAR_ORDERS_REFRESH:

            return Object.assign({}, state, {
                refresh:true
            })
            break;
        case SET_CAR_MANAGE_REFRESH:
            return Object.assign({}, state, {
                carManage:Object.assign(state.carManage,{refresh:true})
            })
            break;

        default:
            return state;
    }
}

export default car;
