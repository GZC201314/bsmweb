import React, {FC, ReactElement} from 'react'
import _ from 'lodash'
import CDetailInfoTitle from './detailInfoTitle'
import CDetailInfoItem from './detailInfoItem'
import './index.scss'

export interface CDetailInfoProps {
    data?: [],
    children: ReactElement
}

const CDetailInfo: FC<CDetailInfoProps> = (props) => {

    /**state  state部分**/
    const {data, children} = props;
    /**effect  effect部分**/

    /**methods 方法部分**/

    /**styles 样式部分**/

    /**render**/

    return (
        <div className='c-detail-info'>
            {
                data && !!data.length && data.map((baseItem: any, baseIndex) => {
                    return <div className='c-detail-info-base-item' key={baseItem.id}>
                        {
                            baseItem.title && <CDetailInfoTitle title={baseItem.title}/>
                        }
                        {
                            !!baseItem.data.length && !baseItem.slot && <CDetailInfoItem data={baseItem.data}/>
                        }
                        {/*如果children是数组则循环判断用到的是哪一个children*/}
                        {
                            !!baseItem.data.length && baseItem.slot && _.isArray(children) && children.map((slotItem, slotIndex) => {
                                return slotItem.props.slot === baseItem.slot && slotItem
                            })
                        }
                        {/*如果children是对象并且children的props.slot为data中定义的slot则展示*/}
                        {
                            baseItem.slot && !_.isArray(children) && children.props.slot === baseItem.slot && children
                        }
                    </div>
                })
            }
        </div>
    );
}
export default CDetailInfo
