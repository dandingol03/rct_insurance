/**
 * Created by dingyiming on 2017/2/15.
 */

import UPDATE_SCORE_INFO from '../constants/ScoreConstants';
var Proxy = require('../proxy/Proxy');


export let updateScoreInfo=(payload)=>{
    return {
        type:UPDATE_SCORE_INFO,
        payload:payload
    }
}





