import React, {FC, ReactElement, useEffect, useState} from 'react'
import {Checkbox} from 'antd'
import './index.scss'

export interface CCheckboxProps {
    value: false;
    onChange?: Function;
    children?:any
}

const CCheckbox: FC<CCheckboxProps> = (props) => {

    /**state  state部分**/
    const {value, onChange,children} = props;
    /**effect  effect部分**/
    const [valueState, setValueState] = useState(value)
    /**methods 方法部分**/

    const changeHandler = (e: { target: { checked: any; }; }) => {
        let value = e.target.checked;
        setValueState(value)
        onChange && onChange(value);
    }

    /**styles 样式部分**/

    /**render**/

    return (
        <Checkbox {...props} checked={valueState} onChange={(e) => changeHandler(e)}>{children}</Checkbox>

    );
}
export default CCheckbox
