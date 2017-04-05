
import Config from '../../config';
var Proxy = require('../proxy/Proxy');

import {
    SET_LIFE_HISTORY_ORDERS,
    SET_LIFE_PRICED_ORDERS,
    SET_LIFE_APPLYED_ORDERS,
    ENABLE_LIFEORDERS_ONFRESH,
    DISABLE_LIFEORDERS_ONFRESH,
    SET_LIFE_PLANS,
    SET_LIFE_PLAN_DETAIL
    } from '../constants/LifeConstants';

export let setLifeOrdersInHistory=(orders)=>{
    return {
        type:SET_LIFE_HISTORY_ORDERS,
        orders:orders
    }
}

export let setLifeOrdersInPriced=(orders)=>{
    return {
        type:SET_LIFE_PRICED_ORDERS,
        orders:orders
    }
}

export let setLifeOrdersInApplyed=(orders)=>{
    return {
        type:SET_LIFE_APPLYED_ORDERS,
        orders:orders
    }
}

export let enableLifeOrdersOnFresh=()=>{
    return {
        type:ENABLE_LIFEORDERS_ONFRESH,
    }
}

export let disableLifeOrdersOnFresh=()=>{
    return {
        type:DISABLE_LIFEORDERS_ONFRESH,
    }
}

export let setLifePlans=(plans)=>{
    return {
        type:SET_LIFE_PLANS,
        plans:plans
    }
}

export let setLifePlanDetail=(plan)=>{
    return {
        type:SET_LIFE_PLAN_DETAIL,
        planDetail:plan
    }
}


export let fetchLifeOrders=function () {


    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            var accessToken=state.user.accessToken;

            var orders = null;
            var applyedOrders=[];
            var pricedOrders=[];
            var historyOrders=[];

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getLifeOrders'
                }
            }).then((json)=>{


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


                        resolve({re:1});
                    }
                }

            }).catch((err)=>{
                reject(err)
            })
        });
    }

}


export let updateLifeModified=function(plans,modifiedPlan) {
    return dispatch => {
        plans.map(function (item, i) {
            if (item.planId == modifiedPlan.planId) {
                item = modifiedPlan;
            }

        })
        dispatch(setLifePlans(plans));
    }
}
