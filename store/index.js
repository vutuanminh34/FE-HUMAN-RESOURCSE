import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  setAccountInfo,
  getAccountInfo,
  removeAccountInfo,
} from '@/utils/auth'
import { login } from '@/api/staff'
function getAccount() {
  const accountInfo = getAccountInfo()
  if (!accountInfo) {
    removeToken()
    removeRefreshToken()
    removeAccountInfo()
    return null
  } else {
    return accountInfo
  }
}
export const state = () => ({
  accessToken: getToken(),
  refreshToken: getRefreshToken(),
  accountInfo: getAccount(),
  snackbar: false,
  snackbarColor: 'red darken-4',
  notifyMessage: null,
  pageHeaderTitle: '',
  avatarDefault: require('@/assets/images/avatar-default.svg'),
})

export const getters = {
  getAvatarDefault(state) {
    return state.avatarDefault
  },
}

export const mutations = {
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_ACCOUNT_INFO: (state, accountInfo) => {
    state.accountInfo = accountInfo
  },
  SET_SNACKBAR: (state, snackbar) => {
    state.snackbar = snackbar
  },
  SET_SNACKBAR_COLOR: (state, color) => {
    state.snackbarColor = color
  },
  SET_NOTIFY_MESSAGE: (state, mes) => {
    state.notifyMessage = mes
  },
  SET_PAGE_HEADER_TITLE: (state, title) => {
    state.pageHeaderTitle = title
  },
}

export const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then(({ data }) => {
          if (!data) {
            reject(new Error('Có lỗi xảy ra, vui lòng đăng nhập lại.'))
          }
          commit('SET_ACCESS_TOKEN', data.AccessToken) // save to store
          commit('SET_REFRESH_TOKEN', data.RefreshToken)
          commit('SET_ACCOUNT_INFO', data.AccountInfo)
          setToken(data.AccessToken) // save to cookie
          setRefreshToken(data.RefreshToken)
          // get user info
          setAccountInfo(data.AccountInfo)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_ACCOUNT_INFO', '')
      removeToken()
      removeRefreshToken()
      removeAccountInfo()
      resolve()
    })
  },

  // status has two options True=>Success or False=>Failure
  showSnackbar({ commit }, { status, message }) {
    commit('SET_SNACKBAR', true)
    if (status) {
      commit('SET_SNACKBAR_COLOR', 'success darken-4')
      commit('SET_NOTIFY_MESSAGE', message || 'Success')
    } else {
      commit('SET_SNACKBAR_COLOR', 'red darken-4')
      commit(
        'SET_NOTIFY_MESSAGE',
        message || 'Something went wrong, Please try again!'
      )
    }
  },
}
