<template>
  <div class="navbar">
    <div class="fold-container" @click="toggleSideBar">
      <i v-if="isActive" class="el-icon-s-unfold" />
      <i v-else class="el-icon-s-fold" />
    </div>
    <Breadcrumb class="breadcrumb-container" />
    <Dropdown class="dropdown-container" />
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb.vue'
import Dropdown from './Dropdown.vue'
export default {
  components: {
    Breadcrumb,
    Dropdown
  },
  data () {
    return {
    }
  },
  computed: {
    isActive () {
      return this.$store.state.app.sidebar.opened
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style scoped lang="scss">
.navbar{
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .fold-container{
    height: 100%;
    width: 50px;
    cursor: pointer;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }

    i {
      font-size: 20px;
    }
  }

  .breadcrumb-container{
    float: left;
    line-height: 50px;
  }

  .dropdown-container{
    float: right;
  }
}

</style>
