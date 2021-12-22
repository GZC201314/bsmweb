

export const tableData = {
  tHead: [
    {
      key: 'id',
      title: 'id',
      dataIndex: 'id',
    },
    {
      key: 'rolename',
      dataIndex: 'rolename',
      title: '角色名',
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
