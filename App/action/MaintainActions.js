
import Config from '../../config';
var Proxy = require('../proxy/Proxy');

import {
    UPDATE_MAINTAIN_BUSINESS
} from '../constants/MaintainConstants';


export let updateMaintainBusiness=(payload)=>{

    return {
        type:UPDATE_MAINTAIN_BUSINESS,
        payload:payload
    }
}
