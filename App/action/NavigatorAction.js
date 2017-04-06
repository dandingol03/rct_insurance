
import {
    UPDATE_NAVIGATOR
} from '../constants/PageStateConstants';

export let updateNavigator=(payload)=>{
    return (dispatch,getState)=> {
        dispatch({
            type:UPDATE_NAVIGATOR,
            payload:payload
        });
    }
}


