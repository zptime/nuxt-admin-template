/**
 * @description: 不同客户端的相关配置
 * @param {*} device 客户端类型，mobile-移动端，desktop-PC端
 * @param {*} isMobile 是否为移动端，true-是，false-否
 * @param {*} sidebar 侧栏配置，opened：侧栏是否展开，withoutAnimation：是否有动画效果
 */
import { getLocalCache, setLocalCache } from '~/utils/utils.js'

const sideBarFlag = 'aside_status'

export const state = () => {
  return {
    sidebar: {
      opened: false,
      withoutAnimation: false
    },
    device: 'desktop',
    isMobile: false
  }
}
export const mutations = {
  toggleSideBar: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      setLocalCache(sideBarFlag, 1)
    } else {
      setLocalCache(sideBarFlag, 0)
    }
  },
  setSideBar: (state) => {
    const flag = getLocalCache(sideBarFlag)
    const opened = flag ? !!+flag : true
    state.sidebar.opened = opened
    state.sidebar.withoutAnimation = false
  },
  closeSideBar: (state, withoutAnimation) => {
    setLocalCache(sideBarFlag, 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  toggleDevice: (state, device) => {
    state.device = device
  },
  toggleMobile: (state, isMobile) => {
    state.isMobile = isMobile
  }
}
export const actions = {
  setSideBar ({ commit }) {
    commit('setSideBar')
  },
  toggleSideBar ({ commit }) {
    commit('toggleSideBar')
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('closeSideBar', withoutAnimation)
  },
  toggleMobile ({ commit }, isMobile) {
    commit('toggleMobile', isMobile)
    if (isMobile) {
      commit('toggleDevice', 'mobile')
    } else {
      commit('toggleDevice', 'desktop')
    }
  }
}
