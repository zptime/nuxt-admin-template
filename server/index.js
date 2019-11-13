const Koa = require('koa') // web开发框架
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('koa-bodyparser') // 配置解析post的bodypaser
const json = require('koa-json') // 美观地输出JSON response

const app = new Koa()

app.use(json())
app.use(bodyParser())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

const user = require('./routes/user')

// 错误处理：当token验证异常时的处理，如token过期、token错误
// app.use((ctx, next) => {
//   return next().catch((err) => {
//     if (err.status === 401) {
//       ctx.status = 401
//       ctx.body = {
//         code: 10002,
//         msg: 'Protected resource, use Authorization header to get access\n'
//       }
//     } else {
//       throw err
//     }
//   })
// })

// // 路由权限控制：控制哪些路由需要jwt验证，哪些接口不需要验证。除了path里的路径不需要验证token，其他都要。
// app.use(
//   koaJwt({
//     secret: 'secret'
//   }).unless({
//     path: [/^\/login/, /^\/register/, '/favicon.ico']
//   })
// )

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
