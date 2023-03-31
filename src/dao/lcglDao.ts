import axios from "../utils/MyAxios"
const deployFlowUrl: string = '/bsmservice/flowable/deploy';
const getUserTaskListUrl: string = '/bsmservice/flowable/userTaskList';
const validateOrganizationNameUrl: string = '/bsmservice/organization/validateName';
const getListUrl: string = '/bsmservice/organization/list';
const deleteUrl: string = '/bsmservice/organization/delete';
const insertUrl: string = '/bsmservice/organization/add';
const updateUrl: string = '/bsmservice/organization/update';
/*组织列表信息查询*/
const deployFlow = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : deployFlowUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*查询组织select信息*/
const getUserTaskList = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(url ? url : getUserTaskListUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*组织详细信息查询*/
const getOrganizationInfo = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : getUserTaskListUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*校验组织名*/
const validateOrganizationName = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : validateOrganizationNameUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*新增组织*/
const add = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(url ? url : insertUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*更新组织*/
const update = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: url||updateUrl,
        data:paramter
    }).then(res => {
        successCallback(res.data);
    }).catch(err => {
        console.error(err)
    });

    // axios.post(url ? url : updateUrl, paramter).then(
    //     (res) => {
    //         successCallback(res.data);
    //     }
    // )
}

/*用户详细信息查询*/
const del = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : deleteUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

export default {
    deployFlow,
    getOrganizationInfo,
    validateOrganizationName,
    update,
    add,
    getUserTaskList,
    del
};