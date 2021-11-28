import axios from "axios";
import {RLSB_LOGIN, CHECK_EMAILADDRESS, USER_LOGIN_ACTION} from "../actionTypes";
import {getStorage, setStorage} from "../utils";
const defaultState = {
    userInfo:{},
    menulist:[]
}
export default (state = defaultState,action) =>{
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case USER_LOGIN_ACTION:
            newState.userInfo = action.data.data.userinfo
            newState.menulist = JSON.parse(action.data.data.menulist)
            break;
        case RLSB_LOGIN:
            newState.userInfo = action.data.userinfo
            newState.menulist = JSON.parse(action.data.menulist)
            break;
        case CHECK_EMAILADDRESS:
            axios.get('/todo',action.data).then(res => {
                newState.validateCodePic = res.data.data;
            });
            break;
        default:
            break;
    }
    return newState;
}
