import React, {FC, useEffect, useState} from 'react'
import './style.scss'
import {useHistory} from "react-router-dom";
import {sjypzManageListNewData, tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import dsrwDao from "../../../../dao/dsrwDao";
import _ from "lodash";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Space,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import CButton from "../../../../components/CButton";
import CTable from "../../../../components/CTable";
import {MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {validateJobKey} from "./validate";
import moment from "moment";

export interface DsrwProps {

}

const Dsrw: FC<DsrwProps> = (props) => {


    const history = useHistory()
    const [taskForm] = Form.useForm();
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState<any>(sjypzManageListNewData)
    const [taskList, setTaskList] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [loading, setLoading] = useState(true)
    const [repeatCount, setRepeatCount] = useState(0)
    /*记录数据源是否测试连接通过*/
    const [modalVisible, setModalVisible] = useState(false)
    const [taskType, setTaskType] = useState("0")
    const [currentTime, setCurrentTime] = useState<any>(null)
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        placeholder: '请输入定时任务名'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取定时任务列表数据
    let getListData = (page1?: any) => {
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

        dsrwDao.getTaskPageList(getData, (res: any) => {
            if (res.code === 200) {
                let data = res.data.records;
                let total = res.data.total;
                setTaskList(data)
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
        debugger
        if (selectionDataIds.length === 0) {
            message.warning("请选择一条记录删除！")
            return;
        }
        let delData = {
            delIds: selectionDataIds.join(",")
        };

        dsrwDao.deleteTasks(delData, (res: any) => {
            if (res.code === 200) {
                getListData();
            }
        })
    }

    useEffect(() => {
        getListData();
    }, [reload, searchData.value])
    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            getListData({...page, ...data.data})
            setPage({...page, ...data.data})
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

    /*新增数据源*/
    const addHandler = () => {
        /*TODO 这边的实现是打开一个模式窗口*/
        setData(sjypzManageListNewData)
        setModalVisible(true)
    }


    // 重置筛选项
    const resetHandler = (e: any) => {
        history.push({
            pathname: "/dsrw"
        })
        setSearchData({...searchData, value: ''})
        setPage(tableData.tPage)
        // userManageList.clearFilterData();
    }

    // 删除当前行
    const delHandler = (data: any) => {

        let delData = {
            delIds: [data.jobName].join(",")
        };

        dsrwDao.deleteTasks(delData, (res: any) => {
            if (res.code === 200) {
                getListData()
            }
        })

    }

    // 启动当前任务
    const startJobHandler = (data: any) => {

        let param = {
            jobName: data.jobName
        };

        dsrwDao.startTask(param, (res: any) => {
            if (res.code === 200) {
                getListData();
            }
        })
    }

    // 停止当前任务
    const stopJobHandler = (data: any) => {

        let param = {
            jobName: data.jobName
        };

        dsrwDao.stopTask(param, (res: any) => {
            if (res.code === 200) {
                getListData();
            }
        })
    }

    // 立即执行当前任务
    const execNowJobHandler = (data: any) => {

        let param = {
            jobName: data.jobName
        };

        dsrwDao.executeNowTask(param, (res: any) => {
            if (res.code === 200) {
                getListData();
            }
        })
    }

    /**
     * 新增定时任务处理函数
     * @param data
     */
    const onFinish = (data: any) => {

        dsrwDao.insertTask(data, (res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                /*关闭弹窗*/
                setModalVisible(false)

                getListData();
                return;
            }
            message.error("登录过期，请重新登录。")
            setModalVisible(false)
            history.push({
                pathname: "/login"
            })
        })
    }



    const onCancel = (data: any) => {
        taskForm.resetFields()
        setModalVisible(false)
        setRepeatCount(0)
    }

    const taskTypeChange = (value: any) => {
        setTaskType(value)
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


    /*设置当前时间之前的时间禁用*/
    const disabledDate = (endValue: any) => {
        const startValue = currentTime;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    const handleEndOpenChange = (open: any) => {
        if (open) {
            setCurrentTime(moment())
        }
        setCurrentTime(moment())
    }
    /*停止所有任务处理函数*/
    const stopAllTaskHandler = () => {

        dsrwDao.stopAllTasks({},(res:any) =>{
            if(res.code === 200){
                message.success("已停止所有的定时任务。");
                getListData();
            }else {
                message.error("停止所有的定时任务失败！");
            }
        })
    }
    /*启动所有任务处理函数*/
    const startAllTaskHandler = () => {

        dsrwDao.startAllTasks({},(res:any) =>{
            if(res.code === 200){
                message.success("已启动所有的定时任务。");
                getListData();
            }else {
                message.error("启动所有的定时任务失败！");
            }
        })
    }

    return (
        <div className='user-manage-list'>
            <div className='flex filter-wrap'>
                <div className='flex filter-left'>
                    <CButton type='primary' authId='userManageListNewAdd' onClick={addHandler}>新增</CButton>
                    <CButton type='danger' authId='userManageListBatchDelete'
                             onClick={removeHandler}>批量删除</CButton>
                </div>
                <div className='flex filter-left'>
                    <CButton type='primary'
                             onClick={startAllTaskHandler}>启动所有任务</CButton>
                    <CButton type='danger'  onClick={stopAllTaskHandler}>停止所有任务</CButton>

                </div>
            </div>
            {/*// @ts-ignore*/}
            <CTable size={'middle'} scroll={true} loading={loading} columns={colums}
                    selectedRowKeys={selectionDataIds}
                    dataSource={taskList} page={page} onTableChange={onTableChange} onStateChange={onStateChange}
                    checked={true} rowKey={"jobName"}>

                <div
                    slot='state'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        switch (text) {
                            case "NORMAL":
                                return <Tag color={'green'}>正常</Tag>;
                            case "PAUSED":
                                return <Tag color={'default'}>停止</Tag>;
                            case "COMPLETE":
                                return <Tag color={'orange'}>完成</Tag>
                            case "ERROR":
                                return <Tag color={'error'}>错误</Tag>
                            case "BLOCKED":
                                return <Tag color={'processing'}>阻塞</Tag>
                        }
                    }
                    }/>

                <div
                    slot='operate'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        if(_.isEmpty(record)){
                            return;
                        }
                        switch (record.state) {
                            case "NORMAL":
                                return <div className='operate'>
                                    <CButton type='text'
                                             onClick={() => execNowJobHandler(record)}>立即执行</CButton>
                                    <CButton type='text'
                                             onClick={() => stopJobHandler(record)}>停止</CButton>
                                    <CButton type='text'
                                             onClick={() => delHandler(record)}>删除</CButton>
                                </div>;
                            case "PAUSED":
                                return <div className='operate'>
                                    <CButton type='text'
                                             onClick={() => startJobHandler(record)}>启动</CButton>
                                    <CButton type='text'
                                             onClick={() => delHandler(record)}>删除</CButton>
                                </div>;
                            default:
                                return <div className='operate'>
                                    <CButton type='text'
                                             onClick={() => delHandler(record)}>删除</CButton>
                                </div>;

                        }
                    }
                    //     (

                    // )
                    }/>
                <div
                    slot='taskTypeRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {

                        if (_.isEmpty(text)) {
                            return "非周期任务";
                        } else {
                            return "周期任务";
                        }
                    }
                    }/>
            </CTable>

            {/*数据源新增模式框*/}
            <Modal destroyOnClose visible={modalVisible} footer={null} onCancel={onCancel}>
                <div className='user-manage-list-new'>
                    <div className='c-page-new'>
                        <div className='c-page-new-item' key={data.id}>
                            <div className='flex c-page-new-item-title'>
                                <span className='title-before-icon'/>{data.title}</div>
                            <div>
                                <Form
                                    {...formItemLayout}
                                    form={taskForm}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="jobKey"
                                        label="定时任务Key"

                                        rules={[{required: true, message: '定时任务Key为空!'}, {
                                            validator: validateJobKey,
                                            message: '定时任务Key校验不成功!'
                                        }]}
                                    >
                                        <Input placeholder={'定时任务Key，形如 定时任务名.任务组'}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="jobClass"
                                        label="定时执行全类名"

                                        rules={[{required: true, message: '执行全类名不能为空!'}]}
                                    >
                                        <Input placeholder={'请输入执行全类名 形如 org.bsm.jobClass'}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="taskType"
                                        label="定时任务类型"
                                        rules={[{
                                            required: true,
                                            message: '请输入定时任务类型!',
                                        }]}
                                    >
                                        <Select placeholder="请输入定时任务类型" onChange={taskTypeChange}>
                                            <Select.Option value="0">循环任务</Select.Option>
                                            <Select.Option value="1">非循环任务</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    {/*设置job参数*/}
                                    <Form.Item
                                        label="定时任务参数"
                                    >
                                        <Form.List name="mapData">
                                            {(fields, {add, remove}) => (
                                                <>
                                                    {fields.map(({key, name, ...restField}) => (
                                                        <Space key={key} style={{display: 'flex', marginBottom: 8}}
                                                               align="baseline">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'key']}
                                                                rules={[{required: true, message: '参数Key不能为空'}]}
                                                            >
                                                                <Input placeholder="参数Key"/>
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'value']}
                                                                rules={[{required: true, message: '参数Value不能为空'}]}
                                                            >
                                                                <Input placeholder="参数Value"/>
                                                            </Form.Item>
                                                            <MinusCircleOutlined onClick={() => remove(name)}/>
                                                        </Space>
                                                    ))}
                                                    <Form.Item>
                                                        <Button type="dashed" onClick={() => add()} block
                                                                icon={<PlusOutlined/>}>
                                                            新增参数
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </Form.Item>

                                    {
                                        taskType === '0' &&
                                        <Form.Item
                                            name="cron"
                                            label="cron表达式"

                                            rules={[{required: true, message: 'cron表达式不能为空!'}]}
                                        >
                                            <Input placeholder={'请输入cron表达式 形如 0 0/2 * * * ?'}/>
                                        </Form.Item>
                                    }
                                    {//如果是非循环任务
                                        taskType === '1' &&
                                        <Form.Item
                                            label="重复次数"
                                        >
                                            <Form.Item
                                                name="repeatCount"
                                                rules={[{required: true, message: '重复次数不能为空!'}]}
                                            >
                                                <InputNumber min={0} defaultValue={0} value={repeatCount}
                                                             onChange={(value) => {
                                                                 setRepeatCount(value)
                                                             }
                                                             }/>
                                            </Form.Item>
                                            <Tooltip style={{marginLeft: 20}} title={"只执行一次的任务重复次数为0。"}>
                                                <Typography.Link><QuestionCircleOutlined/></Typography.Link>
                                            </Tooltip>
                                        </Form.Item>
                                    }
                                    {//如果是非循环任务
                                        taskType === '1' && repeatCount > 0 &&
                                        <Form.Item
                                            label="间隔时间"
                                        >

                                            <Form.Item
                                                name="intervalTime"
                                                rules={[{required: true, message: '间隔时间不能为空!'}]}
                                            >
                                                <InputNumber min={1} defaultValue={1}/>
                                            </Form.Item>
                                            <Tooltip style={{marginLeft: 20}} title={"间隔时间，默认单位是秒。"}>
                                                <Typography.Link><QuestionCircleOutlined/></Typography.Link>
                                            </Tooltip>

                                        </Form.Item>

                                    }

                                    <Form.Item
                                        name="startDate"
                                        label="任务开始时间"

                                        rules={[{
                                            required: true,
                                            message: '任务开始时间不能为空!'
                                        }]}
                                    >
                                        <DatePicker showTime
                                                    showNow={false}
                                                    disabledDate={disabledDate}
                                                    onOpenChange={handleEndOpenChange}
                                        />
                                    </Form.Item>


                                    <Form.Item
                                        name="jobDescription"
                                        label="描述"
                                    >
                                        <Input.TextArea placeholder={'请输入任务描述'}/>
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
export default Dsrw