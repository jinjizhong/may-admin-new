import request from '@/utils/request'

export function fetchList (params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

// 添加/修改角色
export function createOrUpdate (params) {
  return request({
    url: '/role/createOrUpdate',
    method: 'post',
    data: params
  })
}
// 编辑角色获取详情
export function editGetMore (params) {
  return request({
    url: '/role/edit',
    method: 'post',
    data: params
  })
}
export function createRole (data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

export function updateRole (id, data) {
  return request({
    url: '/role/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus (id, params) {
  return request({
    url: '/role/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteRole (data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data: data
  })
}

export function fetchAllRoleList () {
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}

export function listMenuByRole (roleId) {
  return request({
    url: '/role/listMenu/' + roleId,
    method: 'get'
  })
}

export function listResourceByRole (roleId) {
  return request({
    url: '/role/listResource/' + roleId,
    method: 'get'
  })
}

export function allocMenu (data) {
  return request({
    url: '/role/allocMenu',
    method: 'post',
    data: data
  })
}

export function allocResource (data) {
  return request({
    url: '/role/allocResource',
    method: 'post',
    data: data
  })
}
