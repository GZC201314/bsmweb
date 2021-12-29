import React, {FC, useEffect, useState} from 'react'
import {Select, TreeSelect} from 'antd'
import './index.scss'
const { Option} = Select
export type Item = {
    name: string;
    value: string;
    disabled:boolean;
}

export interface CSelectProps {
    value: any;
    type:any;
    style?:object;
    options?: Item[];
    disabled?:boolean;
    placeholder?:string;
    onSearch?:Function;
    onChange?: Function;
}

const CSelect: FC<CSelectProps> = (props) => {

    /**state  state部分**/
    /**effect  effect部分**/
    /**methods 方法部分**/

    const changeHandler = (value:any)=>{
        onChange && onChange("value",value);
    }

    const searchHandler = (value:any)=>{
        onSearch && onSearch(value);
    }

    /**styles 样式部分**/

    /**render**/
    const {type, options, style, onSearch, onChange, ...restProps} = props;
    const SelectDom = type === 'treeSelect' ? TreeSelect : Select;

    return (
        // @ts-ignore
        <SelectDom {...restProps}
                   value={props.value}
                   className='c-select'
                   style={{...style}}
                   onSearch={(value:any) => searchHandler(value)}
                   onChange={(value:any) => changeHandler(value)}>
            {
                type === 'select' && options && options.map((item, index)=>{
                    return <Option key={index} value={item.value} disabled={item.disabled}>{item.name}</Option>
                })
            }
        </SelectDom>
    );
}
export default CSelect