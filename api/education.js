import request from '@/utils/request'

export function getEducationByPersonId(idPerson) {
  return request({
    url: `/api/Education/${idPerson}`,
    method: 'get',
  })
}
export function updateEducation(data) {
  return request({
    url: `/api/Education/${data.Id}`,
    method: 'put',
    data,
  })
}
export function swapOrder(data) {
  return request({
    url: '/api/Education/swap',
    method: 'put',
    data,
  })
}
export function createEducation(data) {
  return request({
    url: '/api/education',
    method: 'post',
    data,
  })
}
export function deleteEducation(idDelete) {
  return request({
    url: `/api/Education/${idDelete}`,
    method: 'delete',
  })
}
