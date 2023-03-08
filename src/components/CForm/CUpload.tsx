import React, {FC, useEffect} from 'react'
import {message, Modal, Upload} from 'antd'
// import PropTypes from 'prop-types'
import _ from 'lodash'
import {PlusSquareOutlined} from "@ant-design/icons";

export type FileTypes = {
    uid: string,
    name: string,
    url: string,
}

export interface CUploadProps {
    uploads: {
        action: string,
        accept: string, //'.png,.jpg,.jpeg,.svg'
        disabled: boolean,
        name: string,
        listType: string,
        showUploadList: boolean,
        defaultFileList: FileTypes[],//{uid: '', name: '', url: ''}
        fileList: [],
        limit: number,//限制上传数量 默认无限制
        size: number,//默认限制大小为2M
    },
    fileList: [],
    previewVisible: boolean,
    previewImage: string,
    className?: string
    type?: string,
    onChange: Function,
    disabled?: boolean,
}

const CUpload: FC<CUploadProps> = (props) => {

    /**state  state部分**/

    /**methods 方法部分**/

    // debugger
    // 初始化upload选项
    const initUploadState = (data: any) => {
        // debugger
            if (!data) {
                return
            }
            const {fileList, ...props} = _.cloneDeep(data);
            if (!fileList || !_.isArray(fileList)) {
                return
            }
            fileList.forEach(item => {
                if (item.hasOwnProperty('id')) {
                    // item.uid = item.id.toString();
                    item.status = 'done';
                    item.thumbUrl = item.url;
                }
            });

            props.fileList = fileList;
            props.uploads.fileList = fileList;
            props.onChange && props.onChange("uploads", fileList)
        }

    const getBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // 点击modal打开
    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        props.onChange && props.onChange("previewImage", file.url || file.preview)
        props.onChange && props.onChange("previewVisible", true)
    }

    // 上传之前的判断
    const beforeUpload = (file: any, fileList: any) => {
        // debugger
        let name = file.name;
        let size = file.size;
        let currentFileType = name.split('.').pop();
        let fileType = props.uploads.accept.split(',');

        if (props.uploads.size < size) {
            message.info('文件大小超过最大限制');
            return false;
        }
// debugger
        if (fileType.includes(`.${currentFileType}`)) {
            return true;
        } else {
            message.info('请上传指定的文件类型');
        }
        return false
    }

    // 上传change
    // @ts-ignore
    const handleChange = ({file, fileList, event}) => {
        // debugger
        if (file.status === 'done') {
            let data = [] as any;
            fileList.forEach((item: any) => {
                if (item.response) {
                    item.response.uid = item.uid;
                    data.push(item.response)
                } else {
                    data.push(item)
                }
            });
            props.onChange && props.onChange("uploads", {...props.uploads, ...{fileList: fileList}});
        } else if (file.status === 'uploading') {


            props.onChange && props.onChange("uploads", {...props.uploads, fileList});
        } else {
            // 不符合上传条件的
            if (fileList.length > 0) {
                fileList.pop();
            }
        }
    }

    // 移出文件
    const removeFile = (file: any) => {
        let uid = file.uid;
        let list = _.cloneDeep(props.uploads.fileList);
        let currentFileIndex = list.findIndex((item: any) => {
            return item.uid === uid
        });
        list.splice(currentFileIndex, 1);

        props.onChange && props.onChange("uploads", {...props.uploads, ...{fileList: list}});
    }


    // modal取消
    const modalCancel = () => {
        props.onChange && props.onChange("previewVisible", false)
    }

    /**styles 样式部分**/

    /**effect  effect部分**/

    useEffect(() => {

        // debugger
        initUploadState(props);
    },[])
    // useEffect(() => {
    //     initUploadState(props);
    // }, [props.fileList])

    /**render**/
    const uploadButton = (
        '+ Upload'
    );

    return (
        <div>
            <div className={`c-upload ${props.className}`}>
                {/* @ts-ignore*/}
                <Upload
                    {...props.uploads}
                    className="avatar-uploader"
                    onPreview={(file) => handlePreview(file)}
                    beforeUpload={(file, fileList) => beforeUpload(file, fileList)}
                    onRemove={(file) => removeFile(file)}
                    onChange={({file, fileList, event}) => handleChange({file, fileList, event})}>
                    {props.uploads.limit <= props.uploads.fileList.length ? null : uploadButton}
                </Upload>
                <Modal visible={props.previewVisible} footer={null} onCancel={modalCancel}>
                    <img alt="example" style={{width: '100%'}} src={props.previewImage}/>
                </Modal>
            </div>
        </div>
    );
}
export default CUpload