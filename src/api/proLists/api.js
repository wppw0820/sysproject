import { axios } from '@/utils/request'
import { getApi} from '@/api/baseUrl'
import { Script } from 'vm'
const api = getApi({
    getLists: '/tinker/project', // 获取所有项目和单个项目地址
    del: '/tinker/project', // 删除某个项目地址
    createPro: '/tinker/project',// 创建项目的地址
}) 
export function getLists(parameter){
  return axios({
    url:api.getLists,
    method:'get',
    params:parameter
  })
}
export function delPro(parameter){
  return axios({
    url:api.del,
    method:'delete',
    params:parameter
  })
}
export function createPro(parameter){
  return axios({
    url:api.del,
    method:'post',
    data:parameter
  })
}
