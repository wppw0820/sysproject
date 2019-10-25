import { axios } from '@/utils/request'
import { getApi} from '@/api/baseUrl'
const api = {
    login: '/tinker/system/login' // 登录接口地址
}
export function getLogin(parameter){
  return axios({
    url:api.login,
    method:'post',
    data:parameter,
  })
}
