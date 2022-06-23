// import axios from "axios";
import axios from "../utils/MyAxios"
import {RLSB_LOGIN, CHECK_EMAILADDRESS, USER_LOGIN_ACTION, USER_SET_USERINFO_ACTION} from "../actionTypes";
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
        case USER_SET_USERINFO_ACTION:
            newState.userInfo = action.data.userinfo
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
