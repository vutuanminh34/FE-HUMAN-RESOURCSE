import request from '@/utils/request'

export function getTechnologyList(params) {
  return request({
    url: '/api/technology',
    method: 'get',
    params,
  })
}
export function updateTechnology(data) {
  return request({
    url: `/api/technology/${data.Id}`,
    method: 'put',
    data,
  })
}
export function createTechnology(data) {
  return request({
    url: '/api/technology',
    method: 'post',
    data,
  })
}
export function deleteTechnology(idDelete) {
  return request({
    url: `/api/technology/${idDelete}`,
    method: 'delete',
  })
}
