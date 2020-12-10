import request from '@/utils/request'

export function validateCaptcha(params) {
  return request({
    url: '/api/account/captcha',
    method: 'post',
    params,
  })
}
