import request from '@/utils/request'
import {getExel} from '@/utils/exportExcal'

//查询套餐
export function fetchList (params) {
  return request({
    url: '/package/list',
    method: 'get',
    params: params
  })
}
//修改套餐
export function changeStatus (data) {
  return request({
    url: '/package/changeStatus',
    method: 'post',
    data: data
  })
}
//创建套餐
export function changeCreate (data) {
  return request({
    url: 'package/create',
    method: 'post',
    data: data
  })
}
//修改套餐
export function updateStatus (data) {
  return request({
    url: '/package/update',
    method: 'post',
    data: data
  })
}
//查询套餐分类
export function productCategoryList () {
  return request({
    url: '/packageCategory/list',
    method: 'get',

  })
}
//修改套餐分类
export function categoryUpdate (params) {
  return request({
    url: '/packageCategory/update',
    method: 'post',
    data: params
  })
}
//添加套餐分类
export function categoryAdd (params) {
  return request({
    url: '/packageCategory/create',
    method: 'post',
    data: params
  })
}
//修改套餐分类状态
export function changePackStatus (params) {
  return request({
    url: '/packageCategory/changeStatus',
    method: 'post',
    data: params
  })
}
//查询配件分类
export function productList (params) {
  return request({
    url: '/product/list',
    method: 'get',
    params: params
  })
}
//查询门店列表
export function storeList (params) {
  return request({
    url: '/store/list',
    method: 'get',
    params: params
  })
}
//修改上架状态
export function changeSaleStatus (data) {
  return request({
    url: '/package/changeSaleStatus',
    method: 'post',
    data: data
  })
}
//修改推荐状态
export function changeRecommendStatus (data) {
  return request({
    url: '/package/changeRecommendStatus',
    method: 'post',
    data: data
  })
}
//套餐导出
export function packageExport (params) {
  return getExel('/package/export',params,'GET')
}
//查询详情
export function packageGet (params) {
  return request({
    url: '/package/get',
    method: 'post',
    params: params
  })
}
//上传图片
export function minioUpload (params) {
  return request({
    url: '/minio/upload',
    method: 'post',
    params: params
  })
}