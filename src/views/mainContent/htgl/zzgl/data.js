export const tableData = {
  tHead: [
    // {
    //   key: 'id',
    //   title: '组织ID',
    //   fixed: 'right',
    //   dataIndex: 'id',
    // },
    {
      key: 'name',
      dataIndex: 'name',
      fixed: 'right',
      title: '组织名',
    },
    {
      key: 'icon',
      dataIndex: 'icon',
      fixed: 'right',
      title: '组织标志',
      slot: 'imgRender'
    },
    {
      key: 'createBy',
      dataIndex: 'createBy',
      fixed: 'right',
      title: '创建人',
    },
    {
      key: 'createDate',
      dataIndex: 'createDate',
      fixed: 'right',
      title: '创建时间',
    },
    {
      key: 'modifyDate',
      dataIndex: 'modifyDate',
      fixed: 'right',
      title: '修改时间',
    },
    {
      key: 'desc',
      dataIndex: 'desc',
      fixed: 'right',
      title: '描述',
      slot: 'descRender'
    },
    {
      key: 'operate',
      dataIndex: 'operate',
      title: '操作',
      fixed: 'right',
      width: 100,
      slot: 'operate',
    },
  ],
  tBody: [],
  tPage: {
    total: 0,
    page: 1,
    pageSize: 10
  }
};

/*
*
*     validateStatus?: "" | "success" | "error" | "warning" | "validating" | undefined,
    validate?: boolean,
* */
/*新增角色的配置信息*/
// @ts-ignore
export const organizationManageListNewData = [
  {
    id: 'baseInfo',
    title: '组织基本信息',
    data: [
      {
        id: 'id',
        name: '组织Id',
        placeholder: '请输入组织Id',
        type: 'input',
        checkType: 'required',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: true,
        editDisabled: true,
        newShow: false,
        editShow: true,
        value: '',
        options: [],
        expand: {},
        jpath: 'id'
      },
      {
        id: 'name',
        name: '组织名',
        placeholder: '请输入组织名',
        type: 'input',
        checkType: 'required',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: '',
        options: [],
        expand: {},
        jpath: 'name'
      },
      {
        id: 'icon',
        name: '组织icon',
        placeholder: '请输入角色中文名',
        type: 'img',
        checkType: 'required',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: '',
        options: [],
        expand: {
          uploads: {
            action: '',
            accept: '.png,.jpg,.jpeg,.svg', //'.png,.jpg,.jpeg,.svg'
            disabled: false,
            name: 'file',
            listType: 'picture-card',
            showUploadList: true,
            defaultFileList: [],//{uid: '', name: '', url: ''}
            fileList: [],
            limit: 1,//限制上传数量 默认无限制
            size: 1024*1024*2,//默认限制大小为2M
          },
          fileList: [],
          previewVisible: false,
          previewImage: '',
          className: '',
          type: '',
          onChange: Function,
          disabled: false,
        },
        jpath: 'icon'
      },
      {
        id: 'desc',
        name: '描述',
        placeholder: '请选择描述',
        type: 'textarea',
        checkType: '',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: '',
        options: [],
        expand: {},
        jpath: 'desc'
      }
    ]
  }
];
