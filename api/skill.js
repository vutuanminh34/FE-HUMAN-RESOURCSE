import request from '@/utils/request'

export function getSkillByPersonId(id) {
  return request({
    url: `/api/person/${id}/skill`,
    method: 'get',
  })
}

export function createSkill(data) {
  return request({
    url: '/api/skill',
    method: 'post',
    data,
  })
}

export function updateSkill(id, data) {
  return request({
    url: `/api/skill/${id}`,
    method: 'put',
    data,
  })
}

export function deleteSkill(id) {
  return request({
    url: `/api/skill/${id}`,
    method: 'delete',
  })
}
export function swapOrder(data) {
  return request({
    url: '/api/skill/swap',
    method: 'put',
    data,
  })
}
