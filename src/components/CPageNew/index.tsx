import React, {FC, useEffect} from 'react'
import _ from 'lodash'
import CForm from '../CForm/CForm'
import CButton from '../CButton'
import {setObjectValue} from "../../utils"
import './index.scss'

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

    const onChange = (data: any, value: any) => {
        setDataByKeyForValue(data, value);
        props.onChange && props.onChange({data, value});
    }

    const onSearch = (data: any, value: any) => {
        props.onSearch && props.onSearch({data, value});
    }

    /*设置data某一项的value*/
    const setDataByKeyForValue = (itemData: any, value: any) => {
        let newData = _.cloneDeep(props.data);
        // @ts-ignore
        newData.forEach(item => {
            item.data && item.data.forEach((formItem: any) => {
                if (_.isArray(formItem)) {
                    formItem.forEach(form => {
                        if (itemData.id === form.id) {
                            form.value = value;
                        }
                    })
                } else {
                    if (itemData.id === formItem.id) {
                        formItem.value = value;
                    }
                }
            })
        });
        props.onChange && props.onChange("data",newData)
    }

    /*获取所有项的value*/
    const getValueAll = (data: any) => {
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
        let validateAllArr: boolean[] = [];
        /*TODO 查找所有的输入项，校验*/
        return validateAllArr.includes(false) ? false : true;
    }

    /*处理需要返回的data数据*/
    const dealDataFormat = () => {
        let obj = {};
        // @ts-ignore
        props.data.forEach((item: any) => {
            item.data && item.data.forEach((formItem: any) => {
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
        if(!_.isEqual(newData,data)){
            debugger
            props.onChange && props.onChange("data",newData)
        }
    }


    /**styles 样式部分**/

    /**effect  effect部分**/

    // useEffect(() => {
    //     initFormatData(props.data);
    // }, [props])

    useEffect(() => {
        initFormatData(props.data);
        let values = getValueAll(props.data);
        validateFormAll(values);
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
                                    _.isArray(formItem) && formItem.map((item:any, index:number) => {
                                    return <React.Fragment key={item.id}>
                                        {
                                            item.show && <div className='c-page-form-item'>
                                                <CForm {...item}
                                                    // ref={item.id}
                                                       label={item.name}
                                                       onChange={(value: any) => onChange(item, value)}
                                                       onSearch={(value: any) => onSearch(item, value)}/>
                                            </div>
                                        }
                                    </React.Fragment>
                                })}
                                {
                                    // @ts-ignore
                                    _.isObject(formItem) && formItem.show && <div className='c-page-form-item'>
                                        <CForm validateStatus={undefined} validate={false} info={''} type={''}
                                               value={undefined} {...formItem}
                                            // ref={formItem.id}
                                            // @ts-ignore
                                               label={formItem.name}
                                               onChange={(value: any) => onChange(formItem, value)}
                                               onSearch={(value: any) => onSearch(formItem, value)}/>
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
