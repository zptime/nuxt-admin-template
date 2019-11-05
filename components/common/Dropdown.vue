<template>
  <el-dropdown class="avatar-container" trigger="click">
    <div class="avatar-wrapper">
      <img src="/images/avatar.gif" class="user-avatar">
      <i class="el-icon-caret-bottom" />
    </div>
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
</template>

<script>
export default {
  data () {
    return {}
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
