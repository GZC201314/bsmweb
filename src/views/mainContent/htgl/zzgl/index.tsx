import {Button, Form, Image, Input, message, Modal, Select, Upload} from 'antd';
import React, {FC, useEffect, useState} from 'react'
import CButton from '../../../../components/CButton';
import CInput from '../../../../components/CForm/CInput';
import CTable from '../../../../components/CTable';
import {organizationManageListNewData, tableData} from './data'
import './style.scss'
import {useSelector} from "../../../../hooks/hooks";
import zzglDao from "../../../../dao/zzglDao";
import {useHistory} from "react-router-dom";
import _ from "lodash";
import {handleErrorAxis, validateOrganizationName} from '../../../../utils';
import {UploadFile} from "antd/lib/upload/interface";
import {FieldData} from "rc-field-form/es/interface";

export interface JsglProps {

}


const Jsgl: FC<JsglProps> = (props) => {

    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState(organizationManageListNewData)
    const [editFlag, setEditFlag] = useState(false)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [filterData, setFilterData] = useState([])
    const [selectData, setSelectData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState('')
    const [updateType, setUpdateType] = useState<"insert" | "edit">("insert")
    const [modalVisible, setModalVisible] = useState(false)
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入组织名'
    })

    const [fileList, setFileList] = useState([] as UploadFile[]);

    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
    };

    const [form] = Form.useForm();

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取组织列表数据
    let getOrganizationListData = (page1?: any) => {
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

        zzglDao.getOrganizationListInfo(getData, (res: any) => {

            if (res.code === 200) {
                let data = res.data.records;
                let total = res.data.total;
                setDataSource(data)
                if (!_.isEqual(page.total, total)) {
                    setPage({...page, total: total})
                }
                setLoading(false)
                return;
            } else {
                handleErrorAxis(res, history);
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

        zzglDao.getOrganizationInfo(delData, (res: any) => {
            if (res.code === 200) {
                getOrganizationListData();
            }
        })
    }

    const fillSelectData = () => {
        zzglDao.getList(null, (res: any) => {
            if (res.code === 200) {
                // debugger
                let select = []
                select.push({value: -1, label: "顶层组织"});
                let orgList: [] = res.data
                for (const orgListKey in orgList) {
                    select.push({value: orgList[orgListKey]['id'], label: orgList[orgListKey]['name']});
                }
                // @ts-ignore
                setSelectData(select)
            }
        })
    }

    useEffect(() => {
        getOrganizationListData();
        // 填充组织select
        fillSelectData();
    }, [reload, searchData.value])
    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getOrganizationListData({...page, ...data.data})
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

    /*搜索*/
    const searchHandler = (value: any) => {
        setSearchData({...searchData, value: value})
    }

    /*新增角色*/
    const addHandler = () => {
        /* 这边的实现是打开一个模式窗口*/
        setData(organizationManageListNewData)
        setModalVisible(true)
        setEditFlag(false)
    }


    // 重置筛选项
    const resetHandler = (e: any) => {
        history.push({
            pathname: "/zzgl"
        })
        setSearchData({...searchData, value: ''})
        setSearchValue('')
    }
    // 编辑当前行
    const editHandler = (formData: any) => {
        // debugger
        setUpdateType('edit')
        setEditFlag(true)
        setModalVisible(true)
        let fieldDatas = [] as FieldData[]
        for (const formDataKey in formData) {

            switch (formDataKey) {
                case 'icon':
                    let uploadFile = {} as UploadFile
                    uploadFile.url = formData[formDataKey]
                    setFileList([uploadFile])
                    break;
                default:
                    fieldDatas.push({name: formDataKey, value: formData[formDataKey]});
                    break;
            }
        }
        form.setFields(fieldDatas)
    }
    // 删除当前行
    const delHandler = (data: any) => {

        let delData = {
            delIds: [data.id].join(",")
        };

        zzglDao.del(delData, (res: any) => {
            if (res.code === 200) {
                getOrganizationListData();
            }
        })
    }

    // @ts-ignore
    const onChange = ({file: file, fileList: newFileList}) => {
        // if (file){
        //     if (formData.has('icon')){
        //         formData = new FormData();
        //     }
        //     formData.append('icon',file);
        // }
        setFileList(newFileList);
    };
    // @ts-ignore
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        // @ts-ignore
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        // @ts-ignore
        imgWindow.document.write(image.outerHTML);
    };
    const beforeUpload = async (file: any) => {
        return false;
    }

    // const onChange = (type: string, data1: any) => {
    //     if (type === "data") {
    //         if (_.isObject(data1)) {
    //             // @ts-ignore
    //             setData(data1)
    //         }
    //     }
    //
    // }

    function onCancel(data: any) {
        form.resetFields()
        setModalVisible(false)
        setEditFlag(false)
    }


    /**render**/


    function onRemove() {

    }

    const onFinish = (data: any) => {
        debugger
        let method = null;
        if (editFlag) {
            method = zzglDao.update
        } else {
            method = zzglDao.add
        }

        let formData = new FormData();

        for (const key in data) {
            if (key === 'icon') {
                if (data[key]) {
                    formData.append('icon', data[key].file);
                }
            } else {
                formData.append(key, data[key]);
            }
        }
        method(formData, (res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                /*关闭弹窗*/
                setModalVisible(false)

                getOrganizationListData();
                return;
            } else {
                handleErrorAxis(res, history);
            }
        })
    }
    const onSelectChange = (newValue: string) => {
        // debugger
        setValue(newValue);
    };
    /**styles 样式部分**/

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
                    slot='imgRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        return <Image
                            width={50}
                            src={text}
                        />
                    }
                    }/>
                <div
                    slot='descRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) && text.length > 10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        } else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
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
                    {/*自定义模式框*/}
                    <div className='c-page-new'>
                        <div className='c-page-new-item'>
                            <div className='flex c-page-new-item-title'>
                                <span className='title-before-icon'/>{organizationManageListNewData[0].title}
                            </div>
                        </div>
                    </div>
                </div>
                <Form
                    {...formItemLayout}
                    layout="horizontal"
                    labelAlign={'right'}
                    colon={false}
                    form={form}
                    onFinish={onFinish}
                >
                    {editFlag ? <Form.Item
                        name="id"
                    >
                        <Input type={'hidden'}/>
                    </Form.Item> : ''}

                    {editFlag ? <Form.Item name="name" label="组织名">
                        <Input disabled={true}/>
                    </Form.Item> : <Form.Item name="name" validateTrigger={'onSubmit'} label="组织名"
                                              rules={[{validator: validateOrganizationName, message: "组织名检验失败"}]}>
                        <Input/>
                    </Form.Item>}

                    <Form.Item name="icon" label="组织标志">
                        <Upload
                            name='file'
                            listType="picture-card"
                            className="avatar-uploader"
                            accept="image/*"
                            beforeUpload={beforeUpload}
                            fileList={fileList}
                            onChange={onChange}
                            onRemove={onRemove}
                            onPreview={onPreview}
                        >
                            {fileList.length < 1 && '+ Upload'}
                        </Upload>
                    </Form.Item>

                    <Form.Item name="parent" label="父组织">
                        <Select
                            defaultValue="-1"
                            value={value}
                            style={{width: 120}}
                            onSelect={onSelectChange}
                            // onChange={onSelectChange}
                            options={selectData}
                        />
                    </Form.Item>
                    <Form.Item name="desc" label="组织描述">
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 12, offset: 6}}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}
export default Jsgl