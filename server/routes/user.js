const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

// 路由前缀
router.prefix('/api')

// 用户登录
router.post('/login', (ctx) => {
  const { username, password } = ctx.request.body
  const valid = username.length && password === '123'

  if (!valid) {
    ctx.body = {
      code: -1,
      data: null,
      msg: '用户名或密码错误'
    }
  } else {
    ctx.body = {
      code: 0,
      data: {
        username,
        password
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

// GET /api/users 获取所有用户列表
router.get('/users', (ctx) => {
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
