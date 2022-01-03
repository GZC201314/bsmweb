import {CDGL_GET_MENULIST_HANDLE} from "../actionTypes";

const defaultState = {
    menuList:[]
}
/*获取菜单列表*/
export default (state = defaultState,action: any) =>{
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case CDGL_GET_MENULIST_HANDLE:
            newState.menuList = action.data
            break;
        default:
            break;
    }
    return newState;
}
