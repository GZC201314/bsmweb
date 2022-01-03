import axios from "axios";
import Qs from 'qs'


const validEmailAddressUrl: string = '/valid/userinfo';
const validPasswordUrl: string = '/valid/userinfo';
const sendRegisterEmailUrl: string = '/user/sendRegisterEmail';
const userLogOutUrl: string = '/logout';
const registerUserUrl: string = '/user/register';
const userLoginUrl: string = '/login';
const rlsbLoginUrl: string = '/ai/faceLogin';
const faceRegisterUrl: string = '/ai/faceRegister';

/*用户人脸识别登录*/
const rlsbLogin = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: rlsbLoginUrl,
        data:paramter
    }).then(res => {
        successCallback(res);
    }).catch(err => {
        console.error(err)
    });

}
/*用户人脸注册*/
const faceRegister = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: faceRegisterUrl,
        data:paramter
    }).then(res => {
        successCallback(res);
    }).catch(err => {
        console.error(err)
    });

}

/*用户登录*/
const userLogin = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    /*这边在发送请求的时候要把发送的格式转化成application/x-www-form-urlencoded
     如果不这样,会导致在后台的时候拦截器无法直接取到form参数*/
    axios.post(userLoginUrl,Qs.stringify(paramter),{
        headers:{
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    }).then(
        (res) => {
            console.log("res")
            console.log(res)
            successCallback(res);
        }
    ).catch((err) => {
        console.error(err)
    })

}
/*校验邮箱*/
const validEmailAddress = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        url: url || validEmailAddressUrl,
        method: 'GET',
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*校验用户名*/
const validUsername = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        url: url || validEmailAddressUrl,
        method: 'GET',
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
const validPassword = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        url: url || validPasswordUrl,
        method: 'GET',
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*发送用户注册邮件*/
const sendRegisterEmail = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        url: url || sendRegisterEmailUrl,
        method: 'GET',
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*用户注册*/
const registerUser = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(registerUserUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*用户退出*/
const userLogOut = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        url: url || userLogOutUrl,
        method: 'GET',
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
export default {
    rlsbLogin,
    faceRegister,
    validPassword,
    userLogin,
    validEmailAddress,
    validUsername,
    sendRegisterEmail,
    registerUser,
    userLogOut,
}