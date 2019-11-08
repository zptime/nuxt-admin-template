# nuxt-admin-template

> 基于 Nuxt.js 服务渲染框架搭建的后台管理系统，UI 框架选择的是[Element UI](https://element.eleme.cn/#/zh-CN)

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
  - 问题：computed 阶段：Cookies.get('sidebarStatus')一直为 undefined。<br>
    原因：computed 阶段，document 对象不存在；mounted 阶段，可获取到 cookied 值。
- pages/login/index.vue 页面：登录页面

```js
// store/index.js
npm install js-cookie
```

## 身份认证

> 用户身份验证通常有两种方式，一种是基于 cookie 的认证方式，另一种是基于 token 的认证方式。当前常见的无疑是基于 token 的认证方式。

### token 认证

- token 认证的优点是无状态机制，在此基础之上，可以实现天然的跨域和前后端分离等。
- token 认证的缺点是服务器每次都需要对其进行验证，会产生额外的运行压力。此外，无状态的 api 缺乏对用户流程或异常的控制，为了避免一些例如回放攻击的异常情况，大多会设置较短的过期时间。
- JSON Web Token (JWT)是一个开放标准(RFC 7519)，它定义了一种简洁的、自包含的方法，用于通信双方之间以 JSON 对象的形式安全地传输信息。该信息可以被验证和信任，因为它是数字签名的，JWT 可以使用 HMAC 算法或者是 RSA 的公钥密钥进行签名。
- koa-jwt 主要作用是控制哪些路由需要 jwt 验证，哪些接口不需要验证

使用 koa-jwt 的大致流程是：

1. 用户通过身份验证 API(登录)获取当前用户在有效期内的 token
2. 需要身份验证的 API 都需要携带此前认证过的 token 发送至服务端
3. koa 会利用 koa-jwt 中间件的默认验证方式进行身份验证，中间件会进行验证成功和验证失败的分流。

![JWT过程演示](https://github.com/zptime/resources/blob/master/images/JWT.png)

koa-jwt 中间件的验证方式有三种：

1. 在请求头中设置 authorization 为 Bearer + token，注意 Bearer 后有空格。（koa-jwt 的默认验证方式 {'authorization': "Bearer " + token}）
2. 自定义 getToken 方法
3. 利用 Cookie（此 cookie 非彼 cookie）此处的 Cookie 只作为存储介质发给服务端的区域，校验并不依赖于服务端的 session 机制，服务端不会进行任何状态的保存。

实战逻辑：

1. 服务端生成 token，在登录路由中进行验证，可携带用户名等必要信息，并将其放至上下文对象中。
2. 客户端登录成功并获取 token 信息后，将其保存在客户端中。如 localstorage，cookie 等。
3. 在请求服务器端 API 接口时，需要设置 authorization，把 token 带在请求头中传给服务器进行验证，如下两种方式：
   (1) 利用 axios 请求拦截器，设置请求头，将 token 放到 headers 中；
   (2) 利用 koa 的中间件在总路由中进行拦截处理。

```js
// 安装依赖包
npm install jsonwebtoken koa-jwt

// 1.服务端生成token，详见 server/routes/user.js
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

// 2.客户端存储token信息,详见 store/index.js
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

// 3.请求验证
// a. axios请求拦截器，详见 plugin/axios.js
$axios.onRequest((config) => {
  const token = getToken()
  config.headers.common.Authorization = 'Bearer ' + token
  return config
})

// b. koa中间件拦截，放在 server/index.js
app.use(bodyParser())
app.use(async (ctx, next) => {
    console.log(ctx)
    let params =Object.assign({}, ctx.request.query, ctx.request.body);
    ctx.request.header = {'authorization': "Bearer " + (params.token || '')}
    await next();
})

// 4.利用koa-jwt设置需要验证才能访问的接口，验证成功后可在上下文中的state中获取状态信息。
const { sign } = require('jsonwebtoken');
const secret = 'demo';
const jwt = require('koa-jwt')({secret});
router.get('/userinfo', jwt, async (ctx, next) => {
    ctx.body = {username: ctx.state.user.username}
    console.log(ctx)
})


// 5.koa-jwt主要作用是控制哪些路由需要jwt验证，哪些接口不需要验证：
import  *  as  koaJwt  from  'koa-jwt';

//路由权限控制 除了path里的路径不需要验证token 其他都要
app.use(
    koaJwt({
        secret:  secret.sign
    }).unless({
        path: [/^\/login/, /^\/register/]
    })
);

// 6.服务端处理前端发送过来的Token
前端发送请求携带token，后端需要判断以下几点：
token是否正确，不正确则返回错误
token是否过期，过期则刷新token 或返回401表示需要从新登录
关于上面两点，需要在后端写一个中间件来完成：
app.use((ctx, next) => {
  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
      //取出token
      const scheme = parts[0];
      const token = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          jwt.verify(token, secret.sign, {
            complete: true
          });
        } catch (error) {
          //token过期 生成新的token
          const newToken = getToken(user);
          //将新token放入Authorization中返回给前端
          ctx.res.setHeader('Authorization', newToken);
        }
      }
    }
  }

  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body =
        'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }});
 });

// 7.后端刷新token 前端需要更新token
后端更换新token后，前端也需要获取新token 这样请求才不会报错。
由于后端更新的token是在响应头里，所以前端需要在响应拦截器中获取新token。
依然以axios为例：

//响应拦截器
axios.interceptors.response.use(function(response) {
    //获取更新的token
    const { authorization } = response.headers;
    //如果token存在则存在localStorage
    authorization && localStorage.setItem('tokenName', authorization);
    return response;
  },
  function(error) {
    if (error.response) {
      const { status } = error.response;
      //如果401或405则到登录页
      if (status == 401 || status == 405) {
        history.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

// 8.check中间件
check中间件
根据koa洋葱式的中间件机制，我们可以写个检查token的中间件，我们干的事情就是拿到客户端传来的token，解码后取出重要信息，检查
const Promise = require("bluebird");
const jwt = require("jsonwebtoken");
const verify = Promise.promisify(jwt.verify);
let { secret } = require("../util/secret");

async function check(ctx, next) {
  let url = ctx.request.url;
  // 登录 不用检查
  if (url == "/users/login") await next();
  else {
      // 规定token写在header 的 'autohrization' 
    let token = ctx.request.headers["authorization"];
    // 解码
    let payload = await verify(token,secret);
    let { time, timeout } = payload;
    let data = new Date().getTime();
    if (data - time <= timeout) {
        // 未过期
      await next();
    } else {
        //过期
      ctx.body = {
        status: 50014，
        message:'token 已过期'
      };
    }
  }
}

module.exports = check
复制代码加入中间件即可
const check = require('./utils/check')
app.use(check)

作者：Webwwl
链接：https://juejin.im/post/5ae8827b6fb9a07a9d702077
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// 9.https://github.com/lin-xin/blog/issues/28

```

### cookie 认证

## 路由鉴权
