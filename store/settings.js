/**
 * @description: 页面整体结构配置
 * @param {*} fixedHeader 是否固定Header头部组件，true：固定，不随页面滚动；false：不固定
 * @param {*} sidebarLogo 是否在Aside侧栏组件中显示Logo组件
 */
export const state = () => {
  return {
    fixedHeader: true,
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
