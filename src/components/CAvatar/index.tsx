import {Rate} from 'antd'
import './index.scss'
import React, {FC, useEffect, useState} from 'react'

export type CAvatarType = "user"|"rate"

export interface CAvatarProps{
    type: CAvatarType,
    title:string,
    rate:any,
    description?:string,

}
const CAvatar:FC<CAvatarProps> = (props) => {

    /**state  state部分**/
    const{type,title,rate,description}= props;
    const [avatar,setAvatar] = useState("")
    /**effect  effect部分**/
    useEffect(() => {
        setAvatar(localStorage.getItem("avatar") as string)
    }, [avatar])
    /**methods 方法部分**/

    /**styles 样式部分**/

    /**render**/

    return(
        <div>
            <div className='c-avatar flex'>
                <img className='c-avatar-img' src={avatar} alt="头像"/>
                <div className='c-avatar-info'>
                    <p className='c-avatar-title'>{title}</p>
                    {type === 'rate' && <div><Rate className='c-avatar-rate' value={rate} disabled /></div>}
                    <div className='c-avatar-description'>{description}</div>
                </div>
            </div>
        </div>
    );
}
export default CAvatar