import React, {FC, useEffect} from 'react'
import {Radio} from 'antd'
import './index.scss'

export type Item ={
  name: string;
  value: string;
}
export interface CRadioProps{
  onChange?:Function;
  options?:Item[];
  disabled?:boolean;
  value: any;
}
const CRadio:FC<CRadioProps> = (props) => {

    /**state  state部分**/
    const{value,onChange,options,disabled}= props;
    /**effect  effect部分**/

    useEffect(()=>{
        props.onChange && props.onChange("value",value)
    },[value])

    /**methods 方法部分**/
    const changeHandler = (e:any)=>{
    let value = e.target.value;
        props.onChange && props.onChange("value",value)
    onChange && onChange(value);
  }
    /**styles 样式部分**/

    /**render**/

  return(
        <Radio.Group onChange={(e) => changeHandler(e)} value={props.value}>
          {
              options && options.map((item=>{
              return <Radio key={item.value} disabled={disabled} value={item.value}>{item.name}</Radio>
            }))
          }
        </Radio.Group>
    );
}
export default CRadio
