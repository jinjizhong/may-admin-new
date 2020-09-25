import request from '@/utils/request'
export function policy () {
  return request({
    url: '/aliyun/oss/policy',
    method: 'get',
  })
}
/* 查询积分设置 */
export function inteQuery () {
  return request({
    url: '/setting/integration/query',
    method: 'get',
  })
}
/* 修改积分设置 */
export function inteUpdate (params) {
  return request({
    url: '/setting/integration/update',
    method: 'post',
    data: params
  })
}
