import React, {FC} from 'react'
import {Switch} from 'antd'
import './index.scss'
import _ from "lodash";

export interface CSwitchProps {
    value: any;
    onChange?: Function;
    disabled?: boolean;
    checked?:boolean
}

const CSwitch: FC<CSwitchProps> = (props) => {

    const {onChange, ...restProps} = props;
    /**state  state部分**/
    /**effect  effect部分**/
    // useEffect(()=>{
    //     props.onChange && props.onChange("value",props.checked || false)
    // }, [])
    /**methods 方法部分**/
    const changeHandler = (checked: boolean,event:any) => {
        // debugger
        onChange && onChange("value",checked);
    }
    /**styles 样式部分**/

    /**render**/

    return (
        <Switch checked={_.isBoolean(props.value)?props.value:(props.value === 'true')} onChange={(checked, event) => changeHandler(checked,event)}/>
    );
}
export default CSwitch