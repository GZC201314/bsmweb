

export const tableData = {
  tHead: [
    {
      key: 'sourcename',
      title: '数据源名',
      fixed: 'right',
      dataIndex: 'sourcename',
    },
    {
      key: 'sourcetype',
      dataIndex: 'sourcetype',
      fixed: 'right',
      title: '数据源类型',
      slot:'datasourceType'
    },
    {
      key: 'username',
      dataIndex: 'username',
      fixed: 'right',
      title: '用户名',
    },
    {
      key: 'driveurl',
      dataIndex: 'driveurl',
      title: '驱动地址',
      fixed: 'right',
      slot: "driveUrlrender"
    },
    {
      key: 'sourceurl',
      dataIndex: 'sourceurl',
      fixed: 'right',
      title: '数据源地址',
      slot: "dataSourceUrlrender",
    },
    {
      key: 'description',
      dataIndex: 'description',
      fixed: 'right',
      title: '描述',
    },
    {
      key: 'pass',
      dataIndex: 'pass',
      fixed: 'right',
      title: '测试通过',
      slot: "isPass"
    },
    {
      key: 'driveclass',
      dataIndex: 'driveclass',
      title: '驱动类',
      fixed: 'right',
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
export const sjypzManageListNewData =
  {
    id: 'baseInfo',
    title: '数据源基本信息',
    data: []
  };
