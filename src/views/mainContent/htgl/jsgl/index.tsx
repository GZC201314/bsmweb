import {DownOutlined} from '@ant-design/icons';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import React, {FC, useEffect, useState} from 'react'
import CButton from '../../../../components/CButton';
import CInput from '../../../../components/CForm/CInput';
import CTable from '../../../../components/CTable';
import CSwitch from "../../../../components/CForm/CSwitch";
import {tableData} from './data'
import {setReload} from "../../../../redux/common/action";
import _ from 'lodash'
import './style.scss'
import {useSelector} from "../../../../hooks/hooks";
import jsglDao from "../../../../dao/jsglDao";
import {useDispatch} from "react-redux";

export interface JsglProps {

}


const Jsgl: FC<JsglProps> = (props) => {

    const dispatch = useDispatch()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [loading, setLoading] = useState(true)
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入角色名'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([])

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    useEffect(() => {
        if (reload) {
            getUserListData();
        }
    }, [reload])

    useEffect(() => {
        getUserListData();
    }, [page,searchData])

    useEffect(() => {
        removeHandler();
    }, [selectionDataIds])
    /**methods 方法部分**/

        // 获取用户角色列表数据
    const getUserListData = () => {
            let getData = {
                page: page.page,
                pageSize: page.pageSize,
                search: searchData.value,
            };
            setLoading(true)

            jsglDao.getRoleListInfo(getData, (res: any) => {
                let data = res.data.list;
                let total = res.data.pagination.total;
                setDataSource(data)
                setPage({...page, total: total})
                setLoading(false)
                dispatch(setReload(false));
            })
        }

    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
        } else if (data.type === 'selection') {
            setSelectionDataIds(data.data.ids)
        }
    }

    /*搜索*/
    const searchHandler = (value:any) =>{
        setSearchData({...searchData,value:value})
    }

    /*新增角色*/
    const addHandler = () => {
        /*TODO 这边的实现是打开一个模式窗口*/
        console.log("addHandler")
    }

    /*单独删除或者批量删除*/
    const removeHandler = () =>{
        let delData = {
            ids: selectionDataIds
        };
        jsglDao.delRole(delData,(res:any)=>{
            getUserListData();
        })
    }

    // 重置筛选项
    const resetHandler = () =>{
        setSearchData({...searchData, value: ''})
        setPage(tableData.tPage)
        // userManageList.clearFilterData();
    }

    // 查看详情
    const detailHandler=(data:any) =>{
        console.log("detailHandler")
    }

    // 编辑当前行
    const editHandler = (data:any) =>{
        console.log("editHandler")
    }

    // 删除当前行
    const delHandler=(data:any)=>{
        // @ts-ignore
        setSelectionDataIds([data.id])
    }

    // 激活or停用用户
    const editActiveChange= (value: any, record: { isActive?: any; id?: any })=>{
        let data = {
            id: record.id,
            isActive: value
        };
        jsglDao.editActiveRoleList(data,(res:any)=>{
            getUserListData();
        })
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
                    <CInput value={searchData.value}
                            className='search-input'
                            type='search'
                            placeholder={searchData.placeholder} onEnter={searchHandler}/>
                    <CButton type='primary' onClick={resetHandler}>重置</CButton>
                </div>
            </div>

            {/*ref='userManageList'*/}
            <CTable loading={loading} columns={colums}
                    dataSource={dataSource} page={page} onTableChange={onTableChange}>
                <div
                    slot='isActive'
                    // @ts-ignore
                    render={(text: any, record: { isActive?: any; id?: any; }, index: any) => (
                        <div className='isActive'>
                            <CSwitch value={record.isActive}
                                     onChange={(value: any) => editActiveChange(value, record)}/>
                        </div>
                    )}/>
                <div
                    slot='operate'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => (
                        <div className='operate'>
                            <CButton type='text' onClick={() => detailHandler(record)}>查看</CButton>
                            <CButton type='text' authId='userManageListEdit'
                                     onClick={() => editHandler(record)}>编辑</CButton>
                            <CButton type='text' authId='userManageListDelete'
                                     onClick={() => delHandler(record)}>删除</CButton>
                        </div>
                    )}/>
            </CTable>
        </div>
    );
}
export default Jsgl