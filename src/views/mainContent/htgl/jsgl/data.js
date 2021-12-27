

export const tableData = {
  tHead: [
    {
      key: 'id',
      title: '角色ID',
      dataIndex: 'roleid',
    },
    {
      key: 'rolename',
      dataIndex: 'rolename',
      title: '角色名',
    },
    {
      key: 'rolecname',
      dataIndex: 'rolecname',
      title: '角色中文名',
    },
    {
      key: 'disabled',
      dataIndex: 'disabled',
      title: '启用',
      fixed: 'right',
      slot: 'isActive',
    },
    {
      key: 'remark',
      dataIndex: 'remark',
      title: '备注',
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


/*新增角色的配置信息*/
export const roleManageListNewData = [
  {
    id: 'baseInfo',
    title: '基本信息',
    data: [
      {
        id: 'rolename',
        name: '角色名',
        placeholder: '请输入角色名',
        type: 'input',
        checkType: 'required',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: '',
        options: [],
        expand: {},
        jpath: 'rolename'
      },
      {
        id: 'rolecname',
        name: '角色中文名',
        placeholder: '请输入角色中文名',
        type: 'input',
        checkType: 'required',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: '',
        options: [],
        expand: {},
        jpath: 'rolecname'
      },
      {
        id: 'disabled',
        name: '是否启用',
        placeholder: '',
        type: 'radio',
        checkType: 'required',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: '0',
        options: [
          {
            value: '1',
            name: '禁用'
          },
          {
            value: '0',
            name: '启用'
          }
        ],
        expand: {},
        jpath: 'disabled'
      },
      {
        id: 'remark',
        name: '角色备注',
        placeholder: '请选择角色备注',
        type: 'textarea',
        checkType: '',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: '',
        options: [],
        expand: {},
        jpath: 'remark'
      }
    ]
  }
];
