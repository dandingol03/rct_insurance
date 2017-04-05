/**
 * Created by danding on 17/2/27.
 */
/**
 * Created by dingyiming on 2017/2/15.
 */

import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import {
    UPDATE_PERSON_INFO,
    UPDATE_SCORE,
    SAVE_CONTACT_INFO,
    UPDATE_CERTIFICATE
} from '../constants/UserConstants';

export let updatePersonInfo=(payload)=>{
    return {
        type:UPDATE_PERSON_INFO,
        payload:payload
    }
}

export let updateScore=(payload)=>{
    return {
        type:UPDATE_SCORE,
        payload:payload
    }
}

export let updateCertificate=(payload)=>{
    return {
        type:UPDATE_CERTIFICATE,
        payload:payload
    }
}

//修改密码
export  let passwordModify=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve,reject)=>{
            var state=getState();
            var accessToken=state.user.accessToken;
            var {password}=payload;
            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'passwordModify',
                    info:{
                        password: password
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

//校验用户手机是否冗余
export let verifyMobilePhoneRedundancy=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve,reject)=>{
           var state=getState();

           var {mobilePhone}=payload;
            Proxy.postes({
                url: Config.server + '/verifyMobilePhoneRedundancy',
                headers: {
                    'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json'
                },
                body: {
                    mobilePhone:mobilePhone,
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e);
            })
        });
    }
}

//生成验证码
export let generateSecurityCode=(payload)=>{

        return new Promise((resolve,reject)=> {
            var {mobilePhone}=payload;

            Proxy.postes({
                url: Config.server + '/securityCode',
                headers: {
                    'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json'
                },
                body: {
                    phoneNum:mobilePhone,
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e);
            })

        });

}

//用户注册
export let registerUser=(payload)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();


            var {username,password,mail,mobilePhone}=payload;

            Proxy.postes({
                url: Config.server + '/register?'+'username='+username+'&&password='+password+
                    '&&mobilePhone='+mobilePhone+'&&EMAIL='+mail,
                headers: {
                    'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })


        });
    }
}


//获取个人积分
export let fetchScoreBalance=()=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            const state=getState();
            var accessToken=state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'fetchScoreBalance'
                }
            }).then((json)=>{
                resolve(json);
            }).catch((err)=>{
               reject(err);
            });

        });
    }
}

export let saveContactInfo=(payload)=>{

    return (dispatch,getState)=> {

        const state=getState();
        var accessToken=state.user.accessToken;

        Proxy.postes({
            url: Config.server + '/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request: 'saveContactInfo',
                info:{
                    info:payload
                }
            }
        }).then(function (json) {

            if(json.re==1) {
                dispatch(updatePersonInfo({data:json.data}));
            }

        }).catch(function (err) {
            alert(err);
        })

    }
}


export let fetchAccessToken=()=>{

    return (dispatch,getState)=>{

        return new Promise((resolve, reject) => {
            const state=getState();
            if(state.user.accessToken)
            {
                resolve({re:1,data:state.user.accessToken});
            }else{
                if(state.user&&state.user.username&&state.user.password)
                {
                    //TODO:登录获取accessToken
                    Proxy.postes({
                        url: Config.server + '/login',
                        headers: {
                            'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: "grant_type=password&password=" + password + "&username=" + username
                    }).then(function (json) {
                        if(json&&json.accessToken)
                        {
                            dispatch(getAccessToken(json.accessToken));
                            resolve({re:1});
                        }else{
                            reject('无效的用户名、密码')
                        }
                    })
                }else{
                    reject('缺少用户名、密码,无法自动登录');
                }
            }
        });
    }

}







