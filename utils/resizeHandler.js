const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  watch: {
    $route (route) { // 切换路由时触发
      if (this.isMobile && this.sidebar.opened) {
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted () {
    // 刷新页面时触发
    this.$_toggleMobile()
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile () {
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler () { // 移动端和PC端模式切换时触发
      if (!document.hidden) {
        this.$_toggleMobile()
      }
    },
    $_toggleMobile () {
      const isMobile = this.$_isMobile()
      this.$store.dispatch('app/toggleMobile', isMobile)

      if (isMobile) {
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: true })
      } else {
        this.$store.dispatch('app/setSideBar')
      }
    }
  }
}
