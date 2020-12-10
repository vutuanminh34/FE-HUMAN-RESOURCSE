import request from '@/utils/request'
const baseUrl = '/api/person'

export function getPersonById(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get',
  })
}

export function createPerson(data) {
  return request({
    url: baseUrl,
    method: 'post',
    data,
  })
}

export function updatePerson(id, data) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'put',
    data,
  })
}

export function getListPerson(params) {
  return request({
    url: baseUrl,
    method: 'get',
    params,
  })
}

export function deletePerson(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete',
  })
}

export function updateDescription(personId, data) {
  return request({
    url: `${baseUrl}/description/${personId}`,
    method: 'put',
    data,
  })
}

export function downloadCV(personId, type) {
  return request({
    url: `api/file/${personId}?type=${type}`, // type: pdf/excel
    method: 'get',
  })
}

// import excel file
export function importCV(data) {
  return request({
    url: `api/file`,
    method: 'post',
    data,
  })
}

export function updateCV(personId, data) {
  return request({
    url: `api/file/${personId}`,
    method: 'put',
    data,
  })
}
export function downloadCVTemplate() {
  return request({
    url: `api/file`,
    method: 'get',
  })
}
