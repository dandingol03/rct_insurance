import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {
    SET_CAR_ORDERS_REFRESH,
    UPDATE_CAR_HISTORY_ORDERS,
    UPDATE_APPLIED_CAR_ORDERS,
    DISABLE_CARORDERS_ONFRESH,
    UPDATE_CAR_ORDER_MODIFY
} from '../constants/OrderConstants';

import {
    SET_CAR_MANAGE_REFRESH
} from '../constants/CarManageConstants';

export let enableCarManageRefresh=()=>{
    return {
        type:SET_CAR_MANAGE_REFRESH,
        data:true
    }
}

export let enableCarOrdersOnFresh=()=>{
    return {
        type:SET_CAR_ORDERS_REFRESH,
        data:true
    }
}

export let disableCarOrdersOnFresh=()=>{
    return {
        type:DISABLE_CARORDERS_ONFRESH
    }
}

export let fetchCarOrdersInHistory=()=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            var accessToken=state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getCarOrdersInHistory'
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        });
    }
}

export let fetchApplyedCarOrders=()=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state=getState();
            var accessToken=state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getApplyedCarOrders'
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })

        });
    }
}

export let updateCarOrdersInHistory=(payload)=>{
    return {
        type:UPDATE_CAR_HISTORY_ORDERS,
        payload:payload
    }
}

export let updateAppliedCarOrders=(payload)=>{
    return {
        type:UPDATE_APPLIED_CAR_ORDERS,
        payload:payload
    }
}

let setCarOrdersInHistory=(orders)=>{
    return {
        type:SET_CAR_HISTORY_ORDERS,
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

export let updateCarOrderModify=(payload)=>{
    return {
        type:UPDATE_CAR_ORDER_MODIFY,
        payload:payload
    }
}

export let updateInsuranceCarOrder=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            var {order,price}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'updateInsuranceCarOrder',
                    info: {
                        orderId: order.orderId,
                        fields:{
                            insurerId:19,
                            companyId:price.companyId,
                            discount:price.discount,
                            benefit:price.benefit,
                            insuranceFeeTotal:price.insuranceFeeTotal,
                            contractFee:price.contractFee,
                            commission:price.commission,
                            score:price.score,
                            exchangeMoney:price.exchangeMoney,
                            orderDate:new Date()
                        }

                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })

        });
    }
}

export let applyCarOrderPrice=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            var {price,invoiceTitle}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'applyCarOrderPrice',
                    info: {
                        price: price,
                        invoiceTitle:invoiceTitle
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        });
    }
}

export let getCarValidateState=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            var {carId}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getCarValidateState',
                    info:{
                        carId:carId
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })

        });
    }
}

export let getOrderStateByOrderId=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state = getState();
            var accessToken = state.user.accessToken;
            var {orderId}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getOrderStateByOrderId',
                    info:{
                        orderId:orderId,
                        type:'car'
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        })
    }
}

//修改车险订单状态
export let updateCarOrderState=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            var {orderId,orderState}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'updateCarOrderState',
                    info:{
                        orderId:orderId,
                        orderState:orderState
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        });
    }
}

//拉取车险订单和相关产品
export let fetchApplyedCarOrderByOrderId=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

            var {orderId}=payload;
            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getApplyedCarOrderByOrderId',
                    info:{
                        orderId:orderId
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        });
    }
}

//拉取邮箱地址
export let fetchRecvAddresses=()=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getCustomerMailAddresses',
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })

        });
    }
}


export let getCarInfoByCarNum=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            var carInfo=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getCarInfoByCarNum',
                    info:{
                        carNum:carInfo.carNum,
                        ownerName:carInfo.ownerName
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        });
    }
}

//拉取车险订单
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
















//创建车辆
export let createCarInfo=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state = getState();
            var accessToken = state.user.accessToken;
            var {carInfo}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getCarInfoByCarNum',
                    info:{
                        carNum:carInfo.carNum,
                        ownerName:carInfo.ownerName
                    }
                }
            }).then((json)=>{
                if(json.re==1) {
                    //TODO:核实已匹配车牌号
                    resolve({re:2,data:'你提交的车牌号重复,请重新填入后提交'})
                }else if(json.re==-1){


                    Proxy.postes({
                        url: Config.server + '/svr/request',
                        headers: {
                            'Authorization': "Bearer " + accessToken,
                            'Content-Type': 'application/json'
                        },
                        body: {
                            request: 'uploadCarAndOwnerInfo',
                            info:carInfo
                        }
                    }).then((json)=>{

                        if(json.re==1){

                            resolve(json)
                        }

                    })
                }
            }).catch((e)=>{
                reject(e)
            })

        });
    }
}

export let updateCarInfo=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state = getState();
            var accessToken = state.user.accessToken;
            var {carId,licenseAttachId1,licenseAttachId2,licenseAttachId3}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'updateCarInfo',
                    info:{
                        carId:carId,
                        licenseAttachId1:licenseAttachId1,
                        licenseAttachId2:licenseAttachId2,
                        licenseAttachId3:licenseAttachId3
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        });
    }
}

export let uploadPhoto=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            var {path,filename,imageType,carId,docType}=payload;

            var data = new FormData();
            data.append('file', {uri: path, name: filename, type: 'multipart/form-data'});

            var suffix=null;
            var reg=/.*?\.(.*)/;
            var re=reg.exec(path);
            if(re!=null&&re[1])
            {
                suffix=re[1];
            }

            //限定为jpg后缀
            Proxy.post({
                url:Config.server+'/svr/request?request=uploadPhoto&suffix='+suffix+'&imageType='+
                    imageType+'&filename='+filename+'&carId='+carId,
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type':'multipart/form-data',
                },
                body: data,
            },(json)=> {

                Proxy.postes({
                    url: Config.server + '/svr/request',
                    headers: {
                        'Authorization': "Bearer " + accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        request: 'createPhotoAttachment',
                        info:{
                            imageType:imageType,
                            filename:filename,
                            suffix:suffix,
                            docType:docType,
                            carId:carId
                        }
                    }
                }).then((json)=>{
                    resolve(json)
                }).catch((e)=>{
                  reject(e)
                })

            }, (err) =>{
              reject(err)
            });

        });
    }
}

export let uploadCarAndOwnerInfo=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state = getState();
            var accessToken = state.user.accessToken;
            var carInfo=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'uploadCarAndOwnerInfo',
                    info:carInfo
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e);
            })
        });
    }
}


//保存车辆信息
export let postCarInfo= (payload)=> {
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            const state = getState();
            var accessToken = state.user.accessToken;
            var {carInfo}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'uploadCarAndOwnerInfo',
                    info:carInfo
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e);
            })
        });
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
