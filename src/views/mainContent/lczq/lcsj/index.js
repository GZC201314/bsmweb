import React, {useEffect, useState} from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'
import './style.scss'
import customTranslate from "../../../../resource/bpmnCustomTranalate/customTranslate";
import {xmlstr} from '../../../../resource/testXml'
import CButton from "../../../../components/CButton";
import tokenSimulation from "bpmn-js-token-simulation";
import flowableModdleExtension from '../../../../resource/extension-moddle/flowable/index'
// 引入json转换与高亮
import X2JS from "x2js";
import {Modal} from "antd";

function Lcsj() {
    let size = 1;
    let previewResult = ''
    let recoverable = false
    let revocable = false
    /*设置预览弹窗显示*/
    let simulationStatus = false
    let modeling = null;
    let bpmnModeler = null;
    useEffect(() => {
        initBpmn();
    }, [])

    const initBpmn = () => {
        let customTranslateModule = {
            translate: ["value", customTranslate]
        }
        bpmnModeler = new BpmnModeler({
            container: '#canvas',
            height: '100vh',
            propertiesPanel: {
                parent: '#properties-panel'
            },
            additionalModules: [
                /*汉化*/
                customTranslateModule,
                /*模拟流转流程*/
                tokenSimulation,
                // 左边工具栏以及节点
                propertiesPanelModule,
                /*flowableModdleModule 模块*/
                flowableModdleExtension,
                propertiesProviderModule
            ],
            moddleExtensions: {
                // camunda: camundaModdleDescriptor,
                flowable:flowableModdleExtension,
            }
        });
        createBpmnDiagram();
        modeling = bpmnModeler.get("modeling");
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
    const exportXmlFlow = () => {
        console.log("exportXmlFlow")
        download("dpmn20.xml", previewResult)
    };
    const exportSvgFlow = () => {
        console.log("exportSvgFlow")
        bpmnModeler.saveSVG().then((res) => {
            download("dpmn20.svg", res.svg)
        })
    };
    const clearFlow = () => {
        bpmnModeler.createDiagram();
        console.log("clearFlow")
    };
    const saveFlow = () => {
        console.log("saveFlow")
    };

    const previewProcess = () => {
        // setPreviewModelVisible(true)
    }
    //
    // const handleOk = () => {
    //     setPreviewModelVisible(false);
    // };
    //
    // const handleCancel = () => {
    //     setPreviewModelVisible(false);
    // };

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
    return (
        <div>
            <div className='flex filter-left'>
                <CButton icon={'LeftOutlined'} onClick={unDo}>撤回</CButton>
                <CButton icon={'RightOutlined'} onClick={reDo}>重做</CButton>
                <CButton icon={'PlusCircleOutlined'} onClick={doBig}>放大</CButton>
                <CButton icon={'FullscreenExitOutlined'} onClick={doOld}>还原</CButton>
                <CButton icon={'MinusCircleOutlined'} onClick={doSmall}>缩小</CButton>
                <CButton icon={'VerticalAlignTopOutlined'} onClick={importFlow}>导入</CButton>
                <CButton icon={'VerticalAlignBottomOutlined'} onClick={exportXmlFlow}>XML</CButton>
                <CButton icon={'VerticalAlignBottomOutlined'} onClick={exportSvgFlow}>SVG</CButton>
                {/*<CButton icon={'FundOutlined'} onClick={previewProcess}>预览</CButton>*/}
                <CButton icon={'DeleteOutlined'} onClick={clearFlow}>清空</CButton>
                <CButton icon={'SaveOutlined'} onClick={saveFlow}>保存</CButton>
            </div>
            {/*bpmn 容器*/}
            <div id={'canvas'} className="container"/>
            <div id={'properties-panel'} className={'properties-panel'}/>

            {/*<Modal visible={previewModelVisible} title="流程预览" onOk={handleOk} onCancel={handleCancel}>*/}

            {/*    <span>{previewResult}</span>*/}

            {/*</Modal>*/}
        </div>
    )


}

export default Lcsj;