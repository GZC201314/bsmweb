import axios from "axios";


const getDataSourceListUrl: string = '/bsmservice/datasource/getDataSourceList';
const delDataSourceUrl: string = '/bsmservice/datasource/deleteDataSource';
const updateSourceUrl: string = '/bsmservice/datasource/updateDataSource';
const insertDataSourceUrl: string = '/bsmservice/datasource/insertDataSource';
const uploadDriveUrl: string = '/bsmservice/datasource/uploadDrive';
const testDataSourceUrl: string = '/bsmservice/datasource/testDataSource';


/*数据源列表查询*/
const getDataSourceList = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||getDataSourceListUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*删除数据源*/
const delDataSource = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||delDataSourceUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*更新数据源*/
const updateDataSource = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||updateSourceUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*新增数据源*/
const insertDataSource = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||insertDataSourceUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*上传数据源驱动*/
const uploadDrive = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: url||uploadDriveUrl,
        data:paramter
    }).then(res => {
        successCallback(res.data);
    }).catch(err => {
        console.error(err)
    });
}

/*测试数据源连接*/
const testDataSource = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : testDataSourceUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

export default {
    getDataSourceList,
    delDataSource,
    updateDataSource,
    insertDataSource,
    uploadDrive,
    testDataSource,
};