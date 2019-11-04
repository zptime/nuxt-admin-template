import Cookies from 'js-cookie'
export const state = () => {
  return {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop'
  }
}
export const mutations = {
  toggleSideBar: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  closeSideBar: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  toggleDevice: (state, device) => {
    state.device = device
  }
}
export const actions = {
  toggleSideBar ({ commit }) {
    commit('toggleSideBar')
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('closeSideBar', withoutAnimation)
  },
  toggleDevice ({ commit }, device) {
    commit('toggleDevice', device)
  }
}
