import axios from "axios";
import Qs from "qs";

const getMenuListUrl: string = '/pages/getPagePages';
const updatePageUrl: string = '/pages/updatePages';
const delPageUrl: string = '/pages/deletePages';
const insertPageUrl: string = '/pages/addPages';
const getparentNodeUrl: string = '/pages/getparentNode';
const getIconTypesUrl: string = '/icontype.json';
const pageKeyUniqueUrl: string = '/pages/pageKeyUnique';


/*用户详细信息查询*/
const getPageList = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(getMenuListUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*更新页面*/
const updatePage = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : updatePageUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*删除页面*/
const delPage = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : delPageUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*新增页面*/
const insertPage = (paramter: any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url ? url : insertPageUrl, paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*获取所有的父节点*/
const getParentNode = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(url ? url : getparentNodeUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*获取所有的图标*/
const getIconTypes = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(url ? url : getIconTypesUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*校验parentKey 唯一性*/
const pageKeyUnique = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url:url ? url : pageKeyUniqueUrl,
        method:"GET",
        params:paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

export default {
    getPageList,
    updatePage,
    delPage,
    insertPage,
    getParentNode,
    getIconTypes,
    pageKeyUnique,
};