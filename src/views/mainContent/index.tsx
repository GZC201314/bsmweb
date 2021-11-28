import React, {FC, useEffect } from 'react'
import { Card} from 'antd'
import CBreadcrumb from '../../components/CBreadcrumb'
import CButton from '../../components/CButton'
import CScroll from '../../components/CScroll'
import { setReload, setWindowInfo} from "../../redux/common/action";
import './index.scss'
import {useSelector} from "../../hooks/hooks";
export interface MainContentProps{
    windowInfo?:object,
    reload?:any,
    breadcrumbData?:any
}
const MainContent:FC<MainContentProps> = (props) => {

    /**state  state部分**/
    /**effect  effect部分**/
    /**methods 方法部分**/
    const reload = () =>{
    setReload(true);
  }

  // 监听window高宽变化
  const listenWindowInfo = () =>{
    window.addEventListener('resize', function (e) {
      let height = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
      let width = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
      // @ts-ignore
      let mainContentHeight = document.getElementById('mainContent').offsetHeight;
      // @ts-ignore
      let mainContentWidth = document.getElementById('mainContent').offsetWidth;
      let value = {
        ...props.windowInfo,
        screenHeight: height,
        screenWidth: width,
        mainContentHeight,
        mainContentWidth};
      setWindowInfo && setWindowInfo(value);
    })
  }




    useEffect(()=>{
        return () =>{
            listenWindowInfo();
        }
    },[listenWindowInfo])
    /**styles 样式部分**/
    
    /**render**/
    
    return(
        <div className='main-content' id='mainContent'>
          <CScroll>
            <div className='main-content-scroll'>
              <div className='flex main-breadcrumb'>
                <CBreadcrumb>
                  <CButton icon='ReloadOutlined' disabled={props.reload} type='primary' onClick={reload}/>
                </CBreadcrumb>
              </div>
              <div className='main-content-body'>
                <Card className='main-content-body-card'>
                  {props.children}
                </Card>
              </div>
            </div>
          </CScroll>
        </div>
    );
}
export default MainContent