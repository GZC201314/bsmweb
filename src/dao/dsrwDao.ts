// import axios from "axios";
import axios from "../utils/MyAxios"

const getTaskPageListUrl: string = '/bsmservice/task/getTaskPageList';
const getTaskInfoUrl: string = '/bsmservice/task/getTaskInfo';
const addTaskUrl: string = '/bsmservice/task/addTask';
const validateJobKeyUrl: string = '/bsmservice/task/validateJobKey';
const deleteTasksUrl: string = '/bsmservice/task/deleteTasks';
const stopAllTasksUrl: string = '/bsmservice/task/stopAllTasks';
const startAllTasksUrl: string = '/bsmservice/task/startAllTasks';
const startTaskUrl: string = '/bsmservice/task/startTask';
const stopTaskUrl: string = '/bsmservice/task/stopTask';

/*定时任务列表查询*/
const getTaskPageList = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url || getTaskPageListUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*定时任务详细信息查询*/
const getTaskInfo = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url ? url : getTaskInfoUrl,
        method: "GET",
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*新增定时任务*/
const insertTask = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url || addTaskUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*修改定时任务*/
// const updateTask = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {
//
//     axios.post(url || addTaskUrl, paramter).then(
//         (res) => {
//             successCallback(res.data);
//         }
//     )
// }

/*校验定时任务Key*/
const validateJobKey = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url ? url : validateJobKeyUrl,
        method: "GET",
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*删除定时任务*/
const deleteTasks = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url ? url : deleteTasksUrl,
        method: "GET",
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*停止所有的定时任务*/
const stopAllTasks = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url ? url : stopAllTasksUrl,
        method: "GET",
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*停止所有的定时任务*/
const startAllTasks = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url ? url : startAllTasksUrl,
        method: "GET",
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*启动定时任务*/
const startTask = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url ? url : startTaskUrl,
        method: "GET",
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*停止定时任务*/
const stopTask = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url ? url : stopTaskUrl,
        method: "GET",
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

export default {
    getTaskPageList,
    getTaskInfo,
    insertTask,
    validateJobKey,
    deleteTasks,
    stopAllTasks,
    startAllTasks,
    startTask,
    stopTask,
};