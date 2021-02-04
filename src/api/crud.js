import request from '@/utils/request'
import en from "element-ui/src/locale/lang/en";

export function refFieldQuery(entity, field, pageNo, pageSize) {
  return request({
    url: 'crud/refFieldQuery',
    method: 'get',
    params: {entity, 'refField': field, pageNo, pageSize},
  })
}

export function formCreateQuery(entity) {
  return request({
    url: 'crud/formCreateQuery',
    method: 'get',
    params: {entity},
  })
}

export function formUpdateQuery(entity, id) {
  return request({
    url: 'crud/formUpdateQuery',
    method: 'get',
    params: {entity, id},
  })
}

export function saveRecord(entity, id, formModel) {
  return request({
    url: 'crud/saveRecord',
    method: 'post',
    params: {entity, id},
    data: formModel,
  })
}

export function getDataList(entity, fields, filter, pageSize, pageNo) {
  return request({
    url: 'crud/listQuery',
    method: 'post',
    data: { 'mainEntity': entity, 'fieldsList': fields, 'filter': filter, 'pageSize': pageSize, 'pageNo': pageNo }
  })
}

export function initDataList(entity) {
  return request({
    url: 'crud/initDataList',
    method: 'get',
    params: {entity},
  })
}
