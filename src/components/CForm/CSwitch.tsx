import React, {FC, useEffect, useState} from 'react'
import {Switch} from 'antd'
import './index.scss'

export interface CSwitchProps {
    value: any;
    onChange?: Function;
}

const CSwitch: FC<CSwitchProps> = (props) => {

    const {onChange, value, ...restProps} = props;
    /**state  state部分**/
    const [valueState, setValueState] = useState(value)
    /**effect  effect部分**/
    useEffect(()=>{
        setValueState(value || false)
    }, [value])
    /**methods 方法部分**/
    const changeHandler = (checked: boolean) => {
        let value = checked;
        setValueState(value)
        onChange && onChange(value);
    }
    /**styles 样式部分**/

    /**render**/

    return (
        <Switch {...props} checked={valueState} onChange={(checked) => changeHandler(checked)}/>

    );
}
export default CSwitch