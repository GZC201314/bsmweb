import axios from "axios";
import Qs from 'qs'
import {message} from "antd";
class XxxgDao {
    private getUserInfoUrl: string = '/user/getUserInfoBySession';
    private editAvatarUrl: string = '/user/editAvatar';
    private editUserNameUrl: string = '/user/updateUserName';
    private editUserPasswordUrl: string = '/user/updateUserPassword';


    /*用户详细信息查询*/
    getUserInfo(paramter:any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.get(this.getUserInfoUrl,paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    /*修改用户名*/
    editUserName(paramter:any, successCallback: Function, errorCallback?: Function, url?: string) {
        axios.post(this.editUserNameUrl,Qs.stringify(paramter),{
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
    /*修改用户密码*/
    editUserPassword(paramter:any, successCallback: Function, errorCallback?: Function, url?: string) {
        axios.post(this.editUserPasswordUrl,Qs.stringify(paramter),{
            headers:{
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        }).then(
            (res) => {
                successCallback(res);
            }
        ).catch((err) => {
            console.error(err)
        })
    }
    /*修改用户头像信息*/
    editAvatar(paramter:any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios({
            headers:{
                'Content-Type': 'multipart/form-data'
            },
            method: 'post',
            url: this.editAvatarUrl,
            data:paramter
        }).then(res => {
            successCallback(res);
        }).catch(err => {
            console.error(err)
        });
    }

}

const xxxgDao = new XxxgDao();
export default xxxgDao;
