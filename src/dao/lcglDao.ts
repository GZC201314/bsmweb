import axios from "../utils/MyAxios"

const deployFlowUrl: string = '/bsmservice/flowable/deploy';
const getUserTaskListUrl: string = '/bsmservice/flowable/userTaskList';
const validateFlowNameUrl: string = '/bsmservice/flowable/validateName';
const getFlowListUrl: string = '/bsmservice/flowable/flowableList';
const deleteUrl: string = '/bsmservice/flowable/deleteFlows';
const getAllFlowUrl: string = '/bsmservice/flowable/allFlow';
/*组织列表信息查询*/
const deployFlow = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : deployFlowUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*查询用户任务信息*/
const getUserTaskList = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(url ? url : getUserTaskListUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*查询流程列表信息*/
const getFlowList = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : getFlowListUrl, paramter).then(
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
/*校验流程名*/
const validateOrganizationName = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : validateFlowNameUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*获取全部流程*/
const getAllFlow = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(url ? url : getAllFlowUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
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
    getFlowList,
    validateOrganizationName,
    getAllFlow,
    getUserTaskList,
    del
};