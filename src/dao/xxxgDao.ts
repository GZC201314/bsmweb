import axios from "axios";
import Qs from 'qs'
import {message} from "antd";
class XxxgDao {
    private getUserInfoUrl: string = '/user/getUserInfoBySession';


    /*用户详细信息查询*/
    getUserInfo(paramter:any, successCallback: Function, errorCallback?: Function, url?: string) {

        axios.get(this.getUserInfoUrl,paramter).then(
            (res) => {
                successCallback(res.data);
            }
        )
    }

}

const xxxgDao = new XxxgDao();
export default xxxgDao;
