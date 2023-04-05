import React, {FC, useEffect, useState} from 'react'
import './style.scss'
import CButton from "../../../../components/CButton";
import CTable from "../../../../components/CTable";
import {Badge, Button, Form, Image, Input, message, Modal, Select, Space, Tooltip, Typography} from "antd";
import {useHistory} from "react-router-dom";
import {tableData, userManageListNewData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import jsglDao from "../../../../dao/jsglDao";
import yhglDao from "../../../../dao/yhglDao";
import _ from "lodash";
import CForm from "../../../../components/CForm/CForm";
import {validateUserEmail, validateUserName} from "../../../../utils";
import {QuestionCircleOutlined} from "@ant-design/icons";

export interface YhglProps {

}

const Yhgl: FC<YhglProps> = (props) => {
    const [userModelForm] = Form.useForm()
    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [data, setData] = useState<any>(userManageListNewData)
    const [editFlag, setEditFlag] = useState(false)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [roleSelect, setRoleSelect] = useState([])

    const [filterData, setFilterData] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [searchData, setSearchData] = useState({
        value: '',//搜索框筛选
        roleValue: '',//角色筛选
        placeholder: '请输入角色名'
    })
    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)
    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // TODO 获取角色select
    let getRoleSelect = () => {
        jsglDao.getAllRole({}, (response: any) => {
            let roleList = [] as any[];
            if (response.data) {
                response.data.forEach((roleListKey: any) => {
                    let roleSelect = {
                        key: roleListKey.roleid,
                        name: roleListKey.rolecname,
                        label: roleListKey.rolecname,
                        value: roleListKey.roleid,
                    }
                    roleList.push(roleSelect)
                })
            }
            // @ts-ignore
            setRoleSelect(roleList)
        })
    }
    // 获取用户角色列表数据
    let getUserListData = (page1?: any) => {
        let getData = {
            page: {
                page: page.page,
                pageSize: page.pageSize,
            },
            username: searchData.value,
            roleid: searchData.roleValue
        };

        if (page1) {
            getData = {
                page: {
                    page: page1.page,
                    pageSize: page1.pageSize,
                },
                username: searchData.value,
                roleid: searchData.roleValue
            }
        }
        setLoading(true)

        yhglDao.getUserListInfo(getData, (res: any) => {
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
        })
    }

    /**
     * 模式框关闭处理函数
     * @param data
     */
    function onCancel(data: any) {
        userModelForm.resetFields()
        setModalVisible(false)
    }

    useEffect(() => {
        getRoleSelect();
    }, [])
    useEffect(() => {
        getUserListData();
    }, [reload, searchData.value, searchData.roleValue])
    /**methods 方法部分**/

    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
    };

    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getUserListData({...page, ...data.data})
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

    const onFinish = (data: any) => {
        let method = null;
        if (editFlag) {
            method = yhglDao.resetUserPassword
        } else {
            method = yhglDao.insertUser
        }
        method(data, (res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                /*关闭弹窗*/
                setModalVisible(false)

                getUserListData();
                return;
            }
            message.error("登录过期，请重新登录。")
            setModalVisible(false)
            history.push({
                pathname: "/login"
            })
        })
    }
    /*新增角色*/
    const addHandler = () => {
        /* 这边的实现是打开一个模式窗口*/
        setModalVisible(true)
    }


    // 编辑当前行
    const resetPasswordHandler = (formData: any) => {
        yhglDao.resetUserPassword(formData,(res:any)=>{
            if (res.code === 200) {
                message.info(res.msg)
            }
        })
    }

    // 删除当前行
    const delHandler = (data: any) => {

        let delData = {
            userid: [data.userid].join(",")
        };

        yhglDao.delUser(delData,(res:any) =>{
            if (res.code === 200) {
                getUserListData();
            }
        });
    }
    /*单独删除或者批量删除*/
    const removeHandler = () => {
        if (selectionDataIds.length === 0) {
            message.warning("请选择一条记录删除！")
            return;
        }
        let delData = {
            userid: selectionDataIds.join(",")
        };

        yhglDao.delUser(delData,(res:any) =>{
            if (res.code === 200) {
                getUserListData();
            }
        });
    }

    // @ts-ignore
    return (
        <div className='user-manage-list'>
            <div className='flex filter-wrap'>
                <div className='flex filter-left'>
                    <CButton type='primary' authId='userManageListNewAdd' onClick={addHandler}>新增</CButton>
                    <CButton type='danger' authId='userManageListBatchDelete'
                             onClick={removeHandler}>批量删除</CButton>
                </div>
                <div className='flex filter-right'>
                    <CForm type={'input'} value={searchData.value} label={'用户名：'}
                           onChange={(type: any, value: any) => {
                               setSearchData({...searchData, value: _.isString(value.value) ? value.value : value})
                           }}>
                    </CForm>
                    <CForm type={'select'} options={roleSelect} label={'角色：'} value={searchData.roleValue}
                           onChange={(type: any, value: any) => {
                               setSearchData({...searchData, roleValue: value.value})
                           }}
                    >
                    </CForm>
                </div>
            </div>

            <CTable size={'middle'} scroll={true} loading={loading} columns={colums}
                    selectedRowKeys={selectionDataIds}
                    dataSource={dataSource} page={page} onTableChange={onTableChange} onStateChange={onStateChange}
                    checked={true} rowKey={"userid"}>
                <div
                    slot='roleRender'
                    // @ts-ignore
                    render={(text: any, record: { disabled?: any; roleid?: any; }, index: any) => {
                        let result = ''
                        roleSelect.map((value: { key: any; name: string; }, index1: any, array: any) => {
                            if (value.key === record.roleid) {
                                result = value.name
                            }
                        })
                        return result;

                    }}/>

                <div
                    slot='iconRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        return <Image
                            width={50}
                            src={text}
                        />
                    }
                    }/>
                <div
                    slot='regRender'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        if (text === true) {
                            return <Badge status="success" text="已注册"/>
                        } else {
                            return <Badge status="error" text="未注册"/>
                        }
                    }
                    }/>

                <div
                    slot='operate'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => (
                        <div className='operate'>
                            <CButton type='text'
                                     onClick={() => delHandler(record)}>删除</CButton>
                            <CButton type='text'
                                     onClick={() => resetPasswordHandler(record)}>重置密码</CButton>
                        </div>
                    )}/>
            </CTable>

            <Modal destroyOnClose visible={modalVisible} footer={null} onCancel={onCancel}>
                <div className='user-manage-list-new'>
                    <div className='c-page-new'>
                        <div className='c-page-new-item' key={data.id}>
                            <div className='flex c-page-new-item-title'>
                                <span className='title-before-icon'/>{data.title}</div>
                            <div>
                                <Form
                                    {...formItemLayout}
                                    form={userModelForm}
                                    onFinish={onFinish}

                                >

                                    <Form.Item
                                        label="用户名"
                                        name={"username"}
                                        validateTrigger={"onSubmit"}
                                        validateFirst={true}
                                        rules={[{required: true}, {
                                            validator: validateUserName, message: "用户名校验失败"
                                        }]}
                                    >
                                        <Input placeholder={'请输入用户名'}/>
                                    </Form.Item>

                                    <Form.Item label="密码">
                                        <Space>
                                            <Form.Item
                                                noStyle
                                                validateFirst={true}
                                                name={'password'}
                                                rules={[{required: true, message: "密码不能为空"}, {
                                                    pattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
                                                    message: '密码过于简单'
                                                }]}>
                                                <Input.Password/>
                                            </Form.Item>
                                            <Tooltip title={"最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符"}>
                                                <Typography.Link><QuestionCircleOutlined/></Typography.Link>
                                            </Tooltip>
                                        </Space>
                                    </Form.Item>

                                    <Form.Item
                                        label="邮箱"
                                        name="emailaddress"
                                        validateTrigger={"onSubmit"}
                                        validateFirst={true}
                                        rules={[{
                                            type: 'email', message: '请输入正确的邮箱地址'
                                        }, {
                                            validator: validateUserEmail, message: "邮箱校验失败"
                                        }]}
                                    >
                                        <Input placeholder={'请输入用户邮箱'}/>
                                    </Form.Item>
                                    <Form.Item label="角色"
                                               name={'roleid'}
                                    >
                                        <Select options={roleSelect}></Select>

                                    </Form.Item>
                                    <Form.Item wrapperCol={{span: 12, offset: 6}}>
                                        <Button type="primary" htmlType="submit">
                                            提交
                                        </Button>
                                    </Form.Item>
                                    {editFlag ? <Form.Item
                                        name="userid"
                                    >
                                        <Input type={'hidden'}/>
                                    </Form.Item> : ''}
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
export default Yhgl