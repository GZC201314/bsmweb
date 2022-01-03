import React, {FC, useEffect, useState} from 'react'
import CInput from './CInput'
import CSelect from './CSelect'
import CCheckbox from './CCheckbox'
import CSwitch from './CSwitch'
import CRadio, {Item} from './CRadio'
import CDatePicker from './CDatePicker'
import CUpload from './CUpload'
import {Form} from 'antd'
import validateAll from "./validate";
import _ from 'lodash'
import * as util from "util";
import cdglDao from "../../dao/cdglDao";

export interface CFormProps {
    validateStatus?: "" | "success" | "error" | "warning" | "validating" | undefined,
    validate?: boolean,
    disabled?: boolean,
    info?: string,
    type:string,
    value: any,
    checkType?: string,
    label?: string,
    placeholder?: string,
    onChange?: Function,
    onSearch?: Function,
    expand?:boolean,
    checkName?:string,
    options?:any[]
}

const CForm: FC<CFormProps> = (props) => {

    /**state  state部分**/

    /**methods 方法部分**/

    const validateHandler = async (value: any) => {
        if (!props.checkType) {
            return true
        }

        let checkTypeArr = props.checkType.split('|');
        let validateStatus = null;

        for (let i = 0; i < checkTypeArr.length; i++) {
            let checkData = checkTypeArr[i] as any;
            let checkArg = '' as any;
            if (checkData.includes(':')) {
                checkArg = checkData.split(':');
                checkData = checkArg[0];
                checkArg = checkArg[1];
            }
            /*在这边判断一下，是不是异步函数，如果是需要阻塞*/

            // @ts-ignore
            if (validateAll[checkData].constructor.name === 'AsyncFunction') {
                let promise = new Promise(((resolve) => {
                    // @ts-ignore
                    resolve(validateAll[checkData](value, checkArg))

                }))
                validateStatus = await promise
            } else {
                // @ts-ignore
                validateStatus = validateAll[checkData](value, checkArg);
            }
            if (!validateStatus.validate) {
                break
            }
        }
        return validateStatus;
    }


    const onChange = async (type: any, value: any) => {
        let validateResult = await validateHandler(value);
        props.onChange && props.onChange("value", {...validateResult, value: value})
    }

    const onSearch = async (value: any) => {
        let validateResult = await validateHandler(value);
        props.onSearch && props.onSearch("value", {...validateResult, value: value})
    }

    /**styles 样式部分**/

    /**effect  effect部分**/

    // useEffect(() => {
    //     props.onChange && props.onChange("value", props.value)
    // }, [props])

    // useEffect(() => {
    //     props.onChange && props.onChange("value", props.value)
    // }, [])

    /**render**/
    const isInput = ['input', 'number', 'search', 'password', 'textarea'].includes(props.type);
    const isSelect = ['select', 'treeSelect'].includes(props.type);
    const isCheckbox = ['checkbox'].includes(props.type);
    const isCSwitch = ['switch'].includes(props.type);
    const isRadio = ['radio'].includes(props.type);
    const isDatePicker = ['date', 'mouth', 'range', 'week'].includes(props.type);
    const isUpload = ['img'].includes(props.type);
    let newExpand = {};
    if (props.expand || _.isObject(props.expand)) {
        newExpand = _.cloneDeep(props.expand);
    }

    return (
        <div className='c-form'>

            <div className='flex c-form-content'>
                {
                    props.label && <div className='c-form-label ellipsis' title={props.label}>
                        {props.checkType && props.checkType.includes('required') && <span className='required-icon'>*</span>}
                        {props.label}
                    </div>
                }
                <div className='c-form-content-form'>
                    <Form>
                        <Form.Item className='c-form-item' validateStatus={props.validateStatus}>
                            {
                                isInput && <CInput {...newExpand} type={props.type}
                                                   placeholder={props.placeholder}
                                                   value={props.value}
                                                   disabled={props.disabled} onChange={onChange}/>
                            }
                            {
                                isSelect && <CSelect {...newExpand} type={props.type}
                                                     placeholder={props.placeholder}
                                                     value={props.value}
                                                     options={props.options}
                                                     disabled={props.disabled} onChange={onChange}
                                                     onSearch={onSearch}/>
                            }
                            {
                                isCheckbox &&
                                <CCheckbox value={props.value} disabled={props.disabled}
                                                         onChange={onChange}>{props.checkName}</CCheckbox>
                            }
                            {
                                isCSwitch &&
                                <CSwitch {...newExpand} value={props.value} disabled={props.disabled}
                                         onChange={onChange}/>
                            }
                            {
                                isRadio &&
                                <CRadio {...newExpand} disabled={props.disabled} value={props.value}
                                        options={props.options} onChange={onChange}/>
                            }
                            {
                                isDatePicker &&
                                // @ts-ignore
                                <CDatePicker {...newExpand} type={props.type} disabled={props.disabled}
                                             value={props.value} onChange={onChange}/>
                            }
                            {
                                isUpload &&
                                // @ts-ignore
                                <CUpload {...newExpand} type={props.type}
                                         fileList={props.value}
                                         onChange={onChange} disabled={props.disabled}/>
                            }
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className={`c-form-error-info ${!props.label ? 'c-form-none-label' : ''}`}>
                {props.info}
            </div>
        </div>
    );
}
export default CForm
