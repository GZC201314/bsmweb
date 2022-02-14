import React, {FC, useEffect, useState} from 'react'
import './style.scss'
import {useHistory} from "react-router-dom";
import {bookManageListNewData, tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import tsglDao from "../../../../dao/tsglDao";
import _ from "lodash";
import {Button, Form, Image, Input, message, Modal, Rate, Select, Upload,} from "antd";
import {setPageNewValue, setStorage, validateISBN, validateUserName} from "../../../../utils";
import CButton from "../../../../components/CButton";
import CInput from "../../../../components/CForm/CInput";
import CTable from "../../../../components/CTable";
import xxxgDao from "../../../../dao/xxxgDao";

export interface TsglProps {

}

const Tsgl: FC<TsglProps> = (props) => {


    const history = useHistory()
    const [dataSourceForm] = Form.useForm();
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState<any>(bookManageListNewData)
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
    let getDouBanBookList = (page1?: any) => {
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

        tsglDao.getPageDouBanBook(getData, (res: any) => {
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

        tsglDao.deleteDouBanBook(delData, (res: any) => {
            if (res.code === 200) {
                getDouBanBookList();
            }
        })
    }

    useEffect(() => {
        getDouBanBookList();
    }, [reload, searchData.value])
    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getDouBanBookList({...page, ...data.data})
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
        setData(bookManageListNewData)
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

        tsglDao.deleteDouBanBook(delData, (res: any) => {
            if (res.code === 200) {
                getDouBanBookList();
            }
        })
    }

    const onFinish = (data: any) => {
        let method = null;
        if (editFlag) {
            method = tsglDao.updateDoubanBook;
        } else {
            method = tsglDao.addDoubanBook
        }
        method(data, (res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                /*关闭弹窗*/
                setModalVisible(false)

                getDouBanBookList();
                return;
            }
            message.error("登录过期，请重新登录。")
            setModalVisible(false)
            history.push({
                pathname: "/login"
            })
        })
    }


    const beforeUpload = async (file: any) => {
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        let url: string = "";
        url = await new Promise((resolve, reject) => {
            tsglDao.editAvatar(formData, (res: any) => {
                if (res.data.code === 200) {
                    url = res.data.data;
                    resolve(url)

                    /*更新头像*/
                }
            })
        })
        if (url !== "") {
            history.push({
                pathname: '/xxxg',
            })
            return false;
        }

    }


    function onCancel(data: any) {
        setModalVisible(false)
    }

    function sourceTypeChange(value: any) {
        setSourceType(value)
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
                    checked={true} rowKey={"isbn"}>
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
                    slot='bookImage'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        return <Image
                            width={50}
                            src={text}
                        />
                    }
                    }/>
                <div
                    slot='nameRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) &&text.length>10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
                <div
                    slot='publisherRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) &&text.length>10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
                <div
                    slot='bookIntroduction'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) &&text.length>10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
                <div
                    slot='translateRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) &&text.length>10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
                <div
                    slot='seriesnameRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) &&text.length>10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
                <div
                    slot='authorRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isString(text) &&text.length>10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
                <div
                    slot='scoreRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                         return <Rate disabled defaultValue={text/2.0}/>
                    }
                    }/>
            </CTable>

            {/*图书新增模式框*/}
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
                                        name="isbn"
                                        label="ISBN"
                                        validateTrigger={"OnSubmit"}
                                        validateFirst={true}
                                        rules={[{required: true, message: 'ISBN号不能为空!'},{validator: validateISBN, message: "ISBN号校验失败"}]}
                                    >
                                        <Input placeholder={'请输入ISBN号'}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="name"
                                        label="图书名"
                                        rules={[{required: true, message: '图书名不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入图书名'}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="name"
                                        label="图书名"
                                        rules={[{required: true, message: '图书名不能为空!'}]}
                                    >
                                        <Upload
                                            name='file'
                                            beforeUpload={beforeUpload}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            accept="image/*"
                                            fileList={fileList}
                                            onChange={onChange}
                                            onPreview={onPreview}
                                        >
                                            {fileList.length < 1 && '+ Upload'}
                                        </Upload>
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
                </div>
            </Modal>

        </div>
    );

}
export default Tsgl