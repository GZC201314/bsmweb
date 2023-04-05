import React, {FC, useEffect, useState} from 'react'
import './style.scss'
import {tableData} from "./data";
import {useSelector} from "../../../../hooks/hooks";
import lcglDao from "../../../../dao/lcglDao";
import _ from "lodash";
import {Image, message, Modal} from "antd";
import CTable from "../../../../components/CTable";
import CButton from "../../../../components/CButton";

export interface LcglProps {

}
const Lcgl:FC<LcglProps> = (props) => {
    /**state  state部分**/
    const [colums] = useState(tableData.tHead)
    const [dataSource, setDataSource] = useState(tableData.tBody)
    const [page, setPage] = useState(tableData.tPage)
    const [loading, setLoading] = useState(true)
    const [src, setSrc] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const [selectionDataIds, setSelectionDataIds] = useState([] as Array<any>)

    /**effect  effect部分**/

    const reload = useSelector((state) => {
        return state.CommonReducer.reload;
    });

    // 获取流程列表数据
    let getFlowListData = () => {
        let getData = {
            page: {
                page: page.page,
                pageSize: page.pageSize,
            }
        };
        setLoading(true)

        lcglDao.getFlowList(getData, (res: any) => {

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


    useEffect(() => {
        getFlowListData();
    }, [reload])

    /**methods 方法部分**/



    const onTableChange = (data: any) => {
        if (data.type === 'page' || data.type === 'pageSize') {
            setPage({...page, ...data.data})
            getFlowListData();
        } else if (data.type === 'selection') {
            setSelectionDataIds(data.data.ids)
        }
    }


    function onCancel(data: any) {

        setModalVisible(false)
    }
    function onOk() {
        setModalVisible(false)
    }

    const  suspendFlow=(record:any)=>{
        let params ={
            delIds:[record.key].join(",")
        }
        lcglDao.del(params,(res:any)=>{
            if (res.code===200 && res.data){
                message.success("挂起流程成功!").then(r => {

                });
                getFlowListData();
            }else {
                message.success("挂起流程失败!").then(r => {
                });
                getFlowListData();
            }
        })
    }

    const viewFlowImg = (id:String)=>{
        setSrc("/bsmservice/flowable/getFlowImg/"+id);
        setModalVisible(true)
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
                    checked={true} rowKey={"key"}>
                <div
                    slot='substr'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => {
                        if (_.isString(text) &&text.length>40) {
                            return <span title={text}>{text.substring(0, 40) + "..."}</span>;
                        }else {
                            return <span title={text}>{text}</span>;
                        }
                    }}/>

                <div
                    slot='operate'
                    // @ts-ignore
                    render={(text: any, record: any, index: any) => (
                        <div className='operate'>
                            <CButton type='text'
                                     onClick={()=>{suspendFlow(record)}}>挂起</CButton>
                            {record.hasImg?<CButton type='text'
                                                    onClick={()=>{viewFlowImg(record.id)}}>查看流程图</CButton>:''}

                        </div>
                    )}/>
            </CTable>

            {/*授权页面管理模式框*/}
            <Modal
                destroyOnClose
                title={'流程图'}
                style={{ top: 40 }}
                visible={modalVisible}
                // footer={null}
                onCancel={onCancel}
                onOk={onOk}
            >
                <Image src={src}/>
            </Modal>

        </div>
    );
}
export default Lcgl