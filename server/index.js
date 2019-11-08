const Koa = require('koa') // web开发框架
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('koa-bodyparser') // 配置解析post的bodypaser
const json = require('koa-json') // 美观地输出JSON response
// const jwt = require('jsonwebtoken') // 用于签发、解析`token`
// const koaJwt = require('koa-jwt') // 用于路由权限控制

const app = new Koa()

app.use(json())
app.use(bodyParser())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

const user = require('./routes/user')

// /* 当token验证异常时候的处理，如token过期、token错误 */
// app.use((ctx, next) => {
//   return next().catch((err) => {
//     if (err.status === 401) {
//       ctx.status = 401
//       ctx.body = {
//         ok: false,
//         msg: err.originalError ? err.originalError.message : err.message
//       }
//     } else {
//       throw err
//     }
//   })
// })

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // 路由权限控制 除了path里的路径不需要验证token 其他都要
  // app.use(
  //   koaJwt({
  //     secret: secret.sign
  //   }).unless({
  //     path: [/^\/login/, /^\/register/]
  //   })
  // )

  /* 路由权限控制 */
  // app.use(jwtKoa({ secret }).unless({
  // // 设置login、register接口，可以不需要认证访问
  //   path: [
  //     /^\/api\/login/,
  //     /^\/api\/register/,
  //     /^((?!\/api).)*$/ // 设置除了私有接口外的其它资源，可以不需要认证访问
  //   ]
  // }))

  /* 获取一个期限为4小时的token */
  // function getToken(payload = {}) {
  //   return jwt.sign(payload, secret, { expiresIn: '4h' });
  // }

  /* 通过token获取JWT的payload部分 */
  // function getJWTPayload (token) {
  // // 验证并解析JWT
  //   return jwt.verify(token.split(' ')[1], secret)
  // }

  // routes 配置服务端路由
  app.use(user.routes(), user.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
