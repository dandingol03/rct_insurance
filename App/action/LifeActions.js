/**
 * Created by dingyiming on 2017/2/28.
 */
import * as types from './types';
import Config from '../../config';
var Proxy = require('../proxy/Proxy');

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