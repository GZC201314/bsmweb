// import axios from "axios";
import axios from "../utils/MyAxios"

const getUserInfoUrl: string = '/bsmservice/user/getAlluser';
const getAllRoleUrl: string = '/bsmservice/role/getAllRole';
const editActiveRoleListUrl: string = '/bsmservice/role/updateRoleStatus';
const delUserUrl: string = '/bsmservice/user/deleteUser';
const insertUserUrl: string = '/bsmservice/user/add';
const resetUserPasswordUrl: string = '/bsmservice/user/resetUserPassword';
/*角色列表信息查询*/
const getUserListInfo = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : getUserInfoUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*查询角色select信息*/
const getAllRole = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(url ? url : getAllRoleUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*用户详细信息查询*/
const delUser = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : delUserUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*启用or停用角色*/
const editActiveRoleList = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : editActiveRoleListUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*新增用户*/
const insertUser = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(url ? url : insertUserUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*更新角色*/
const resetUserPassword = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : resetUserPasswordUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}



export default {
    getUserListInfo,
    resetUserPassword,
    insertUser,
    editActiveRoleList,
    delUser,
    getAllRole,
};