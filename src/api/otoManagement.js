import request from '@/utils/request'
import {getExel} from '@/utils/exportExcal'

//查询门店
export function fetchList(params) {
  return request({
    url:'/store/list',
    method:'get',
    params:params
  })
}
//修改门店
export function updateStatus(data) {
  return request({
    url:'/store/update',
    method:'post',
    data:data
  })
}
//修改门店状态
export function changeStatus(data) {
  return request({
    url:'/store/changeStatus',
    method:'post',
    data:data
  })
}
//导出门店
export function Export(params) {
    return request({
      url:'/store/export',
      method:'get',
      params:params
    })
  }
//门店详情
  export function getStoreInfo(id) {
    return request({
      url:'/store/info/'+id,
      method:'get',
    })
  }
  //同步门店数据
  export function storeSync(data) {
    return request({
      url:'/store/sync',
      method:'post',
      data:data
    })
  }
  //导出门店
  export function exportStoreList(params) {
    return getExel('/store/export',params,'GET')
  }