/**
 * Created by dingyiming on 2017/2/15.
 */
import * as types from './types';
var Proxy = require('../proxy/Proxy');
import Config from '../../config';
import {updatePersonInfo,updateScore,updateCertificate} from './UserActions';
import {updateRegistrationId} from './JpushActions';
import {activeTTSToken} from './TTSActions';
import WS from '../components/utils/WebSocket';

export let loginAction=function(username,password,cb){

    return dispatch=> {

        dispatch(onOauth());

        var accessToken=null;

        Proxy.postes({
            url: Config.server + '/login',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "grant_type=password&password=" + password + "&username=" + username
        }).then((json)=> {
             accessToken = json.access_token;

            //TODO:make a dispatch
            updateCertificate({username: username, password: password});

            return Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getPersonInfoByPersonId'
                }
            });
        }).then((json) => {

            if (json.re == 1) {
                dispatch(updatePersonInfo({data: json.data}));
            }

            return Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'fetchScoreBalance'
                }
            });
        }).then((json)=> {

            if (json.re == 1) {
                dispatch(updateScore({data: json.data}));
            }

            //update registrationId
            return updateRegistrationId({accessToken: accessToken});
        }).then((json)=>{

            //activate tts token
            return dispatch(activeTTSToken({accessToken:accessToken}));
        }).then((json)=> {


            return Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getPersonalContactInfo'
                }
            });
        }).then((json)=>{


            //ws端 登录
            WS.login(username,password,accessToken);


            dispatch(getAccessToken(accessToken));
            dispatch(clearTimerAction());
            if (cb)
                cb();


        }).catch((err)=> {
            dispatch(getAccessToken(null));
            dispatch(clearTimerAction());
            if (cb)
                cb();
        });
    }

}


export let setTimerAction=function (timer) {
    return dispatch=>{
        dispatch({
            type: types.TIMER_SET,
            timer:timer
        });
    };
}

export let clearTimerAction=function () {
    return dispatch=>{
        dispatch({
            type: types.TIMER_CLEAR
        });
    };
}



let onOauth= () => {
    return {
        type:types.AUTH_BY_OAUTH
    };
}

let getAccessToken= (accessToken)=>{
    if(accessToken!==null)
        return {
            type: types.ACCESS_TOKEN_ACK,
            accessToken: accessToken,
            auth:true,
            validate:true
        };
    else
        return {
            type:types.ACCESS_TOKEN_ACK,
            accessToken:accessToken,
            auth:'failed'
        }
}



export let selectCarAction=function(car){
    return {
        type:types.SELECT_CUSTOMER_CAR,
        car:car
    }
}



let setCarOrdersInHistory=(orders)=>{
    return {
        type:types.SET_CAR_HISTORY_ORDERS,
        orders:orders
    }
}

let setCarOrdersInPricedAndInPricing=(orders)=>{
    return {
        type:types.SET_CAR_PRICED_AND_PRICING_ORDERS,
        orders:orders
    }
}

let setCarOrdersInApplyed=(orders)=>{
    return {
        type:types.SET_CAR_APPLYED_ORDERS,
        orders:orders
    }
}

export let enableCarOrdersOnFresh=()=>{
    return {
        type:types.ENABLE_CARORDERS_ONFRESH
    }
}

let disableCarOrdersOnFresh=()=>{
    return {
        type:types.DISABLE_CARORDERS_ONFRESH
    }
}

let setLifeOrdersInHistory=(orders)=>{
    return {
        type:types.SET_LIFE_HISTORY_ORDERS,
        orders:orders
    }
}

let setLifeOrdersInPriced=(orders)=>{
    return {
        type:types.SET_LIFE_PRICED_ORDERS,
        orders:orders
    }
}

let setLifeOrdersInApplyed=(orders)=>{
    return {
        type:types.SET_LIFE_APPLYED_ORDERS,
        orders:orders
    }
}

export let enableLifeOrdersOnFresh=()=>{
    return {
        type:types.ENABLE_LIFEORDERS_ONFRESH
    }
}

let disableLifeOrdersOnFresh=()=>{
    return {
        type:types.DISABLE_LIFEORDERS_ONFRESH
    }
}


export let fetchCarOrders=function (accessToken,cb) {

    return dispatch=> {
        var pricedOrPricingOrders=[];
        Proxy.postes({
            url: Config.server + '/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request: 'getCarOrdersInHistory'
            }
        }).then(function (json) {
            var historyOrders=[];
            if(json.re==1) {
                historyOrders=json.data;
            }

            if(historyOrders !== undefined && historyOrders !== null &&historyOrders.length > 0) {
                dispatch(setCarOrdersInHistory(historyOrders));
            }

            return Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getCarOrderInPricedState'
                }
            });
        }).then(function (json) {
            if(json.re==1)
            {
                pricedOrPricingOrders=json.data;
            }
            return Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getApplyedCarOrders'
                }
            });
        }).then(function (json) {
            var applyedOrders=[];
            if(json.re==1)
            {
                if(json.data!==undefined&&json.data!==null)
                {
                    json.data.map(function (order,i) {
                        if(order.orderState==2)
                            pricedOrPricingOrders.push(order);
                        if(order.orderState==1)
                            applyedOrders.push(order);
                    })
                }
            }

            if(pricedOrPricingOrders !== undefined && pricedOrPricingOrders !== null &&pricedOrPricingOrders.length > 0)
                dispatch(setCarOrdersInPricedAndInPricing(pricedOrPricingOrders));
            if(applyedOrders !== undefined && applyedOrders !== null &&applyedOrders.length > 0)
                dispatch(setCarOrdersInApplyed(applyedOrders));
            dispatch(disableCarOrdersOnFresh());
            if(cb)
                cb();
        }).catch(function (err) {
            if(cb)
                cb();
            alert(err);
        })
    }

}

export let fetchLifeOrders=function (accessToken,cb) {
    var orders = null;
    var applyedOrders=[];
    var pricedOrders=[];
    var historyOrders=[];

    return dispatch=> {
        Proxy.postes({
            url: Config.server + '/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request: 'getLifeOrders'
            }
        }).then(function (res) {

            var json = res;
            if (json.re == 1) {
                orders = json.data;

                if (orders !== undefined && orders !== null &&orders.length > 0) {

                    orders.map(function (order, i) {
                        var date = new Date(order.applyTime);
                        // order.applyTime = date.getFullYear().toString() + '-'
                        //     + date.getMonth().toString() + '-' + date.getDate().toString();
                        if (order.orderState == 3) {
                            pricedOrders.push(order);
                        }
                        if (order.orderState == 5) {
                            historyOrders.push(order);
                        }
                        if (order.orderState == 1||order.orderState == 2) {
                            applyedOrders.push(order);
                        }

                    })

                    if(historyOrders !== undefined && historyOrders !== null &&historyOrders.length > 0)
                       dispatch(setLifeOrdersInHistory(historyOrders));
                    if(pricedOrders !== undefined && pricedOrders !== null &&pricedOrders.length > 0)
                       dispatch(setLifeOrdersInPriced(pricedOrders));
                    if(applyedOrders !== undefined && applyedOrders !== null &&applyedOrders.length > 0)
                        dispatch(setLifeOrdersInApplyed(applyedOrders));
                    dispatch(disableLifeOrdersOnFresh());
                    if(cb)
                        cb();
                }
            }

        }).catch(function (err) {
            if(cb)
                cb();
            alert(err);
        })
    }

}


export let setLifePlans=(plans)=>{
    return {
        type:types.SET_LIFE_PLANS,
        plans:plans
    }
}

export let setLifePlanDetail=(plan)=>{
    return {
        type:types.SET_LIFE_PLAN_DETAIL,
        planDetail:plan
    }
}


export let updateLifeModified=function(plans,modifiedPlan){
    return dispatch=> {
        plans.map(function(item,i){
            if(item.planId==modifiedPlan.planId){
                item = modifiedPlan;
            }

        })
        dispatch(setLifePlans(plans));
    }

}

