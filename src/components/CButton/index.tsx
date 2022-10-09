import React, {FC} from 'react'
import {Button} from 'antd'
import './index.scss'
import * as Icons from "@ant-design/icons";


export interface CButtonProps {
    loading?: boolean,
    icon?: string,
    type?: "link" | "text" | "default" | "ghost" | "primary" | "dashed"|"danger" | undefined,
    size?: string,
    disabled?: boolean,
    className?: string,
    authId?: string,
    onClick?: Function,
    block?: boolean | undefined
}


const CButton: FC<CButtonProps> = (props) => {
    const {icon, type, size, disabled, className, authId, ...restProps} = props;

    /**state  state部分**/

    /**effect  effect部分**/

    /**methods 方法部分**/
    const clickHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        props.onClick && props.onClick();
    }

    const renderIcon = (iconName: any) => {
        // @ts-ignore
        return React.createElement(Icons[iconName]);
    }

    /**styles 样式部分**/
        // @ts-ignore
    const iconRender = icon.includes('fa') ? <i className={`fa ${icon}`}/> : renderIcon(icon);

    /**render**/

    return (
        <div className={`c-button ${props.block ? 'c-button-block' : ''} ${className ? className : ''}`}>
            <Button
                className={`c-button-base c-button-${type} c-button-size-${size} ${disabled ? 'c-button-disabled' : ''} ${icon ? 'c-button-icon' : ''}`}
                {...restProps}
                onClick={(e) => clickHandler(e)}>
                {icon !== '' ? iconRender : ''}
                {
                    props.children
                }
            </Button>
        </div>
    );
}

CButton.defaultProps = {
    type: 'default',
    size: 'default',
    icon: 'fa',
    disabled: false,
    loading: false,
};

export default CButton
