/*
* 过滤项展示组件
* */
import React, {FC} from 'react'
import _ from 'lodash'
import {Tag} from 'antd';

export interface filterHeadProps {
    data: any[],
    onTagClose: Function,
}

const FilterHead: FC<filterHeadProps> = (props) => {

    /**state  state部分**/

    /**methods 方法部分**/
    const tagClose = (data: any, tag: any) => {
        props.onTagClose && props.onTagClose(data, tag);
    }

    const flag = (data: any) => {
        if (_.isArray(data.data)) {
            return !!data.data.length
        } else if (_.isObject(data.data)) {
            return _.isArray(data.data.dateString) ? !!data.data.dateString.length : !!data.data.dateString
        }
        return false
    }
    /**styles 样式部分**/

    /**effect  effect部分**/

    /**render**/

    return (
        <div className='flex filter-head'>
            {
                !!props.data.length && (
                    <>
                        <div className='flex filter-label'>
                            <i className='fa fa-filter'></i>
                            <span>筛选项</span>
                        </div>
                        <div className='flex filter-content'>
                            {
                                props.data.map((item: any, index) => {
                                    return <div key={item.key}>
                                        {
                                            flag(item) && <div className='flex filter-head-item'>
                                                <span className='label'>{item.title}</span>
                                                <div className='filter-tag'>
                                                    {
                                                        item.type === 'filter' && item.data.map((tag: any) => {
                                                            return <Tag closable color="cyan"
                                                                        onClose={(e) => tagClose(item, tag)}
                                                                        key={tag.value}>{tag.text}</Tag>
                                                        })
                                                    }
                                                    {
                                                        item.type === 'date' && _.isString(item.data.dateString) &&
                                                        <Tag closable color="cyan"
                                                             onClose={(e) => tagClose(item, item.data.dateString)}>{item.data.dateString}</Tag>
                                                    }
                                                    {
                                                        item.type === 'date' && _.isArray(item.data.dateString) &&
                                                        <Tag closable color="cyan"
                                                             onClose={(e) => tagClose(item, item.data.dateString)}>{item.data.dateString[0]}-{item.data.dateString[1]}</Tag>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default FilterHead
