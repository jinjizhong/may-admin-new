import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
/* 获取当前用户信息 */
export function getInfo () {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout () {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function fetchList (params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function createAdmin (data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data: data
  })
}
// 创建后台用户
export function newAdmin (data) {
  return request({
    url: '/admin/create',
    method: 'post',
    data: data
  })
}
export function updateAdmin (id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}
/* 更新状态 */
export function updateStatus (id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin (id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

export function getRoleByAdmin (id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function allocRole (data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}

export function getCaptcha(data) {
  return request({
    url: `/admin/forgetPassword/getCaptcha?mobile=${data}`,
    method: 'get'
  })
}
/* 获取指定用户信息 */
export function getInfoById (id) {
  return request({
    url: '/admin/' + id,
    method: 'get',
  })
}

export function setNewPassword(data) {
  return request({
    url: '/admin/forgetPassword/setNewPassword',
    method: 'post',
    data: data
  })
}
/* 分页获取所有权限列表 */
export function getPermission (params) {
  return request({
    url: '/permission/list',
    method: 'post',
    data: params
  })
}

/* 修改用户密码 */
export function updatePassword (params) {
  return request({
    url: '/admin/updatePassword',
    method: 'post',
    data: params
  })
}