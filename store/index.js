import { getToken, setToken } from '../plugins/utils.js'
import { login } from '../server/api'

export const state = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

export const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
  setName: (state, name) => {
    state.name = name
  },
  setAvatar: (state, avatar) => {
    state.avatar = avatar
  }
}

export const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username, password }).then((response) => {
        const { data } = response
        if (data.code === 0) {
          commit('setToken', data.data.token)
          setToken(data.data.token)
        }
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
