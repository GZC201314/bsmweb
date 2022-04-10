import axios from "axios";
const getConfigListUrl: string = '/bsmservice/config/getConfigList';
const getConfigInfoUrl: string = '/bsmservice/config/getConfigInfo';
const delConfigUrl: string = '/bsmservice/config/deleteConfigs';
const insertConfigUrl: string = '/bsmservice/config/addConfig';
const updateConfigUrl: string = '/bsmservice/config/updateConfig';
/*配置项列表信息查询*/
const getConfigList = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : getConfigListUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*删除配置项*/
const delConfig = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url:url ? url : delConfigUrl,
        method:"GET",
        params:paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
    
}

/*新增配置项*/
const insertConfig = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(url ? url : insertConfigUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*配置项详细信息查询*/
const getConfigInfo = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(url ? url : getConfigInfoUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*更新配置项*/
const updateConfig = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : updateConfigUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}



export default {
    getConfigList,
    updateConfig,
    insertConfig,
    delConfig,
    getConfigInfo,
};