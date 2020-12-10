import request from '@/utils/request'

export function getAccountList(params) {
  return request({
    url: '/api/account/all',
    method: 'get',
    params,
  })
}
export function getAccountById(Id) {
  return request({
    url: `/api/Account/${Id}`,
    method: 'get',
  })
}
export function updatePasswordAccount(data, id) {
  return request({
    url: `api/Account/Password/${id}`,
    method: 'put',
    data,
  })
}
export function insertAccount(data) {
  return request({
    url: '/api/account',
    method: 'post',
    data,
  })
}
export function updateAccount(data, id) {
  return request({
    url: `api/account/${id}`,
    method: 'put',
    data,
  })
}
export function deleteAccount(id) {
  return request({
    url: `api/account/${id}`,
    method: 'delete',
  })
}
