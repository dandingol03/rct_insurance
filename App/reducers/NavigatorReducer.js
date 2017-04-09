/**
 * Created by danding on 17/4/6.
 */
import {
    PAGE_REGISTER,
    PAGE_LOGIN,
    PAGE_PASSWORDFORGET,
    UPDATE_PAGE_STATE,
    UPDATE_NAVIGATOR
} from '../constants/PageStateConstants';

const initialState = {
    navigators:{
        home:null,
        my:null,
        chat:null
    },
    queue:['maintain']
};

let navigatorState = (state = initialState, action) => {

    switch (action.type) {


        case UPDATE_NAVIGATOR:
            var {route,navigator,queue}=action.payload;
            var _navigators=state.navigators;
            var routes=navigator.getCurrentRoutes();
            _navigators[routes[0].name]=navigator;
            var _queue=_.cloneDeep(state.queue)
            if(queue)
                _queue=queue;
            return Object.assign({}, state, {
                navigators:_navigators,
                queue:queue
            })
            break;
        default:
            return state;
    }
}

export default navigatorState;
