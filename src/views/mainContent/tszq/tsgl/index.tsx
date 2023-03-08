import React, {FC, useEffect, useState} from 'react'
import Moment from 'moment'
import './style.scss'
import {useHistory} from "react-router-dom";
import {bookManageListNewData, tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import tsglDao from "../../../../dao/tsglDao";
import _ from "lodash";
import {Button, DatePicker, Form, Image, Input, message, Modal, Rate, Upload,} from "antd";
import {validateISBN} from "../../../../utils";
import CButton from "../../../../components/CButton";
import CInput from "../../../../components/CForm/CInput";
import CTable from "../../../../components/CTable";
import {UploadFile} from "antd/lib/upload/interface";
import {PlusOutlined} from '@ant-design/icons';
import {FieldData} from "rc-field-form/es/interface";

export interface TsglProps {

}

const Tsgl: FC<TsglProps> = (props) => {

    const [bookModelForm] = Form.useForm()

    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead);
    const [data, setData] = useState<any>(bookManageListNewData)
    const [editFlag, setEditFlag] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [fileList, setFileList] = useState([] as UploadFile[]);
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('' as string)
    const [previewTitle, setPreviewTitle] = useState('')

    const [loading, setLoading] = useState(true)
    /*记录数据源是否测试连接通过*/
    const [modalVisible, setModalVisible] = useState(false)
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入图书名'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取豆瓣图书列表数据
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
            // message.error("登录信息已过期。请重新登录。")
            // history.push({
            //     pathname: '/login'
            // });
        })
    }

    /**
     * 处理预览取消
     */
    const handleCancel = () => {
        setPreviewVisible(false)

    }
    /**
     * 处理预览
     * @param file
     */
    const handlePreview = async (file: UploadFile) => {
        // @ts-ignore
        setPreviewImage(file.url)
        setPreviewVisible(true)
        // @ts-ignore
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };
    // @ts-ignore
    const handleChange = ({fileList}) => {
        setFileList(fileList)
    };

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
        setSearchData({...searchData, value: value})
    }

    /*新增*/
    const addHandler = () => {
        /* 这边的实现是打开一个模式窗口*/
        setData(bookManageListNewData)
        setModalVisible(true)
    }


    // 重置筛选项
    const resetHandler = (e: any) => {
        history.push({
            pathname: "/tsgl"
        })
        setSearchData({...searchData, value: ''})
        setPage(tableData.tPage)
        // userManageList.clearFilterData();
    }
    let fieldDatas = [] as FieldData[]
    // 编辑当前行
    const editHandler = (formData: any) => {
        setEditFlag(true)
        setModalVisible(true)

        for (const formDataKey in formData) {
            if(formDataKey === 'publishingtime'){
                var formatTime = Moment(new Date(formData[formDataKey]));
                fieldDatas.push({name:formDataKey,value:formatTime})
                continue
            }
            if(formDataKey === 'score'){
                fieldDatas.push({name:formDataKey,value:formData[formDataKey]/2.0})
                continue
            }
            if(formDataKey === 'image'){
                let uploadFile = {} as UploadFile
                uploadFile.url = formData[formDataKey]

                setFileList([uploadFile])
                continue
            }
            fieldDatas.push({name:formDataKey,value:formData[formDataKey]})
        }
        // formData.forEach((value:any,key:any) =>{
        //     console.log(value,key);
        // });

        /*给每个Item的value赋值*/
        bookModelForm.setFields(fieldDatas)
        // setPageNewItem
    }

    // 删除当前行
    const delHandler = (data: any) => {

        let delData = {
            delIds: [data.isbn].join(",")
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
        if(!_.isEmpty(fileList)){
            data.image = fileList[0].url
        }
        data.score = data.score*2;
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
        debugger
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        let url: string = "";
        url = await new Promise((resolve, reject) => {
            tsglDao.giteeUpload(formData, (res: any) => {
                if (res.code === 200) {
                    url = res.data;
                    resolve(url)
                }
            })
        })

        file.url = url
        setFileList([file])
        return false
    }


    /**
     * 模式框关闭处理函数
     * @param data
     */
    function onCancel(data: any) {
        setModalVisible(false)
        bookModelForm.resetFields()
        /*重置上传的图书封面*/
        setFileList([])
        //重置editFlag
        setEditFlag(false)
    }


    /**styles 样式部分**/

    /**render**/

    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
    };

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );
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

                        if (_.isString(text) && text.length > 10) {
                            return <span title={text}>{text.substring(0, 10) + "..."}</span>;
                        } else {
                            return <span title={text}>{text}</span>;
                        }
                    }
                    }/>
                <div
                    slot='publisherRender'
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
                    slot='bookIntroduction'
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
                    slot='translateRender'
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
                    slot='seriesnameRender'
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
                    slot='authorRender'
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
                    slot='scoreRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        return <Rate disabled allowHalf value={text / 2.0}/>
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
                                    form={bookModelForm}
                                    onFinish={onFinish}

                                >
                                    {editFlag?                                    <Form.Item
                                        name="isbn"
                                        label="ISBN"
                                        validateTrigger={"onSubmit"}
                                        validateFirst={true}
                                    >
                                        <Input disabled placeholder={'请输入ISBN号'}/>
                                    </Form.Item>:<Form.Item
                                        name="isbn"
                                        label="ISBN"
                                        validateTrigger={"onSubmit"}
                                        validateFirst={true}
                                        rules={[{required: true, message: 'ISBN号不能为空!'}, {
                                            validator: validateISBN,
                                            message: "ISBN号校验失败"
                                        }]}
                                    >
                                        <Input placeholder={'请输入ISBN号'}/>
                                    </Form.Item>}

                                    <Form.Item
                                        name="name"
                                        label="图书名"
                                        rules={[{required: true, message: '图书名不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入图书名'}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="image"
                                        label="图书封面"
                                    >
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList}
                                            accept={'image/*'}
                                            onPreview={handlePreview}
                                            onChange={handleChange}
                                            beforeUpload={beforeUpload}
                                        >
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item
                                        name="englishname"
                                        label="图书英文名"
                                    >
                                        <Input placeholder={'请输入图书英文名'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="title"
                                        label="图书标题"
                                    >
                                        <Input placeholder={'请输入图书标题'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="seriesname"
                                        label="丛书"
                                    >
                                        <Input placeholder={'请输入丛书'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="author"
                                        label="作者"
                                        rules={[{required: true, message: '作者不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入作者'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="introduction"
                                        label="介绍"
                                    >
                                        <Input.TextArea placeholder={'请输入图书介绍'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="publisher"
                                        label="出版社"
                                    >
                                        <Input placeholder={'请输入出版社'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="publishingtime"
                                        label="出版时间"
                                    >
                                        <DatePicker picker={'date'}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="edition"
                                        label="出版公司"
                                    >
                                        <Input placeholder={'请输入出版公司'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="score"
                                        label="评分"
                                        // rules={[{required: true, message: '作者不能为空!'}]}
                                    >
                                        <Rate defaultValue={0} allowHalf/>
                                    </Form.Item>
                                    <Form.Item
                                        name="translate"
                                        label="翻译"
                                        // rules={[{required: true, message: '作者不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入翻译'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="folio"
                                        label="页数"
                                        // rules={[{required: true, message: '作者不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入页数'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="size"
                                        label="装订"
                                        // rules={[{required: true, message: '作者不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入装订'}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="price"
                                        label="价格"
                                        // rules={[{required: true, message: '作者不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入价格'}/>
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

            {/*图片预览模式框*/}
            <Modal
                destroyOnClose
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>

        </div>
    );

}
export default Tsgl