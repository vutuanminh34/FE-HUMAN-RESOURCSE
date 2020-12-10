import axios from 'axios'
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  removeToken,
  removeRefreshToken,
  removeAccountInfo,
  setAccountInfo,
} from '@/utils/auth'
// import { ERROR_LOGIN_OTHER_DEVICE, ERROR_STATUS_USER_CHANGED } from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.API_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})
// request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 403) {
      return Promise.reject(
        new Error('You are not authorized to perform this function')
      )
    }
    if (error.response.status === 400) {
      return Promise.reject(new Error(error.response.data.Message))
    }

    // do something with request error
    if (error.response.status === 401) {
      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      axios.interceptors.response.eject(service)
      return service({
        url: '/api/Account/refreshtoken',
        method: 'post',
        data: { refreshToken: getRefreshToken() },
      })
        .then((res) => {
          const { AccessToken, RefreshToken, AccountInfo } = res.data
          setToken(AccessToken)
          setRefreshToken(RefreshToken)
          setAccountInfo(AccountInfo)
          error.response.config.headers.authorization = `Bearer ${AccessToken}`
          return axios(error.response.config)
        })
        .catch((error) => {
          removeToken()
          removeRefreshToken()
          removeAccountInfo()
          location.reload()
          return Promise.reject(error)
        })
    }

    if (
      error.response &&
      error.response.config &&
      error.response.config.responseType &&
      error.response.config.responseType === 'blob'
    ) {
      return error.response.data.text().then((v) => {
        return Promise.reject(
          new Error(JSON.parse(v).message || 'Error when returning Blob format')
        )
      })
    }

    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message
    // if (
    //   [ERROR_LOGIN_OTHER_DEVICE, ERROR_STATUS_USER_CHANGED].includes(
    //     errorMessage
    //   )
    // ) {
    //   removeToken()
    //   removeRefreshToken()
    //   setTimeout(() => location.reload(), 2000)
    //   const mLogout = {
    //     [ERROR_LOGIN_OTHER_DEVICE]:
    //       'The account is logged in on another device, the system will log out by itself',
    //     [ERROR_STATUS_USER_CHANGED]:
    //       'The account has been deactivated, the system will automatically log out',
    //   }
    //   return Promise.reject(new Error(mLogout[errorMessage]))
    // }
    return Promise.reject(new Error(errorMessage || 'An error occurred'))
  }
)

export default service
