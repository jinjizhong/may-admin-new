import request from '@/utils/request'
//查询分类
export function fetchList(params) {
  return request({
    url:'/productCategory/list',
    method:'get',
    params:params
  })
}
//创建套餐分类
export function changeCreate(data) {
  return request({
    url: 'productCategory/create',
    method: 'post',
    data: data
  })
}
//修改分类
export function updateStatus(data) {
  return request({
    url:'/productCategory/update',
    method:'post',
    data:data
  })
}
//修改分类状态
export function changeStatus(data) {
  return request({
    url:'/productCategory/changeStatus',
    method:'post',
    data:data
  })
}
