/**
 * Created by dingyiming on 2017/2/15.
 */
import { combineReducers } from 'redux';

import user from './user';
import timer from './timer';
import life from './life';
import car from './CarReducer';
import serviceReducer from './ServiceReducer';
import maintainReducer from './MaintainReducer';
import notification from './NotificationReducer';

export default rootReducer = combineReducers({
    user,
    timer,
    life,
    carOrders:car,
    service:serviceReducer,
    maintain:maintainReducer,
    notification:notification
})
