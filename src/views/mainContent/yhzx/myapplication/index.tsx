import {Descriptions, Form, Input, message, Modal, Select, Spin} from 'antd';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import './style.scss'
import CInput from "../../../../components/CForm/CInput";
import CButton from "../../../../components/CButton";
import CTable from "../../../../components/CTable";
import CSwitch from "../../../../components/CForm/CSwitch";
import {useHistory} from "react-router-dom";
import {roleManageListNewData, tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import _ from "lodash";
import debounce from 'lodash/debounce';
import type {SelectProps} from 'antd/es/select';
import lcglDao from "../../../../dao/lcglDao";
import TextArea from 'antd/lib/input/TextArea';


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
    const [selectedUser, setSelectedUser] = useState<ParamValue[]>([]);
    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState(roleManageListNewData)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [form,setForm] = useState<{type:string,label:string,id:string}[]>()
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入角色名'
    })
    const [paramsForm] = Form.useForm();
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)
    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取用户角色列表数据
    let getMyApplicationListData = (page1?: any) => {
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

        lcglDao.getMyApplicationList(getData, (res: any) => {

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
        if (value[0] && !_.isNull(value[0].value)){
            lcglDao.getFlowFormByFlowId({id:value[0] && value[0].value},(res:any)=>{
                setForm(res.data.form);
            })
        }
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

        lcglDao.delFlowInstance(delData,(res:any)=>{
            if (res.code === 200){
                message.info("删除流程实例成功。");
            }else {
                message.error(res.msg)
            }
        })
        // jsglDao.delRole(delData, (res: any) => {
        //     if (res.code === 200) {
        //         getMyApplicationListData();
        //     }
        // })
    }

    useEffect(() => {
        getMyApplicationListData();
    }, [reload,searchData.value])
    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getMyApplicationListData({...page, ...data.data})
        } else if (data.type === 'selection') {
            setSelectionDataIds(data.data.ids)
        }
    }
    const onStateChange = (type: string, value: any) => {
        if (type === 'selectedRowKeys') {
            setSelectionDataIds(value)
        } else if (type === 'filterData') {
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
        setPage(tableData.tPage)
        // userManageList.clearFilterData();
    }
    // 编辑当前行
    const editHandler = (formData: any) => {
        setModalVisible(true)
    }

    // 删除当前行
    const delHandler = (data: any) => {
        let delData = {
            delIds: data.id
        };

        lcglDao.delFlowInstance(delData,(res:any)=>{
            if (res.code === 200){
                getMyApplicationListData();
            }else {
                message.error(res.msg)
            }
        });
    }



    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };

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
        setForm([])
        setValue([])
        setSelectedUser([])
    }
    function commitFlow(data:any) {
        let fieldsValue = paramsForm.getFieldsValue();
        let params ={
            id:value[0].value,
            assignee:selectedUser[0].value,
            params:fieldsValue
        }
        lcglDao.commitFlow(params,(res:any)=>{
            console.log(res);
        })
    }

    async function fetchUserList(username: string): Promise<ParamValue[]> {
        return fetch('/bsmservice/user/getUserListByUserName',{
            method:'post',
            body:JSON.stringify({username:username}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((body) =>
                body.data && body.data.map(
                    (user: { key:string,value?:string}) => ({
                        label: user.value,
                        value: user.key,
                    }),
                ),
            );
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
            </div>

            <CTable size={'middle'} scroll={true} loading={loading} columns={colums}
                    selectedRowKeys={selectionDataIds}
                    dataSource={dataSource} page={page} onTableChange={onTableChange} onStateChange={onStateChange}
                    checked={true} rowKey={"id"}>
                <div
                    slot='isSuspended'
                    // @ts-ignore
                    render={(text: any, record: { disabled?: any; roleid?: any; }, index: any) => {
                        return <div className='isSuspended'>
                            <CSwitch disabled={true} value={!text}/>
                        </div>

                    }}/>
                <div
                    slot='operate'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => (
                        <div className='operate'>
                            <CButton type='text'
                                     onClick={() => editHandler(record)}>详情</CButton>
                            <CButton type='text'
                                     onClick={() => delHandler(record)}>删除</CButton>
                        </div>
                    )}/>
            </CTable>

            {/*角色新增模式框*/}
            <Modal title={'新增我的申请'} destroyOnClose visible={modalVisible} onOk={commitFlow} onCancel={onCancel}>
                <div className='modal-class'>
                    <Descriptions className={'descriptionsClass'} title="业务流程" bordered layout={'horizontal'}/>
                    <DebounceSelect mode="tags"
                                    value={value}
                                    placeholder="选择流程"
                                    fetchOptions={fetchFlowList}
                                    onChange={(newValue) => {
                                        setValue(newValue as ParamValue[]);
                                    }}
                                    style={{ width: '100%' }}/>
                    {form && form.length>0?<Descriptions className={'descriptionsClass'} title="流程表单" bordered layout={'horizontal'}/>:''}
                    {form && form.length>0?
                    <Form name="dynamic_form_item"
                          form={paramsForm}
                          labelCol={{ flex: '110px' }}
                          labelAlign="left"
                          wrapperCol={{ flex: 1 }}
                          onFinish={onFinish}
                          className={'formClass'}
                    >

                        {form?.map((field)=>(
                            <Form.Item
                                label={field.label}
                                name={field.id}
                            >
                                {field.type==='string'?<Input/>:field.type==='long'?<Input type={'number'}/>:field.type==='date'?<Input type={'date'}/>:field.type==='text'?<TextArea/>:''}

                            </Form.Item>
                        ))}

                    </Form>:''
                    }
                    <Descriptions className={'descriptionsClass'} title="审批人" bordered layout={'horizontal'}/>

                    <DebounceSelect mode="tags"
                                    className={'descriptionsClass'}
                                    value={selectedUser}
                                    placeholder="选择审批人"
                                    fetchOptions={fetchUserList}
                                    onChange={(newValue) => {
                                        setSelectedUser(newValue as ParamValue[]);
                                    }}
                                    style={{ width: '100%' }}/>
                </div>
            </Modal>

        </div>
    );
}
export default MyApplication