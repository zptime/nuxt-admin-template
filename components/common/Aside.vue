<template>
  <div class="app-scrollbar" :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        default-active="2-2"
        mode="vertical"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
      >
        <aside-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from '~/components/common/Logo.vue'
import AsideItem from '~/components/common/AsideItem.vue'
import variables from '@/assets/css/variables.scss'
export default {
  components: {
    Logo,
    AsideItem
  },
  data () {
    return {}
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    routes () {
      return this.$router.options.routes
    },
    // activeMenu() {
    //   const route = this.$route
    //   const { meta, path } = route
    //   // if set path, the sidebar will highlight the path you set
    //   if (meta.activeMenu) {
    //     return meta.activeMenu
    //   }
    //   return path
    // },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  mounted () {
    console.log(this.routes)
  }
}
</script>

<style lang="scss">
.app-scrollbar{
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }
  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }
  .el-scrollbar__bar.is-horizontal {
    display: none;
  }
  .el-scrollbar {
    height: 100%;
  }
  .el-menu {
    border: none;//解决menu右边白边问题
    height: 100%;
    width: 100%;
  }

  &.has-logo {
    .el-scrollbar {
      height: calc(100% - 50px);
    }
  }
}
</style>

<style lang="scss" scoped>
.app-scrollbar{
  .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>
