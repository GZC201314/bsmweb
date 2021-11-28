import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux'
import './assets/css/common.scss'
import Route from './routers'
import * as serviceWorker from './serviceWorker';
import {store} from "./store/store";
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider} from 'antd';
import {validateMessages} from "./utils/ValidateMessages";


const render = (Component:any) => {
    ReactDOM.render(
        <ConfigProvider locale={zhCN} form={{validateMessages}}>
            <Provider store={store}>
                <Component/>
            </Provider>
        </ConfigProvider>
        ,
        document.getElementById('root'));
};

render(Route);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
serviceWorker.unregister();