import React, {FC, useState} from 'react'
import {Table, Spin} from 'antd'
import {renderTableFilter} from './tableFilter'
import FilterHead from './filterHead'
import CPage from '../CPage'
import _ from 'lodash'
import {SizeType} from "antd/lib/config-provider/SizeContext";

export interface CTableProps {
    columns: any[],
    dataSource: never[],
    children: any[],
    rowKey: string,
    page: {
        page: number,
        total: number,
        pageSize: number
    },
    checked?: boolean,
    // bordered?: boolean,
    size?: SizeType,
    showFilter?: boolean,//是否显示过滤项
    loading: boolean,
    scroll?: boolean,//默认展示scroll
    onTableChange?: Function,
    onStateChange?: Function,
    selectedRowKeys: any[],
    filterData?: any[]
}

const CTable: FC<CTableProps> = (props) => {
    const { size, scroll, page, columns, dataSource, selectedRowKeys, filterData, loading} = props;
    const scrollConfig: any = scroll ? {x: 'max-content'} : {x: false};
    /**state  state部分**/

    /**methods 方法部分**/
        // 过滤项发生变化时向上传递事件
    const filterChangeToParent = (filterData: any) => {
            let data = {
                type: 'filter',
                data: filterData
            };
            props.onTableChange && props.onTableChange(data);
        }
    // 初始化tableHead数据
    const columnsInit = (columnsData?: any, nextProps?: { columns: any }) => {
        let columns = null;
        if (columnsData) {
            columns = _.cloneDeep(columnsData);
        } else {
            columns = _.cloneDeep(props.columns);
            if (nextProps) {
                columns = _.cloneDeep(nextProps.columns);
            }
        }

        columns.forEach((item: any, index: number) => {
            if (item.hasOwnProperty('filterMultiple')) {
                if (item.filters) {
                    item.filters.forEach((filterItem: { hasOwnProperty: (arg0: string) => any; checked: boolean }) => {
                        if (!filterItem.hasOwnProperty('checked')) {
                            filterItem.checked = false;
                        }
                    })
                }
                // 如果是日期筛选
                if (item.hasOwnProperty('filterDate') && !item.hasOwnProperty('dateValue')) {
                    item.dateValue = null;//添加日期value，为了可控的日期组件
                }
                item.filterDropdown = (data: any) => {
                    return renderTableFilter(data, item, filterConfirm)
                };
            }
        });
        // setColumns(columns)
    }

    // 初始化tableHead数据
    const dataSourceInit = (nextProps: any) => {
        let dataSource = _.cloneDeep(nextProps.dataSource);
        // setDataSource(dataSource)
    }

    // 根据tagClose改变columns中filter的checked
    const formCheckedFilterToColumns = (key: any, value: any, checked: boolean) => {
        let columns1 = _.cloneDeep(columns);
        columns1.forEach(item => {
            // @ts-ignore
            if (item.key === key) {
                // @ts-ignore
                item.filters.forEach(filterItem => {
                    if (filterItem.value === value) {
                        filterItem.checked = checked
                    }
                })
            }
        });
        return columns1
    }

    // tag关闭事件
    const tagClose = (data: any, tag: { value: any }) => {
        let newData = data;
        let tagIndex = _.isArray(newData.data) && newData.data.findIndex((item: { value: any }) => {
            return item.value === tag.value
        });
        // 日期筛选类型下tagIndex为false，此项为非日期判断
        if (tagIndex !== false && (tagIndex === 0 || tagIndex > -1)) {
            newData.data.splice(tagIndex, 1);
            _.isArray(newData.value) ? newData.value.splice(tagIndex, 1) : (newData.value = '');
        }
        // 如果是date筛选类型
        if (newData.type === 'date') {
            newData.data.dateString = null;
        }
        filterConfirm(newData);
        let columns = null;
        if (newData.type === 'filter') {
            columns = formCheckedFilterToColumns(newData.key, tag.value, false);
        }
        columns ? columnsInit(columns) : columnsInit();
    }

    // 清空过滤项数据
    const clearFilterData = () => {
        // setFilterData([])
        if (props.onStateChange) {
            props.onStateChange("filterData", [])
            columnsInit();
        }
    }

    // filter过滤确认
    const filterConfirm = (data: any) => {
        let filterData1 = _.cloneDeep(filterData);
        // @ts-ignore
        let currentIndex = filterData1.findIndex((item: { key: any }) => {
            return item.key === data.key
        });
        let currentFilter = {
            data,
        };
        if (currentIndex > -1) {
            // 存在则修改
            if (filterData1) {
                currentFilter = filterData1[currentIndex];
            }
            currentFilter.data = data.data;
            // 判断如果在close的时候data.data可能是空，这时候需要删除当前项
            if (data.type === 'filter' && !currentFilter.data.length) {
                // @ts-ignore
                filterData1.splice(currentIndex, 1);
            } else if (data.type === 'date') {
                let isHave = _.isArray(currentFilter.data.dateString) ? !!currentFilter.data.dateString.length : !!currentFilter.data.dateString;
                if (!isHave) {
                    // @ts-ignore
                    filterData1.splice(currentIndex, 1);
                }
            } else {
                // @ts-ignore
                filterData1.splice(currentIndex, 1, currentFilter);
            }
        } else {
            //不存在则新添加
            // @ts-ignore
            filterData1.push(data);
        }

        if (props.onStateChange) {
            props.onStateChange("filterData", filterData1)
        }
        filterChangeToParent(data);
    }

    // 配置rowSelection
    const rowSelection = () => {
        if (!props.checked) {
            return null
        }
        return {
            type: 'checkbox',
            fixed: 'left',
            columnWidth: 40,
            selectedRowKeys: props.selectedRowKeys,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                if (props.onStateChange) {
                    props.onStateChange("selectedRowKeys", selectedRowKeys)
                }
                tableSelectionChange(selectedRowKeys, selectedRows);
            },
            // 选择框的默认属性配置
            getCheckboxProps: (record: { disabled: any; checked: any }) => ({
                selected: record.checked,
            }),
        } as any
    }


    // 初始化selected
    const selectedRowKeysInit = () => {
        let selectedRowKeys = props.selectedRowKeys
        dataSource.forEach(item => {
            // @ts-ignore
            if (item.checked) {
                // @ts-ignore
                selectedRowKeys.push(item.id);
            }
        });
        // @ts-ignore
        if (props.onStateChange) {
            props.onStateChange("selectedRowKeys", selectedRowKeys);
        }
    }

    // 选择项发生变化
    const tableSelectionChange = (selectedRowKeys: any, selectedRows: any) => {
        let data = {
            type: 'selection',
            data: {
                ids: selectedRowKeys,
                data: selectedRows
            }
        };
        props.onTableChange && props.onTableChange(data);
    }


    // 分页change
    const onPageChange = (data: any) => {
        props.onTableChange && props.onTableChange(data);
    }

    // 渲染tableColumn
    const renderColumn = (item: any) => {
        if (!item.slot) {
            return <Table.Column
                {...item}
                render={(text, record, index) => (
                    <div className='c-table-column'>{text}</div>
                )}/>
        } else if (props.children) {
            if (_.isArray(props.children)) {
                // @ts-ignore
                let childrenItem = props.children.filter((childrenItem: { props: any }, childrenIndex: any) => {
                    return childrenItem.props.slot === item.slot;
                });
                if (childrenItem.length) {
                    return <Table.Column
                        {...item}
                        render={(text, record, index) => (
                            <div className='c-table-column'>{childrenItem[0].props.render(text, record, index)}</div>
                        )}/>
                }
                return null;
            } else {
                // @ts-ignore
                if (props.children.props.slot === item.slot) {
                    return <Table.Column
                        {...item}
                        render={(text, record, index) => (
                            <div className='c-table-column'>{
                                // @ts-ignore
                                props.children.props.render(text, record, index)
                            }</div>
                        )}/>
                } else {
                    return null;
                }
            }
        }
    }

    React.useEffect(() => {
        columnsInit();
        selectedRowKeysInit();
    }, [columnsInit, props.loading, selectedRowKeysInit])


    /**styles 样式部分**/

    /**effect  effect部分**/

    /**render**/


    return (
        <div>
            <div className='c-table'>
                <Spin spinning={loading}>
                    <FilterHead data={filterData ? filterData : []} onTagClose={tagClose}/>
                    <Table
                        rowKey={props.rowKey}
                        // bordered={bordered !== undefined ? bordered : false}
                        size={size}
                        scroll={scrollConfig}
                        pagination={false}
                        rowSelection={rowSelection()}
                        dataSource={dataSource}>
                        {
                            columns.map(item => {
                                return renderColumn(item)
                            })
                        }
                    </Table>
                    {page && !!page.total && <CPage total={page.total}
                                                    page={page.page}
                                                    pageSize={page.pageSize} onPageChange={onPageChange}/>}
                </Spin>
            </div>
        </div>
    );
}

export default CTable
