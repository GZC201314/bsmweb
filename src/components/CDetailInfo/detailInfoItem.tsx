import { Modal } from 'antd';
import React, {FC, useState } from 'react'
import CSwiper from '../CSwiper';
import _ from "lodash";
import './index.scss'
export interface DetailInfoItemProps{
data:[]
}
const CDetailInfoItem:FC<DetailInfoItemProps> = (props) => {

    /**state  state部分**/
    const {data} = props;
  const [swiperData,setSwiperData] =useState([])
  const [modalVisible,setModalVisible] =useState(false)

    /**effect  effect部分**/

    /**methods 方法部分**/
    function imgModalLook(data: { value: any; }){
    if(data.value){
      let value = data.value;
      if(!_.isArray(data.value)){
        value = [value]
      }
      setSwiperData(value)
      setModalVisible(true)
    }
  }

  function modalCancelHandler(){
      setModalVisible(false)
  }
    /**styles 样式部分**/

    /**render**/
    const colOne = data.slice(0, Math.ceil(data.length/2));
    const colTwo = data.slice(Math.ceil(data.length/2));
    return(
        <div className='flex c-detail-info-item' ref='CDetailInfoItem'>
          <div className='info-col info-col-one'>
            {
              colOne.map((infoItem :any, infoIndex: any) => {
                return <div className='flex info-row' key={infoItem.id}>
                  <div className='info-row-label ellipsis' title={infoItem.name}>{infoItem.name}</div>
                  {
                    infoItem.type === 'img' ? <div className='info-row-content img-look ellipsis' onClick={() => imgModalLook(infoItem)}>查看</div> : <div className='info-row-content ellipsis' title={infoItem.value}>{infoItem.value || <span className='none-value'>暂无</span>}</div>
                  }
                </div>
              })
            }
          </div>
          <div className='info-col-null'></div>
          <div className='info-col info-col-two'>
            {
              colTwo.map((infoItem :any, infoIndex) => {
                return <div className='flex info-row' key={infoItem.id}>
                  <div className='info-row-label ellipsis' title={infoItem.name}>{infoItem.name}</div>
                  {
                    infoItem.type === 'img' ? <div className='info-row-content img-look ellipsis' onClick={() => imgModalLook(infoItem)}>查看</div> : <div className='info-row-content ellipsis' title={infoItem.value}>{infoItem.value || <span className='none-value'>暂无</span>}</div>
                  }
                </div>
              })
            }
          </div>

          <Modal
              width='700px'
              visible={modalVisible}
              onCancel={modalCancelHandler}
              destroyOnClose={true}
              footer={null}>
            <CSwiper data={swiperData} />
          </Modal>
        </div>
    );
}
export default CDetailInfoItem
