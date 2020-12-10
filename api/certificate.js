import request from '@/utils/request'

const baseUrl = '/api/certificate'

export function getCertificateById(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get',
  })
}

export function addCertificate(data) {
  return request({
    url: baseUrl,
    method: 'post',
    data,
  })
}

export function updateCertificate(data, id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCertificate(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete',
  })
}

export function swapCertificateOrder(data) {
  return request({
    url: `${baseUrl}/swap`,
    method: 'put',
    data,
  })
}
