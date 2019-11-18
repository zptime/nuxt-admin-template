<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">
      首页
    </el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
  </el-breadcrumb>
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
  font-size: 14px;
}
</style>
