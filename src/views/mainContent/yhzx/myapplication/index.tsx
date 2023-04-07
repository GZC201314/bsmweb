import {message, Modal, Select, Spin} from 'antd';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import './style.scss'
import CInput from "../../../../components/CForm/CInput";
import CButton from "../../../../components/CButton";
import CTable from "../../../../components/CTable";
import CSwitch from "../../../../components/CForm/CSwitch";
import {useHistory} from "react-router-dom";
import {roleManageListNewData, tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import jsglDao from "../../../../dao/jsglDao";
import _ from "lodash";
import debounce from 'lodash/debounce';
import {setPageNewValue} from "../../../../utils";
import type {SelectProps} from 'antd/es/select';
import {debuglog, log} from "util";
import lcglDao from "../../../../dao/lcglDao";

export type userInfoType = {
    username: string,
    usericon:string,
    createtime: string,
    emailaddress: string,
    enabled: boolean,
    isfacevalid: boolean,
    lastmodifytime: string,
    roleName: string,
}

export interface ParamValue {
    label: string;
    value: string;
}

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

const MyApplication: FC<DebounceSelectProps> = (props) => {
    const [value, setValue] = useState<ParamValue[]>([]);
    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState(roleManageListNewData)
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
        placeholder: '请输入角色名'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)
    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取用户角色列表数据
    let getRoleListData = (page1?: any) => {
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

        jsglDao.getRoleListInfo(getData, (res: any) => {

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

    useEffect(()=>{
        console.log(value)
        lcglDao.getFlowFormByFlowId({id:value[0] && value[0].value},(res:any)=>{
            console.log(res);
        })
    },[value])
    /*单独删除或者批量删除*/
    const removeHandler = () => {
        if (selectionDataIds.length === 0) {
            message.warning("请选择一条记录删除！")
            return;
        }
        let delData = {
            delIds: selectionDataIds.join(",")
        };

        jsglDao.delRole(delData, (res: any) => {
            if (res.code === 200) {
                getRoleListData();
            }
        })
    }

    useEffect(() => {
        getRoleListData();
    }, [reload,searchData.value])
    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getRoleListData({...page, ...data.data})
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
        setSearchData({...searchData, value: value})
    }

    /*新增角色*/
    const addHandler = () => {
        /*TODO 这边的实现是打开一个模式窗口*/
        setData(roleManageListNewData)
        setModalVisible(true)
    }


    // 重置筛选项
    const resetHandler = (e: any) => {
        history.push({
            pathname: "/jsgl"
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

        jsglDao.delRole(delData, (res: any) => {
            if (res.code === 200) {
                getRoleListData();
            }
        })
    }

    // 激活or停用用户
    const editActiveChange = (type: any, value: any, record: { disabled?: any; roleid?: any }) => {
        let data = {
            roleid: record.roleid,
            disabled: !value
        };

        jsglDao.editActiveRoleList(data, (res: any) => {
            if (res.code === 200) {
                dataSource.forEach((item: any) => {
                    if (item.roleid === record.roleid) {
                        item.disabled = !value
                    }
                })
                setSearchData({...searchData, value: ''})
                message.success(res.msg)
            } else {
                message.error(res.msg)
            }
            // getUserListData();
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
    const selectOnChange = (type: string, data: any) => {
        console.log("selectOnChange")
        console.log(type)
        console.log(data)
    }

    function DebounceSelect<
        ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
        >({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
        const [fetching, setFetching] = useState(false);
        const [options, setOptions] = useState<ValueType[]>([]);
        const fetchRef = useRef(0);

        const debounceFetcher = useMemo(() => {
            const loadOptions = (value: string) => {
                fetchRef.current += 1;
                const fetchId = fetchRef.current;
                setOptions([]);
                setFetching(true);

                fetchOptions(value).then((newOptions) => {
                    if (fetchId !== fetchRef.current) {
                        // for fetch callback order
                        return;
                    }

                    setOptions(newOptions);
                    setFetching(false);
                });
            };

            return debounce(loadOptions, debounceTimeout);
        }, [fetchOptions, debounceTimeout]);

        return (
            <Select
                labelInValue
                filterOption={false}
                onSearch={debounceFetcher}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                {...props}
                options={options}
            />
        );
    }

    function onCancel(data: any) {
        setModalVisible(false)
    }

    async function fetchFlowList(flowKey: string): Promise<ParamValue[]> {
        return fetch('/bsmservice/flowable/allFlow',{
            method:'post',
            body:JSON.stringify({key:flowKey}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((body) =>
                body.data && body.data.map(
                    (flow: { key:string,name?:string,id:string}) => ({
                        label: `${flow.key} ${flow.name}`,
                        value: flow.id,
                    }),
                ),
            );
    }

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
                    checked={true} rowKey={"roleid"}>
                <div
                    slot='isActive'
                    // @ts-ignore
                    render={(text: any, record: { disabled?: any; roleid?: any; }, index: any) => {
                        return <div className='isActive'>
                            <CSwitch value={!text}
                                     onChange={(type: any, value: any) => editActiveChange(type, value, record)}/>
                        </div>

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
                <div className='modal-class'>
                    <DebounceSelect mode="tags"
                                    value={value}
                                    placeholder="选择流程"
                                    fetchOptions={fetchFlowList}
                                    onChange={(newValue) => {
                                        setValue(newValue as ParamValue[]);
                                    }}
                                    style={{ width: '100%' }}/>
                    {/*<CPageNew data={data} onChange={onChange} onSubmit={onSubmit} onCancel={onCancel}*/}
                    {/*          updateType={updateType} footerShow={true}/>*/}
                </div>
            </Modal>

        </div>
    );
}
export default MyApplication