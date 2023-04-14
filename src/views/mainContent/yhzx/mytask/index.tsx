import {Avatar, List, Skeleton} from 'antd';
import React, {FC, useEffect, useState} from 'react'
import './style.scss'
import {useSelector} from "../../../../hooks/hooks";
import CButton from "../../../../components/CButton";


export interface MyTaskProps {

}


const MyTask: FC<MyTaskProps> = (props) => {

    const listData = Array.from({length: 3}).map((_, i) => ({
        href: 'https://ant.design',
        title: `ant design part ${i + 1}`,
        avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));

    const mytask = useSelector((state) => {
        return state.CommonReducer.mytask;
    });

    useEffect(
        () => {
            console.log(mytask)
            mytask.map((item: any) => {
                debugger
                console.log(item)
            })
        }
        , [])
    const [loading, setLoading] = useState(false);
    return (
        <div className='user-manage-list'>
            <List
                itemLayout="vertical"
                size="small"
                dataSource={listData}
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        extra={
                            !loading && (
                                <CButton type={'danger'} className={'button-lcsp'}>审批</CButton>
                            )
                        }
                    >
                        <Skeleton loading={loading} active avatar>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar}/>}
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.description}
                            />
                            {item.content}
                        </Skeleton>
                    </List.Item>
                )}
            />
        </div>
    );
}
export default MyTask