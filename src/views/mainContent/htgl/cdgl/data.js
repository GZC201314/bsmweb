export const tableData = {
    tHead: [
        // {
        //     key: 'pageid',
        //     title: '页面ID',
        //     fixed: 'right',
        //     dataIndex: 'pageid',
        // },
        {
            key: 'pagekey',
            dataIndex: 'pagekey',
            fixed: 'right',
            title: '页面Key',
        },
        {
            key: 'parentkey',
            dataIndex: 'parentkey',
            fixed: 'right',
            title: '父节点Key',
        },
        {
            key: 'pagepath',
            dataIndex: 'pagepath',
            title: '页面路径',
            fixed: 'right',
        },
        {
            key: 'title',
            dataIndex: 'title',
            fixed: 'right',
            title: '页面名',
        },
        {
            key: 'icontype',
            dataIndex: 'icontype',
            fixed: 'right',
            title: '图标类型',
        },
        {
            key: 'icon',
            dataIndex: 'icon',
            fixed: 'right',
            title: '页面图标',
            slot: 'icon'
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
export const cdglManageListNewData = [
    {
        id: 'baseInfo',
        title: '菜单基本信息',
        data: [
            {
                id: 'pageid',
                name: '页面id',
                placeholder: '',
                type: 'input',
                checkType: 'required',
                validateStatus: '',
                validate: false,
                info: '',
                newDisabled: true,
                editDisabled: true,
                newShow: false,
                editShow: true,
                value: '',
                options: [],
                expand: {},
                jpath: 'pageid'
            },
            {
                id: 'pagekey',
                name: '页面Key',
                placeholder: '请输入页面Key',
                type: 'input',
                checkType: 'required|pageKeyUnique',
                validateStatus: '',
                validate: false,
                info: '',
                newDisabled: false,
                editDisabled: true,
                newShow: true,
                editShow: false,
                value: '',
                options: [],
                /*TODO 在这边设置校验保证输入的pagekey唯一*/
                expand: {},
                jpath: 'pagekey'
            },
            {
                id: 'parentkey',
                name: '父节点Key',
                placeholder: '',
                type: 'select',
                checkType: '',
                validateStatus: '',
                validate: false,
                info: '',
                newDisabled: false,
                editDisabled: true,
                newShow: true,
                editShow: true,
                value: '',
                /*这边在页面初始化的时候从后台取到父节点渲染*/
                options: [],
                expand: {
                    showSearch: true,
                },
                jpath: 'parentkey'
            },
            {
                id: 'pagepath',
                name: '页面路径',
                placeholder: '',
                // type: 'radio',
                type: 'input',
                /*URL验证，如果选择的父节点是0的话这边的验证可以为空*/
                checkType: '',
                validateStatus: '',
                validate: false,
                info: '',
                newDisabled: false,
                editDisabled: false,
                newShow: true,
                editShow: true,
                value: '',
                expand: {},
                jpath: 'pagepath'
            },
            {
                id: 'title',
                name: '页面名',
                placeholder: '请输入页面名',
                type: 'input',
                checkType: 'required',
                validateStatus: '',
                validate: false,
                info: '',
                newDisabled: false,
                editDisabled: false,
                newShow: true,
                editShow: true,
                value: '',
                options: [],
                expand: {},
                jpath: 'title'
            },
            {
                id: 'icon',
                name: '节点图标',
                placeholder: '请输入节点图标',
                type: 'select',
                checkType: '',
                validateStatus: '',
                validate: false,
                info: '',
                newDisabled: false,
                editDisabled: false,
                newShow: true,
                editShow: true,
                value: '',
                options: [],
                expand: {
                    showSearch: true,
                    defaultActiveFirstOption: false,
                    showArrow: false,
                    filterOption: false,
                    notFoundContent: null,
                },
                jpath: 'icon'
            },
        ]
    }
];
