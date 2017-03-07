import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {
    SET_CAR_ORDERS_REFRESH
} from '../constants/OrderConstants';


export let enableCarOrderRefresh=()=>{
    return {
        type:SET_CAR_ORDERS_REFRESH,
        data:true
    }
}

//审车订单中用于搜索不在订单状态的车辆
export let fetchCarsNotInDetectState=function () {

    return (dispatch,getState)=>{

        return new Promise((resolve, reject) => {

            const state = getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'fetchCarsNotInDetectState'
                }
            }).then( (json) =>{

                var cars=[];

                if (json.re== 1&&json.data!==undefined&&json.data!==null) {
                    cars=json.data;
                    resolve({re:1,data:cars});
                }
                else{
                    resolve({re:1,data:cars})
                }
            }).catch(function (err) {
                reject(err)
                alert(err);
            })


        })
    }
}
