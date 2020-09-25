import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/member/list',
    method:'get',
    params:params
  })
}

export function memberOrderList(params) {
  return request({
    url:'/member/order/list',
    method:'get',
    params:params
  })
}

