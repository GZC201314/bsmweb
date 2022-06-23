// import axios from "axios";
import axios from "../utils/MyAxios"

const uploadPictureUrl: string = '/bsmservice/ai/ocr';


/*上传文字识别图像*/
const uploadPicture = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: url||uploadPictureUrl,
        data:paramter
    }).then(res => {
        successCallback(res.data);
    }).catch(err => {
        console.error(err)
    });
}

export default {
    uploadPicture
};