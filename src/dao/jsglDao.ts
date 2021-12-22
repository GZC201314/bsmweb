import axios from "axios";
import Qs from 'qs'
class JsglDao {
    private getRoleInfoUrl: string = '/role/getPageRole';
    private delRoleUrl: string = '/user/getUserInfoBySession';


    /*用户信息查询*/
    getRoleListInfo(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {

        console.log("paramter")
        console.log(paramter)

        axios.get(this.getRoleInfoUrl, paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    /*用户详细信息查询*/
    delRole(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.get(this.getRoleInfoUrl, paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
    /*启用or停用角色*/
    editActiveRoleList(paramter: any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.get(this.getRoleInfoUrl, paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }
}

const jsglDao = new JsglDao();
export default jsglDao;
