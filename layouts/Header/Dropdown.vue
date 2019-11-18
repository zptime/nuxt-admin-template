<template>
  <el-dropdown class="avatar-container" trigger="click">
    <div class="avatar-wrapper">
      <img src="/images/avatar.gif" class="user-avatar">
      <i class="el-icon-caret-bottom" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <router-link to="/">
        <el-dropdown-item icon="el-icon-s-home">
          Home
        </el-dropdown-item>
      </router-link>
      <el-dropdown-item icon="el-icon-s-promotion">
        <el-link target="_blank" href="https://github.com/zptime/nuxt-admin-template" :underline="false">
          Github
        </el-link>
      </el-dropdown-item>
      <el-dropdown-item divided icon="el-icon-s-finance" @click.native="logout()">
        Log Out
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    async logout () {
      await this.$store.dispatch('logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-container {
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>
