import axios from "axios";
import Qs from 'qs'
import {message} from "antd";
class LoginDao {
    private validEmailAddressUrl: string = '/valid/userinfo';
    private validPasswordUrl: string = '/valid/userinfo';
    private sendRegisterEmailUrl: string = '/user/sendRegisterEmail';
    private userLogOutUrl: string = '/logout';
    private registerUserUrl: string = '/user/register';
    private userLoginUrl: string = '/login';
    private rlsbLoginUrl: string = '/ai/faceLogin';
    private faceRegisterUrl: string = '/ai/faceRegister';

    /*用户人脸识别登录*/
    rlsbLogin(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        axios({
            headers:{
                'Content-Type': 'multipart/form-data'
            },
            method: 'post',
            url: this.rlsbLoginUrl,
            data:paramter
        }).then(res => {
            successCallback(res);
        }).catch(err => {
            console.error(err)
        });

    }
    /*用户人脸注册*/
    faceRegister(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        axios({
            headers:{
                'Content-Type': 'multipart/form-data'
            },
            method: 'post',
            url: this.faceRegisterUrl,
            data:paramter
        }).then(res => {
            successCallback(res);
        }).catch(err => {
            console.error(err)
        });

    }

    /*用户登录*/
    userLogin(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        /*这边在发送请求的时候要把发送的格式转化成application/x-www-form-urlencoded
         如果不这样,会导致在后台的时候拦截器无法直接取到form参数*/
        axios.post(this.userLoginUrl,Qs.stringify(paramter),{
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
    validEmailAddress(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        axios({
            url: url || this.validEmailAddressUrl,
            method: 'GET',
            params: paramter
        }).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    /*校验用户名*/
    validUsername(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        axios({
            url: url || this.validEmailAddressUrl,
            method: 'GET',
            params: paramter
        }).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    validPassword(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        axios({
            url: url || this.validPasswordUrl,
            method: 'GET',
            params: paramter
        }).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    /*发送用户注册邮件*/
    sendRegisterEmail(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        axios({
            url: url || this.sendRegisterEmailUrl,
            method: 'GET',
            params: paramter
        }).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }

    /*用户注册*/
    registerUser(paramter:any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.post(this.registerUserUrl,paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }

    /*用户退出*/
    userLogOut(paramter: object, successCallback: Function, errorCallback?: Function, url?: string) {
        axios({
            url: url || this.userLogOutUrl,
            method: 'GET',
            params: paramter
        }).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }

}

const loginDao = new LoginDao();
export default loginDao;
