import React, {FC, useEffect, useState, useRef, ReactNode} from 'react'
import CButton from '../../components/CButton';
import { Menu, Dropdown } from 'antd';
import {menuList} from './data'
import {getStorage, setStorage} from "../../utils";
import './index.scss'
import { collapsedToggle, setWindowInfo, setUserInfo, setCurrentTheme} from "../../redux/common/action";
import config from '../../config'
import * as Icons from '@ant-design/icons';
import {useHistory} from "react-router-dom";
export interface HeaderProps{
  collapsed?:boolean,
  windowInfo?:object,
  userInfo?: any,
  collapsedToggle?:Function,
}
const Header:FC<HeaderProps> = (props) => {

    /**state  state部分**/
    const userInfoRef = useRef(null)
    const themeConfigRef = useRef(null)
    const history =useHistory()
    const [menuList,setMenuList] = useState([])
    const[timeState,setTimeState] =useState(new Date().getTime())
    const[themeMenuList] =useState([
      [
        {
          id: 'default',
          color: '#e6f3fd',
        },
        {
          id: 'deongaree',
          color: '#344058',
        }
      ],
      [
        {
          id: 'green',
          color: '#009688',
        },
        {
          id: 'red',
          color: '#cc0000',
        }
      ]
    ])
    /**methods 方法部分**/

    const renderIcon =(iconName:any) =>{
      // @ts-ignore
      return React.createElement(Icons[iconName]);
    }

  const collapsedChange = () =>{
    let collapse  = !props.collapsed;
    // @ts-ignore
      props.collapsedToggle(collapse);

    clearTimeout(timeState);
    let time = setTimeout(function () {
      // @ts-ignore
      let mainContentHeight = document.getElementById('mainContent').offsetHeight;
      // @ts-ignore
      let mainContentWidth = document.getElementById('mainContent').offsetWidth;
      let value = {
        ...props.windowInfo,
        mainContentHeight,
        mainContentWidth};
      setWindowInfo && setWindowInfo(value);
    },300);
    // @ts-ignore
      setTimeState(time)
  }

  const menuClick=(data: {id:string})=>{
    if(data.id === 'loginOut'){
      // 退出
      setStorage('userInfo', "","");
      setUserInfo(null);
      history.push('/login')
    }else if(data.id === 'personal'){
      history.push('/personal')
    }
  }

  const themeChange = (data: {id:string}) =>{
    setStorage('theme', data.id,"");
    setCurrentTheme(data.id);
  }
  /**effect  effect部分**/
  // @ts-ignore
  // setMenuList(getStorage("menuList",''))
    /**styles 样式部分**/

  /**render**/
    const { name, avatar} = props.userInfo || {};
  const url = avatar ? avatar : '';

  const menu = (
      <Menu>
        {
          menuList.map((item:any, index)=>
              <Menu.Item key={index}>
                <CButton type='text' block onClick={() => menuClick(item)}>{item.name}</CButton>
              </Menu.Item>
          )
        }
      </Menu>);

  const themeMenu = (
      <Menu>
        {
          themeMenuList.map((item: any[], index: React.Key | null | undefined)=>
              <Menu.Item key={index}>
                <div className='flex themeItem'>
                  {
                    item.map(i=><div className='themeItemColor' key={i.id} style={{'backgroundColor': i.color}} onClick={() => themeChange(i)} />)
                  }
                </div>
              </Menu.Item>
          )
        }
      </Menu>);
    return(
        <header className='flex text-color-white header'>
          <div className='logo'>{config.name}</div>
          <div className='flex info'>
            <div className='flex collapsed' onClick={collapsedChange}>
              {renderIcon('MenuFoldOutlined')}
            </div>


            <div className='flex info-right'>

              <div className='theme-config' ref={themeConfigRef}>
                <Dropdown overlay={themeMenu} getPopupContainer={() => themeConfigRef as unknown as HTMLElement}>
                <span>
                  <span className='theme-config-name'>主题皮肤</span>
                  {renderIcon('DownOutlined')}
                </span>
                </Dropdown>
              </div>

              <div className='user-info' ref={userInfoRef}>
                <Dropdown overlay={menu} getPopupContainer={() => userInfoRef as unknown as HTMLElement}>
                <span>
                  <img className='user-avatar' src={url} alt=""/>
                  <span className='user-name'>
                    {name}</span>
                  {renderIcon('DownOutlined')}
                </span>
                </Dropdown>
              </div>
            </div>
          </div>
        </header>
    );
}
export default Header
