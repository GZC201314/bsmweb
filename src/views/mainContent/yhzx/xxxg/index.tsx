import {Button, Collapse, Divider, Form, Input, Modal, Space, Tooltip, Typography, Upload} from 'antd';
import React, {FC, useState} from 'react'
import './style.scss'
import ImgCrop from 'antd-img-crop'
import cookie from 'react-cookies'
import {QuestionCircleOutlined, VideoCameraOutlined} from '@ant-design/icons';
import Webcam from "react-webcam";
import {useDispatch} from 'react-redux'
import loginDao from "../../../../dao/loginDao";
import {RLSB_LOGIN, XXXG_GET_USERINFO_HANDLE} from "../../../../actionTypes";
import xxxgDao from "../../../../dao/xxxgDao";
import {useSelector} from "../../../../hooks/hooks";
import {convertImgDataToBlob, getStorage, setStorage, validatePassword, validateUserName} from "../../../../utils";
import {UploadFile} from 'antd/lib/upload/interface';
import {useHistory} from "react-router-dom";

export interface XxxgProps {

}

const Xxxg: FC<XxxgProps> = (props) => {

    const history = useHistory();
    const [editUserNameForm] = Form.useForm();
    const [editPasswordForm] = Form.useForm();
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };
    const webcamRef = React.useRef(null);
    /**state  state部分**/
    /*TODO 这边是否要重新查询一下数据库来获取用户信息，是否可以使用登录时获取的用户信息*/
    const reduxUserInfo = useSelector((state) => {
        return state.Xxxgreducer.userInfo;
    })
    /*redux 在刷新页面之后，存在数据丢失的问题，这边使用*/

    const headerUserInfo = getStorage("userInfo", "") as any

    const [fileList, setFileList] = useState([] as UploadFile[]);
    const [rlsbModelvisible, setRlsbModelvisible] = useState(false)
    const [rlsbModelLoading, setRlsbModelLoading] = useState(false)
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

    React.useEffect(() => {
        xxxgDao.getUserInfo({}, (res: any) => {
            if (res.code === 200) {
                let actionType = {
                    type: XXXG_GET_USERINFO_HANDLE,
                    data: res.data
                }
                dispatch(actionType)
            } else {

                history.push({
                    pathname: '/login',
                });

            }
        })
    }, [])
    const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current.getScreenshot();
            let blob = convertImgDataToBlob(imageSrc);
            let formData = new FormData();
            if (blob) {
                formData.append('file', blob);
            }
            loginDao.rlsbLogin(formData, (res: any) => {
                if (res.data.code === 200) {
                    const action = {
                        type: RLSB_LOGIN,
                        data: res.data.data
                    }
                    dispatch(action);
                    setRlsbModelLoading(false)
                    setRlsbModelvisible(false)
                    // @ts-ignore
                    webcamRef.current.stream.getTracks()[0].stop();
                }
            })

        },
        [dispatch]
    );
    /**methods 方法部分**/


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


    /**styles 样式部分**/

    /**render**/
    const beforeUpload = async (file: any) => {
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        let url: string = "";
        url = await new Promise((resolve, reject) => {
            xxxgDao.editAvatar(formData, (res: any) => {
                if (res.data.code === 200) {
                    url = res.data.data;
                    headerUserInfo.usericon = url;
                    setStorage("userInfo", headerUserInfo, "")
                    resolve(url)

                    /*更新头像*/
                }
            })
        })
        if (url !== "") {
            history.push({
                pathname: '/xxxg',
            })
            return false;
        }

    }


    /*修改用户名*/
    const editUserName = async () => {
        try {
            const values = await editUserNameForm.validateFields();
            xxxgDao.editUserName(values,(res:any)=>{
                console.log(res)
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    /*修改密码*/
    const editUserPassWord = async () => {
        try {
            const values = await editPasswordForm.validateFields();
            xxxgDao.editUserPassword(values,(res:any)=>{
                console.log(res)
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    return (
        <div>
            <Divider><span className="title-xxxg">用户信息修改</span></Divider>

            <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel header="用户头像修改" key="1">
                    <ImgCrop
                        rotate
                    >
                        <Upload
                            name='file'
                            beforeUpload={beforeUpload}
                            listType="picture-card"
                            className="avatar-uploader"
                            accept="image/*"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length < 1 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
                </Collapse.Panel>


                <Collapse.Panel header="用户名修改" key="2">
                    <Form form={editUserNameForm}
                          onFinish={editUserName}
                    >

                        <Space>
                            <Form.Item label="用户名" name={'username'}
                                       validateTrigger={"onBlur"}
                                       hasFeedback
                                       rules={[{required: true}, {
                                           validator: validateUserName, message: "用户名校验失败"
                                       }]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType={"submit"}>修改用户名</Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Collapse.Panel>

                <Collapse.Panel header="用户密码修改" key="3">
                    <Form form={editPasswordForm}
                          onFinish={editUserPassWord}
                    >

                        <Space>
                            <Form.Item label="原密码" name={'oldPassword'}
                                       validateTrigger={"onBlur"}
                                       hasFeedback
                                       rules={[{required: true}, {
                                           validator:validatePassword,
                                           message: '密码错误'
                                       }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item label="新密码" name={'password'}
                                       validateTrigger={"onBlur"}
                                       hasFeedback
                                       rules={[{required: true}, {
                                           pattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
                                           message: '密码过于简单'
                                       }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Tooltip className={'tooltip-class'} title={"最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符"}>
                                <Typography.Link><QuestionCircleOutlined/></Typography.Link>
                            </Tooltip>
                            <Form.Item label="重复密码" name={'rePassword'}
                                       validateTrigger={"onBlur"}
                                       hasFeedback
                                       rules={[{required: true}, {
                                           pattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
                                           message: '密码过于简单'
                                       }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Space>
                            <Button type="primary" htmlType={"submit"}>修改密码</Button>

                    </Form>

                </Collapse.Panel>
                {!reduxUserInfo.isFaceValid ? <Collapse.Panel header="用户人脸注册信息" key="4">
                    <Space align={'center'} size={50}>
                        <span> 人脸注册请点击右侧摄像头图标</span>
                        <VideoCameraOutlined className={'video-camera-outlined'} onClick={openRlsbModal}/>
                        <Tooltip title={"进行人脸信息注册，需要设备带有摄像头，请确保你的设备满足要求。"}>
                            <Typography.Link><QuestionCircleOutlined/></Typography.Link>
                        </Tooltip>
                    </Space>

                </Collapse.Panel> : ''}


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