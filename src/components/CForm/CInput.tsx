import React, {FC, useEffect, useState } from 'react'
import { Input, InputNumber} from 'antd'
import './index.scss'

export interface CInputProps{
  type: string,
  showNumberStep: false,//是否显示number类型的step
  value: string|number,
  onChange:Function,
  onEnter:Function,
  className:string
}
const CInput:FC<CInputProps> = (props) => {

    /**state  state部分**/
    const {type, showNumberStep, className, onChange, onEnter, value, ...restProps} = props;
  const [inputTypeOver,setInputTypeOver]=useState({
    password:'Password',
    search:'Search',
    textarea:'TextArea',
  })

  const [valueState,setValueState] =useState('')
  // @ts-ignore
  const InputDom = inputTypeOver[type] ? Input[inputTypeOver[type]] : (type === 'input' && Input);
  const onSearch = (value:any) => searchHandler(value);
  let propsObj = {};
  if(type === 'search'){
    propsObj = {
      onSearch
    }
  }




    /**effect  effect部分**/
    useEffect(()=>{
      let defaultValue:any = type === 'number' ? undefined : '';
      setValueState(value || defaultValue)
    },[type, value, valueState])

    /**methods 方法部分**/
    const changeHandler = (e:any) =>{
    let value = type === 'number' ? e : e.target.value;

    setValueState(value)
    onChange && onChange(value);
  }

  const enterHandler=(e:any)=>{
    let value = e.target.value;
    onEnter && onEnter(value);
  }

  const searchHandler=(value:any)=>{
    onEnter && onEnter(value);
  }
    /**styles 样式部分**/

    /**render**/

    return(
        <>
          {!!InputDom && <InputDom {...props}
                                   {...propsObj}
                                   value={valueState}
                                   className={`c-input ${className}`}
                                   onChange={(e:any) => changeHandler(e)}
                                   onPressEnter={(e:any) => enterHandler(e)}/>}
          {type === 'number'
          && <InputNumber {...props}
                          value={valueState}
                          onChange={(value) => changeHandler(value)}
                          className={`c-input-number ${className} ${!showNumberStep ? 'no-show-number-step' : ''}`}/>}
        </>
    );
}
export default CInput