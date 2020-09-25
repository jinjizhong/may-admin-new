import request from '@/utils/request'
//查询今日概况
export function getTodaySummary() {
  return request({
    url:'/index/todaySummary/query',
    method:'get',

  })
}
//查询Top排行榜
export function getTopRanking() {
	return request({
		url:'/index/topRanking/query',
		method:'get',

	})
}
//查询待处理事项
export function geWaitToHandle() {
	return request({
		url:'/index/waitToHandle/query',
		method:'get',

	})
}

