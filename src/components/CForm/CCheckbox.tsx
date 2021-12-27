import React, {FC, ReactElement, useEffect, useState} from 'react'
import {Checkbox} from 'antd'
import './index.scss'

export interface CCheckboxProps {
    value: false;
    onChange?: Function;
    children?:any;
    disabled?: boolean;
}

const CCheckbox: FC<CCheckboxProps> = (props) => {

    /**state  state部分**/
    const {value, onChange,children} = props;
    /**effect  effect部分**/
    /**methods 方法部分**/

    const changeHandler = (e: { target: { checked: any; }; }) => {
        let value = e.target.checked;
        onChange && onChange(value);
    }

    /**styles 样式部分**/

    /**render**/

    return (
        <Checkbox {...props} checked={value} onChange={(e) => changeHandler(e)}>{children}</Checkbox>
    );
}
export default CCheckbox
