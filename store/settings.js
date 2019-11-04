export const state = () => {
  return {
    showSettings: true,
    fixedHeader: false,
    sidebarLogo: false
  }
}
export const mutations = {
  changeSetting: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}
export const actions = {
  changeSetting ({ commit }, data) {
    commit('changeSetting', data)
  }
}
