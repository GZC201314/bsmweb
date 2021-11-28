
import React, {FC, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { DatePicker} from 'antd'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import './index.scss'
export interface CDatePickerProps{
  onChange?: Function
  type?: any
  value?:string
  className?:string
}
export type DateType ={
  mouth: 'MonthPicker',
  range: 'RangePicker',
  week: 'WeekPicker'
}
const CDatePicker:FC<CDatePickerProps> = (props) => {

    /**state  state部分**/
    const{type, value, onChange, className, ...restprops}= props;
    /**effect  effect部分**/
  const [valueState,setValueState]=useState(null)
  const [dateFormat,setDateFormat]=useState('YYYY-MM-DD HH:mm:ss')
  const[dateType,setDateType]=useState<DateType>()



  // @ts-ignore
  const DatePickerDom = dateType[type] ? DatePicker[dateType[type]] : DatePicker;
    /**methods 方法部分**/

  const valueFormat=(value:any)=>{
    if(_.isString(value)){
      value = value ? moment(value, dateFormat) : null;
    }
    if(_.isArray(value)){
      value = value.length ? [moment(value[0], dateFormat),moment(value[1], dateFormat)] : null;
    }
      setValueState(value)
  }



  const changeHandler=(date:any, dateString:any)=>{
    valueFormat(dateString);
    onChange && onChange(dateString);
  }

  useEffect(()=>{
    valueFormat(valueState);
  },[valueFormat, valueState])
    /**styles 样式部分**/

    /**render**/

    return(
        <DatePickerDom {...restprops} locale={locale} value={valueState} className={`${className} c-date-picker`} onChange={(date: any, dateString: any) => changeHandler(date, dateString)}/>

    );
}
export default CDatePicker
