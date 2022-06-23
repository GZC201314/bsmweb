import React, {FC, useEffect, useState } from 'react'
import './style.scss'
import {useHistory} from "react-router-dom";
import {configManageListNewData, tableData} from "../../ywgl/pzxgl/data";
import {useSelector} from "../../../../hooks/hooks";
import pzxglDao from "../../../../dao/pzxglDao";
import _ from "lodash";
import {message, Modal} from "antd";
import {setPageNewValue} from "../../../../utils";
import CButton from "../../../../components/CButton";
import CInput from "../../../../components/CForm/CInput";
import CTable from "../../../../components/CTable";
import CSwitch from "../../../../components/CForm/CSwitch";
import CPageNew from "../../../../components/CPageNew";
export interface PzxglProps {

}
const Pzxgl:FC<PzxglProps> = (props) => {

    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState(configManageListNewData)
    const [editFlag, setEditFlag] = useState(false)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [filterData, setFilterData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)
    const [updateType, setUpdateType] = useState<"insert" | "edit">("insert")
    const [modalVisible, setModalVisible] = useState(false)
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入配置项描述'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取配置项列表数据
    let getConfigListData = (page1?: any) => {
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
            }
        }
        setLoading(true)

        pzxglDao.getConfigList(getData, (res: any) => {

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
            // message.error("登录信息已过期。请重新登录。")
            // history.push({
            //     pathname: '/login'
            // });

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

        pzxglDao.delConfig(delData, (res: any) => {
            if (res.code === 200) {
                getConfigListData();
            }
        })
    }

    useEffect(() => {
        getConfigListData();
    }, [reload,searchData.value])
    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getConfigListData({...page, ...data.data})
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
            setSearchData({...searchData,value: value})
        }
    }

    /*搜索*/
    const searchHandler = (value: any) => {
        console.log(value)
        setSearchData({...searchData, value: value})
    }

    /*新增角色*/
    const addHandler = () => {
        /*TODO 这边的实现是打开一个模式窗口*/
        setData(configManageListNewData)
        setUpdateType("insert")
        setModalVisible(true)
    }


    // 重置筛选项
    const resetHandler = (e: any) => {
        history.push({
            pathname: "/pzxgl"
        })
        setSearchData({...searchData, value: ''})
        setSearchValue('')
        setPage(tableData.tPage)
        // userManageList.clearFilterData();
    }
    // 编辑当前行
    const editHandler = (formData: any) => {
        setUpdateType('edit')
        setEditFlag(true)
        setModalVisible(true)

        /*给每个Item的value赋值*/
        let pageNewValue = setPageNewValue(data, formData);
        setData(pageNewValue)
        // setPageNewItem
    }

    // 删除当前行
    const delHandler = (data: any) => {

        let delData = {
            delIds: [data.roleid].join(",")
        };

        pzxglDao.delConfig(delData, (res: any) => {
            if (res.code === 200) {
                getConfigListData();
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

    const onSubmit = (data: any) => {
        let method = null;
        if (editFlag) {
            method = pzxglDao.updateConfig;
        } else {
            method = pzxglDao.insertConfig;
        }
        method(data.data, (res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                /*关闭弹窗*/
                setModalVisible(false)

                getConfigListData();
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

            <CTable size={'middle'} scroll={true} loading={loading} columns={colums}
                    selectedRowKeys={selectionDataIds}
                    dataSource={dataSource} page={page} onTableChange={onTableChange} onStateChange={onStateChange}
                    checked={true} rowKey={"id"}>
                <div
                    slot='remarkSlot'
                    // @ts-ignore
                    render={(text: any, record: { disabled?: any; roleid?: any; }, index: any) => {

                        if (_.isString(text) &&text.length>40) {
                            return <span title={text}>{text.substring(0, 40) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }

                    }}/>
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
                    <CPageNew data={data} onChange={onChange} onSubmit={onSubmit} onCancel={onCancel}
                              updateType={updateType} footerShow={true}/>
                </div>
            </Modal>

        </div>
    );
}
export default Pzxgl