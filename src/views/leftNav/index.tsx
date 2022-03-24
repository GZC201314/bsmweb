import {Popover} from 'antd'
import {NavLink, useHistory} from 'react-router-dom'
import './index.scss'
import {getStorage, urlFormat} from '../../utils';
import CScroll from "../../components/CScroll"
import React, {FC, useEffect, useState, useRef} from 'react'
import {setBreadcrumb, collapsedToggle} from "../../redux/common/action";
import * as Icons from '@ant-design/icons';

import {useSelector} from "../../hooks/hooks";
import {LocationDescriptor, Location} from 'history';
import {useDispatch} from "react-redux";
import config from '../../config';

export interface LeftNavProps {
    collapsed?: boolean
}

const LeftNav: FC<LeftNavProps> = (props) => {

    /**state  state部分**/
    /*在这边获取菜单数据*/
    const menuList = getStorage('menulist', '')
    const collapse = useSelector((state) => {
        return getStorage("collapse","");
    });
    const leftNavRef = useRef(null)

    const dispatch = useDispatch()
    const history = useHistory()
    /*获取登录时获取的授权的页面*/
    const [leftNavData, setLeftNavData] = useState<any>(menuList)
    const [currentOpenIds, setCurrentOpenIds] = useState([])
    const [currentActiveId, setCurrentActiveId] = useState('')
    const [leftNavdefaultOpenAll, setLeftNavdefaultOpenAll] = useState(config.leftNavdefaultOpenAll)
    const [CollapseModel, setCollapseModel] = useState(config.CollapseModel)
    /**effect  effect部分**/
    useEffect(() => {
        dispatch(collapsedToggle(props.collapsed))
    }, [dispatch, props.collapsed])


    useEffect(() => {
        console.log("initOpenAll")
        initOpenAll();
        initCurrentActive();
        // @ts-ignore
        getRouterAndSetBreadcrumb();
    },[getRouterAndSetBreadcrumb, initCurrentActive, initOpenAll])
    /**methods 方法部分**/

    /*展开收起事件*/
    function changeToggle(data: any) {
        if (!data || !data.id) return;
        // 手风琴模式
        let currentOpenIdsVal: never[] = [];
        if (CollapseModel) {
            // 如果当前点击项在数组中存在表明是关闭操作
            // @ts-ignore
            if (currentOpenIds.includes(data.id)) {
                setCurrentOpenIds([]);
            } else {
                // @ts-ignore
                currentOpenIdsVal.push(data.id)
            }
            // currentOpenIds = currentOpenIds.length ? [] : [data.id];
        } else {
            // 如果当前点击项在数组中存在表明是关闭操作
            // @ts-ignore
            if (currentOpenIds.includes(data.id)) {
                // @ts-ignore
                let index = currentOpenIds.indexOf(data.id);
                currentOpenIds.splice(index, 1);
                currentOpenIdsVal = currentOpenIds
                // setCurrentOpenIds(currentOpenIds)
            } else {
                currentOpenIdsVal = currentOpenIds;
                // @ts-ignore
                currentOpenIdsVal.push(data.id)
                // @ts-ignore
            }
        }
        setCurrentOpenIds(currentOpenIdsVal)
    }

    /*初始化展开项的id列表  针对于配置默认全部展开和默认打开某个路由时需要展开项*/
    function initOpenAll() {
        if (leftNavdefaultOpenAll) {
            let currentOpenIdsVal: any[] = [];
            // @ts-ignore
            leftNavData.forEach(item => {
                if (item.children && item.children.length) currentOpenIdsVal.push(item.id);
            });

            // @ts-ignore
            setCurrentOpenIds(currentOpenIdsVal)
        }
    }

    /*初始化当前选中项  判断当前路由下的选中项  this.props获取不到路由信息使用window.location代替*/
    function initCurrentActive() {
        let routeInfo = urlFormat(window.location.href);
        let hash = routeInfo.hash;

        // 过滤出选中的一级导航或者展开的一级导航
        // @ts-ignore
        let openOrSelectData = leftNavData.filter(item => {
            if(item.path === ''){
                return false;
            }
            return hash.includes(item.path)
        });
        if (!openOrSelectData.length) {
            return
        }

        // 当前选中项一定是打开的，所以先删除当前选中项在currentOpenIds中的值
        // @ts-ignore
        let index = currentOpenIds.indexOf(openOrSelectData[0].id);
        let currentOpenIds1 = currentOpenIds;
        if (index > -1) {
            currentOpenIds1.splice(index, 1);
            setCurrentOpenIds(currentOpenIds1)
        }
        setCurrentOpenIds(currentOpenIds1)
        // 展开二级路由所在的一级菜单
        changeToggle(openOrSelectData[0]);

        // 找到选中的一个菜单或者二级菜单
        debugger
        let is_children = openOrSelectData[0].children && openOrSelectData[0].children.length;
        let currentActiveId = '';
        if (is_children) {
            // @ts-ignore
            let selectedChildrenData = openOrSelectData[0].children.filter(item => {
                return hash.includes(item.path)
            });
            currentActiveId = selectedChildrenData[0] && selectedChildrenData[0].id;
        } else {
            currentActiveId = openOrSelectData[0].id;
        }
        setCurrentActiveId(currentActiveId)
    }


    // 设置breadcrumb面包屑导航数据
    function getRouterAndSetBreadcrumb(data: any) {
        let routeInfo = urlFormat(window.location.href);
        let hash = routeInfo.hash;
        if (data) {
            hash = data.path;

            setCurrentActiveId(data.id)
        }
        let hashArr: any[] = [];
        if (hash) hashArr = hash.substring(1).split('/');
        let breadcrumb: any[] = [];

        if (hashArr.length) {
            // @ts-ignore
            let firstRoute = leftNavData.filter(item => {
                return item.path.substring(1) === hashArr[0]
            });
            if (firstRoute && firstRoute.length) {
                let childrenRoute = [];
                if (firstRoute[0].children && firstRoute[0].children.length) {
                    // @ts-ignore
                    childrenRoute = firstRoute[0].children.filter(item => {
                        return item.path === hash
                    });
                }
                breadcrumb.push(...[{
                    name: firstRoute[0].name || ''
                }, {
                    name: childrenRoute && childrenRoute.length ? childrenRoute[0].name : ''
                }]);
            }
        }
        dispatch(setBreadcrumb(breadcrumb));
    }

    const renderIcon = (iconName: any) => {
        // @ts-ignore
        return React.createElement(Icons[iconName]);
    }

    // 监听路由变换
    function listenRouterChange() {
        console.log("listenRouterChange")
        // @ts-ignore
        history.listen(() => {
            initCurrentActive();
            // @ts-ignore
            getRouterAndSetBreadcrumb();
        })
    }

    useEffect(() => {
        listenRouterChange();
    },[])

    function popoverContentRender(item: any) {
        if (item.children && item.children.length) {
            return (
                <div className='popover-container'>
                    {
                        item.children.map((children_item: any, children_index: number) => {
                            return <div className='popover-container-item' key={children_item.id}>
                                <NavLink exact onClick={() => getRouterAndSetBreadcrumb(children_item)}
                                         className={`flex item-link ${currentActiveId === children_item.id ? 'selected' : ''}`}
                                         to={children_item.path}>
                                    <span className='popover-container-span' style={{color:'#ffffff',fontSize:'12px'}}>{children_item.name}</span>
                                </NavLink>
                            </div>
                        })
                    }
                </div>
            )
        }
    }

    function childrenRender(item: { id: never; children: any[]; iconType: string; icon: string | undefined; name: {} | null | undefined; path: LocationDescriptor<unknown> | ((location: Location<unknown>) => LocationDescriptor<unknown>) }) {
        return (
            <div className='ellipsis left-nav-item'>
                {
                    item.children && item.children.length ?
                        <div className={`flex item-link ${currentOpenIds.includes(item.id) ? 'open' : ''}`}
                             onClick={() => changeToggle(item)}>
                          <span className='left'>
                            {item.iconType === 'fa' ? <i className={`prefix-icon fa ${item.icon}`}></i> :
                                renderIcon(item.icon)}
                          </span>
                        </div> : <NavLink exact onClick={() => getRouterAndSetBreadcrumb(item)}
                                          className={`flex item-link ${currentActiveId === item.id ? 'selected' : ''}`}
                                          to={item.path}>
                          <span className='left'>
                            {item.iconType === 'fa' ? <i className={`prefix-icon fa ${item.icon}`}></i> :
                                renderIcon(item.icon)}
                          </span>
                        </NavLink>
                }
            </div>
        )
    }

    /**styles 样式部分**/

    /**render**/

    return (
        <div ref={leftNavRef} className={`left-nav ${collapse ? 'left-nav-open' : 'left-nav-close'}`}>
            <CScroll>
                {
                    leftNavData.map((item: { id: never; children: any[]; iconType: string; icon: string | undefined; name: {} | null | undefined; path: LocationDescriptor<unknown> | ((location: Location<unknown>) => LocationDescriptor<unknown>); }, index: any) => {
                        return <div key={item.id}>
                            {
                                collapse ? <div className='ellipsis left-nav-item'>
                                    {
                                        item.children && item.children.length ?
                                            <div
                                                className={`flex item-link ${currentOpenIds.includes(item.id) ? 'open' : ''}`}
                                                onClick={() => changeToggle(item)}>
                        <span className='left'>
                          {item.iconType === 'fa' ? <i className={`prefix-icon fa`}/> :
                              renderIcon(item.icon)}
                        </span>
                                                {
                                                    collapse && <span className='flex right'>
                            {item.name}
                                                        {item.children && item.children.length &&
                                                        <i className='suffix-icon fa fa-angle-down'/>}
                          </span>
                                                }
                                            </div> : <NavLink exact onClick={() => getRouterAndSetBreadcrumb(item)}
                                                              className={`flex item-link ${currentActiveId === item.id ? 'selected' : ''}`}
                                                              to={item.path}>
                        <span className='left'>
                          {item.iconType === 'fa' ? <i className={`prefix-icon fa ${item.icon}`}/> :
                              renderIcon(item.icon)}
                        </span>
                                                {
                                                    collapse && <span className='flex right'>
                    {item.name}
                                                        {item.children && item.children.length &&
                                                        <i className='suffix-icon fa fa-angle-down'/>}</span>
                                                }
                                            </NavLink>
                                    }
                                    {
                                        item.children && item.children.length && collapse && <div
                                            style={{height: currentOpenIds.includes(item.id) ? `calc(${item.children.length} * 40px)` : '0px'}}
                                            className={`left-nav-item-children`}>
                                            {
                                                item.children.map((children_item, children_index) => {
                                                    return <div className='left-nav-item-children-item'
                                                                key={children_item.id}>
                                                        <NavLink exact
                                                                 onClick={() => getRouterAndSetBreadcrumb(children_item)}
                                                                 className={`flex item-link ${currentActiveId === children_item.id ? 'selected' : ''}`}
                                                                 to={children_item.path}>
                                                            {/*<i className='prefix-icon fa fa-circle'/>*/}
                                                            {children_item.name}
                                                        </NavLink>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }
                                </div> : <div>{/*TODO getPopupContainer={()=>leftNavRef}*/}
                                    {item.children && item.children.length ?
                                        <Popover content={popoverContentRender(item)} placement='right'
                                                 color={'#000000bf'} overlayClassName='popover-content-render'>
                                            {childrenRender(item)}
                                        </Popover> : childrenRender(item)}
                                </div>
                            }
                        </div>
                    })
                }
            </CScroll>
        </div>
    );
}
export default LeftNav
