import axios from "axios";

import {message} from "antd";

axios.interceptors.response.use(function (response) {
    // 登录权限验证失败
    if (response.data.code && response.data.code == 403) {
        window.history.back();
        message.error("登录信息已过期,请重新登录。")
    } else {
        return response;
    }
}, function (error) {
    return Promise.reject(error);
})

axios.interceptors.request.use(function (request) {
    return request;
}, function (error) {
    return Promise.reject(error);
})

export default axios