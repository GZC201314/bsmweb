import Mock from 'mockjs'
// mock方法,详细的可以看官方文档
const Random = Mock.Random

export default [
    {
        url: '/userAction!login.action',
        type: 'post',
        response: config => {
            return {
            msg:"登录成功.",
                obj:{
                    isFaceValid:0,
                    refreshToken:"692f8d54-78f6-49d1-94cf-53edc5dfb163",
                    role:0,
                    token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1ZXJqd3QiLCJleHAiOjE2MzA0ODYzNTYsImlhdCI6MTYzMDQ4NjA1NiwidXNlcm5hbWUiOiJhZG1pbiJ9.5fExCHUzgqm_BcLe9reXJkM3omrWTmPRz2psHumV1ok",
                    userName:"admin",
                    userlog:"http://114.116.252.220:8080/BookStoreManager/upload/5f140e8a-0d64-4b3e-a0b4-59de3dd29f46.png"
                },
                success:true
            }
        }
    },
    {
        url: '/userAction!check.action',
        type: 'get',
        response: () => {
            return {
                data: Random.image('200x100', '#50B347', Random.title(1))
            }
        }
    }
]
