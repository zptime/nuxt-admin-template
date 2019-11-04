<template>
  <div class="right-menu">
    <div class="avatar-wrapper">
      <img src="/images/avatar.gif" class="user-avatar">
      <i class="el-icon-caret-bottom" />
    </div>
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-plus">
          黄金糕
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus">
          狮子头
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus-outline">
          螺蛳粉
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-check">
          双皮奶
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-check">
          蚵仔煎
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style scoped lang="scss">
.app-breadcrumb{
  margin: auto 8px;
}
</style>
