//配置本地接口地址
import config from '../config/globalConfig'

const host = config.host

export default {
  login: `${host}/userAction!login.action`,
}
