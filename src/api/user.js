import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post',
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

export function saveRoleData(roleDTO) {
  return request({
    url: 'role/saveRole',
    method: 'post',
    data: roleDTO
  })
}

