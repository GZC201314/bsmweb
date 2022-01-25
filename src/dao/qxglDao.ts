import axios from "axios";


const getGrandPagesUrl: string = '/bsmservice/authorize/getAllAuthorizePagesByRoleName';
const updateGrandPagesUrl: string = '/bsmservice/authorize/updateAuthorizePagesByRoleName';


/*获取角色的授权页面信息*/
const getGrandPages = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios(
        {
            url: url ? url : getGrandPagesUrl,
            method: 'get',
            params: paramter
        }
    ).then((res) => {
        successCallback(res.data);
    })
}

/*更新角色权限*/
const updateAuth = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : updateGrandPagesUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

export default {
    getGrandPages,
    updateAuth,
};