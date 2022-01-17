import React, {FC, useEffect, useState} from 'react'
import './style.scss'
import {useHistory} from "react-router-dom";
import {sjypzManageListNewData, tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import sjypzDao from "../../../../dao/sjypzDao";
import _ from "lodash";
import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    message,
    Modal,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Switch, Tag,
    Upload,
} from "antd";
import {setPageNewValue} from "../../../../utils";
import CButton from "../../../../components/CButton";
import CInput from "../../../../components/CForm/CInput";
import CTable from "../../../../components/CTable";
import {UploadOutlined} from '@ant-design/icons';
import {UploadFile} from "antd/lib/upload/interface";

export interface SjypzProps {

}

const Sjypz: FC<SjypzProps> = (props) => {


    const history = useHistory()
    const [dataSourceForm] = Form.useForm();
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState<any>(sjypzManageListNewData)
    const [editFlag, setEditFlag] = useState(false)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [driveUrl, setDriveUrl] = useState('')
    const [loading, setLoading] = useState(true)
    /*记录数据源是否测试连接通过*/
    const [pass, setPass] = useState(false)
    const [updateType, setUpdateType] = useState<"insert" | "edit">("insert")
    const [modalVisible, setModalVisible] = useState(false)
    const [sourceType, setSourceType] = useState("0")
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入元数据名'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取用户角色列表数据
    let getDataSourceListData = (page1?: any) => {
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

        sjypzDao.getDataSourceList(getData, (res: any) => {
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

        sjypzDao.delDataSource(delData, (res: any) => {
            if (res.code === 200) {
                getDataSourceListData();
            }
        })
    }

    useEffect(() => {
        getDataSourceListData();
    }, [reload, searchData.value])
    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getDataSourceListData({...page, ...data.data})
        } else if (data.type === 'selection') {
            setSelectionDataIds(data.data.ids)
        }
    }
    const onStateChange = (type: string, value: any) => {
        if (type === 'selectedRowKeys') {
            setSelectionDataIds(value)
        } else if (type === 'filterData') {
            /*TODO 后面加列搜索的时候加上*/
            // setFilterData(value)
        } else if (type === 'value') {
            setSearchData({...searchData, value: value})
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
        setData(sjypzManageListNewData)
        setModalVisible(true)
    }


    // 重置筛选项
    const resetHandler = (e: any) => {
        history.push({
            pathname: "/sjypz"
        })
        setSearchData({...searchData, value: ''})
        setPage(tableData.tPage)
        // userManageList.clearFilterData();
    }
    // 编辑当前行
    const editHandler = (formData: any) => {
        setUpdateType('edit')
        setEditFlag(true)
        setModalVisible(true)

        /*给每个Item的value赋值*/
        setData(setPageNewValue(data, formData))
        // setPageNewItem
    }

    // 删除当前行
    const delHandler = (data: any) => {

        debugger
        let delData = {
            delIds: [data.datasourceid].join(",")
        };

        sjypzDao.delDataSource(delData, (res: any) => {
            if (res.code === 200) {
                getDataSourceListData();
            }
        })
    }

    const onFinish = (data: any) => {
        let method = null;
        if (editFlag) {
            method = sjypzDao.updateDataSource;
        } else {
            method = sjypzDao.insertDataSource;
        }
        if (_.isString(driveUrl)) {
            data.driveurl = driveUrl;
        }
        method(data, (res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                /*关闭弹窗*/
                setModalVisible(false)

                getDataSourceListData();
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

    function sourceTypeChange(value: any) {
        setSourceType(value)
    }

    async function testDataSource() {
        /*检验数据源的信息是否完整，完整的话可以进行数据源校验，不完整需要给出提示，最后需要把校验的结果放到pass中，默认是false*/
        await dataSourceForm.validateFields();

        let fieldsValue = dataSourceForm.getFieldsValue();
        if (_.isString(driveUrl)) {
            fieldsValue.driveurl = driveUrl;
        }
        /*测试数据源，如果数据源*/
        sjypzDao.testDataSource(fieldsValue, (res: any) => {

            if (res.code === 200) {

                if (res.data === true) {
                    message.success("数据源测试连接成功。")
                    setPass(true)
                } else {
                    message.error("数据源测试连接失败！")
                }
            }
        })
    }

    /**styles 样式部分**/

    /**render**/

    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
    };


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
                    checked={true} rowKey={"datasourceid"}>
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
                <div
                    slot='datasourceType'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (text === 0) {
                            return "JDBC";
                        } else if (text === 1) {
                            return "SCV"
                        } else {
                            return ""
                        }
                    }
                    }/>
                <div
                    slot='driveUrlrender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) &&text.length>40) {
                            return <span title={text}>{text.substring(0, 40) + "..."}</span>;
                        }
                    }
                    }/>
                <div
                    slot='isPass'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        if (text) {
                            return <Tag color={'green'}>通过</Tag>
                        } else {
                            return <Tag color={'red'}>不通过</Tag>;

                        }
                    }
                    }/>
            </CTable>

            {/*角色新增模式框*/}
            <Modal destroyOnClose visible={modalVisible} footer={null} onCancel={onCancel}>
                <div className='user-manage-list-new'>
                    <div className='c-page-new'>
                        <div className='c-page-new-item' key={data.id}>
                            <div className='flex c-page-new-item-title'>
                                <span className='title-before-icon'/>{data.title}</div>
                            <div>
                                <Form
                                    {...formItemLayout}
                                    form={dataSourceForm}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="sourcename"
                                        label="数据源名"

                                        rules={[{required: true, message: '数据源名不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入数据源名'}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="sourcetype"
                                        label="数据源类型"
                                        rules={[{
                                            required: true,
                                            message: '请输入数据源类型!',
                                        }]}
                                    >
                                        <Select placeholder="请输入数据源类型" onChange={sourceTypeChange}>
                                            <Select.Option value="0">JDBC</Select.Option>
                                            <Select.Option value="1">CSV</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    {
                                        sourceType === '0' &&
                                        <Form.Item
                                            name="username"
                                            label="用户名"

                                            rules={[{required: true, message: '数据源名不能为空!'}]}
                                        >
                                            <Input placeholder={'请输入数据源用户名'}/>
                                        </Form.Item>
                                    }
                                    {
                                        sourceType === '0' &&
                                        <Form.Item
                                            name="password"
                                            label="密码"

                                            rules={[{required: true, message: '数据源密码不能为空!'}]}
                                        >
                                            <Input.Password placeholder={'请输入数据源密码'}/>
                                        </Form.Item>
                                    }
                                    {
                                        sourceType === '0' &&
                                        <Form.Item
                                            name="driveurl"
                                            label="驱动"
                                            rules={[{required: true, message: 'JDBC驱动不能为空!'}]}
                                        >
                                            <Upload accept={'.jar'} maxCount={1} listType="text"
                                                    beforeUpload={(file) => {
                                                        let formData = new FormData();
                                                        if (file) {
                                                            formData.append('file', file);
                                                        }
                                                        /*这边需要先把驱动包上传到FTP服务器上，返回url。根据url来装载类*/
                                                        sjypzDao.uploadDrive(formData, (res: any) => {
                                                            if (res.code === 200) {
                                                                setDriveUrl(res.data)
                                                            }
                                                        })
                                                        return false;
                                                    }
                                                    }>
                                                <Button icon={<UploadOutlined/>}>点击上传驱动</Button>
                                            </Upload>
                                        </Form.Item>
                                    }
                                    {
                                        sourceType === '0' &&
                                        <Form.Item
                                            name="sourceurl"
                                            label="数据源地址"
                                            rules={[{required: true, message: '数据源地址不能为空!'}]}
                                        >
                                            <Input addonAfter={<span className={'clickTestclass'}
                                                                     onClick={testDataSource}>点击测试</span>}/>
                                        </Form.Item>
                                    }
                                    {
                                        sourceType === '0' &&
                                        <Form.Item
                                            name="driveclass"
                                            label="驱动类"
                                            rules={[{required: true, message: '驱动类不能为空!'}]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    }


                                    <Form.Item
                                        name="description"
                                        label="描述"
                                    >
                                        <Input.TextArea placeholder={'请输入数据源描述'}/>
                                    </Form.Item>

                                    <Form.Item wrapperCol={{span: 12, offset: 6}}>
                                        <Button type="primary" htmlType="submit">
                                            提交
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                    {/*<CPageNew data={data} onChange={onChange} onSubmit={onSubmit} onCancel={onCancel}*/}
                    {/*          updateType={updateType} footerShow={true}/>*/}
                </div>
            </Modal>

        </div>
    );

}
export default Sjypz