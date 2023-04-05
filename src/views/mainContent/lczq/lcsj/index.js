import React, {useEffect, useState} from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import './style.scss'
import customTranslate from "../../../../resource/bpmnCustomTranalate/customTranslate";
import {xmlstr} from '../../../../resource/testXml'
import CButton from "../../../../components/CButton";
import tokenSimulation from "bpmn-js-token-simulation";
import flowableModdleExtension from '../../../../resource/extension-moddle/flowable/index'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import lcglDao from "../../../../dao/lcglDao";
import {Button, message, Upload} from "antd";
import {VerticalAlignTopOutlined} from "@ant-design/icons";

// 引入json转换与高亮

function Lcsj() {
    let size = 1;
    let previewResult = ''
    let recoverable = false
    let revocable = false
    /*设置预览弹窗显示*/
    let simulationStatus = true
    let modeling = null;
    let bpmnModeler = null;
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (bpmnModeler ==null){
            initBpmn();
        }else {
            // debugger
            console.log("画板已经初始化");
        }
    }, [])

    const initBpmn = () => {
        let customTranslateModule = {
            translate: ["value", customTranslate]
        }
        bpmnModeler = new BpmnModeler({
            container: '#canvas',
            height: '100vh',
            propertiesPanel: {
                parent: '#js-properties-panel'
            },
            additionalModules: [
                /*汉化*/
                customTranslateModule,
                /*模拟流转流程*/
                tokenSimulation,
                // 左边工具栏以及节点
                propertiesPanelModule,
                /*flowableModdleModule 模块*/
                // camundaModdleDescriptor,
                flowableModdleExtension,
                propertiesProviderModule
            ],
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
                flowable:flowableModdleExtension,
            }
        });
        createBpmnDiagram();
        let eventBus = bpmnModeler.get('eventBus');
        /*监听流程图变化，返回要预览的XML*/
        eventBus.on("commandStack.changed", async event => {
            try {
                recoverable = bpmnModeler.get("commandStack").canRedo()
                revocable = bpmnModeler.get("commandStack").canUndo()
                let {xml} = await bpmnModeler.saveXML({format: true});
                previewResult = xml
            } catch (e) {
                console.error(`[Process Designer Warn]: ${e.message || e}`);
            }
        });

        // 监听视图缩放变化
        bpmnModeler.on("canvas.viewbox.changed", ({viewbox}) => {
            const {scale} = viewbox;
            size = Math.floor(scale * 100) / 100;
        });

    }
    const createBpmnDiagram = async () => {
        // debugger
        // 开始绘制bpmn图
        try {
            await bpmnModeler.importXML(xmlstr);
            /*图形居中*/
            bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')

        } catch (e) {
            console.error(e)
        }
    }

    const unDo = () => {
        console.log("unDo")
        bpmnModeler.get("commandStack").undo();
    };
    const reDo = () => {
        console.log("reDo")
        bpmnModeler.get("commandStack").redo();
    };
    const doBig = () => {
        console.log("doBig")

        let newZoom = Math.floor(size * 100 + 0.1 * 100) / 100;
        if (newZoom > 4) {
            throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
        }
        size = newZoom;
        bpmnModeler.get("canvas").zoom(newZoom, 'auto')

    };
    const doOld = () => {
        console.log("doOld")
        size = 1;
        bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
    };
    const doSmall = () => {
        console.log("doSmall")
        let newZoom = Math.floor(size * 100 - 0.1 * 100) / 100;
        if (newZoom > 4) {
            throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
        }
        size = newZoom;
        bpmnModeler.get("canvas").zoom(newZoom, 'auto')
    };
    const importFlow = () => {
        console.log("importFlow")

    };
    const exportXmlFlow = async () => {
        console.log("exportXmlFlow")
        debugger
        let {xml} = await bpmnModeler.saveXML({format: true});
        let name = bpmnModeler._definitions &&bpmnModeler._definitions.rootElements&& bpmnModeler._definitions.rootElements[0].id
        download(name+".dpmn20.xml", xml)
    };
    const exportSvgFlow = async () => {
        console.log("exportSvgFlow")

        await bpmnModeler.saveSVG().then((res) => {
            let {xml} = bpmnModeler.saveXML({format: true});
            let name = bpmnModeler._definitions &&bpmnModeler._definitions.rootElements&& bpmnModeler._definitions.rootElements[0].id
            download(name+".dpmn20.svg", res.svg)
        })
    };
    const clearFlow = () => {
        bpmnModeler.createDiagram();
        console.log("clearFlow")
    };
    const deployFlow = async () => {
        console.log("deployFlow")
        // 判断是否有相同name的流程
        const {xml} = await bpmnModeler.saveXML({format: true})
        let name = bpmnModeler._definitions &&bpmnModeler._definitions.rootElements&& bpmnModeler._definitions.rootElements[0].id
        let data = {
            xml: xml,
            flowName: name
        };
        // debugger
        lcglDao.deployFlow(data, (res) => {
            if (res.data) {
                message.info("流程部署成功！");
            } else {
                message.error("流程部署失败！");
            }
        })

    };


    //生成 npmn 配置文件
    const download = (filename, text) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    const uploadProps = {
        accept: '.xml',
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            // 在这边渲染流程图
            console.log(file);
            let fileReader = new FileReader();
            fileReader.onload = (e)=>{
                bpmnModeler.importXML(e.target.result);
            };
            fileReader.readAsText(file);
            return false;
        },
        fileList,
    };


    return (
        <div>
            <div className='flex filter-left'>
                <CButton icon={'LeftOutlined'} onClick={unDo}>撤回</CButton>
                <CButton icon={'RightOutlined'} onClick={reDo}>重做</CButton>
                <CButton icon={'PlusCircleOutlined'} onClick={doBig}>放大</CButton>
                <CButton icon={'FullscreenExitOutlined'} onClick={doOld}>还原</CButton>
                <CButton icon={'MinusCircleOutlined'} onClick={doSmall}>缩小</CButton>
                <Upload {...uploadProps}>
                    <Button className="ant-btn c-button-base c-button-default c-button-size-default  c-button-icon" icon={<VerticalAlignTopOutlined />}>导入</Button>
                </Upload>

                <CButton icon={'VerticalAlignBottomOutlined'} onClick={exportXmlFlow}>XML</CButton>
                <CButton icon={'VerticalAlignBottomOutlined'} onClick={exportSvgFlow}>SVG</CButton>
                <CButton icon={'DeleteOutlined'} onClick={clearFlow}>清空</CButton>
                <CButton icon={'DeploymentUnitOutlined'} onClick={deployFlow}>部署</CButton>
            </div>
            {/*bpmn 容器*/}
            <div id={'canvas'} className="container"/>
            {/*<div id={'properties-panel'} className={'properties-panel'}/>*/}
            <div id="js-properties-panel" className="properties-panel"></div>
            {/*<Modal visible={previewModelVisible} title="流程预览" onOk={handleOk} onCancel={handleCancel}>*/}

            {/*    <span>{previewResult}</span>*/}

            {/*</Modal>*/}
        </div>
    )


}

export default Lcsj;