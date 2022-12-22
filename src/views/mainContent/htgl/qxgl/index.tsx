import React, {FC, Key, useEffect, useState} from 'react'
import './style.scss'
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import jsglDao from "../../../../dao/jsglDao";
import _ from "lodash";
import {message, Modal, Tree} from "antd";
import CButton from "../../../../components/CButton";
import CTable from "../../../../components/CTable";
import qxglDao from "../../../../dao/qxglDao";

export interface QxglProps {

}

const Qxgl: FC<QxglProps> = (props) => {

    const dispatch = useDispatch()
    const history = useHistory()
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    /*选择的key，默认是不包含半选择的节点*/
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [checkedKeysAll, setCheckedKeysAll] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [treeData, setTreeData] = useState([])
    const [loading, setLoading] = useState(true)
    const [editRoleName, setEditRoleName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取用户角色列表数据
    let getRoleListData = () => {
        let getData = {
            page: {
                page: page.page,
                pageSize: page.pageSize,
            }
        };
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


    useEffect(() => {
        getRoleListData();
    }, [reload])

    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getRoleListData();
        } else if (data.type === 'selection') {
            setSelectionDataIds(data.data.ids)
        }
    }


    // 授权页面管理
    const editHandler = (formData: any) => {
        /*根据rolename 获取角色的授权页面*/
        const params = {
            rolename: formData.rolename
        }
        setEditRoleName(formData.rolename)


        qxglDao.getGrandPages(params,(res:any) =>{
            if(res.code === 200){
                let treeData = JSON.parse(res.data);
                let checkKeys:[] = treeData.checkKeys;
                let menuList:[] = treeData.menuList;
                let expandedKeys:[] = treeData.expandedKeys;
                setCheckedKeysAll(checkKeys)
                setCheckedKeys(checkKeys)
                setTreeData(menuList)
                setExpandedKeys(expandedKeys)
            }
        })
        setModalVisible(true)
    }

    const onExpand = (expandedKeysValue: React.Key[]) => {

        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    /*check 的key 默认是不包含半选择的key，这里需要把半选择的父节点加进去*/
    const onCheck = (checkedKeysValue: Key[] | { checked: Key[]; halfChecked: Key[]; }, info: any) => {
        // @ts-ignore
        setCheckedKeys(checkedKeysValue);
        // @ts-ignore
        setCheckedKeysAll([...checkedKeysValue,...info.halfCheckedKeys])
    };

    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        setSelectedKeys(selectedKeysValue);
    };

    function onCancel(data: any) {

        setModalVisible(false)
    }
    function onOk() {
        console.log(checkedKeysAll.length)
        let pagesIds = checkedKeysAll.join(',');
        let params ={
            pagesIds:pagesIds,
            rolename:editRoleName,
        }
        qxglDao.updateAuth(params,(res:any) =>{
            if(res.code === 200){
                message.success(res.msg)
                return
            }
            message.error(res.msg)
        })
        setModalVisible(false)
    }

    /**styles 样式部分**/

    /**render**/


    // @ts-ignore
    return (
        <div className='user-manage-list'>
            {/*// @ts-ignore*/}
            <CTable size={'middle'} scroll={true} loading={loading} columns={colums}
                    selectedRowKeys={selectionDataIds}
                    dataSource={dataSource} page={page} onTableChange={onTableChange}
                    checked={true} rowKey={"roleid"}>
                <div
                    slot='operate'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => (
                        <div className='operate'>
                            <CButton type='text'
                                     onClick={() => editHandler(record)}>编辑授权页面</CButton>
                        </div>
                    )}/>
            </CTable>

            {/*授权页面管理模式框*/}
            <Modal
                destroyOnClose
                title={'请选择需要授权的页面'}
                style={{ top: 40 }}
                visible={modalVisible}
                // footer={null}
                onCancel={onCancel}
                onOk={onOk}
            >
                <div className='user-manage-list-new'>
                    <Tree
                        checkable
                        defaultExpandAll={true}
                        onExpand={onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onCheck={onCheck}
                        checkedKeys={checkedKeys}
                        onSelect={onSelect}
                        selectedKeys={selectedKeys}
                        treeData={treeData}
                    />
                </div>
            </Modal>

        </div>
    );
}
export default Qxgl