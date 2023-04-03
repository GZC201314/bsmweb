

export const tableData = {
  tHead: [
    {
      key: 'id',
      title: '角色ID',
      fixed: 'right',
      dataIndex: 'roleid',
    },
    {
      key: 'rolename',
      dataIndex: 'rolename',
      fixed: 'right',
      title: '角色名',
    },
    {
      key: 'rolecname',
      dataIndex: 'rolecname',
      fixed: 'right',
      title: '角色中文名',
    },
    {
      key: 'remark',
      dataIndex: 'remark',
      fixed: 'right',
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

/*
*
*     validateStatus?: "" | "success" | "error" | "warning" | "validating" | undefined,
    validate?: boolean,
* */
/*新增角色的配置信息*/
export const roleManageListNewData = [
  {
    id: 'baseInfo',
    title: '角色基本信息',
    data: [
      {
        id: 'rolename',
        name: '角色名',
        placeholder: '请输入角色名',
        type: 'input',
        checkType: 'required',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: true,
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
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: false,
        value: '',
        options: [],
        expand: {},
        jpath: 'rolecname'
      },
      {
        id: 'disabled',
        name: '是否禁用',
        placeholder: '',
        // type: 'radio',
        type: 'switch',
        checkType: 'required',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: false,
        value: true,
        expand: {},
        jpath: 'disabled'
      },
      {
        id: 'remark',
        name: '角色备注',
        placeholder: '请选择角色备注',
        type: 'textarea',
        checkType: '',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: false,
        value: '',
        options: [],
        expand: {},
        jpath: 'remark'
      },
      {
        id: 'authorizeids',
        name: '授权页面',
        placeholder: '',
        type: 'treeSelect',
        checkType: '',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: true,
        editDisabled: false,
        newShow: false,
        editShow: true,
        value: [],
        options: [],
        expand: {},
        jpath: 'authorizeids'
      }
    ]
  }
];
