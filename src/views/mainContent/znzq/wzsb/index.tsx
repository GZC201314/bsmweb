import React, {FC, useState} from 'react'
import './style.scss'
import {InboxOutlined} from '@ant-design/icons';
import {message, Upload} from 'antd';
import wzsbDao from "../../../../dao/wzsbDao";
import CButton from "../../../../components/CButton";

const { Dragger } = Upload;
export interface WzsbProps {

}
const Wzsb:FC<WzsbProps> = (props) => {

    const[wzsbResult,setWzsbResult] = useState("")
    const[exportDisabled,setExportDisabled] = useState(true)
    const uploadOrops = {
        name: 'file',
        multiple: true,
        maxCount:1,
        beforeUpload:(file:any) =>{
            const isPNG = file.type === 'image/png';
            if (!isPNG) {
                message.error(`${file.name} 不是一个图片文件！`);
            }
            let formData = new FormData();
            if (file) {
                formData.append('file', file);
            }
            wzsbDao.uploadPicture(formData,(res: any) => {
                if (res.code === 200) {
                    setWzsbResult(res.data)
                    setExportDisabled(false)
                }
            })
            return false;
        }
    };
    /**state  state部分**/
    /**effect  effect部分**/

    /**methods 方法部分**/

    /**render**/

    const exportResult  =(element:any) => {
        if(exportDisabled){
            return
        }
        const isIE = (navigator.userAgent.indexOf('MSIE') >= 0);
        if (isIE) {
            const winSave = window.open();
            // @ts-ignore
            winSave.document.open("text","utf-8");
            // @ts-ignore
            winSave.document.write(wzsbResult);
            // @ts-ignore
            winSave.document.execCommand("SaveAs",true,"ocr.txt");
            // @ts-ignore
            winSave.close();
        } else {
            var mimeType =  'text/plain';
            // @ts-ignore
            document.getElementById("createInvote").setAttribute("href",'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(wzsbResult))
            // @ts-ignore
            document.getElementById('createInvote').click();
        }
    }

    /**styles 样式部分**/

    return(
        <div>
            <h1 style={{margin:"20px"}}>图片文字识别</h1>
            <Dragger style={{margin:"20px"}} {...uploadOrops}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">上传文件请点击该区域或者拖拽文件到该区域</p>
                <p className="ant-upload-hint">
                    仅支持单个图片的文字识别
                </p>
            </Dragger>
            <p style={{margin:"20px"}}>文字识别结果：</p>
            <p style={{margin:"20px"}}>{wzsbResult}</p>
            <p style={{margin:"20px"}}>文字识别结果下载：</p>
            <CButton icon={'DownloadOutlined'} disabled={exportDisabled} onClick={exportResult}>生成并导出识别结果 </CButton>
            <a download="ocr.txt" id="createInvote" href={''} />
        </div>
    );
}
export default Wzsb