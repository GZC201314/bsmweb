
import * as Common from './action-type'
// 修改left-nav状态
export const collapsedToggle = (value: any)=>{
  return {
    type: Common.COLLAPSEDTOGGLE,
    value
  }
};

// 修改面包屑状态状态
export const setBreadcrumb = (value: any)=>{
  return {
    type: Common.SETBREADCRUMB,
    value
  }
};

// 修改reload状态
export const setReload = (value: any)=>{
  return {
    type: Common.RELOAD,
    value
  }
};

// 修改windowInfo
export const setWindowInfo = (value: any)=>{
  return {
    type: Common.WINDOWINFO,
    value
  }
};

// 修改登录用户信息
export const setUserInfo = (value: any)=>{
  return {
    type: Common.USERINFO,
    value
  }
};

// 切换主题
export const setCurrentTheme = (value: any)=>{
  return {
    type: Common.CURRENTTHEME,
    value
  }
};
