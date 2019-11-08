export const state = () => {
  return {
    showSettings: true,
    fixedHeader: true, // 是否固定Header头部组件
    sidebarLogo: true // 是否在Aside侧栏组件显示Logo
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
