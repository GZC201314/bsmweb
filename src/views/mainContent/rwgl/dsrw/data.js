export const tableData = {
    tHead: [
        {
            key: 'jobName',
            title: '任务名',
            fixed: 'right',
            dataIndex: 'jobName',
        },
        {
            key: 'jobGroup',
            dataIndex: 'jobGroup',
            fixed: 'right',
            title: '任务组',
        },
        {
            key: 'taskType',
            dataIndex: 'cron',
            fixed: 'right',
            title: '任务类型',
            slot: "taskTypeRender"
        },
        {
            key: 'cron',
            dataIndex: 'cron',
            fixed: 'right',
            title: 'cron表达式',
        },
        {
            key: 'jobClass',
            dataIndex: 'jobClass',
            title: '任务类',
            fixed: 'right',
        },
        {
            key: 'nextFireTime',
            dataIndex: 'nextFireTime',
            fixed: 'right',
            title: '下次执行时间',
        },
        {
            key: 'jobDescription',
            dataIndex: 'jobDescription',
            fixed: 'right',
            title: '描述',
        },

        {
            key: 'state',
            dataIndex: 'state',
            fixed: 'right',
            title: '状态',
            slot: 'state',
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
        title: '定时任务基本信息',
        data: []
    };
