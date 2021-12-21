import {Badge, Descriptions, Image, message} from 'antd';
import React, {FC, useState} from 'react'
import './style.scss'
import grzxDao from "../../../../dao/grzxDao";
import defaultAvatarUrl from '../../../../img/china.svg'
export interface GrzxProps {

}
export type userInfoType = {
    username: string,
    usericon:string,
    createtime: string,
    emailaddress: string,
    enabled: boolean,
    isfacevalid: boolean,
    lastmodifytime: string,
    roleName: string,

}

const Grzx: FC<GrzxProps> = (props) => {

    /**state  state部分**/
    const [userinfo,setUserinfo] = useState<userInfoType>({} as userInfoType)
    /**effect  effect部分**/

    /*用户信息加载*/
    React.useEffect(() =>{
        grzxDao.getUserInfo({},(res:any) => {
            if(res.code === 200){
                setUserinfo(res.data)
            }else {
                message.error(res.msg)
            }
        })
    },[])

    /**methods 方法部分**/

    /**styles 样式部分**/

    /**render**/

    return (
        <div>
            <Descriptions title="用户信息" bordered>
                <Descriptions.Item label="用户名" >{userinfo.username}</Descriptions.Item>
                <Descriptions.Item label="头像" span={2}>
                    <Image
                        width={80}
                        src={userinfo.usericon?userinfo.usericon:defaultAvatarUrl}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">{userinfo.createtime}</Descriptions.Item>
                <Descriptions.Item label="最后修改时间" span={2}>{userinfo.lastmodifytime}</Descriptions.Item>
                <Descriptions.Item label="邮箱">
                    {userinfo.emailaddress}
                </Descriptions.Item>
                <Descriptions.Item label="人脸注册" span={2}>
                    {userinfo.isfacevalid?<Badge status="success" text="已注册"/>:<Badge status="error" text="未注册"/>}
                </Descriptions.Item>
                <Descriptions.Item label="角色">{userinfo.roleName}</Descriptions.Item>
            </Descriptions>
        </div>
    );
}
export default Grzx