import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'user/logout',
    method: 'post',
  })
}

export function deleteUserById(userId) {
  return request({
    url: 'user/deleteUser',
    method: 'post',
    params: { userId }
  })
}

export function getDepartmentTree() {
  return request({
    url: 'department/treeData',
    method: 'get',
  })
}

export function getBlankRoleData() {
  return request({
    url: 'role/getBlankRoleData',
    method: 'get',
  })
}

export function getRoleData(roleId) {
  return request({
    url: 'role/getRoleData',
    method: 'get',
    params: { roleId }
  })
}


export function saveRoleData(roleDTO) {
  return request({
    url: 'role/saveRole',
    method: 'post',
    data: roleDTO
  })
}

export function deleteRoleById(roleId) {
  return request({
    url: 'role/deleteRole',
    method: 'post',
    params: { roleId }
  })
}

