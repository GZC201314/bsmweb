import React, {FC} from 'react'
import {Scrollbars} from 'react-custom-scrollbars';

export interface CScrollProps{
    onScroll?:Function
    children?:any
}
const CScroll:FC<CScrollProps> = (props) => {

    /**state  state部分**/
    const{children,onScroll}= props;
    /**effect  effect部分**/

    /**methods 方法部分**/
     function handleScroll(e: any){
        onScroll && onScroll(e);
    }
    /**styles 样式部分**/
    // @ts-ignore
    function renderThumb({ style, ...props }) {//设置滚动条的样式
        // 暂时不设置滚动条样式
        const thumbStyle = {
            width: '4px',
            backgroundColor: '#000000',
            opacity: '0.2',
            borderRadius: '4px',
            right: '0px',
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}/>
        );
    }
    /**render**/

    return(
        <Scrollbars
            onScroll={handleScroll}
            renderThumbVertical={renderThumb}//传入函数，设置滚动条样式
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            // autoHeight
            thumbMinSize={30}
            universal={true}>
            {children}
        </Scrollbars>
    );
}
export default CScroll
