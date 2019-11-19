# nuxt-admin-template

> 基于 Nuxt.js 服务渲染框架搭建的后台管理系统，UI 框架选择的是[Element UI](https://element.eleme.cn/#/zh-CN)
>
> 该后台管理系统只是一个极简的后台基础模板，只实现了用户登录和权限验证等功能。

## 参考文档

- 基于 Nuxt.js 服务渲染框架的后台管理系统：[https://github.com/JanesChan/Vue-admin](https://github.com/JanesChan/Vue-admin)
- vue-element-admin：[https://panjiachen.github.io/vue-element-admin-site/zh/guide/](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

## 前期准备

> 项目搭建参考另一篇文章：[nuxt-koa-mongodb](https://github.com/zptime/nuxt-koa-mongodb)

项目创建差异：

- 创建框架时，UI 框架选择[Element UI](https://element.eleme.cn/#/zh-CN)
- 未进行 pwa 的额外配置
- 未进行 mongodb 数据库的相关配置
- 增加 sass/scss 配置

```js
// 安装
npm node-sass sass-loader --save-dev
npm install @nuxtjs/style-resources

// 配置 nuxt.config.js
module.exports = {
  css: [
    // 配置全局css
    '@/assets/css/main.scss'
  ],
  modules: [
    // 添加对应的模块
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    // 配置全局 scss 变量 和 mixin
    // 注意：styleResources 配置的资源路径不能使用 ~ 和 @ ，需要使用相对或绝对路径。
    scss: [
      './assets/style/variables.scss', // 全局 scss 变量
      './assets/style/mixins.scss' // 全局 scss 混合
    ]
  }
}
```

## 页面编写

- layouts/base.vue：基础框架页，不带任何组件的框架页
- layouts/default.vue：主要框架页，带侧边栏和顶栏的框架页
  - store：vuex 配置文件夹
  - assets/css：样式文件夹
  - components/common/Header.vue：顶栏组件
    - components/common/Breadcrumb.vue：面包屑组件
    - components/common/Dropdown.vue：下拉菜单组件
  - components/common/Aside.vue：侧边栏组件
    - components/common/Logo.vue：Logo 组件
  - plugins/resizeHandler.js：移动端、PC 端适应配置
  - 问题：computed 阶段：Cookies.get('sidebarStatus')一直为 undefined。
    原因：computed 阶段，document 对象不存在；mounted 阶段，可获取到 cookied 值。
- pages/login/index.vue 页面：登录页面

```js
// store/index.js
npm install js-cookie
```

## 身份认证

> 用户身份验证通常有两种方式，一种是基于 cookie 的认证方式，另一种是基于 token 的认证方式。当前常见的无疑是基于 token 的认证方式。

### token 认证

> token是一个令牌，浏览器第一次访问服务端时会签发一张令牌，之后浏览器每次携带这张令牌访问服务端就会认证该令牌是否有效，只要服务端可以解密该令牌，就说明请求是合法的，令牌中包含的用户信息还可以区分不同身份的用户。一般token由用户信息、时间戳和由hash算法加密的签名构成。

#### token认证流程

1. 客户端使用用户名跟密码请求登录
2. 服务端收到请求，去验证用户名与密码
3. 验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
4. 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
6. 服务端收到请求，然后去验证客户端请求里面带着的 Token（request头部添加Authorization），如果验证成功，就向客户端返回请求的数据，如果不成功返回401错误码，鉴权失败。

#### token认证优缺点

1. token 认证的优点是无状态机制，在此基础之上，可以实现天然的跨域和前后端分离等。
2. token 认证的缺点是服务器每次都需要对其进行验证，会产生额外的运行压力。此外，无状态的 api 缺乏对用户流程或异常的控制，为了避免一些例如回放攻击的异常情况，大多会设置较短的过期时间。

#### JSON Web Token (JWT)

> JWT是一个开放标准(RFC 7519)，它定义了一种简洁的、自包含的方法，用于通信双方之间以 JSON 对象的形式安全地传输信息。该信息可以被验证和信任，因为它是数字签名的，JWT 可以使用 HMAC 算法或者是 RSA 的公钥密钥进行签名。

实战逻辑：

- 服务端生成 token，在登录路由中进行验证，可携带用户名等必要信息，并将其放至上下文对象中。

```js
// 安装依赖包
npm install jsonwebtoken koa-jwt

// 服务端生成token，详见 server/routes/user.js
const jwt = require('jsonwebtoken') // 用于签发、解析`token`
const secret = 'secret' // jwt密钥

// 用户登录
router.post('/login', (ctx) => {
  const { username, password } = ctx.request.body

  // jsonwebtoken在服务端生成token返回给客户端
  const token = jwt.sign({ username, password }, secret, { expiresIn: '2h' })
  ctx.body = {
    code: 0,
    data: {
      token
    },
    msg: '登录成功'
  }
})
```

- 客户端登录成功并获取 token 信息后，将其保存在客户端中。如 localstorage，cookie 等。

```js
// 客户端存储token信息,详见 store/index.js
login ({ commit }, userInfo) {
  const { username, password } = userInfo
  return new Promise((resolve, reject) => {
    login({ username, password }).then((response) => {
      const { data } = response
      if (data.code === 0) {
        commit('setToken', data.data.token)
        setToken(data.data.token)
      }
      resolve(data)
    })
  })
}
```

- 在请求服务器端 API 接口时，需要设置 authorization，把 token 带在请求头中传给服务器进行验证，如下两种方式：本项目采用的是第一种方式

   (1) 利用 axios 请求拦截器，设置请求头，将 token 放到 headers 中；

   (2) 利用 koa 的中间件在总路由中进行拦截处理。

```js
// a. axios请求拦截器，详见 plugin/axios.js
$axios.onRequest(config => {
  const token = getToken();
  config.headers.common.Authorization = "Bearer " + token;
  return config;
});

// b. koa中间件拦截，放在 server/index.js
app.use(bodyParser());
app.use(async (ctx, next) => {
  console.log(ctx);
  let params = Object.assign({}, ctx.request.query, ctx.request.body);
  ctx.request.header = { authorization: "Bearer " + (params.token || "") };
  await next();
});
```

### koa-jwt 主要作用是控制哪些路由需要 jwt 验证，哪些接口不需要验证

![JWT过程演示](https://github.com/zptime/resources/blob/master/images/JWT.png)

- koa-jwt 中间件的验证方式有三种：

1. 在请求头中设置 authorization 为 Bearer + token，注意 Bearer 后有空格。（koa-jwt 的默认验证方式 {'authorization': "Bearer " + token}）
2. 自定义 getToken 方法
3. 利用 Cookie（此 cookie 非彼 cookie）此处的 Cookie 只作为存储介质发给服务端的区域，校验并不依赖于服务端的 session 机制，服务端不会进行任何状态的保存。

```js
// server/index.js
const koaJwt = require("koa-jwt"); // 用于路由权限控制
// 错误处理：当token验证异常时的处理，如token过期、token错误
app.use((ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 20001,
        msg: err.originalError ? err.originalError.message : err.message
      };
    } else {
      throw err;
    }
  });
});

// 路由权限控制：控制哪些路由需要jwt验证，哪些接口不需要验证。除了path里的路径不需要验证token，其他都要。
app.use(
  koaJwt({
    secret: "secret"
  }).unless({
    path: [/^\/login/, /^\/register/]
  })
);
```

- 服务端处理前端发送过来的 Token

前端发送请求携带 token，后端需要判断以下几点：

- token 是否正确，不正确则返回错误
- token 是否过期，过期则刷新 token 或返回 401 表示需要重新登录

```js
// 服务端验证
app.use((ctx, next) => {
  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(" ");
    if (parts.length === 2) {
      // 取出token
      const scheme = parts[0];
      const token = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        try {
          // jwt.verify方法验证token是否有效
          jwt.verify(token, "secret", {
            complete: true
          });
        } catch (error) {
          // token过期 生成新的token
          const newToken = getToken();
          // 将新token放入Authorization中返回给前端
          ctx.res.setHeader("Authorization", newToken);
        }
      }
    }
  }

  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = "Protected resource, use Authorization header to get access\n";
    } else {
      throw err;
    }
  });
});
```

- 后端刷新 token，前端需要更新 token：后端更新的 token 是在响应头里，所以前端需要在响应拦截器中获取新 token。

```js
// 响应拦截器
$axios.onResponse(resp => {
  // 获取更新的token
  const { authorization } = resp.headers;
  // 如果token存在，则存在cookie中
  authorization && setToken(authorization);
  return Promise.resolve(resp.data);
});
```

## 路由鉴权

[https://juejin.im/post/5cdb83fe51882569223af7ae](https://juejin.im/post/5cdb83fe51882569223af7ae)

## 错误解决

### nuxt.config.js

- 使用 import 引入文件报错：import routes from './utils/routes' SyntaxError: Unexpected identifier

  解决import和export不能用的问题：node版本9以上就已经支持了，但是需要把文件名改成*.mjs,并且加上--experimental-modules 选项。

- 模块导入导出有哪些方式:
  - 模块导入方式有：require、import、import xxx from yyy、import {xx} from yyy
  - 模块导出方式有：exports、module.exports、export、export.default
- 使用规则和范围:
  - 模块导入方面
    - require: node和ES6都支持的模块导入方式
    - import和import xxx from yyy和import {xx} from yyy：只有ES6支持
  - 模块导出方面
    - module.exports/exports: node本身支持的模块导出方式
    - export/import: 只有ES6支持的模块导出方式
- CommonJS规范(node中模块的导入导出)
  - 由于之前js没有很统一比较混乱，代码按照各自的喜好写并没有一个模块的概念，而这个规范说白了就是对模块的定义:
  - CommonJS定义模块分为：模块标识(module)、模块定义(exports)、模块引用(require)

```js
// 错误写法
import routes from './utils/routes'

export default (routes, resolve) => {
  routes = iterator(routes, menus)
  console.log(routes)
}

// 正确写法
const routes = require('./utils/routes.js')

module.exports = (routes, resolve) => {
  routes = iterator(routes, menus)
  console.log(routes)
}
```

## nuxtjs 自定义路由实现及路由权限拦截配置

(1) Nuxt简单介绍及搭建过程：[http://blog.liuxiuqian.com/bloginfo/26](http://blog.liuxiuqian.com/bloginfo/26)
(2) 是否能加一个可以设置自动生成路由树的“meta”对象的一个方法：[https://github.com/nuxt/nuxt.js/issues/4749](https://github.com/nuxt/nuxt.js/issues/4749)
(3) nuxtjs如何通过路由meta信息控制路由查看权限：[https://www.cnblogs.com/goloving/p/11730607.html](https://github.com/nuxt/nuxt.js/issues/4749)
(4) fix(config) : fix `extendRoutes` method type： [https://github.com/nuxt/nuxt.js/pull/5841](https://github.com/nuxt/nuxt.js/pull/5841)
