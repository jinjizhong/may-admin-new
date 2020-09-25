import request from '@/utils/request'
//查询配件
export function fetchList(params) {
  return request({
    url:'/product/list',
    method:'get',
    params:params
  })
}
//创建配件
export function changeCreate(data) {
  return request({
    url: '/product/fitting/create',
    method: 'post',
    data: data
  })
}
//修改配件
export function changeUpdate(data) {
  return request({
    url:'/product/fitting/update',
    method:'post',
    data:data
  })
}