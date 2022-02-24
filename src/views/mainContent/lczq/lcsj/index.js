import React, {useEffect} from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'
import './style.scss'
import customTranslate from "../../../../resource/bpmnCustomTranalate/customTranslate";
import {xmlstr} from '../../../../resource/testXml'
import CButton from "../../../../components/CButton";

function Lcsj() {
    let bpmnModeler = null;
    useEffect(() => {
        initBpmn();
    })

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
                // 左边工具栏以及节点
                propertiesPanelModule,
                propertiesProviderModule
            ],
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            }
        });
        createBpmnDiagram();
    }
    const createBpmnDiagram = async () => {
        // 开始绘制bpmn图
        try {
            await bpmnModeler.importXML(xmlstr);
            /*图形居中*/
            bpmnModeler.get('canvas').zoom('fit-viewport','auto')
        } catch (e) {
            console.error(e)
        }
    }

    const unDo = () => {
        console.log("unDo")
    };
    const reDo = () => {
        console.log("reDo")
    };
    const doBig = () => {
        console.log("doBig")
    };
    const doOld = () => {
        console.log("doOld")
    };
    const doSmall = () => {
        console.log("doSmall")
    };
    const importFlow = () => {
        console.log("importFlow")
    };
    const exportXmlFlow = () => {
        console.log("exportXmlFlow")
    };
    const exportSvgFlow = () => {
        console.log("exportSvgFlow")
    };
    const clearFlow = () => {
        console.log("clearFlow")
    };
    const saveFlow = () => {
        console.log("saveFlow")
    };
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
                <CButton icon={'FundOutlined'} onClick={exportSvgFlow}>预览</CButton>
                <CButton icon={'DeleteOutlined'} onClick={clearFlow}>清空</CButton>
                <CButton icon={'SaveOutlined'} onClick={saveFlow}>保存</CButton>
            </div>
            {/*bpmn 容器*/}
            <div id={'canvas'} className="container"/>
            <div id={'properties-panel'} className={'properties-panel'}/>
        </div>
    )


}

export default Lcsj;