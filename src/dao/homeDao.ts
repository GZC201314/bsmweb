// import axios from "axios";
import axios from "../utils/MyAxios"


const getMethodUrl: string = '/bsmservice/system/getSystemDetailInfo';


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