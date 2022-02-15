

export const tableData = {
  tHead: [
    {
      key: 'isbn',
      title: 'ISBN',
      fixed: 'right',
      dataIndex: 'isbn',
    },
    {
      key: 'name',
      dataIndex: 'name',
      fixed: 'right',
      title: '图书名',
      slot: 'nameRender'
    },
    {
      key: 'image',
      dataIndex: 'image',
      fixed: 'right',
      title: '图书封面',
      slot: 'bookImage'
    },
    // {
    //   key: 'seriesname',
    //   dataIndex: 'seriesname',
    //   fixed: 'right',
    //   title: '丛书',
    //   slot: 'seriesnameRender'
    // },
    {
      key: 'author',
      dataIndex: 'author',
      title: '作者',
      fixed: 'right',
      slot: 'authorRender'
    },
    // {
    //   key: 'translate',
    //   dataIndex: 'translate',
    //   title: '翻译作者',
    //   fixed: 'right',
    //   slot: 'translateRender'
    // },
    {
      key: 'introduction',
      dataIndex: 'introduction',
      fixed: 'right',
      title: '介绍',
      slot: "bookIntroduction",
    },
    {
      key: 'publisher',
      dataIndex: 'publisher',
      fixed: 'right',
      title: '出版社',
      slot: "publisherRender",
    },
    {
      key: 'publishingtime',
      dataIndex: 'publishingtime',
      fixed: 'right',
      title: '出版时间',
    },
    {
      key: 'score',
      dataIndex: 'score',
      title: '评分',
      fixed: 'right',
      slot: "scoreRender",
    },
    {
      key: 'folio',
      dataIndex: 'folio',
      title: '页数',
      fixed: 'right',
    },
    {
      key: 'size',
      dataIndex: 'size',
      title: '装订',
      fixed: 'right',
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: '价格',
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
/*新增角色的配置信息*/
export const bookManageListNewData =
  {
    id: 'baseInfo',
    title: '图书基本信息',
    data: []
  };
