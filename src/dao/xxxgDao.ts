import axios from "axios";
import Qs from 'qs'


const getUserInfoUrl: string = '/bsmservice/user/getUserInfoBySession';
const editAvatarUrl: string = '/bsmservice/user/editAvatar';
const editUserNameUrl: string = '/bsmservice/user/updateUserName';
const editUserPasswordUrl: string = '/bsmservice/user/updateUserPassword';


/*用户详细信息查询*/
const getUserInfo = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(getUserInfoUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*修改用户名*/
const editUserName = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(editUserNameUrl,Qs.stringify(paramter),{
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
const editUserPassword = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(editUserPasswordUrl,Qs.stringify(paramter),{
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
const editAvatar = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: editAvatarUrl,
        data:paramter
    }).then(res => {
        successCallback(res);
    }).catch(err => {
        console.error(err)
    });
}
export default {
    getUserInfo,
    editUserName,
    editUserPassword,
    editAvatar,
};