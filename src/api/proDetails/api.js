import { axios } from '@/utils/request'
import { getApi} from '@/api/baseUrl'
import { Script } from 'vm'
const api = getApi({
    getAllIssue:'/tinker/issue', // 获取所有问题地址
    getIssue: '/tinker/issue/', // 后面restful跟id
    getIssuePath:'/tinker/issue/path',// 获取问题路径
    issueStat: '/tinker/issue/stat', // 项目问题统计
    getSourceCode: '/tinker/project/source', // 获取项目源码
    downloadReport: '/tinker/project/report', // 下载项目报告
}) 
export function getAllIssue(parameter){
  return axios({
    url:api.getAllIssue,
    method:'get',
    params:parameter
  })
}
export function getIssue(parameter){
  return axios({
    url:api.getIssue,
    method:'get',
    params:parameter
  })
}
export function getIssuePath(parameter){
  return axios({
    url:api.getIssuePath,
    method:'get',
    params:parameter
  })
}
export function issueStat(parameter){
  return axios({
    url:api.issueStat,
    method:'get',
    params:parameter
  })
}
export function getSourceCode(parameter){
  return axios({
    url:api.getSourceCode,
    method:'get',
    params:parameter
  })
}
export function downloadReport(parameter){
  return axios({
    url:api.downloadReport,
    method:'get',
    params:parameter
  })
}
