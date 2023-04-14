

export const tableData = {
  tHead: [
    {
      key: 'id',
      title: '流程实例ID',
      fixed: 'right',
      dataIndex: 'id',
    },
    {
      key: 'name',
      dataIndex: 'name',
      fixed: 'right',
      title: '流程名',
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      fixed: 'right',
      title: '创建时间',
    },
    {
      key: 'curState',
      dataIndex: 'curState',
      title: '当前状态',
      fixed: 'right',
    },
    {
      key: 'isSuspended',
      dataIndex: 'isSuspended',
      title: '是否激活',
      fixed: 'right',
      slot: 'isSuspended',
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
        id: 'roleid',
        name: '角色id',
        placeholder: '请输入角色名',
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
        jpath: 'roleid'
      },
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
        editShow: true,
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
        editShow: true,
        value: true,
        // options: [
        //   {
        //     value: true,
        //     name: '禁用'
        //   },
        //   {
        //     value: false,
        //     name: '启用'
        //   }
        // ],
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
        editShow: true,
        value: '',
        options: [],
        expand: {},
        jpath: 'remark'
      }
    ]
  }
];
