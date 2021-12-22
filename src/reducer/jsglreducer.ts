import {XXXG_GET_USERINFO_HANDLE} from "../actionTypes";

const defaultState = {
    userInfo:{}
}
export default (state = defaultState,action: any) =>{
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case XXXG_GET_USERINFO_HANDLE:
            newState.userInfo = action.data
            break;
        default:
            break;
    }
    return newState;
}
