import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/comment/list',
    method:'get',
    params:params
  })
}

export function toExamine(data) {
  return request({
    url:'/comment/approval',
    method:'post',
    data:data
  })
}

export function Delete(data) {
  return request({
    url:'/comment/delete?id='+data.id,
    method:'post',
  })
}

