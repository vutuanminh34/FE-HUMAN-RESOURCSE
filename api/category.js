import request from '@/utils/request'

const baseUrl = '/api/category'

export function getCategoryList(params) {
  return request({
    url: baseUrl,
    method: 'get',
    params,
  })
}

export function addCategory(data) {
  return request({
    url: baseUrl,
    method: 'post',
    data,
  })
}

export function updateCategory(data, id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCategory(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete',
  })
}
