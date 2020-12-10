import request from '@/utils/request'

export function getProjectById(id) {
  return request({
    url: `/api/project/person/${id}`,
    method: 'get',
  })
}
export function getTechnology(id) {
  return request({
    url: `/api/technology/${id}/person`,
    method: 'get',
  })
}

export function insertProject(project) {
  return request({
    url: '/api/project',
    data: project,
    method: 'post',
  })
}
export function insertListTechnology(technology) {
  return request({
    url: '/api/ProjectTechnology',
    data: technology,
    method: 'post',
  })
}
export function updateProject(id, project) {
  return request({
    url: `/api/project/${id}`,
    data: project,
    method: 'put',
  })
}
export function updateListTechnology(id, technology) {
  return request({
    url: `/api/ProjectTechnology/${id}`,
    data: technology,
    method: 'put',
  })
}
export function deleteProject(id) {
  return request({
    url: `/api/project/${id}`,
    method: 'delete',
  })
}
export function swapOrder(order) {
  return request({
    url: `/api/project/Swap`,
    method: 'put',
    data: order,
  })
}
