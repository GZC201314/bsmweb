import React, {FC, useEffect} from 'react'
import _ from 'lodash'
import CForm from '../CForm/CForm'
import CButton from '../CButton'
import {setObjectValue} from "../../utils"
import './index.scss'
import validateAll from "../CForm/validate";
import {message} from "antd";

export interface CPageNewProps {
    onChange: Function,
    onSearch?: Function,
    onSubmit: Function,
    onCancel: Function,
    updateType: 'insert' | 'edit',
    /*如果是修改类型的话，data就是查询的详情信息*/
    data?: any[],
    footerShow?: boolean,
}

const CPageNew: FC<CPageNewProps> = (props) => {

    /**state  state部分**/

    /**methods 方法部分**/

    const onChange = (data: any, type: any, value: any) => {
        if (type === 'value') {
            setDataByKeyForValue(data, type, value);
        }

        // props.onChange && props.onChange({data, value});
    }

    const onSearch = (data: any, value: any) => {
        setDataByKeyForValue(data, "searchValue", value);
    }

    /*设置data某一项的value*/
    const setDataByKeyForValue = (itemData: any, type: any, value: any) => {
        // debugger
        let newData = _.cloneDeep(props.data);
        // @ts-ignore
        newData.forEach(item => {
            item.data && item.data.forEach((formItem: any) => {
                if (_.isArray(formItem)) {
                    formItem.forEach(form => {
                        if (itemData.id === form.id) {
                            Object.assign(form, value)
                        }
                    })
                } else {
                    if (itemData.id === formItem.id) {
                        Object.assign(formItem, value)
                    }
                }
            })
        });
        if(type === 'searchValue'){
            props.onSearch && props.onSearch("data", newData,value.value)
        }else {
            props.onChange && props.onChange("data", newData)
        }
    }
    /*获取所有项的value*/
    const getValueAll = (data: any) => {
        // debugger
        let values = {} as any;
        data.forEach((item: any) => {
            item.data && item.data.forEach((formItem: any) => {
                if (_.isArray(formItem)) {
                    formItem.forEach(form => {
                        if (form.show) {
                            values[form.id] = form.value
                        }
                    })
                } else {
                    if (formItem.show) {
                        values[formItem.id] = formItem.value;
                    }
                }
            })
        });
        return values;
    }


    const validateFormAll = (values: any) => {
        const newData = _.cloneDeep(props.data);

        let result: boolean[] = [];
        for (let key in values) {
            let value = values[key];
            newData?.forEach((item1) => {
                item1.data.forEach((item2: any) => {
                    if (key === item2.id) {

                        if (!item2.checkType) {
                            return true
                        }
                        let checkTypeArr = item2.checkType.split('|');
                        let validateStatus = null;

                        for (let i = 0; i < checkTypeArr.length; i++) {
                            let checkData = checkTypeArr[i] as any;
                            let checkArg = '' as any;
                            if (checkData.includes(':')) {
                                checkArg = checkData.split(':');
                                checkData = checkArg[0];
                                checkArg = checkArg[1];
                            }
                            debugger
                            // @ts-ignore
                            validateStatus = validateAll[checkData](value, checkArg);
                            result.push(validateStatus.validate)
                        }
                    }
                })
            })
        }
        return !result.includes(false);
    }

    /*处理需要返回的data数据*/
    const dealDataFormat = () => {
        let obj = {};
        // @ts-ignore
        props.data.forEach((item: any) => {
            item.data && item.data.forEach((formItem: any) => {
                // debugger
                if (_.isArray(formItem)) {
                    formItem.forEach((form: any) => {
                        // @ts-ignore
                        if (formItem.show) {
                            setObjectValue(obj, form.jpath, form.value);
                        }
                    })
                } else {
                    if (formItem.show) {
                        setObjectValue(obj, formItem.jpath, formItem.value);
                    }
                }
            })
        });
        return obj;
    }

    /*提交*/
    const submitHandler = () => {
        let values = getValueAll(props.data);
        let validateStatus = validateFormAll(values);
        let data1 = {status: validateStatus, data: {}};
        if (validateStatus) {
            data1.data = dealDataFormat();
            props.onSubmit && props.onSubmit(data1);
            return data1;
        }
        /*校验不通过，拒绝提交，提示用户检查输入*/
        message.error("参数校验不通过，请检查输入。")
        return null;
    }

    /*取消*/
    const cancelHandler = () => {
        props.onCancel && props.onCancel();
    }

    // 初始时格式化data数据
    const initFormatData = (data: any) => {
        let newData = _.cloneDeep(data);
        let disabledKey = 'newDisabled';
        let showKey = 'newShow';
        /*TODO 这边可以通过属性绑定给模式框传参*/
        if (props.updateType === 'edit') {
            disabledKey = 'editDisabled';
            showKey = 'editShow';
        }
        newData.forEach((item: { data: any[] }) => {
            item.data && item.data.forEach((formItem: any) => {
                if (_.isArray(formItem)) {
                    formItem.forEach(form => {
                        form.disabled = form[disabledKey] || false;
                        form.show = form[showKey] || false;
                    })
                } else {
                    formItem.disabled = formItem[disabledKey] || false;
                    formItem.show = formItem[showKey] || false;
                }
            })
        });
        if (!_.isEqual(newData, data)) {
            props.onChange && props.onChange("data", newData)
        }
    }


    /**styles 样式部分**/

    /**effect  effect部分**/

    // useEffect(() => {
    //     initFormatData(props.data);
    // }, [props])

    useEffect(() => {
        initFormatData(props.data);
        // let values = getValueAll(props.data);
        // validateFormAll(values);
    }, [])
    /**render**/

    return (
        <div className='c-page-new'>
            {
                !!props.data && props.data.map((pageItem, pageIndex) => {
                    return <div className='c-page-new-item' key={pageItem.id}>
                        {pageItem.title && <div className='flex c-page-new-item-title'>
                            <span className='title-before-icon'/>{pageItem.title}</div>}
                        {!!pageItem.data.length && pageItem.data.map((formItem: any, formIndex: number) => {
                            return <div className='flex c-page-form' key={formItem.id}>
                                {
                                    _.isArray(formItem) && formItem.map((item: any, index: number) => {
                                        return <React.Fragment key={item.id}>
                                            {
                                                item.show && <div className='c-page-form-item'>
                                                    <CForm {...item}
                                                        // ref={item.id}
                                                           label={item.name}
                                                           onChange={(type: any, value: any) => onChange(formItem, type, value)}
                                                           onSearch={(value: any) => onSearch(item, value)}/>
                                                </div>
                                            }
                                        </React.Fragment>
                                    })}
                                {
                                    // @ts-ignore
                                    _.isObject(formItem) && formItem.show && <div className='c-page-form-item'>
                                        {/*// @ts-ignore*/}
                                        <CForm
                                            {...formItem}
                                            // ref={formItem.id}
                                            // @ts-ignore
                                            label={formItem.name}
                                            onChange={(type: any, value: any) => onChange(formItem, type, value)}
                                            onSearch={(type: any, value: any) => onSearch(formItem, value)}/>
                                    </div>
                                }
                            </div>
                        })}
                    </div>
                })
            }
            {
                props.footerShow && <div className='c-page-footer-button'>
                    <CButton size='larger' type='primary' onClick={submitHandler}>确定</CButton>
                    <CButton size='larger' onClick={cancelHandler}>取消</CButton>
                </div>
            }
        </div>
    );
}
export default CPageNew
