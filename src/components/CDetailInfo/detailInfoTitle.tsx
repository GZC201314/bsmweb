import React, {FC, ReactElement} from 'react'
import './index.scss'

export interface CDetailInfoTitleProps{
    title?:string,
    children?:ReactElement
}
const CDetailInfoTitle:FC<CDetailInfoTitleProps> = (props) => {

    /**state  state部分**/
    const{title,children}= props;
    /**effect  effect部分**/

    /**methods 方法部分**/

    /**styles 样式部分**/

    /**render**/

    return(
        <div className='flex c-detail-info-title'>
            <div className='flex c-detail-info-title-left'>
                <span className='title-before-icon'/>
                {title}
            </div>
            <div className='c-detail-info-title-right'>{children}</div>
        </div>
    );
}
export default CDetailInfoTitle

