/**
 * Created by dingyiming on 2017/2/15.
 */
import { combineReducers } from 'redux';

import user from './user';
import timer from './timer';
import lifeOrders from './lifeOrders';

export default rootReducer = combineReducers({
    user,
    timer,
    lifeOrders
})
