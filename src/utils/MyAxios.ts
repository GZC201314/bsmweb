import axios from "axios";

import {message} from "antd";

import _ from 'lodash'

axios.interceptors.response.use(function (response) {
    // 登录权限验证失败
    debugger
    if (response.status && response.status === 402) {
        window.history.back();
        message.error("登录信息已过期,请重新登录。").then(r => {
            console.log(r)
            return response;
        })
    } else {
        return response;
    }
}, function (error:any) {
    debugger
    if (!_.isNull(error)){
        if (error.response && error.response.status === 401){
            message.error("登录信息已过期,请重新登录。").then(r => {
            })
        }else if (error.response.data && error.response.data.code === 500){
            message.error(error.response.data.msg).then(r => {
            })
        }
    }
    return error && error.response;
})

axios.interceptors.request.use(function (request) {
    return request;
}, function (error) {
    return Promise.reject(error);
})

export default axios