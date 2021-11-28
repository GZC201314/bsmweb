const defaultState = {
    list:[]
}
export default (state = defaultState,action) =>{
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case "add_num":
            // newState.num += 1;
            break;
        case "input_value_change_handle":
            // newState.iptVal = action.value;
            break;
        case "input_value_submit_handle":
            // newState.list.push(newState.iptVal)
            break;
        default:
            break;
    }
    return newState;
}
