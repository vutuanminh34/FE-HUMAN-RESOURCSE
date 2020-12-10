import Cookies from 'js-cookie'

const TokenKey = 'AccessToken'
const refreshTokenKey = 'RefreshToken'
const accountInfo = 'accountInfo'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshTokenKey, token) // 1 day
}

export function removeRefreshToken() {
  return Cookies.remove(refreshTokenKey)
}
export function setAccountInfo(info) {
  return localStorage.setItem(accountInfo, JSON.stringify(info))
}

export function getAccountInfo() {
  return JSON.parse(localStorage.getItem(accountInfo))
}

export function removeAccountInfo() {
  return localStorage.removeItem(accountInfo)
}
