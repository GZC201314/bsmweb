import React, {FC, useEffect, useState} from 'react'
import './style.scss'
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {cdglManageListNewData, tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import cdglDao from "../../../../dao/cdglDao";
import _ from "lodash";
import {message, Modal, Tag} from "antd";
import {setPageNewValue} from "../../../../utils";
import CButton from "../../../../components/CButton";
import CInput from "../../../../components/CForm/CInput";
import CTable from "../../../../components/CTable";
import CPageNew from "../../../../components/CPageNew";
import * as Icons from '@ant-design/icons';
import {setReload} from "../../../../redux/common/action";

export interface CdglProps {

}

const Cdgl: FC<CdglProps> = (props) => {

    const dispatch = useDispatch()
    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState(cdglManageListNewData)
    const [editFlag, setEditFlag] = useState(false)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [filterData, setFilterData] = useState([])
    const [parentkeyOptions, setParentkeyOptions] = useState<any[]>([])
    // const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)
    const [parentKeyOption, setParentKeyOption] = useState([])
    const [updateType, setUpdateType] = useState<"insert" | "edit">("insert")
    const [modalVisible, setModalVisible] = useState(false)
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入页面名'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    /*渲染图标*/
    const renderIcon = (iconName: any): any => {
        // @ts-ignore
        if (!_.isEmpty(iconName) && Icons[iconName] !== null) {
            // @ts-ignore
            return React.createElement(Icons[iconName]);
        } else {
            return null;
        }
    }

    // 获取页面列表数据
    let getLPageistData = (page1?: any) => {

        let getData = {
            page: {
                page: page.page,
                pageSize: page.pageSize,
                search: searchData.value,
            }
        };
        if (page1) {
            getData = {
                page: {
                    page: page1.page,
                    pageSize: page1.pageSize,
                    search: searchData.value,
                }
            };
        }
        // setLoading(!reload)

        cdglDao.getPageList(getData, (res: any) => {

            if (res.code === 200) {
                let data = res.data.records;
                let total = res.data.total;
                setDataSource(data)
                if (!_.isEqual(page.total, total)) {
                    setPage({...page, total: total})
                }
                setLoading(false)
                return;
            }
            message.error("登录信息已过期。请重新登录。")
            history.push({
                pathname: '/login'
            });

        })
    }

    /*单独删除或者批量删除*/
    const removeHandler = () => {
        if (selectionDataIds.length === 0) {
            message.warning("请选择一条记录删除！")
            return;
        }
        let delData = {
            delIds: selectionDataIds.join(",")
        };

        cdglDao.delPage(delData, (res: any) => {
            if (res.code === 200) {
                getLPageistData();
            }
        })
    }

    useEffect(() => {
        getLPageistData();
    }, [reload, searchData.value]);


    /*初始化数据*/
    useEffect(() => {
        /*设置父节点Select Option*/
        initParentKeySelect();
    }, [])


    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getLPageistData({...page, ...data.data})

        } else if (data.type === 'selection') {
            setSelectionDataIds(data.data.ids)
        }
    }
    const onStateChange = (type: string, value: any) => {
        if (type === 'selectedRowKeys') {
            setSelectionDataIds(value)
        } else if (type === 'filterData') {
            setFilterData(value)
        } else if (type === 'value') {
            setSearchData({...searchData, value: value})
        }
    }

    /*初始化parentKey Select*/
    const initParentKeySelect = () => {

        cdglDao.getParentNode({}, (res: any) => {
            let parentNodeOption = [] as any[]
            /*设置根目录*/
            parentNodeOption.push({
                value: '0',
                key: '0',
                disabled: false,
                name: "根目录",
            })
            if (res.code === 200) {
                if (_.isArray(res.data)) {
                    res.data.forEach((item: any) => {
                        parentNodeOption.push({
                            value: item.pagekey,
                            key: item.pagekey,
                            disabled: false,
                            name: item.title,
                        })
                    })
                }
                let newData = _.cloneDeep(data);
                if (_.isArray(newData)) {
                    newData.forEach((item: any) => {
                        item.data && item.data.forEach((item: any) => {
                            if (item.id === 'parentkey') {
                                item.options = parentNodeOption
                                item.expand = {defaultValue: '0'}
                            }
                        })
                    })
                }
                setData(() => {
                    return newData
                })
            }
        })
    }
    /*搜索*/
    const searchHandler = (value: any) => {
        console.log(value)
        setSearchData({...searchData, value: value})
    }

    /*新增菜单*/
    const addHandler = () => {

        setUpdateType('insert')
        setEditFlag(false)

        let newData = _.cloneDeep(data);
        if (_.isArray(newData)) {
            newData.forEach((item: any) => {
                if (item.data && _.isArray(item.data)) {
                    item.data.forEach((data: any) => {
                        data.value = ''
                    })
                }
            })
        }
        setData(newData)


        setModalVisible(true)
    }


    // 重置筛选项
    const resetHandler = (e: any) => {
        history.push({
            pathname: "/cdgl"
        })
        setSearchData({...searchData, value: ''})
        // setPage(tableData.tPage)
        // userManageList.clearFilterData();
    }
    // 编辑当前行
    const editHandler = (formData: any) => {
        // if(formData.parentkey === '0'){
        //     message.warning("不允许修改一级菜单")
        //     return;
        // }
        setUpdateType('edit')
        setEditFlag(true)
        setModalVisible(true)

        /*给每个Item的value赋值*/
        setData(setPageNewValue(data, formData))
        // setPageNewItem
    }

    // 删除当前行
    const delHandler = (data: any) => {

        let delData = {
            delIds: [data.pageid].join(",")
        };

        cdglDao.delPage(delData, (res: any) => {
            if (res.code === 200) {
                getLPageistData();
            }
        })
    }


    const onChange = (type: string, data1: any) => {
        if (type === "data") {
            if (_.isObject(data1)) {
                // @ts-ignore
                setData(data1)
            }
        }

    }
    const onSearch = (type: string, data1: any, value: any) => {
        if (type === "data") {
            if (_.isObject(data1)) {
                // @ts-ignore
                setData(data1)
            }
        }
        cdglDao.getIconTypes({}, (res: any) => {
            let iconTypes = [] as any[]
            if (_.isArray(res.iconType)) {
                res.iconType.forEach((iconType: any) => {
                    if (iconType.includes(value)) {
                        iconTypes.push({
                            value: iconType,
                            key: iconType,
                            disabled: false,
                            name: <div>{renderIcon(iconType)}<span className={'iconTypeClass'}>{iconType}</span></div>
                        })
                    }
                })
                let newData = _.cloneDeep(data);
                if (_.isArray(newData)) {
                    newData.forEach((item) => {
                        if (_.isArray(item.data)) {
                            item.data.forEach((formItem: any) => {
                                if (formItem.id === 'icon') {
                                    formItem.options = iconTypes
                                }
                            })
                        }
                    })
                    setData(newData)
                }
            }

        })

    }

    const onSubmit = (data: any) => {
        let method = null;
        if (editFlag) {
            method = cdglDao.updatePage;
        } else {
            method = cdglDao.insertPage;
        }
        debugger

        /*在这边进行表单校验*/
        //如果是一级菜单
        if(data.data.parentkey === '0'){
            if(data.data.pagepath!==''){
                message.warning('一级菜单不需要设置页面路径,系统将自动设置为空。')
                data.data.pagepath =''
            }
            if(data.data.icon ===''){
                message.warning('一级菜单需要设置节点图标。')
                return;
            }
        }else{//如果是二级菜单
            if(data.data.icon !==''){
                message.warning('二级菜单不能设置节点图标,系统将自动设置为空。')
                data.data.icon = ''
            }
            if(data.data.pagepath===''){
                message.warning('二级菜单需要设置页面路径，请输入页面路径。')
                return;
            }
        }

        method(data.data, (res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                /*关闭弹窗*/
                setModalVisible(false)

                getLPageistData();
                return;
            }
            message.error("登录过期，请重新登录。")
            setModalVisible(false)
            history.push({
                pathname: "/login"
            })
        })
    }

    function onCancel(data: any) {
        setModalVisible(false)
    }

    /**styles 样式部分**/

    /**render**/


    return (
        <div className='user-manage-list'>
            <div className='flex filter-wrap'>
                <div className='flex filter-left'>
                    <CButton type='primary' authId='userManageListNewAdd' onClick={addHandler}>新增</CButton>
                    <CButton type='danger' authId='userManageListBatchDelete'
                             onClick={removeHandler}>批量删除</CButton>
                </div>
                <div className='flex filter-right'>
                    <CInput
                        className='search-input'
                        type='search'
                        value={searchData.value}
                        placeholder={searchData.placeholder} onEnter={searchHandler} onChange={onStateChange}/>
                    <CButton type='primary' onClick={resetHandler}>重置</CButton>
                </div>
            </div>

            {/*// @ts-ignore*/}
            <CTable size={'middle'} scroll={true} loading={loading} columns={colums}
                    selectedRowKeys={selectionDataIds}
                    dataSource={dataSource} page={page} onTableChange={onTableChange} onStateChange={onStateChange}
                    checked={true} rowKey={"pageid"}>

                <div
                    slot='icon'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => (
                        renderIcon(text)
                    )}/>

                <div
                    slot='operate'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => (
                        <div className='operate'>
                            <CButton type='text'
                                     onClick={() => editHandler(record)}>编辑</CButton>
                            <CButton type='text'
                                     onClick={() => delHandler(record)}>删除</CButton>
                        </div>
                    )}/>
            </CTable>

            {/*角色新增模式框*/}
            <Modal destroyOnClose visible={modalVisible} footer={null} onCancel={onCancel}>
                <div className='user-manage-list-new'>
                    <CPageNew data={data} onChange={onChange} onSearch={onSearch} onSubmit={onSubmit}
                              onCancel={onCancel}
                              updateType={updateType} footerShow={true}/>
                </div>
            </Modal>

        </div>
    );
}
export default Cdgl