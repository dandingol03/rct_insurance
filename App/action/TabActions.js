/**
 * Created by danding on 17/4/8.
 */
import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {
    UPDATE_ROOT_TAB
} from '../constants/TabConstants';

export let updateRootTab=(payload)=>{
    return {
        type:UPDATE_ROOT_TAB,
        payload:payload
    }
}

