
import React, {FC, useEffect, useState,useRef } from 'react'
import Echarts from 'echarts'
import './index.scss'
export interface CEchartsProps{
  options?:object
  height?:any
}
const CEcharts:FC<CEchartsProps> = (props) => {

    /**state  state部分**/
    const{options,height}= props;
    const refEcharts = useRef(null)
    /**effect  effect部分**/
    /*TODO*/

    const [echarts,setEcharts] =useState<Echarts.ECharts>()
    // const [options,setOptions] =useState<object>(null)
    /**methods 方法部分**/

  const initEcharts = ()=>{
    // @ts-ignore
      let echarts = Echarts.init(refEcharts);
      // @ts-ignore
      setEcharts(echarts)
      initOptions(options)
    }

  const initOptions = (options: any)=>{
    if(echarts && options){
      echarts.setOption(options)
    }
  }

  const resizeHandler=()=>{
    echarts && echarts.resize();
  }
  useEffect(()=>{
    initOptions(options);
    resizeHandler();
  },[initOptions, options, resizeHandler])
  useEffect(()=>{
    initEcharts();
  },[echarts, initEcharts])
    /**styles 样式部分**/
    let style = {};
  if(height){
    style = {height: height};
  }

    /**render**/

    return(
        <div style={style}  className='c-echarts' ref={refEcharts} />
    );
}
export default CEcharts