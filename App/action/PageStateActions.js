import Config from '../../config';
var Proxy = require('../proxy/Proxy');


import {
    PAGE_LOGIN,
    PAGE_REGISTER,
    UPDATE_PAGE_STATE
} from '../constants/PageStateConstants';


//更新登录前的页面状态
export let updatePageState=(payload)=>{

    return (dispatch,getState)=> {
        dispatch({
            type:UPDATE_PAGE_STATE,
            payload:payload
        });
    }
}


