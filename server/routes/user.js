const fs = require('fs')
const path = require('path')
const router = require('koa-router')() // 路由中间件
const jwt = require('jsonwebtoken') // 用于签发、解析`token`
const koaJwt = require('koa-jwt') // 用于路由权限控制

/* 路由前缀 */
router.prefix('/api')

/* jwt密钥 */
const secret = 'secret'

// 用户登录
router.post('/login', (ctx) => {
  const { username, password } = ctx.request.body
  const data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  const valid = JSON.parse(data).filter((item) => {
    return item.name === username && item.password === password
  })
  if (!valid || valid.length === 0) {
    ctx.body = {
      code: 10001,
      data: null,
      msg: '用户名或密码错误'
    }
  } else {
    // jsonwebtoken在服务端生成token返回给客户端
    const token = jwt.sign({
      username,
      // 设置 token 过期时间，一小时后，秒为单位
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    }, secret)
    ctx.body = {
      code: 0,
      data: {
        token
      },
      msg: '登录成功'
    }
  }
})

// 用户退出
router.post('/logout', (ctx) => {
  ctx.body = {
    code: 0,
    data: null,
    msg: '退出成功'
  }
})

// koaJwt中间件会拿着密钥解析JWT是否合法。并且把JWT中的payload的信息解析后放到state中，ctx.state用于中间件的传值。
// GET /api/users 获取所有用户列表
router.get('/users', koaJwt({
  secret
}), (ctx) => {
  // 验证通过，state.user
  // console.log(ctx.state.user)
  const data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  ctx.body = {
    code: 0,
    data,
    msg: '获取成功'
  }
})

// GET /api/users/:id 获取单个用户信息
router.get('/users/:id', (ctx) => {
  const data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  const user = JSON.parse(data).filter((item) => {
    return item.id === Number(ctx.params.id)
  })
  ctx.body = {
    code: 0,
    data: user,
    msg: '查询成功'
  }
})

// POST /api/users 新增用户数据
router.post('/users', (ctx) => {
  let data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  data = JSON.parse(data)
  data.push(ctx.request.body)
  ctx.body = {
    code: 0,
    data,
    msg: '新增成功'
  }
})

// PUT /api/users/:id 修改单个用户信息
router.put('/users/:id', (ctx) => {
  const data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  let user = JSON.parse(data).filter((item) => {
    return item.id === Number(ctx.params.id)
  })
  user = Object.assign(user[0], ctx.request.body)
  ctx.body = {
    code: 0,
    data: user,
    msg: '修改成功'
  }
})

// DELETE /api/users/:id 删除单个用户信息
router.delete('/users/:id', (ctx) => {
  let data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  data = JSON.parse(data).filter((item) => {
    return item.id !== Number(ctx.params.id)
  })
  ctx.body = {
    code: 0,
    data,
    msg: '删除成功'
  }
})

module.exports = router
