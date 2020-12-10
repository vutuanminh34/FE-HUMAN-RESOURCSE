import request from '@/utils/request'

export function getWorkHistoryByPersonId(id) {
  return request({
    url: `/api/workhistory/person/${id}`,
    method: 'get',
  })
}

export function createWorkHistory(data) {
  return request({
    url: '/api/workhistory',
    method: 'post',
    data,
  })
}

export function updateWorkHistory(id, data) {
  return request({
    url: `/api/workhistory/${id}`,
    method: 'put',
    data,
  })
}

export function deleteWorkHistory(id) {
  return request({
    url: `/api/workhistory/${id}`,
    method: 'delete',
  })
}

export function swapOrder(data) {
  return request({
    url: '/api/workhistory/swap',
    method: 'put',
    data,
  })
}
