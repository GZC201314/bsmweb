import axios from "axios";


const getUserInfoUrl: string = '/bsmservice/user/getUserDetailInfo';


/*用户详细信息查询*/
const getUserInfo = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(getUserInfoUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

export default {
    getUserInfo
};