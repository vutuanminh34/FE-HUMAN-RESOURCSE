import { moveIndex } from '@/utils/index'
export const state = () => ({
  listProjects: [],
  listWorkHistory: [],
  listSkill: [],
  personInfo: {},
  listEducations: [],
  listCertificates: [],
})
export const getters = {
  GET_USERNAME: (state) => {
    return state.personInfo.FullName
  },
  GET_LIST_PROJECT: (state) => {
    return state.listProjects
  },
  GET_LIST_TECHNOLOGY: (state) => {
    const listTechnologies = []
    state.listSkill.map((item) => {
      item.Technologies.map((v) => {
        listTechnologies.push(v)
      })
    })
    return listTechnologies
  },
  GET_LIST_WORK_HISTORY: (state) => {
    return state.listWorkHistory
  },
  GET_LIST_SKILL: (state) => {
    return state.listSkill
  },
  GET_PERSON_INFO: (state) => {
    return state.personInfo
  },
  GET_LIST_EDUCATION: (state) => {
    return state.listEducations
  },
  GET_LIST_CERTIFICATE: (state) => {
    return state.listCertificates
  },
}
export const mutations = {
  SET_LIST_PROJECT: (state, data) => {
    state.listProjects = data
  },
  SET_LIST_TECHNOLOGY: (state, data) => {
    state.listTechnologies = data
  },
  INSERT_ITEM_IN_LIST_PROJECT: (state, data) => {
    state.listProjects.push({ ...data })
  },
  DELETE_ITEM_IN_LIST_PROJECT: (state, index) => {
    state.listProjects.splice(index, 1)
  },
  MOVE_ITEM_IN_LIST_PROJECT: (state, data) => {
    moveIndex(state.listProjects, data.from, data.to)
  },
  SET_LIST_WORK_HISTORY: (state, data) => {
    state.listWorkHistory = data
  },
  SET_LIST_SKILL: (state, data) => {
    state.listSkill = data
  },
  SET_PERSON_INFO: (state, data) => {
    state.personInfo = data
  },
  SET_LIST_EDUCATION: (state, data) => {
    state.listEducations = data
  },
  SET_LIST_CERTIFICATE: (state, data) => {
    state.listCertificates = data
  },
}
export const actions = {
  setListWorkHistory({ commit }, newList) {
    commit('SET_LIST_WORK_HISTORY', JSON.parse(JSON.stringify(newList)))
  },
  setListSkill({ commit }, newList) {
    commit('SET_LIST_SKILL', JSON.parse(JSON.stringify(newList)))
  },
  setPersonInfo({ commit }, newList) {
    commit('SET_PERSON_INFO', newList)
  },
  setListEducation({ commit }, newList) {
    commit('SET_LIST_EDUCATION', JSON.parse(JSON.stringify(newList)))
  },
  setListCertificate({ commit }, newList) {
    commit('SET_LIST_CERTIFICATE', JSON.parse(JSON.stringify(newList)))
  },
  resetResume({ commit }) {
    commit('SET_LIST_WORK_HISTORY', [])
    commit('SET_LIST_SKILL', [])
    commit('SET_PERSON_INFO', {})
    commit('SET_LIST_EDUCATION', [])
    commit('SET_LIST_CERTIFICATE', [])
    commit('SET_LIST_PROJECT', [])
  },
}
