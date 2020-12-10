import request from '@/utils/request'

export function login(userInfo) {
  return request({
    url: '/api/Account/login',
    method: 'post',
    data: userInfo,
  })
}
