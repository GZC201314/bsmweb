import React, {FC} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from '../views/app/App';

import LoginComponent from "../views/login/loginComponent";
import MainContent from '../views/mainContent';
import homeRouter from "./homeRouter";

export interface RouteConfigProps {

}

const RouteConfig: FC<RouteConfigProps> = (props) => {

    /**state  state部分**/
    /**effect  effect部分**/

    /**methods 方法部分**/


    const routers = [
        homeRouter,
        // userManageRouter,
        // storeManageRouter,
        // authManageRouter,
        // goodsManageRouter,
        // historyRecordRouter,
        // personalRouter
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
