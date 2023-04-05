

export const tableData = {
  tHead: [
    {
      key: 'id',
      title: '流程id',
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
      key: 'createtime',
      dataIndex: 'createtime',
      fixed: 'right',
      title: '创建时间',
    },
    {
      key: 'version',
      dataIndex: 'version',
      fixed: 'right',
      title: '版本',
    },
    {
      key: 'key',
      dataIndex: 'key',
      fixed: 'right',
      title: '流程主键',
    },
    {
      key: 'resourceName',
      dataIndex: 'resourceName',
      fixed: 'right',
      title: '流程资源',
      slot: 'substr',
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