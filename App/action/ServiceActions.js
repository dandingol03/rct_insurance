import _ from 'lodash';
import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {UPDATE_SERVICE_ORDERS} from '../constants/ServiceConstants';



export let updateServiceOrders=(payload)=>{
    return {
        type:UPDATE_SERVICE_ORDERS,
        payload:payload
    }
}


export let fetchServiceOrders=function () {

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
                        request: 'fetchServiceOrderByCustomerId'
                    }
                }).then(function (json) {

                    if (json.re == 1) {
                    }
                    resolve(json);
                    dispatch(updateServiceOrders({orders: json.data}));
                }).catch(function (err) {
                    reject(err)
                    alert(err);
                })


            })
        }

}

let fetchPlaceInfo=function (payload) {
    return new Promise((resolve,reject)=>{

        var {_order,accessToken}=payload;

        var _order=_.cloneDeep(_order);

        Proxy.postes({
            url: Config.server + '/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request: 'getServicePlaceNameByPlaceId',
                info:{
                    type:'place',
                    placeId:_order.servicePlaceId
                }
            }
        }).then(function (res) {
            var json=res;
            if(json.re==1) {
                _order.servicePlace=json.data;
            }
            resolve({re:1,data:_order});
        }).catch(function (e) {
            reject({re:-1,error:e});
        })


    });
}


let fetchRelativeInfo=function (payload) {

        return new Promise((resolve, reject) => {

            var {order,accessToken}=payload;
            var _order=_.cloneDeep(order);

            if(_order.servicePersonId!==undefined&&_order.servicePersonId!==null)
            {
                //单个派送

                Proxy.postes({
                    url: Config.server + '/svr/request',
                    headers: {
                        'Authorization': "Bearer " + accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request: 'getInfoPersonInfoByServicePersonId',
                        info:{
                            servicePersonId:_order.servicePersonId
                        }
                    }
                }).then(function (json) {
                    if(json.re==1)
                    {
                        _order.servicePerson=json.data;
                    }
                    resolve({re:1,data:_order});
                }).catch(function (e) {
                    reject(e);
                })


            }else{
                //范围派送

                Proxy.postes({
                    url: Config.server + '/svr/request',
                    headers: {
                        'Authorization': "Bearer " + accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request: 'fetchServiceOrderCandidateByOrderId',
                        info:{
                            orderId:_order.orderId
                        }
                    }
                }).then(function(json) {

                    if(json.re==1)
                    {
                        _order.candidates=json.data;
                        if(_order.candidates!==undefined&&_order.candidates!==null&&_order.candidates.length>0)
                        {
                            _order.candidates[0].checked=true;
                        }
                    }
                    resolve({re:1,data:_order});
                }).catch(function (e) {
                    reject(e);
                })

            }
        });

}


export let fetchAppliedOrderDetail=(payload)=>{

    return (dispatch,getState)=> {

        return new Promise((resolve, reject) => {

            const state = getState();
            var accessToken = state.user.accessToken;
            var {order}=payload;

            fetchRelativeInfo({order,accessToken}).then(function (json) {
                if(json.re==1)
                {
                    var _order=json.data;
                    if(_order.servicePlaceId!==undefined&&_order.servicePlaceId!==null)
                    {
                        fetchPlaceInfo({_order,accessToken}).then(function (json) {
                            resolve(json)
                        })
                    }else{
                        resolve({re:1,data:_order});
                    }
                }else{
                    resolve({re:2,data:null});
                }
            }).catch(function (e) {
                reject({re:-1,error:e});
            })

        });
    }
}
