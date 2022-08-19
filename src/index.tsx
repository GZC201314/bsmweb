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

/*bpmn 样式文件*/
/*左边工具栏以及编辑节点的样式*/
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import {Footer} from "antd/lib/layout/layout";


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