/*定时任务名校验，判断定时任务名是否重复*/
import dsrwDao from "../../../../dao/dsrwDao";

export const validateJobKey = async (rule: any, value: any) => {
    let params = {jobKey: value};
    let promise = new Promise(((resolve) => {
        dsrwDao.validateJobKey(params, async (res: any) => {
            resolve(res.data)
        })
    }))
    /*当 Promise resolve一个之后才会执行，否则会一直阻塞在这里*/
    let result = await promise;
    if (result) {
        return Promise.resolve()
    } else {
        return Promise.reject()
    }
};