import _ from 'lodash'
import loginDao from "../dao/loginDao";
import tsglDao from "../dao/tsglDao";

/**
 * @param url 完整路径
 */
export const urlFormat = (url:string, name?:any) => {
  let result: any = {
    hash: '',
    query: {}
  };
  if(!url){
    return url;
  }

  let href = url;
  let hashIndex = href.indexOf('#');
  let queryIndex = href.indexOf('?');
  let hash = hashIndex > -1 ? href.substring(hashIndex + 1, queryIndex > -1 ? queryIndex : href.length) : '';
  let queryString = queryIndex > -1 ? href.substring(queryIndex + 1) : '';
  let query = {};
  if(queryString){
    let queryArr = queryString.split('&');

    queryArr.forEach(item=>{
      let key = item.split('=')[0];
      // @ts-ignore
      query[key] = item.split('=')[1];
    });
  }

  result.hash = hash;
  result.query = query;

  if(name){
    try {
      // @ts-ignore
      result = query[name];
    }catch (e) {
      result = ''
    }
  }

  return result;
};


/**
 * 给对象绑定一个方法，返回传入字符串的对象的值,
 * @param {解析的对象} obj
 * @param {传入的jpath 'aa.bb.cc'} text
 *
 * 解析失败返回''
 */
export const getObjectValue = function(obj:object, text:string) {
  try {
    if ((_.isObject(obj) || _.isArray(obj)) && text) {
      let textArray = text.split('.');
      // @ts-ignore
      let get_value = function(obj:object, textArray:any) {
        let key = textArray.shift();
        if (key.length < 5 && parseInt(key)) {
          key = parseInt(key);
        }
        // @ts-ignore
        if (typeof obj[key] === 'undefined' || obj[key] === null) {
          return '';
        }
        if (textArray.length === 0) {
          // @ts-ignore
          return obj[key];
        }
        // @ts-ignore
        obj = obj[key];
        return get_value(obj, textArray);
      }
      return get_value(obj, textArray);
    }
    return '';
  } catch (error) {

  }
};

/**
 * 返回一个对象，给对象增加属性与值
 * @param {传入的对象} obj
 * @param {传入的jpath} text
 * @param {设置的值} value
 */
export const setObjectValue = function(obj:object, text:string, values?:string) {
  // debugger
  try {
    if (text === '')
      return obj;
    let textArray = text.split('.');
    // @ts-ignore
    let set_value = function(temp_obj:object, textArray:any) {
      let key = textArray.shift();
      // @ts-ignore
      if (!temp_obj[key])
        { // @ts-ignore
          temp_obj[key] = {};
        }
      if (textArray.length === 0) {
        // @ts-ignore
        temp_obj[key] = values;
        return obj;
      }
      // @ts-ignore
      return set_value(temp_obj[key], textArray);
    };
    return set_value(obj, textArray);
  } catch (error) {

  }
};

/**
 * 设置pageNew数据
 * @param data
 * @param id 唯一id
 * @param field 对应key对象中修改的字段
 * @param value
 */
export const setPageNewItem = (data:any, id:any, field:any, value:any) => {
  // debugger
  let newData = _.cloneDeep(data);
  newData.forEach((item: { data: any[]; })=>{
    item.data && item.data.forEach(dataItem => {
      if(_.isArray(dataItem)){
        dataItem.forEach(_item=>{
          if(_item.key === id){
            _item[field] = value;
          }
        })
      }else{
        if(dataItem.id === id){
          dataItem[field] = value;
        }
      }
    });
  });
  return newData;
};

/**
 * 设置详情和表单数据的value
 * @param data 详情数据
 * @param obj 取值的数据对象
 * @returns {*}
 */
export const setPageNewValue = function(data:any, obj: object) {
  let result = _.cloneDeep(data);
  result.forEach((item: { data: any[]; })=>{
    item.data && item.data.forEach(dataItem => {
      if(_.isArray(dataItem)){
        dataItem.forEach(_item=>{
          let value = getObjectValue(obj, _item.jpath);
          if(_item.type === 'img' && typeof value === 'object' && !(value instanceof Array)){
            value = [value]
          }
          _item.value = typeof value === 'object' ? value : value.toString();
        })
      }else{
        let value = getObjectValue(obj, dataItem.jpath);
        if(dataItem.type === 'img' && typeof value === 'object' && !(value instanceof Array)){
          value = [value]
        }
        dataItem.value = typeof value === 'object' ? value : value.toString();
      }
    });
  });
  return result;
};


/**
 * 格式化日期格式
 * @param date
 * @param format 日期格式 YYYY-MM-DD HH:mm:ss
 */
export const formatDate = (date:  Date, format?: string ) => {
  let newDate: Date;
  if(!date){
    newDate = new Date();
  }else{
    newDate = new Date(date);
  }

  if(!format){
    format = 'YYYY-MM-DD HH:mm:ss';
  }

  let addZero = function(num:number){
    return num > 9 ? num : '0' + num;
  };
  let dateObj = {
    year: newDate.getFullYear(),
    month: addZero(newDate.getMonth() + 1),
    date: addZero(newDate.getDate()),
    hour: addZero(newDate.getHours()),
    minute: addZero(newDate.getMinutes()),
    second: addZero(newDate.getSeconds())
  };
  let newDateString = `${dateObj.year}-${dateObj.month}-${dateObj.date}`;
  let newTimeString = `${dateObj.hour}:${dateObj.minute}:${dateObj.second}`;
  let dateSeparationIndex = format.lastIndexOf('Y') > -1 ? format.lastIndexOf('Y') + 1 : '';
  let timeSeparationIndex = format.lastIndexOf('H') > -1 ? format.lastIndexOf('H') + 1 - 10 : '';

  let result = '';
  // @ts-ignore
  if(newDateString[dateSeparationIndex]){
    // @ts-ignore
    newDateString.replace(/-/g, newDateString[dateSeparationIndex]);
    result = newDateString;
  }
  // @ts-ignore
  if(newTimeString[timeSeparationIndex]){
    // @ts-ignore
    newTimeString.replace(/:/g, newTimeString[timeSeparationIndex]);
    if(result) {
      result += ` ${newTimeString}`;
    }else{
      result = newTimeString;
    }
  }
  // @ts-ignore
  if(!newDateString[dateSeparationIndex] && !newTimeString[timeSeparationIndex]){
    result = `${newDateString} ${newTimeString}`;
  }

  return result;
};

/**
 * 随机生成指定范围内的日期
 * @param startTime
 * @param endTime
 * @returns {string}
 */
export const randomDate = (startTime: Date, endTime: Date) => {
  if(!startTime){
    return
  }
  if(!endTime){
    endTime = new Date();
  }
  let start = new Date(startTime).getTime();
  let end = new Date(endTime).getTime();
  let random = Math.floor((Math.random() * (end - start) + start));
  return formatDate(new Date(random))
};

/**
 * 获取指定日期前后相隔指定天数的日期
 * @param date
 * @param n 负值向前  正值向后
 * @returns {string}
 */
export const getDateSeparated = (date: Date, n: number) => {
  if(!date){
    return
  }
  if(!n){
    n = 0
  }
  let resultDate = new Date();
  resultDate.setDate(new Date(date).getDate() + n);
  return formatDate(resultDate);
};



/**
 * 获取sessionStorage或者localStorage数据
 * @param type session或者local 默认为local
 * @param key
 */
export const getStorage = (key: string, type: string) => {
  let storage = type === 'session' ? sessionStorage : localStorage;
  let _value = storage.getItem(key);
  try {
    if (_value != null) {
      _value = JSON.parse(_value)
    }
  }catch (e) {

  }
  return _value;
};

/**
 * 设置sessionStorage或者localStorage数据
 * @param type session或者local 默认为local
 * @param key
 * @param value
 */
export const setStorage = (key: string, value: string, type: string) => {
  let storage = type === 'session' ? sessionStorage : localStorage;
  if(typeof value === 'object'){
    value = JSON.stringify(value);
  }
  storage.setItem(key, value);
};

/**
 * 删除sessionStorage或者localStorage数据
 * @param type session或者local 默认为local
 * @param key
 */
export const removeStorage = (key: string, type: string) => {
  let storage = type === 'session' ? sessionStorage : localStorage;
  storage.removeItem(key);
};

export const convertImgDataToBlob = (base64Data: String) => {
  if(base64Data.length === 0){
    return null;
  }
  let format = "image/jpeg";
  let files = base64Data.split(",")
  /*获取图片的格式*/
  format = files[0].substring(files[0].indexOf(':')+1,files[0].indexOf(';')) !== ''?files[0].substring(files[0].indexOf(':')+1,files[0].indexOf(';')):format;
  let code = window.atob(files[1]);
  let aBuffer = new window.ArrayBuffer(code.length);
  let uBuffer = new window.Uint8Array(aBuffer);
  for (let i = 0; i < code.length; i++) {
    uBuffer[i] = code.charCodeAt(i) & 0xff;
  }

  let blob = null;
  try {
    blob = new Blob([uBuffer], {type: format});
  } catch (e) {
    console.error(e)
  }
  return blob;

};


/*ISBN号校验，判断isbn号是否重复*/
export const validateISBN = async (rule: any, value: any) => {
  let params = {isbn: value};
  let promise = new Promise(((resolve) => {
    tsglDao.validISBN(params, async (res: any) => {
      resolve(res.data)
    })
  }))
  /*当 Promise resolve一个之后才会执行，否则会一直阻塞在这里*/
  let result = await promise;
  if (result) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
};
/*用户密码校验,用于修改密码时，原密码的校验*/
export const validatePassword = async (rule: any, value: any) => {
  let params = {password: value};
  let promise = new Promise(((resolve) => {
    loginDao.validPassword(params, async (res: any) => {
      resolve(res.data)
    })
  }))
  /*当 Promise resolve一个之后才会执行，否则会已知阻塞在这里*/
  let result = await promise;
  if (result) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
};

export const validateUserEmail = async (rule:any, value:any) => {
  let params = {emailaddress: value};
  let promise = new Promise(((resolve) => {
    loginDao.validEmailAddress(params, async (res: any) => {
      resolve(res.data)
    })
  }))
  /*当 Promise resolve一个之后才会执行，否则会已知阻塞在这里*/
  let result = await promise;
  if (result) {
    console.log(result)
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
};
/*用户名校验*/
export const validateUserName = async (rule: any, value: any) => {
  let params = {username: value};
  let promise = new Promise(((resolve) => {
    loginDao.validUsername(params, async (res: any) => {
      resolve(res.data)
    })
  }))
  /*当 Promise resolve一个之后才会执行，否则会一直阻塞在这里*/
  let result = await promise;
  if (result) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
};