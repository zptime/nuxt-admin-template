<template>
  <div class="demo-input-suffix">
    <h2>后台登录系统</h2>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
      <el-form-item prop="username">
        <el-input
          v-model="ruleForm.username"
          placeholder="请输入用户名"
          clearable
        >
          <i slot="prefix" class="el-input__icon el-icon-user" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" show-password>
          <i slot="prefix" class="el-input__icon el-icon-lock" />
        </el-input>
      </el-form-item>
      <div class="login-btn">
        <el-button type="primary" @click="submit('ruleForm')">
          立即登录
        </el-button>
        <div class="tips">
          <span>username: admin</span>
          <span>password: 123456</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '用户名 不能为空' }
        ],
        password: [
          { required: true, message: '密码 不能为空' }
        ]
      }
    }
  },
  methods: {
    submit (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/login', {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }).then((res) => {
            // 判断是否请求成功
            if (res.code === 0) {
              // 将服务端的token存入cookie当中
              // Cookie.set('token', res.data.token)
              this.$router.push({
                path: '/'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  a{
    text-decoration:none;
  }
  .demo-input-suffix{
    width: 320px;
    margin: 200px auto 88px auto;

    h2{
      text-align: center;
      margin-bottom: 20px;
    }

    el-input{
      margin-top: 15px;
    }

    .login-btn{
      .el-button{
        width:320px;
      }
    }

    .tips{
      margin-top: 15px;
      font-size: 14px;

      span {
        &:first-of-type {
          margin-right: 20px;
        }
      }
    }
  }
</style>
