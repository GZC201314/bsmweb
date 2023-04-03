import {Badge, Descriptions, Image, message} from 'antd';
import React, {FC, useState} from 'react'
import './style.scss'
import grzxDao from "../../../../dao/grzxDao";
import defaultAvatarUrl from '../../../../img/china.svg'
export interface MytaskProps {

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

const MyTask: FC<MytaskProps> = (props) => {

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
        <h1 className="style">mytask Page</h1>
    );
}
export default MyTask