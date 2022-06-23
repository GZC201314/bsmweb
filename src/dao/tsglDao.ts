// import axios from "axios";
import axios from "../utils/MyAxios"

const getPageDouBanBookUrl: string = '/bsmservice/doubanbook/getPageDouBanBook';
const getDouBanBookInfoUrl: string = '/bsmservice/doubanbook/getDouBanBookInfo';
const addDoubanBookUrl: string = '/bsmservice/doubanbook/addDoubanBook';
const updateDoubanBookUrl: string = '/bsmservice/doubanbook/updateDoubanBook';
const deleteDouBanBookUrl: string = '/bsmservice/doubanbook/deleteDouBanBook';
const validISBNUrl: string = '/bsmservice/doubanbook/validISBN';
const giteeUploadUrl: string = '/bsmservice/giteeUpload/uploadFile';


/*豆瓣图书列表查询*/
const getPageDouBanBook = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||getPageDouBanBookUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*删除豆瓣图书*/
const deleteDouBanBook = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||deleteDouBanBookUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*更新豆瓣图书*/
const updateDoubanBook = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||updateDoubanBookUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*新增豆瓣图书*/
const addDoubanBook = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.post(url||addDoubanBookUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*豆瓣图书详细信息查询*/
const getDouBanBookInfo = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(getDouBanBookInfoUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}
/*豆瓣图书校验ISBN号*/
const validISBN = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        url: url || validISBNUrl,
        method: 'GET',
        params: paramter
    }).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*上传图书封面，把图书上传到gitee上*/
const giteeUpload = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: url||giteeUploadUrl,
        data:paramter
    }).then(res => {
        successCallback(res.data);
    }).catch(err => {
        console.error(err)
    });
}


export default {
    getPageDouBanBook,
    deleteDouBanBook,
    updateDoubanBook,
    addDoubanBook,
    getDouBanBookInfo,
    validISBN,
    giteeUpload,
};