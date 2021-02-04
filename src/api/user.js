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

/*
export function getUserList(entity, fields, filter, pageSize, pageNo) {
  return request({
    url: 'crud/listQuery',
    method: 'post',
    data: { 'mainEntity': entity, 'fieldsList': fields, 'filter': filter, 'pageSize': pageSize, 'pageNo': pageNo }
  })
}
*/

export function getDepartmentTree() {
  return request({
    url: 'department/treeData',
    method: 'get',
  })
}

