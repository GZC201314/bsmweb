import axios from "axios";


const getMethodUrl: string = '/templete/getMethod';
const postMethodUrl: string = '/templete/postMethod';
const multPartMethodUrl: string = '/templete/multPartMethod';


/*get 方法模版*/
const getMethod = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {

    axios.get(getMethodUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*post 方法模版*/
const postMethod = (paramter:any, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios.post(url||postMethodUrl,paramter).then(
        (res) => {
            successCallback(res.data);
        }
    )
}

/*multPart 方法模板*/
const multPartMethod = (paramter: object, successCallback: Function, errorCallback?: Function, url?: string) => {
    axios({
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: multPartMethodUrl,
        data:paramter
    }).then(res => {
        successCallback(res);
    }).catch(err => {
        console.error(err)
    });

}
export default {
    getMethod,
    postMethod,
    multPartMethod,
}