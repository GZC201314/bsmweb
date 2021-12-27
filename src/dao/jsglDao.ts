import axios from "axios";
class JsglDao {
    private getRoleInfoUrl: string = '/role/getPageRole';
    private editActiveRoleListUrl: string = '/role/updateRoleStatus';
    private delRoleUrl: string = '/role/deleteRoles';
    private insertRoleUrl: string = '/role/addRole';
    private updateRoleUrl: string = '/role/uploadRoleRole';
    /*角色列表信息查询*/
    getRoleListInfo(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.post(this.getRoleInfoUrl,paramter).then(
            (res)=>{
                successCallback(res.data);
            }
        )
    }
    /*用户详细信息查询*/
    delRole(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.post(this.delRoleUrl, paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    /*启用or停用角色*/
    editActiveRoleList(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.post(this.editActiveRoleListUrl, paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }

    /*新增角色*/
    insertRole(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {
        debugger
        axios.post(url?url:this.insertRoleUrl, paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    /*新增角色*/
    updateRole(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.post(url?url:this.updateRoleUrl, paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
}

const jsglDao = new JsglDao();
export default jsglDao;
