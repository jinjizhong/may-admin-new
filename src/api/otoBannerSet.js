import request from '@/utils/request'
//查询bannerList
export function getBanner () {
  return request({
    url: '/banner/bannerList',
    method: 'get',
  })
}
//创建轮播图
export function bannerCreate (params) {
  return request({
    url: '/banner/create',
    method: 'post',
    params: params
  })
}
//修改轮播图
export function bannerUpdate (params) {
  return request({
    url: '/banner/update',
    method: 'post',
    params: params
  })
}

//查询生效轮播图
export function bannerEffective () {
  return request({
    url: '/banner/effective',
    method: 'get',
  })
}
//查询待生效轮播图
export function bannerIneffective () {
  return request({
    url: '/banner/ineffective',
    method: 'get',
  })
}
//立即发布/确认时间-轮播图
export function bannerPublish (params) {
  console.log(params)
  return request({
    url: '/banner/publish',
    method: 'post',
    data: params
  })
}
//删除轮播图
export function bannerDelete (params) {
  return request({
    url: '/banner/delete',
    method: 'post',
    data: params
  })
}
/* 文件删除 */
export function deleteFile (params) {
  return request({
    url: '/minio/delete',
    method: 'post',
    params: params
  })
}