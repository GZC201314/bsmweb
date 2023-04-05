import React, {FC, useEffect, useRef, useState} from 'react'
import CButton from '../../components/CButton';
import {Avatar, Badge, Dropdown, Menu, message} from 'antd';
import {menuList} from './data'
import {removeStorage, setStorage} from "../../utils";
import './index.scss'
import {setCurrentTheme, setUserInfo, setWindowInfo} from "../../redux/common/action";
import config from '../../config'
import * as Icons from '@ant-design/icons';
import {UserOutlined} from '@ant-design/icons';
import {useHistory} from "react-router-dom";
import defaultAvatarUrl from '../../img/china.svg'
import {useDispatch} from "react-redux";
import loginDao from "../../dao/loginDao";

export interface HeaderProps {
    collapsed?: boolean,
    windowInfo?: object,
    userInfo?: any,
    mytask?:Array<any>,
    collapsedToggle?: Function,
}

const Header: FC<HeaderProps> = (props) => {

    /**state  state部分**/
    const userInfoRef = useRef(null)
    const themeConfigRef = useRef(null)
    const history = useHistory()
    const dispatch = useDispatch()
    const [timeState, setTimeState] = useState(new Date().getTime())
    const [themeMenuList] = useState([
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
    ]);
    /**methods 方法部分**/

    const renderIcon = (iconName: any) => {
        // @ts-ignore
        return React.createElement(Icons[iconName]);
    }

    const collapsedChange = () => {
        let collapse = !props.collapsed;
        // @ts-ignore
        setStorage('collapse', collapse, "");
        // @ts-ignore
        dispatch(props.collapsedToggle(collapse));

        clearTimeout(timeState);
        let time = setTimeout(function () {
            // @ts-ignore
            let mainContentHeight = document.getElementById('mainContent').offsetHeight;
            // @ts-ignore
            let mainContentWidth = document.getElementById('mainContent').offsetWidth;
            let value = {
                ...props.windowInfo,
                screenHeight: mainContentHeight,
                screenWidth: mainContentWidth
            };
            setWindowInfo && dispatch(setWindowInfo(value));
        }, 300);
        // @ts-ignore
        setTimeState(time)
    }

    const menuClick = (data: { id: string }) => {
        if (data.id === 'loginOut') {
            // 退出
            removeStorage('userInfo', '')
            setUserInfo(null);
            history.push('/login')

            /*发送到后台，清空session*/
            loginDao.userLogOut({}, (res: any) => {
                message.success(res.msg)
            })

        } else if (data.id === 'personal') {
            history.push('/grzx')
        } else if (data.id === 'myTask') {
            history.push('/myTask')
        } else {
            // 退出
            removeStorage('userInfo', '')
            setUserInfo(null);
            history.push('/login')

            /*发送到后台，清空session*/
            loginDao.userLogOut({}, (res: any) => {
                message.success(res.msg)
            })
        }
    }

    const themeChange = (data: { id: string }) => {
        setStorage('theme', data.id, "");
        dispatch(setCurrentTheme(data.id));
    }
    const goHome = () => {
        history.push('/home');
    }
    /**effect  effect部分**/
    // @ts-ignore
    // setMenuList(getStorage("menuList",''))
    /**styles 样式部分**/
    useEffect(() => {
        return () => {
            clearTimeout(timeState);
        }
    }, [timeState])


    /**render**/
    const {username, usericon} = props.userInfo || {};
    const taskList = props.mytask;
    const url = usericon ? usericon : defaultAvatarUrl;
    const menu = (
        <Menu>
            {
                menuList.map((item: any, index) =>
                    <Menu.Item key={index}>
                        <CButton type='text' block
                                 onClick={() => menuClick(item)}>{item.name}{taskList && taskList.length > 0 && item.id === 'myTask' ?
                            <span style={{color: 'red'}}>{taskList.length}</span> : ''}</CButton>
                    </Menu.Item>
                )
            }
        </Menu>);

    const themeMenu = (
        <Menu>
            {
                themeMenuList.map((item: any[], index: React.Key | null | undefined) =>
                    <Menu.Item key={index}>
                        <div className='flex themeItem'>
                            {
                                item.map(i => <div className='themeItemColor' key={i.id}
                                                   style={{
                                                       backgroundColor: i.color,
                                                       width: 20,
                                                       height: 20,
                                                       borderRadius: 2,
                                                       marginLeft: 5,
                                                       marginRight: 5,
                                                       marginTop: 0,
                                                       marginBottom: 0

                                                   }}
                                                   onClick={() => themeChange(i)}/>)
                            }
                        </div>
                    </Menu.Item>
                )
            }
        </Menu>);
    return (
        <header className='flex text-color-white header'>
            <div className='logo' onClick={goHome}>{config.name}</div>
            <div className='flex info'>
                {/*左侧菜单栏折叠按钮*/}
                <div className='flex collapsed' onClick={collapsedChange}>
                    {renderIcon('MenuFoldOutlined')}
                </div>
                {/*右侧主题和个人登录信息*/}
                <div className='flex info-right'>
                    <div className='theme-config' ref={themeConfigRef}>
                        <Dropdown overlay={themeMenu}
                        >
                <span>
                  <span className='theme-config-name'>主题皮肤</span>
                    {renderIcon('DownOutlined')}
                </span>
                        </Dropdown>
                    </div>

                    <div className='user-info' ref={userInfoRef}>
                        <Dropdown overlay={menu} getPopupContainer={(triggerNode) => triggerNode}>
                <span>

                    <Badge count={taskList && taskList.length}>
                        <Avatar shape="square" icon={<UserOutlined/>} src={url} alt=""/>
                    </Badge>

                  <span className='user-name'>
                    {username}</span>
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
