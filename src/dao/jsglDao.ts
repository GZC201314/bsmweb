// import axios from "axios";
import axios from "../utils/MyAxios"
const getRoleInfoUrl: string = '/bsmservice/role/getPageRole';
const editActiveRoleListUrl: string = '/bsmservice/role/updateRoleStatus';
const delRoleUrl: string = '/bsmservice/role/deleteRoles';
const insertRoleUrl: string = '/bsmservice/role/addRole';
const updateRoleUrl: string = '/bsmservice/role/updateRole';
/*角色列表信息查询*/
const getRoleListInfo = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : getRoleInfoUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*用户详细信息查询*/
const delRole = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : delRoleUrl, paramter).then(
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

/*新增角色*/
const insertRole = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(url ? url : insertRoleUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*更新角色*/
const updateRole = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : updateRoleUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}



export default {
    getRoleListInfo,
    updateRole,
    insertRole,
    editActiveRoleList,
    delRole,
};