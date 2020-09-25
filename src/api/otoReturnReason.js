import request from '@/utils/request'
//查询退款原因选项
export function fetchList(params) {
  return request({
    url:'/refundReasonOption/list',
    method:'get',
    params:params
  })
}
//删除退款原因选项
export function deleteReason(id) {
	return request({
		url:'/refundReasonOption/delete/'+id,
		method:'post'
	})
}
//修改退款原因选项状态
export function changeStatus(data) {
  return request({
    url:'/refundReasonOption/changeStatus',
    method:'post',
    data:data
  })
}
//创建退款原因选项
export function addReason(data) {
  return request({
    url:'/refundReasonOption/create',
    method:'post',
    data:data
  })
}
//修改退款原因选项
export function updateReason(data) {
  return request({
    url:'/refundReasonOption/update',
    method:'post',
    data:data
  })
}

