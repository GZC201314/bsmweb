import {ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import {Card, Col, Divider, message, Row, Statistic} from 'antd';
import React, {FC, useEffect, useState } from 'react'
import './style.scss'
import _ from "lodash";
import homeDao from "../../../dao/homeDao";
import {useHistory} from "react-router-dom";
export interface HomeProps{

}
const Home:FC<HomeProps> = (props) => {

    const history = useHistory()
    let websocket = null as unknown as WebSocket;
    /**state  state部分**/
    const [data,setData] = useState<any>({})
    /**effect  effect部分**/

    useEffect(()=>{
        getSysTemDetailInfo();
        // homeDao.getSystemDetailInfo({},(res:any) =>{
        //     if(res.code === 200){
        //         if(_.isEqual(data,res.data)){
        //             return;
        //         }
        //         setData(res.data);
        //         return;
        //     }
        //     message.error("登录信息已过期,请重新登录。")
        //     history.push({
        //         pathname: '/login'
        //     });
        // },(res:any) =>{
        //     console.log(res)
        // })

    },[])
    /**methods 方法部分**/

    const getSysTemDetailInfo = () =>{
        debugger


        //判断当前浏览器是否支持WebSocket, 主要此处要更换为自己的地址
        if ('WebSocket' in window) {
            websocket = new WebSocket("ws://localhost:8080/system/monitor");
        } else {
            alert('Not support websocket')
        }

        //连接发生错误的回调方法
        websocket.onerror = function() {
            console.log("error")
        };

        //连接成功建立的回调方法
        websocket.onopen = function(event) {
            console.log("open")
            //setMessageInnerHTML("open");
        }

        //接收到消息的回调方法
        websocket.onmessage = function(event) {
            debugger
            const parse = JSON.parse(event.data);
            if(_.isEqual(data,parse)){
               return;
            }
            setData(parse)
        }

        //连接关闭的回调方法
        websocket.onclose = function() {
            console.log("close");
        }

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            websocket.close();
        }



        //关闭连接
        function closeWebSocket() {
            if(!_.isEmpty(websocket)){
                websocket.close();
            }
        }

        //发送消息
        function send() {
            // websocket.send(message);
        }
    }
    /**styles 样式部分**/

    /**render**/

    return(
        <div>
            <Divider>Java 虚拟机信息</Divider>
            <div className="site-statistic-demo-card">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="执行模式"
                                value={data.jvmInfo && data.jvmInfo.info === "mixed mode"?"混合模式":"解释模式"}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="虚拟机名"
                                value={data.jvmInfo && data.jvmInfo.name}
                                // precision={2}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="版本"
                                value={data.javaInfo && data.javaInfo.version}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="JRE地址"
                                value={data.javaRuntimeInfo && data.javaRuntimeInfo.homeDir}
                                // precision={2}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="历史加载类数"
                                value={data.classLoadingMXBean && data.classLoadingMXBean.totalLoadedClassCount}
                                 suffix={"个"}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="当前加载类"
                                value={data.classLoadingMXBean && data.classLoadingMXBean.loadedClassCount}
                                suffix={"个"}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="总内存"
                                value={data.runtimeInfo && data.runtimeInfo.totalMemory}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="可用内存"
                                value={data.runtimeInfo && data.runtimeInfo.freeMemory}
                                // precision={2}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="总进程数"
                                value={data.totalThreadCount}
                                suffix={"个"}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>

                </Row>

            </div>
            <Divider>服务器信息</Divider>
            <div className="site-statistic-demo-card">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="操作系统"
                                value={data.osInfo && data.osInfo.name}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="操作系统架构"
                                value={data.osInfo && data.osInfo.arch}
                                // precision={2}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="IP地址"
                                value={data.hostInfo && data.hostInfo.address}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="localhost"
                                value={data.hostInfo && data.hostInfo.name}
                                // precision={2}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="总内存"
                                value={data.runtimeInfo && data.runtimeInfo.maxMemory}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="可用内存"
                                value={data.runtimeInfo && data.runtimeInfo.usableMemory}
                                // precision={2}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>

    );
}
export default Home