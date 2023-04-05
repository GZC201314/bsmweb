import React, {FC, useEffect} from 'react'

import {collapsedToggle, setCurrentTheme, setUserInfo} from "../../redux/common/action";
import './App.scss'
import Header from '../header'
import LeftNav from '../leftNav'
import {getStorage, setStorage} from "../../utils";
import zhCN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment'
import {useHistory} from "react-router-dom";
import 'moment/locale/zh-cn';
import {ConfigProvider} from 'antd';
import {Location} from 'history';
import {useSelector} from "../../hooks/hooks";
import {useDispatch} from "react-redux";

moment.locale('zh-cn');

export interface AppProps {
  currentTheme?:any
}

const App: FC<AppProps> = (props) => {

  /**state  state部分**/
  /**effect  effect部分**/
  const history = useHistory()
  const dispatch = useDispatch()
  const userInfo = getStorage('userInfo','');
  /**methods 方法部分**/

  const userIsLogin = (location: Location<unknown>)=>{
    // 判断用户是否登录，如果没有登录直接跳到login页面
    const userInfo = getStorage('userInfo','');
    if(!userInfo && location.pathname !== '/login'){
      history.push({
        pathname: '/login'
      });
    }
  }

  useEffect(() => {

  },[])

  useEffect(
      () =>{
        setUserInfo(getStorage('userInfo',''))
      }
  ,[])

  const collapsed = useSelector((state) => {
    return state.CommonReducer.collapsed;
  });
  const mytask = useSelector((state) => {
    return state.CommonReducer.mytask;
  });
  const theme = useSelector((state) => {
    return state.CommonReducer.currentTheme;
  });

  // 在全局监听数据变化
  const watchRouterChange= () =>{
    history.listen((location)=>{
      userIsLogin(location);
      console.log('watchRouterChange');
      // ajax_abort_all();//路由变化时取消axios请求
    })
  }

  // // 切换主题文件
  const setThemeFile = (currentTheme: string) =>{
    if(!getStorage('theme','')){
      setStorage('theme', currentTheme,'');
    }
    dispatch(setCurrentTheme(getStorage('theme','')))
  }


  useEffect(()=>{
    setThemeFile(props.currentTheme)
  },[])

  useEffect(()=>{
    watchRouterChange();
    userIsLogin(history.location);
    setThemeFile(props.currentTheme);
  },[])
    /**styles 样式部分**/
    
    /**render**/
    
    return(
        <ConfigProvider locale={zhCN}>
          <div className='app' data-theme={theme}>
            <Header userInfo={userInfo} collapsedToggle={collapsedToggle} collapsed={collapsed}  mytask={mytask}/>

            <div className='flex app-content'>
              <LeftNav/>

              <div className='app-mainContent'>
                {props.children}
              </div>
            </div>
          </div>

        </ConfigProvider>
    );
}
export default App