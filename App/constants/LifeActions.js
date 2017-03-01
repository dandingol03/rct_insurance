/**
 * Created by dingyiming on 2017/2/28.
 */


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