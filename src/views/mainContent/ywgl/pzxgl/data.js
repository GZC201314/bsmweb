

export const tableData = {
  tHead: [
    {
      key: 'id',
      title: '配置项ID',
      fixed: 'right',
      dataIndex: 'id',
    },
    {
      key: 'name',
      dataIndex: 'name',
      fixed: 'right',
      title: '配置名',
    },
    {
      key: 'value',
      dataIndex: 'value',
      fixed: 'right',
      title: '配置值',
    },
    {
      key: 'type',
      dataIndex: 'type',
      title: '配置类型',
      fixed: 'right',
    },
    {
      key: 'remark',
      dataIndex: 'remark',
      fixed: 'right',
      title: '备注',
      slot: 'remarkSlot',
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
export const configManageListNewData = [
  {
    id: 'baseInfo',
    title: '配置项基本信息',
    data: [
      {
        id: 'id',
        name: '配置项Id',
        placeholder: '请输入配置项Id',
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
        name: '配置项名',
        placeholder: '请输入配置项名',
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
        jpath: 'name'
      },
      {
        id: 'value',
        name: '配置项值',
        placeholder: '请输入配置项值',
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
        jpath: 'value'
      },
      {
        id: 'type',
        name: '配置项类型',
        placeholder: '请输入配置项类型',
        // type: 'radio',
        type: 'input',
        checkType: 'required',
        validateStatus:'',
        validate:false,
        info:'',
        newDisabled: false,
        editDisabled: false,
        newShow: true,
        editShow: true,
        value: true,
        expand: {},
        jpath: 'type'
      },
      {
        id: 'remark',
        name: '配置项备注',
        placeholder: '请选择配置项备注',
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
