import React, {FC, useEffect} from 'react'
import {Switch} from 'antd'
import './index.scss'

export interface CSwitchProps {
    value: any;
    onChange?: Function;
    disabled?: boolean;
}

const CSwitch: FC<CSwitchProps> = (props) => {

    const {onChange, value, ...restProps} = props;
    /**state  state部分**/
    /**effect  effect部分**/
    useEffect(()=>{
        props.onChange && props.onChange("value",value || false)
    }, [])
    /**methods 方法部分**/
    const changeHandler = (checked: boolean) => {
        onChange && onChange(checked);
    }
    /**styles 样式部分**/

    /**render**/

    return (
        <Switch {...props} checked={props.value} onChange={(checked) => changeHandler(checked)}/>
    );
}
export default CSwitch