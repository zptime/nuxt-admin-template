<template>
  <div :class="classObj" class="app-wrapper">
    <!-- mobile模式遮罩 -->
    <div v-if="isMobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 侧边栏组件 -->
    <Aside class="sidebar-container" />
    <!-- 主体内容 -->
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <!-- 顶栏组件 -->
        <Header />
      </div>
      <nuxt />
    </div>
  </div>
</template>

<script>
import Header from './Header/index.vue'
import Aside from './Aside/index.vue'
import ResizeMixin from '~/utils/resizeHandler.js'
export default {
  components: {
    Header,
    Aside
  },
  mixins: [ResizeMixin],
  computed: {
    fixedHeader () {
      return this.$store.state.settings.fixedHeader
    },
    isMobile () {
      return this.$store.state.app.isMobile
    },
    sidebar () {
      return this.$store.state.app.sidebar
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.isMobile
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/mixin.scss";
@import "~assets/css/variables.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  &.mobile.openSidebar{
    position: fixed;
    top: 0;
  }

  .sidebar-container {
    transition: width 0.28s;
    width: $sideBarWidth;
    background-color: $menuBg;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
  .main-container {
    min-height: 100%;
    transition: margin-left .28s;
    margin-left: $sideBarWidth;
    position: relative;

    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: calc(100% - #{$sideBarWidth});
      transition: width 0.28s;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
}

.hideSidebar {
  .sidebar-container {
    width: $hideSideBarWidth !important;
  }
  .main-container {
    margin-left: $hideSideBarWidth;
    .fixed-header {
      width: calc(100% - #{$hideSideBarWidth});
    }
  }
}

// mobile responsive
.mobile {
  .sidebar-container {
    transition: transform .28s;
    width: $sideBarWidth !important;
  }
  .main-container {
    margin-left: 0px;
    .fixed-header {
      width: 100%;
    }
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
