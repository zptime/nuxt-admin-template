<template>
  <div class="container">
    <h2 class="subtitle">
      Koa.js - RESTful APIs 接口测试
    </h2>
    <div>
      <input id="name" v-model="username" type="text" placeholder="请输入用户名">
      <input id="pwd" v-model="password" type="password" placeholder="请输入密码">
      <button id="submit_btn" @click="loginBtn">
        提交
      </button>
    </div>
    <div>说明：用户名为任意值，密码为123才能通过验证</div>
    <div class="lists">
      <div class="list">
        <h3>获取所有用户列表(GET /api/users)</h3>
        <div>{{ userLists }}</div>
      </div>
      <div class="list">
        <h3>获取单个用户信息(GET /api/users/:id)</h3>
        <div>{{ user }}</div>
      </div>
      <div class="list">
        <h3>新增用户数据(POST /api/users )</h3>
        <div>{{ addUserLists }}</div>
      </div>
      <div class="list">
        <h3>修改单个用户信息(PUT /api/users/:id )</h3>
        <div>{{ modUser }}</div>
      </div>
      <div class="list">
        <h3>删除单个用户信息(DELETE /api/users/:id )</h3>
        <div>{{ delUserLists }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '1111',
      password: '111',
      userLists: [],
      addUserLists: [],
      modUser: {},
      delUserLists: [],
      user: {}
    }
  },
  async mounted () {
    const lists = await this.$axios.get('/api/users')
    const lists2 = await this.$axios.get('/api/users/1')
    const lists3 = await this.$axios.post('/api/users', {
      'id': 4,
      'name': 'mongodb',
      'password': 'password4',
      'profession': 'database'
    })
    const lists4 = await this.$axios.put('/api/users/1', {
      'name': 'mongodb',
      'password': 'password4',
      'profession': 'database'
    })
    const lists5 = await this.$axios.delete('/api/users/1')
    this.userLists = lists.data
    this.user = lists2.data
    this.addUserLists = lists3.data
    this.modUser = lists4.data
    this.delUserLists = lists5.data
  },
  methods: {
    async loginBtn () {
      const { msg } = await this.$axios.post('/api/login', {
        username: this.username,
        password: this.password
      })
      alert(msg)
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.lists{
  display: flex;
  flex-direction: row;
}
.lists .list{
  flex: 1;
  border:1px solid #aaa;
  margin: 10px;
}
</style>
