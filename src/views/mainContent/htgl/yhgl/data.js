

export const tableData = {
  tHead: [
    {
      key: 'username',
      dataIndex: 'username',
      fixed: 'right',
      title: '用户名',
    },
    {
      key: 'usericon',
      dataIndex: 'usericon',
      fixed: 'right',
      slot: 'iconRender',
      title: '用户头像',
    },
    {
      key: 'emailaddress',
      dataIndex: 'emailaddress',
      fixed: 'right',
      title: '邮箱',
    },
    {
      key: 'createtime',
      dataIndex: 'createtime',
      title: '创建时间',
      fixed: 'right',
    },
    {
      key: 'lastmodifytime',
      dataIndex: 'lastmodifytime',
      title: '最后修改时间',
      fixed: 'right',
    },
    {
      key: 'roleid',
      dataIndex: 'roleid',
      title: '角色',
      slot: 'roleRender',
      fixed: 'right',
    },
    {
      key: 'isfacevalid',
      dataIndex: 'isfacevalid',
      title: '人脸注册',
      slot: 'regRender',
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
export const userManageListNewData =
    {
      id: 'baseInfo',
      title: '用户基本信息',
      data: []
    };