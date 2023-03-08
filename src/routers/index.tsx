import React, {FC} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from '../views/app/App';

import LoginComponent from "../views/login/loginComponent";
import MainContent from '../views/mainContent';
import homeRouter from "./homeRouter";
/*数据管理*/
import sjypzRouter from "./sjgl/sjypzRouter";
import sjkbfRouter from "./sjgl/sjkbfRouter";
import sjcqRouter from "./sjgl/sjcqRouter";
/*任务管理*/
import pcrwRouter from "./rwgl/pcrwRouter";
import dsrwRouter from "./rwgl/dsrwRouter";
/*智能专区*/
import rlkglRouter from "./znzq/rlkglRouter";
import txzqRouter from "./znzq/txzqRouter";
import tpsbRouter from "./znzq/tpsbRouter";
import wzsbRouter from "./znzq/wzsbRouter"
/*运维管理*/
import pzxglRouter from "./ywgl/pzxglRouter";
import rzjkRouter from "./ywgl/rzjkRouter";
/*图书专区*/
import tsglRouter from "./tszq/tsglRouter";
import tzsfwRouter from "./tszq/dzsfwRouter";
import tslbRouter from "./tszq/tslbRouter";
/*用户中心*/
import xxxgRouter from "./yhzx/xxxgRouter";
import grzxRouter from "./yhzx/grzxRouter";
/*后台管理*/
import cdglRouter from "./htgl/cdglRouter";
import yhglRouter from "./htgl/yhglRouter";
import jsglRouter from "./htgl/jsglRouter";
import zzglRouter from "./htgl/zzglRouter";
import qxglRouter from "./htgl/qxglRouter";
/*流程专区*/
import lcsjRouter from "./lczq/lcsjRouter";
import { Footer } from 'antd/lib/layout/layout';
export interface RouteConfigProps {

}

const RouteConfig: FC<RouteConfigProps> = (props) => {

    /**state  state部分**/
    /**effect  effect部分**/

    /**methods 方法部分**/


    const routers = [
        qxglRouter,
        cdglRouter,
        yhglRouter,
        jsglRouter,
        zzglRouter,
        homeRouter,
        tsglRouter,
        sjypzRouter,
        sjkbfRouter,
        sjcqRouter,
        pcrwRouter,
        dsrwRouter,
        rlkglRouter,
        txzqRouter,
        tpsbRouter,
        wzsbRouter,
        pzxglRouter,
        rzjkRouter,
        tzsfwRouter,
        tslbRouter,
        xxxgRouter,
        grzxRouter,
        lcsjRouter,
    ];

    const renderRoutes = (routers: any[]) => {
        return routers.map((item, index) => {
            if (item.children) {
                let Com = item.component;
                return (
                    <Com key={index}>
                        {renderRoutes(item.children)}
                    </Com>
                )
            } else {
                return (
                    <Route path={item.path} component={item.component} exact={item.exact} key={index}/>
                )
            }
        })
    };
    /**styles 样式部分**/

    /**render**/

    return (
        <HashRouter>
            <Switch>
                <Route exact path='/login' component={LoginComponent}/>
                <Route exact path='/' component={LoginComponent}/>
                <App>
                    <MainContent>
                        {renderRoutes(routers)}
                    </MainContent>

                </App>
            </Switch>
        </HashRouter>

    );
}
export default RouteConfig
