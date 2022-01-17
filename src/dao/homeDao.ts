import axios from "axios";


const getMethodUrl: string = '/system/getSystemDetailInfo';


/*get 方法模版*/
const getSystemDetailInfo = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(url || getMethodUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    ).catch((res:any)=>{
        errorCallback && errorCallback(res)

    })
}
export default {
    getSystemDetailInfo,
}