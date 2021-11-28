import React, {FC, useEffect, useState } from 'react'
import {Radio} from 'antd'
import './index.scss'
export type Item ={
  name: string;
  value: string;
}
export interface CRadioProps{
  onChange?:Function;
  options:Item[];
  disabled:boolean;
  value: any;
}
const CRadio:FC<CRadioProps> = (props) => {

    /**state  state部分**/
    const{value,onChange,options,disabled}= props;
    /**effect  effect部分**/
    const[valueSatte,setValueState]= useState()

    useEffect(()=>{
      setValueState(value || '')
    },[value])

    /**methods 方法部分**/
    const changeHandler = (e:any)=>{
    let value = e.target.value;
    setValueState(value)
    onChange && onChange(value);
  }
    /**styles 样式部分**/

    /**render**/

  return(
        <Radio.Group onChange={(e) => changeHandler(e)} value={valueSatte}>
          {
            options.map((item=>{
              return <Radio key={item.value} disabled={disabled} value={item.value}>{item.name}</Radio>
            }))
          }
        </Radio.Group>
    );
}
export default CRadio
