import axios from "axios";
const getRoleInfoUrl: string = '/role/getPageRole';
const editActiveRoleListUrl: string = '/role/updateRoleStatus';
const delRoleUrl: string = '/role/deleteRoles';
const insertRoleUrl: string = '/role/addRole';
const updateRoleUrl: string = '/role/updateRole';
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