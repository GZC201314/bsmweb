import {Breadcrumb} from 'antd'
import './index.scss'
import React, {FC} from 'react'
import * as Icon from '@ant-design/icons'
import {useSelector} from "../../hooks/hooks";

export interface CBreadcrumbProps{
    data?:[],
    children?:React.ReactElement
}
const CBreadcrumb:FC<CBreadcrumbProps> = (props) => {

    /**state  state部分**/
    const{data,children}= props;
    /**effect  effect部分**/

    const breadcrumbData = useSelector((state) => {
        return state.CommonReducer.breadcrumbData;
    });

    /**methods 方法部分**/

    const iconBC=(Name:any)=>{
        // @ts-ignore
        return React.createElement(Icon[Name]);
    }

    /**styles 样式部分**/
    
    /**render**/
    
    return(
        <div className='flex c-breadcrumb'>
            <Breadcrumb>
                {
                    breadcrumbData.map((item:{name:any,href:any,icon:any}, index: React.Key | null | undefined)=>{
                        return <Breadcrumb.Item key={index} href={item.href}>
                            {item.icon && iconBC(item.icon)}
                            {item.name && item.name}
                        </Breadcrumb.Item>
                    })
                }
            </Breadcrumb>
            {children}
        </div>
    );
}
export default CBreadcrumb
