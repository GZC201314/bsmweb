import axios from "axios";

import {message} from "antd";

import _ from 'lodash'
import {getStorage} from "./index";

axios.interceptors.response.use(function (response) {
    // 登录权限验证失败
    // debugger
    if (response.status && response.status === 402) {
        window.history.back();
        message.error("登录信息已过期,请重新登录。").then(r => {
            console.log(r)
            // 如果存在定时器，则删除定时器
            let intervalId = getStorage("intervalId","");
            if (!_.isEmpty(intervalId)){
                // @ts-ignore
                clearInterval(intervalId)
            }
            return response;
        })
    } else {
        return response;
    }
}, function (error:any) {
    // debugger
    if (!_.isNull(error)){
        if (error.response && error.response.status === 401){
            message.error("登录信息已过期,请重新登录。").then(r => {
                // 如果存在定时器，则删除定时器
                let intervalId = getStorage("intervalId","");
                if (!_.isEmpty(intervalId)){
                    // @ts-ignore
                    clearInterval(intervalId)
                }
            })
        }else if (error.response.data && error.response.data.code === 500){
            // 如果存在定时器，则删除定时器
            message.error(error.response.data.msg).then(r => {
            })
        }
    }
    return error && error.response;
})

axios.interceptors.request.use(function (request) {
    return request;
}, function (error) {
    // 如果存在定时器，则删除定时器
    let intervalId = getStorage("intervalId","");
    if (!_.isEmpty(intervalId)){
        // @ts-ignore
        clearInterval(intervalId)
    }
    return Promise.reject(error);
})

export default axios