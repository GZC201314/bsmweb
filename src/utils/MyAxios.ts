import axios from "axios";

import {message} from "antd";

import _ from 'lodash'

axios.interceptors.response.use(function (response) {
    // 登录权限验证失败
    if (response.status && response.status === 402) {
        window.history.back();
        message.error("登录信息已过期,请重新登录。").then(r => {
            console.log(r)
        })
    } else {
        return response;
    }
}, function (error:any) {
    if (!_.isNull(error)){
        if (error.response && error.response.status === 401){
            message.error("登录信息已过期,请重新登录。").then(r => {
            })
        }else if (error.response.data && error.response.data.code === 500){
            message.error(error.response.data.msg).then(r => {
            })
        }
    }
    return Promise.reject(error);
})

axios.interceptors.request.use(function (request) {
    return request;
}, function (error) {
    return Promise.reject(error);
})

export default axios