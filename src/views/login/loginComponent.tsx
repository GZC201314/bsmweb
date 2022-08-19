import React, {FC, useState} from 'react'
import {KeyOutlined, LockOutlined, QuestionCircleOutlined, UserOutlined} from "@ant-design/icons";
import '../../App.less';
import './login.scss'
import {
    Checkbox, Modal, Form,
    Input,
    Button,
    Space,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {useDispatch} from 'react-redux'
import Webcam from "react-webcam";
import {RLSB_LOGIN, USER_LOGIN_ACTION} from "../../actionTypes";
import loginDao from "../../dao/loginDao"
import {convertImgDataToBlob, setStorage, validateUserName} from "../../utils";
import {useHistory} from "react-router-dom";
import {setBreadcrumb} from "../../redux/common/action";
import {breadcrumbDataType} from "../../redux/common/reducer";
import {Footer} from "antd/lib/layout/layout";

export interface loginComponentProps {

}

const LoginComponent: FC<loginComponentProps> = (props) => {

    /**state  state部分**/
    const [validateCode, setValidateCode] = useState("/bsmservice/code/image")
    const [rlsbModelvisible, setRlsbModelvisible] = useState(false)
    const [yhzcModelvisible, setYhzcModelvisible] = useState(false)
    const [rlsbModelLoading, setRlsbModelLoading] = useState(false)
    const [sendEmailButtondisable, setSendEmailButtondisable] = useState(false)
    const dispatch = useDispatch()
    const webcamRef = React.useRef(null);
    const [registerForm] = Form.useForm();
    const history = useHistory();

    const [emailValidator, setEmailValidator] = useState(false)
    const capture = React.useCallback(
        () => {
            setRlsbModelLoading(true)
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
                    /*登录成功，进入首页*/
                    setStorage("userInfo",res.data.data.userinfo,'');
                    setStorage("menulist",JSON.parse(res.data.data.menulist),'');
                    /*设置面包屑数据*/
                    dispatch(setBreadcrumb([{icon:"HomeOutlined",name:"首页",href:"/yhzx"}] as breadcrumbDataType[]))
                    history.push({
                        pathname: '/home',
                    });
                }
            })

        },
        [dispatch]
    );

    React.useEffect(
        () => {
            if (!rlsbModelvisible && webcamRef.current) {
                // @ts-ignore
                webcamRef.current.stream.getTracks()[0].stop();
            }
        },
        [rlsbModelvisible]
    );

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    /**effect  effect部分**/

    /**methods 方法部分**/

    const handleValidateCodeSelect = (item: any) => {
        setValidateCode(`/bsmservice/code/image?${new Date().getTime()}`)
    }


    const handleRlsbOk = () => {
        setRlsbModelLoading(true)
        setTimeout(() => {
            setRlsbModelvisible(false);
        }, 300);
    };


    const handleRlsbCancel = () => {
        /* 关闭摄像头*/
        // @ts-ignore
        setRlsbModelvisible(false);
        setRlsbModelLoading(false);
    };
    /*登录处理*/
    function handleSubmit(values: any) {
        loginDao.userLogin(values,(res : any)=>{
            if(res.data.code && res.data.code == 403){
                message.error(res.data.msg);
            }else {
                setStorage("userInfo",res.data.userinfo,'');
                setStorage("menulist",JSON.parse(res.data.menulist),'');
                /*设置面包屑数据*/
                dispatch(setBreadcrumb([{icon:"HomeOutlined",name:"首页",href:"/yhzx"}] as breadcrumbDataType[]))
                history.push({
                    pathname: '/home',
                });
            }
        },(res:any)=>{
            console.log(res)
        })
    }

    /*登录失败处理*/
    function onFinishFailed(err:any) {
        console.log(err)
    }




    /**styles 样式部分**/

    /**render**/



    function handleYhzcCancel() {
        setYhzcModelvisible(false)
    }

    function sendEmail() {
        if (emailValidator){
            let params={
                emailaddress:registerForm.getFieldValue('emailaddress')
            }
            loginDao.sendRegisterEmail(params,(res:any)=>{
                if(res.code !== 200){
                    message.error("邮件发送失败，请联系管理员！")
                    return;
                }
                setSendEmailButtondisable(true)
            })
        }else {
            message.error("邮箱验证未通过").then(r => {
                console.log("邮箱验证未通过")
            })

        }
    }

    /*注册*/
    function register(values:any) {
        loginDao.registerUser(values,(res:any)=>{
            console.log(res)
        })

    }

    return (
        <div>
            <div className="login-box">
                <Form
                    name="basic"
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    initialValues={{remember: false}}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="用户名称"
                        name="username"
                        rules={[{required: true, message: '请输入用户名!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}/>
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        name="password"
                        rules={[{required: true, message: '请输入密码!'}]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}/>
                    </Form.Item>

                    <Form.Item
                        label="验证码"
                        name="imageCode"
                        rules={[{required: true, message: '请输入验证码!'}]}
                    >
                        <Input prefix={<KeyOutlined className="site-form-item-icon"/>}/>
                    </Form.Item>

                    <Form.Item name="remember-me" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
                        <Checkbox>记住密码</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <img
                            src={validateCode}
                            className="imgClass" alt={""}/>
                        <a onClick={handleValidateCodeSelect}>看不清，换一张</a>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 6, span: 18}}>
                        <Button type="primary" onClick={() => {
                            setRlsbModelvisible(true)
                        }}>
                            人脸识别
                        </Button>
                        <Button type="primary" onClick={() => {
                            registerForm.resetFields()
                            setEmailValidator(false)
                            setSendEmailButtondisable(false)
                            setYhzcModelvisible(true)
                        }}>
                            注册
                        </Button>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                {/*人脸识别弹窗*/}
                <Modal
                    visible={rlsbModelvisible}
                    title="人脸识别"
                    onOk={handleRlsbOk}
                    onCancel={handleRlsbCancel}
                    footer={null}
                    destroyOnClose
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

                {/*用户注册弹窗*/}
                <Modal
                    visible={yhzcModelvisible}
                    title="用户注册"
                    width={450}
                    onCancel={handleYhzcCancel}
                    footer={null}
                    maskClosable={false}
                >
                    <Form
                        labelCol={{span: 4}}
                        wrapperCol={{span: 16}}
                        form={registerForm}
                        onFinish={register}
                    >
                        <Form.Item
                            name={"username"}
                            validateTrigger={"OnSubmit"}
                            validateFirst={true}
                            hasFeedback
                            rules={[{required: true}, {
                                validator: validateUserName, message: "用户名校验失败"
                            }]}
                            label="用户名">
                            <Input/>
                        </Form.Item>

                        <Form.Item label="密码">
                            <Space>
                                <Form.Item
                                    noStyle
                                    validateFirst={true}
                                    name={'password'}
                                    hasFeedback
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
                            label="确认密码"
                            validateFirst={true}
                            name={'repassword'}
                            dependencies={['password']}
                            hasFeedback
                            rules={[{required: true, message: "密码不能为空"}, ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('密码不匹配'));
                                },
                            }),]}>
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item label="邮箱">
                            <Space>
                                <Form.Item
                                    name="emailaddress"
                                    validateTrigger={"onBlur"}
                                    validateFirst={true}
                                    noStyle
                                    hasFeedback
                                    rules={[{required: true, message: '邮箱是必填字段'}, {
                                        type: 'email', message: '请输入正确的邮箱地址'
                                    }, {
                                        validator: (async (rule, value) => {
                                            let params = {emailaddress: value};
                                            let promise = new Promise(((resolve) => {
                                                loginDao.validEmailAddress(params, async (res: any) => {
                                                    resolve(res.data)
                                                })
                                            }))
                                            /*当 Promise resolve一个之后才会执行，否则会已知阻塞在这里*/
                                            let result = await promise;
                                            // @ts-ignore
                                            setEmailValidator(result)
                                            if (result) {
                                                return Promise.resolve()
                                            } else {
                                                return Promise.reject()
                                            }
                                        }), message: "邮箱校验失败"
                                    }]}
                                >
                                    <Input style={{width: 175}}/>
                                </Form.Item>
                                <Tooltip title="验证码有效时间是30分钟，请及时验证">
                                    <Button type={"primary"} onClick={sendEmail}
                                            disabled={sendEmailButtondisable}>发送验证码</Button>
                                </Tooltip>
                            </Space>
                        </Form.Item>
                        <Form.Item name={"validCode"} label={"验证码"}
                                   hasFeedback
                                   rules={[{required: true, message: "验证码不能为空"}]}
                        >
                            <Input/>
                        </Form.Item>
                        <div className={"capture"}>
                            <Button type={"primary"} htmlType="submit">注册</Button>
                        </div>
                    </Form>
                </Modal>

            </div>
            <Footer style={{ textAlign: 'center',color: '#495770',background: 'center' ,position: 'absolute',top: '90%',left: '34%' }}>Copyright © BSM. All Rights Reserved. <a style={{ color: '#495770' }} target="_blank" rel="noreferrer" href='https://beian.miit.gov.cn/'>京ICP备2021027983号-1</a></Footer>
        </div>
    );
}

export default LoginComponent