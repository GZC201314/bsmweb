import {
    Button,
    Cascader,
    DatePicker,
    Divider,
    Form,
    Collapse,
    Input,
    InputNumber,
    Select,
    Switch,
    TreeSelect,
    Upload, Tooltip, Typography, Space, Modal, message
} from 'antd';
import React, {FC, useState} from 'react'
import './style.scss'
import ImgCrop from 'antd-img-crop'
import {QuestionCircleOutlined, VideoCameraOutlined} from '@ant-design/icons';
import Webcam from "react-webcam";
import {useDispatch} from 'react-redux'
import loginDao from "../../../../dao/loginDao";
import {RLSB_LOGIN, XXXG_GET_USERINFO_HANDLE} from "../../../../actionTypes";
import xxxgDao from "../../../../dao/xxxgDao";
import {useSelector} from "../../../../hooks/hooks";
// export type File ={
//     uid: string,
//     name: string,
//     status: string,
//     url: string,
// }
export interface XxxgProps {

}

const Xxxg: FC<XxxgProps> = (props) => {

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };
    const webcamRef = React.useRef(null);
    /**state  state部分**/

    const [fileList, setFileList] = useState([]);
    const [rlsbModelvisible, setRlsbModelvisible] = useState(false)
    const [rlsbModelLoading, setRlsbModelLoading] = useState(false)
    const [userInfo, setUserInfo] = useState(useSelector((state) => {
        return state.Xxxgreducer.userInfo;
    }))
    const dispatch = useDispatch()
    /**effect  effect部分**/
    React.useEffect(
        () => {
            if (!rlsbModelvisible && webcamRef.current) {
                // @ts-ignore
                webcamRef.current.stream.getTracks()[0].stop();
            }
        },
        [rlsbModelvisible]
    );
    React.useEffect(()=>{
        console.log("加载初始化数据")
        xxxgDao.getUserInfo({},(res:any)=>{
            if(res.code === 200){
                let actionType ={
                    type: XXXG_GET_USERINFO_HANDLE,
                    data:res.data
                }
                dispatch(actionType)
            }else {
                message.error(res.msg)
            }
        })
    },[])
    const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current.getScreenshot();
            let blob = convertImgDataToBlob(imageSrc);
            let formData = new FormData();
            if (blob) {
                formData.append('file', blob);
            }
            loginDao.rlsbLogin(formData,(res:any)=>{
                if(res.data.code===200){
                    const action = {
                        type: RLSB_LOGIN,
                        data: res.data.data
                    }
                    dispatch(action);
                    setRlsbModelLoading(false)
                    setRlsbModelvisible(false)
                    // @ts-ignore
                    webcamRef.current.stream.getTracks()[0].stop();
                    // history.go("")
                }
            })

        },
        [dispatch]
    );
    /**methods 方法部分**/

    /*设置文件的自动上传*/
    function beforeUpload() {
        return false;
    }

    // @ts-ignore
    const onChange = ({fileList: newFileList}) => {
        setFileList(newFileList);
    };
    // @ts-ignore
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        // @ts-ignore
        imgWindow.document.write(image.outerHTML);
    };

    function openRlsbModal() {
        setRlsbModelvisible(true);
    }

    const handleRlsbOk = () => {
        setTimeout(() => {
            setRlsbModelvisible(false);
        }, 300);
    };


    const handleRlsbCancel = () => {
        /* 关闭摄像头*/
        setRlsbModelvisible(false);
    };


    /**
     * base64 转 Blob对象
     * @param base64Data
     */
    function convertImgDataToBlob(base64Data: String) {
        let format = "image/jpeg";
        let code = window.atob(base64Data.split(",")[1]);
        let aBuffer = new window.ArrayBuffer(code.length);
        let uBuffer = new window.Uint8Array(aBuffer);
        for (let i = 0; i < code.length; i++) {
            uBuffer[i] = code.charCodeAt(i) & 0xff;
        }

        let blob = null;
        try {
            blob = new Blob([uBuffer], {type: format});
        } catch (e) {
            console.error(e)
        }
        return blob;

    }

    /**styles 样式部分**/

    /**render**/




    return (
        <div>
            <Divider><span className="title-xxxg">用户信息修改</span></Divider>

            <Collapse defaultActiveKey={['1','2']}>
                <Collapse.Panel header="用户常规信息修改" key="1">
                    <Form
                        labelCol={{span: 4}}
                        wrapperCol={{span: 14}}
                        // layout="horizontal"
                    >
                        <Form.Item label="头像">
                            <Form.Item name={'avatar'}>
                                <ImgCrop rotate>

                                    <Upload
                                        name='file'
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={onChange}
                                        beforeUpload={beforeUpload}
                                        onPreview={onPreview}
                                    >
                                        {fileList.length < 1 && '+ Upload'}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="用户名" name={'username'}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="密码" name={'password'}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label="Button">
                            <Button>Button</Button>
                        </Form.Item>
                    </Form>
                </Collapse.Panel>

                <Collapse.Panel header="用户人脸识别注册" key="2">
                    <Space align={'center'} size={50}>
                        <span> 人脸注册请点击右侧摄像头图标</span>

                        <VideoCameraOutlined className={'video-camera-outlined'} onClick={openRlsbModal}/>
                        <Tooltip title={"进行人脸信息注册，需要设备带有摄像头，请确保你的设备满足要求。"}>
                            <Typography.Link><QuestionCircleOutlined/></Typography.Link>
                        </Tooltip>
                    </Space>
                </Collapse.Panel>

            </Collapse>

            {/*人脸识别弹窗*/}
            <Modal
                visible={rlsbModelvisible}
                title="人脸识别"
                onOk={handleRlsbOk}
                onCancel={handleRlsbCancel}
                footer={null}
            >
                <Webcam audio={false}
                        height={500}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={500}
                        videoConstraints={videoConstraints}
                        mirrored={true}
                >
                </Webcam>
                <div className={"capture"}>
                    <Button type="primary" onClick={capture} loading={rlsbModelLoading}>拍摄照片</Button>
                </div>
            </Modal>

        </div>
    );
}
export default Xxxg