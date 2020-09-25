import request from '@/utils/request'
//查询退款订单
export function fetchList(params) {
  return request({
    url:'/orderRefund/list',
    method:'post',
    params:params
  })
}
//查询退款原因选项
export function fetchReason() {
	return request({
		url:'/refundRejectOption/list',
		method:'get',

	})
}
//退款订单详情
export function getApplyDetail(id) {
  return request({
    url:'/orderRefund/detail/'+id,
    method:'get'
  });
}
//退款审核
export function reject(data) {
  return request({
    url:'/orderRefund/reject',
    method:'post',
    data:data
  });
}
//退款审核
export function release(data) {
  return request({
    url:'/orderRefund/release',
    method:'post',
    data:data
  });
}
