import _ from 'lodash';
import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {
    UPDATE_SERVICE_ORDERS,
    UPDATE_MAP_CENTER,
    SELECT_SERVICE_TAB,
    ENABLE_SERVICE_ORDERS_CLEAR,
    ENABLE_SERVICE_ORDERS_REFRESH,
    DISABLE_SERVICE_ORDERS_REFRESH
} from '../constants/ServiceConstants';


import {
    Geolocation
} from 'react-native-baidu-map';

var bluebird = require('bluebird');

export let updateServiceOrders=(payload)=>{
    return {
        type:UPDATE_SERVICE_ORDERS,
        payload:payload
    }
}

export let enableServiceOrdersRefresh=(payload)=>{
    return {
        type:ENABLE_SERVICE_ORDERS_REFRESH,
        payload:payload
    }
}

export let disableServiceOrdersRefresh=(payload)=>{
    return {
        type:DISABLE_SERVICE_ORDERS_REFRESH,
        payload:payload
    }
}

export let enableServiceOrdersClear=(payload)=>{
    return {
        type:ENABLE_SERVICE_ORDERS_CLEAR,
        payload:payload
    }
}


export  let selectTab=(payload)=>{
    return {
        type:SELECT_SERVICE_TAB,
        payload:payload
    }
}



//批量创建侯选人员
export let updateCandidateState=(payload)=>{

    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            const state = getState();
            var accessToken = state.user.accessToken;
            var {order,servicePersonIds}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'updateCandidateState',
                    info:{
                        orderId: order.orderId,
                        servicePersonIds: servicePersonIds,
                        candidate:1
                    }
                }
            }).then((json)=>{

                resolve(json);
            }).catch((e)=>{
                reject(e);
            })


        });
    }

}


export let generateCarServiceOrder=(payload)=>{

    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {


            const state = getState();
            var accessToken = state.user.accessToken;
            var {carManage}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'generateCarServiceOrder',
                    info:{
                        carManage:carManage,
                        serviceType:carManage.serviceType
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e);
            })



        });
    }
}


export let generateCarServiceOrderFee=(payload)=>{

    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            const state = getState();
            var accessToken = state.user.accessToken;
            var {carManage}=payload;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'generateCarServiceOrderFee',
                    info:{
                        carManage:carManage,
                        serviceType:carManage.serviceType
                    }
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e);
            })


        });
    }

}


export let createNewCustomerPlace=(payload)=>{

    return (dispatch,getState)=>{

        return new Promise((resolve, reject) => {

            const state = getState();
            var accessToken = state.user.accessToken;
            var {destination}=payload;



            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'createNewCustomerPlace',
                    info:{
                        title:destination.title,
                        address:destination.address,
                        longitude:destination.lng,
                        latitude:destination.lat
                    }
                }
            }).then((json)=>{
                resolve(json);
            }).catch((err)=>{
                reject('选择地点错误，请重新选择您的取车地点');
            });



        });
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


let onMapCenterUpdate=(payload)=>{
    return {
        type:UPDATE_MAP_CENTER,
        payload:payload
    }
}

//刷新百度地图中心
export let updateMapCenter=(payload)=>{
    return (dispatch,getState)=> {
        dispatch(onMapCenterUpdate(payload));

    }
}

//获得数据点的分布情况
let getDataDistribution=(payload)=>{

    return new Promise((resolve, reject) => {

        var {center,places,threshold}=payload;

        var records=[];
        var recordCount=0;
        var stepF=0;
        for(var  i=0;i<places.length;i++)
        {
            let place=places[i];
            if (place.longitude !== undefined && place.longitude !== null &&
                place.latitude !== undefined && place.latitude !== null&&
                place.town!==undefined&&place.town!==null&&place.town!='') {


                //TODO:use Geolocation to compute
                Geolocation.getMetersBetweenTowPoints(
                    {lng:place.longitude,lat:place.latitude},
                    {lng:center.longitude,lat:center.latitude}).then(function (json) {

                    var distance=parseFloat(parseFloat(json.distance).toFixed(2));



                    if (distance <= (threshold!==undefined&&threshold!==null?threshold:25000))
                    {
                        recordCount++;
                        place.distance=distance;
                        if(records[place.town]==undefined||records[place.town]==null)
                            records[place.town]=[place];
                        else
                            records[place.town].push(place);
                    }

                    stepF++;
                    if(stepF==places.length)
                    {
                        resolve({re:1,data:{records:records,recordCount:recordCount}});
                    }
                })

            }else{
                stepF++;
                if(stepF==places.length)
                {
                    resolve({re:1,data:{records:records,recordCount:recordCount}});
                }
            }

        }

    });

}

//搜索维修厂数据
export let fetchMaintenance=(payload)=>{
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
                    request: 'fetchMaintenanceInArea',
                    info:{}
                }
            }).then((json)=>{
                if (json.re == 1) {
                    var center=state.service.center;
                    var unites=json.data;

                    getDataDistribution({places:unites,center:center,threshold:20000}).then(function (json) {
                        resolve(json);
                    })

                }

            }).catch((e)=>{
              reject(e);
            })


        });
    }
}



//获取检测公司数据
export let fetchDetectUnitsInArea=(payload)=>{
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
                    request: 'fetchDetectUnitsInArea',
                    info:payload
                }
            }).then(function (json) {


                if (json.re == 1) {

                    var center=state.service.center;
                    var places=json.data;
                    getDataDistribution({places:places,center:center}).then(function (json) {
                        resolve(json);
                    })


                }else{
                        resolve({re:1,data:null})
                }


            }).catch(function (err) {
                reject(err);
            })

        });
    }
}



//测距
let isPointBiaedOrNot=(payload)=>{
    return new Promise((resolve, reject) => {
        var {populations,place,tagIndex}=payload;
        var recurseC=0;
        var flagOfBia=true;
        //tag 为A、B、C的标签
        var length=0;
        var isReturned=false;
        if(!_.isEmpty(populations))
        {
            for(var tag in populations)
                length++;


            for(var tag in populations)
            {
                let population=populations[tag];
                //如果群体已存在
                if(population!==undefined&&population!==null)
                {

                    //TODO:make a change to get distance
                    Geolocation.getMetersBetweenTowPoints(
                        {lng:place.longitude,lat:place.latitude},
                        {lng:population.center.lng,lat:population.center.lat}).then(function (json) {

                        recurseC++;
                        var bias=parseFloat(json.distance.toFixed(2));
                        if(population.plots.length>1)
                        {
                            if(bias<=6000&&!isReturned)
                            {

                                population.center={
                                    lng:(population.center.lng*population.plots.length+place.longitude)/(population.plots.length+1),
                                    lat:(population.center.lat*population.plots.length+place.latitude)/(population.plots.length+1)
                                }
                                population.plots.push(
                                    {
                                        name:place.name!==undefined&&place.name!==null?place.name:place.unitName,
                                        distance:place.distance,
                                        address:place.address,
                                        phone:place.phone,
                                        placeId:place.placeId!==undefined&&place.placeId!==null?place.placeId:place.unitId
                                    });
                                flagOfBia=false;
                                isReturned=true;
                                resolve({data:flagOfBia});
                                return;
                            }else{
                            }
                        }else{
                            if(bias<=12000&&!isReturned)
                            {

                                population.center={
                                    lng:(population.center.lng*population.plots.length+place.longitude)/(population.plots.length+1),
                                    lat:(population.center.lat*population.plots.length+place.latitude)/(population.plots.length+1)
                                }
                                population.plots.push(
                                    {
                                        name:place.name!==undefined&&place.name!==null?place.name:place.unitName,
                                        distance:place.distance,
                                        address:place.address,
                                        phone:place.phone,
                                        placeId:place.placeId!==undefined&&place.placeId!==null?place.placeId:place.unitId
                                    });
                                flagOfBia=false;
                                isReturned=true;
                                resolve({data:flagOfBia})
                                return ;
                            }
                        }





                        if(recurseC==length&&!isReturned)
                        {
                            //如果为离群点
                            if(flagOfBia)
                            {

                                var tag=String.fromCharCode(tagIndex.index+65);
                                tagIndex.index++;
                                populations[tag]={
                                    plots:[
                                        {
                                            name:place.name!==undefined&&place.name!==null?place.name:place.unitName,
                                            distance:place.distance,
                                            address:place.address,
                                            phone:place.phone,
                                            placeId:place.placeId!==undefined&&place.placeId!==null?place.placeId:place.unitId
                                        }],
                                    center:{
                                        lng:place.longitude,
                                        lat:place.latitude
                                    }
                                };

                            }
                            isReturned=true;
                            resolve({data:flagOfBia});
                            return ;
                        }

                    });


                }else{
                    recurseC++;
                    if(recurseC==length&&!isReturned)
                    {
                        //如果为离群点
                        if(flagOfBia)
                        {

                            var tag=String.fromCharCode(tagIndex.index+65);
                            tagIndex.index++;
                            populations[tag]={
                                plots:[
                                    {
                                        name:place.name!==undefined&&place.name!==null?place.name:place.unitName,
                                        distance:place.distance,
                                        address:place.address,
                                        phone:place.phone,
                                        placeId:place.placeId!==undefined&&place.placeId!==null?place.placeId:place.unitId
                                    }],
                                center:{
                                    lng:place.longitude,
                                    lat:place.latitude
                                }
                            };

                        }
                        isReturned=true;
                        resolve({data:flagOfBia});
                    }
                }
            }
        }else{

            //如果为离群点
            if(flagOfBia&&!isReturned)
            {

                var tag=String.fromCharCode(tagIndex.index+65);
                tagIndex.index++;
                populations[tag]={
                    plots:[
                        {
                            name:place.name!==undefined&&place.name!==null?place.name:place.unitName,
                            distance:place.distance,
                            address:place.address,
                            phone:place.phone,
                            placeId:place.placeId!==undefined&&place.placeId!==null?place.placeId:place.unitId
                        }],
                    center:{
                        lng:place.longitude,
                        lat:place.latitude
                    }
                };

            }
            isReturned=true;
            resolve({data:flagOfBia});
        }


    });

}

let filterPopulationsByBias=(payload)=>{
    return new Promise((resolve, reject,reduce) => {

        var {places}=payload;
        var populations={};
        var tagIndex=0;
        var recurseC=0;

        var tagIndex={
            index:0
        }
        bluebird.reduce(places, ( total,place,i) => {
            if(place.unitName!==undefined&&place.unitName!==null)
                         place.name=place.unitName;
            return isPointBiaedOrNot({populations:populations,place:place,tagIndex:tagIndex}).then(res=>{
                return i++;
            });
        }, 0).then(res => {
            resolve({
                re:1,
                data:{
                    populations:populations
                }
            })
        });

        // for(var i=0;i<places.length;i++)
        // {
        //     let place=places[i];
        //
        //     isPointBiaedOrNot({populations:populations,place:place,tagIndex:tagIndex}).then(function (json) {
        //
        //         if(place.unitName!==undefined&&place.unitName!==null)
        //             place.name=place.unitName;
        //
        //         recurseC++;
        //         if(recurseC==places.length)
        //             resolve({re:1,data:{
        //                 populations:populations
        //             }})
        //
        //
        //     });
        //
        // }
    });
}

let doPopulationCompute=(payload)=>{

    return new Promise((resolve, reject) => {

        //群体初始化

        var recurseCount=0;
        var {places,center}=payload;
        var populations=[];
        for(var i=0;i<places.length;i++)
        {
            let place=places[i];
            if (place.longitude !== undefined && place.longitude !== null &&
                place.latitude !== undefined && place.latitude !== null) {

                Geolocation.getMetersBetweenTowPoints(
                    {lng:place.longitude,lat:place.latitude},
                    {lng:center.longitude,lat:center.latitude}).then(function (json) {

                    var distance=json.distance;
                    recurseCount++;
                    //25公里为搜索范围,群体的最大距离为12公里，半径为6公里
                    if (distance <= 25000)
                    {
                        place.distance=distance;
                        populations.push(place);
                    }else{
                    }

                    if(recurseCount==places.length)
                        resolve({re:1,data:populations});
                });

            }else{
                recurseCount++;
                if(recurseCount==places.length)
                    resolve({re:1,data:populations});
            }
        }

    });
}

//周边搜索
export let doRegionSearch=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            var accessToken=state.user.accessToken;

            //这样的center指向地图中心,如果维修和服务有所区别将来再展开
            var {cmd,town,center}=payload;
            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: cmd,
                    info:{
                        townName:town
                    }
                }
            }).then(function (json) {

                if(json.re==1)
                {
                    var places=null;
                    doPopulationCompute({places:json.data,center:center}).then(function (json) {
                        places=json.data;

                        return filterPopulationsByBias({places:places,center:center});
                    }).then(function (json) {
                        var populations=json.data.populations;
                        resolve({re:1,data:{
                            populations:populations,
                            places:places
                        }})

                    })
                }else{

                }

            }).catch(function (e) {
                reject(e);
            })


        });
    }
}

//拉取站点
export  let fetchRailwayStationInArea=(payload)=>{
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
                    request: 'fetchRailwayStationInArea',
                    info:{}

                }
            }).then((json)=>{
                resolve(json);
            }).catch((e)=>{
                reject(e);
            })

        });
    }
}

//拉取用户地点
export let fetchDestinationByPersonId=(payload)=>{
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
                    request: 'selectDestinationByPersonId',

                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                reject(e);
            })
        });
    }
}


export let fetchServicePersonByUnitId=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var {placeId}=payload;
            var state=getState();
            var accessToken=state.user.accessToken;
            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getServicePersonByUnitId',
                    info:{
                        unitId:placeId
                    }
                }
            }).then((json)=>{
                resolve(json);
            }).catch((e)=>{
                reject(e);
            })

        });
    }
}

//根据维修厂拉取服务人员
export let fetchServicePersonByDetectUnitId=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var {detectUnit}=payload;
            var state=getState();
            var accessToken=state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getServicePersonByDetectUnitId',
                    info:{
                        detectUnitId:detectUnit.placeId
                    }
                }
            }).then((json)=>{

                if(json.re==1)
                {
                    resolve(json);
                }
            }).catch((err)=>{
               reject(err);
            });



        });
    }
}
