# nuxt-admin-template

> 基于 Nuxt.js 服务渲染框架搭建的后台管理系统，UI 框架选择的是[Element UI](https://element.eleme.cn/#/zh-CN)
>
> 该后台管理系统只是一个极简的后台基础模板，只实现了用户登录和权限验证等功能。

<!-- ## 参考文档

- 基于 Nuxt.js 服务渲染框架的后台管理系统：[https://github.com/JanesChan/Vue-admin](https://github.com/JanesChan/Vue-admin)
- vue-element-admin：[https://panjiachen.github.io/vue-element-admin-site/zh/guide/](https://panjiachen.github.io/vue-element-admin-site/zh/guide/) -->

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

## 项目结构说明

- assets：未编译的静态资源
- components：组件，没有 asyncData 方法
- layouts：布局组件
  - base.vue：基础框架页，不带任何组件的框架页
  - default.vue：主要框架页，带侧边栏和顶栏的框架页
  - Header/index.vue：顶栏组件
    - layouts/Header/Breadcrumb.vue：面包屑组件
    - layouts/Header/Dropdown.vue：下拉菜单组件
  - Aside/index.vue：侧边栏组件
    - layouts/Aside/AsideItem.vue：侧栏元组件
    - layouts/Aside/Logo.vue：Logo 组件
  - plugins/resizeHandler.js：移动端、PC 端适应配置
  - 问题：computed 阶段：Cookies.get('sidebarStatus')一直为 undefined。
    原因：computed 阶段，document 对象不存在；mounted 阶段，可获取到 cookied 值。
- middleware：中间件
  - authorities.js：路由鉴权
- pages：页面，根据该目录下的 vue 文件自动生成对应的路由配置
  - center/index.vue：用户中心
  - log/index.vue：日志
  - login/index.vue：登录
  - system：系统管理
    - pages/system.vue：嵌套路由父页
    - auth.vue：权限管理
    - role.vue：角色管理
    - user.vue：用户管理
  - others：其他页面
    - 404.vue：404 页面
    - 500.vue：500 页面
    - index.vue：主页
    - restful.vue：restful api 接口测试页
- plugins：自定义或第三方插件
  - axios.js：@nuxtjs/axios 扩展配置
  - element-ui.js：ElementUI 使用配置
- store：vuex 状态树配置
- server：服务端配置
- static：静态文件，不会被构建编译，直接映射至根目录下
- utils：公共 utils 函数
  - utils.js：公用函数
  - routes.js：自定义路由配置
  - resizeHandler.js：PC 端、移动端响应式配置
- nuxt.config.js：nuxt.js 应用的个性化配置，可覆盖默认配置
- package.json：描述应用的依赖关系和对外暴露的脚本接口

## 身份认证

> 用户身份验证通常有两种方式，一种是基于 cookie 的认证方式，另一种是基于 token 的认证方式。当前常见的无疑是基于 token 的认证方式。

### token 认证

> token 是一个令牌，浏览器第一次访问服务端时，服务端会签发一张令牌。之后浏览器每次都要携带这张令牌进行访问，服务端就会认证该令牌是否有效，验证请求的合法性。一般令牌由用户信息、时间戳和由 hash 算法加密的签名构成，令牌中包含的用户信息还可以区分不同身份的用户。

#### token 认证流程

1. 客户端使用用户名和密码请求登录；
2. 服务端收到请求，验证用户名和密码；
3. 验证成功后，服务端会签发一个 token ，并把该 token 发送给客户端；
4. 客户端收到 token 后把它存储起来，比如存在 Cookie 或 Local Storage 中；
5. 客户端每次向服务端请求资源时，需要带着服务端签发的 token ；
6. 服务端收到请求后，验证客户端请求中携带的 token（如 request 头部添加 Authorization ），如果验证成功，就向客户端返回请求的数据，如果不成功返回 401 错误码，鉴权失败。

#### token 认证优缺点

1. 优点：无状态机制，在此基础上，可以实现天然的跨域和前后端分离等。
2. 缺点：服务器每次都需要对其进行验证，会产生额外的运行压力。此外，无状态的 api 缺乏对用户流程或异常的控制，为了避免一些例如回放攻击的异常情况，大多会设置较短的过期时间。

#### JSON Web Token (JWT)

> JWT 是一个开放标准(RFC 7519)，它定义了一种简洁的、自包含的方法，用于通信双方之间以 JSON 对象的形式安全地传输信息。该信息可以被验证和信任，因为它是数字签名的，JWT 可以使用 HMAC 算法或者是 RSA 的公钥密钥进行签名。

实战逻辑：

- 1.服务端生成 token，在登录路由中进行验证，可携带用户名等必要信息，并将其放至上下文对象中。

```js
// 服务端生成token，详见 server/routes/user.js
const jwt = require("jsonwebtoken"); // 用于签发、解析`token`
const secret = "secret"; // jwt密钥
// 用户登录
router.post("/login", ctx => {
  const { username, password } = ctx.request.body;
  // jsonwebtoken在服务端生成token返回给客户端
  const token = jwt.sign({ username, password }, secret, { expiresIn: "2h" });
  ctx.body = {
    code: 0,
    data: {
      token
    },
    msg: "登录成功"
  };
});
```

- 2.客户端登录成功并获取 token 信息后，将其保存在客户端中。如 localstorage，cookie 等。

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

- 3.在请求服务器端 API 接口时，需要设置 authorization，把 token 带在请求头中传给服务器进行验证。如下两种方式(本项目采用的是第一种方式)：

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
  let params = Object.assign({}, ctx.request.query, ctx.request.body);
  ctx.request.header = { authorization: "Bearer " + (params.token || "") };
  await next();
});
```

#### koa-jwt 主要作用是控制哪些路由需要 jwt 验证，哪些接口不需要验证

![JWT过程演示](https://github.com/zptime/resources/blob/master/images/JWT.png)

- 1.koa-jwt 中间件的验证方式有三种：

  1. 在请求头中设置 authorization 为 Bearer + token，注意 Bearer 后有空格。（koa-jwt 的默认验证方式 {'authorization': "Bearer " + token}）
  2. 自定义 getToken 方法
  3. 利用 Cookie（此 cookie 非彼 cookie）此处的 Cookie 只作为存储介质发给服务端的区域，校验并不依赖于服务端的 session 机制，服务端不会进行任何状态的保存。

- 2.前端发送请求携带 token ，服务端收到请求后，需进行如下处理：
  - token 是否正确，不正确则返回错误
  - token 是否过期，过期则刷新 token 或返回 401 表示需要重新登录

```js
// 详见server/index.js
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

- 3.服务端刷新 token 后，前端需要同步更新 token ：服务端更新的 token 是在响应头里，所以前端需要在响应拦截器中获取新 token 。

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

<!-- [https://juejin.im/post/5cdb83fe51882569223af7ae](https://juejin.im/post/5cdb83fe51882569223af7ae) -->

### 自定义路由实现及路由权限配置

<!-- (1) Nuxt简单介绍及搭建过程：[http://blog.liuxiuqian.com/bloginfo/26](http://blog.liuxiuqian.com/bloginfo/26)
(2) 是否能加一个可以设置自动生成路由树的“meta”对象的一个方法：[https://github.com/nuxt/nuxt.js/issues/4749](https://github.com/nuxt/nuxt.js/issues/4749)
(3) nuxtjs如何通过路由meta信息控制路由查看权限：[https://www.cnblogs.com/goloving/p/11730607.html](https://github.com/nuxt/nuxt.js/issues/4749)
(4) fix(config) : fix `extendRoutes` method type： [https://github.com/nuxt/nuxt.js/pull/5841](https://github.com/nuxt/nuxt.js/pull/5841) -->

```js
// utils/routes.js
const menus = [
  {
    name: "login",
    path: "/login",
    meta: { requireAuth: false }
  },
  {
    name: "center",
    path: "/center",
    meta: { title: "个人中心", icon: "el-icon-user", hidden: false }
  },
  {
    name: "system",
    path: "/system",
    meta: { title: "系统管理", icon: "el-icon-setting", hidden: false },
    children: [
      {
        name: "system-user",
        path: "user",
        meta: { title: "用户管理", icon: "el-icon-headset", hidden: false }
      },
      {
        name: "system-role",
        path: "role",
        meta: { title: "角色管理", icon: "el-icon-monitor", hidden: false }
      }
    ]
  }
];

const iterator = (list, menus) => {
  const defaultMeta = {
    hidden: true,
    requireAuth: true
  };
  for (const item in list) {
    for (const m in menus) {
      if (
        list[item].name === menus[m].name &&
        list[item].path === menus[m].path
      ) {
        list[item].meta = Object.assign({}, defaultMeta, menus[m].meta || {});
        if (list[item].children && list[item].children.length > 0) {
          iterator(list[item].children, menus[m].children);
        }
      }
    }
  }
  return list;
};

module.exports = (routes, resolve) => {
  routes = iterator(routes, menus);
};
```

### 路由鉴权：路由拦截，无 token 时跳入登录页面

```js
// middleware/authorities.js
import { getToken, getTokenInServer } from "~/utils/utils.js";
export default function({ req, route, redirect }) {
  const isLogin = route.name && route.name.indexOf("login") === 0; // 登录页不需验证
  const isAuth = route.meta.some(record => record.requireAuth); // 是否需要强制登录
  const path = route.fullPath.split("?")[1]
    ? "?" + route.fullPath.split("?")[1]
    : "";
  const redirectURL = "/login" + path;
  const token = process.server ? getTokenInServer(req) : getToken();
  if (process.server) {
    // 服务端渲染
    if (!isLogin && isAuth && !token) {
      return redirect(redirectURL);
    }
  }

  if (process.client) {
    // 客户端渲染
    if (!isLogin && isAuth && !token) {
      return redirect(redirectURL);
    }
  }
}
```

## 问题解决

### nuxt.config.js 配置文件的 import/export 模块导入错误

使用 import 引入文件报错：import routes from './utils/routes' SyntaxError: Unexpected identifier

解决 import 和 export 不能用的问题：node 版本 9 以上就已经支持了，但是需要把文件名改成\*.mjs,并且加上--experimental-modules 选项。此项目使用的方法是换成 require/export

- 模块导入导出有哪些方式:
  - 模块导入方式有：require、import、import xxx from yyy、import {xx} from yyy
  - 模块导出方式有：exports、module.exports、export、export.default
- 使用规则和范围:
  - 模块导入方面
    - require: node 和 ES6 都支持的模块导入方式
    - import 和 import xxx from yyy 和 import {xx} from yyy：只有 ES6 支持
  - 模块导出方面
    - module.exports/exports: node 本身支持的模块导出方式
    - export/import: 只有 ES6 支持的模块导出方式
- CommonJS 规范(node 中模块的导入导出)
  - 由于之前 js 没有很统一比较混乱，代码按照各自的喜好写并没有一个模块的概念，而这个规范说白了就是对模块的定义:
  - CommonJS 定义模块分为：模块标识(module)、模块定义(exports)、模块引用(require)

```js
// 错误写法(import/export)
export default (routes, resolve) => {
  routes = iterator(routes, menus);
};
import routes from "./utils/routes";

// 正确写法(require/export)
module.exports = (routes, resolve) => {
  routes = iterator(routes, menus);
};
const routes = require("./utils/routes.js");
```

### 刷新页面时，侧栏先展开，再收起，用户可以清楚的看到这个过程，体验感不好

- 验证不同生命周期，相关判断条件的值

测试方式：console.log 输出日志

```js
// store/app.js
import { getLocalCache } from '~/utils/utils.js'
sidebar: {
  opened: getLocalCache(sideBarFlag, 'vuex') ? !!+getLocalCache(sideBarFlag, 'vuex') : true,
  withoutAnimation: false
}

// utils/utils.js
export function getLocalCache (name, type) {
  console.log(Cookies.get(name) + '...' + name + '...' + type)
  return Cookies.get(name)
}

// layouts/default.vue
// 备注：所有用到这三个值的地方，都注释掉，否则会出现多余的日志语句。如v-if="device==='mobile'会触发device的computed，会多打印出一条日志。多次用到某值时，服务端会打印出多条，客户端只打印了一条。
export default {
  computed: {
    fixedHeader () {
      console.log('computed...fixedHeader...' + this.$store.state.settings.fixedHeader)
      return this.$store.state.settings.fixedHeader
    },
    device () {
      console.log('computed...device...' + this.$store.state.app.device)
      return this.$store.state.app.device
    },
    sidebar () {
      console.log('computed...sidebar...' + JSON.stringify(this.$store.state.app.sidebar))
      return this.$store.state.app.sidebar
    }
  },
  created () {
    console.log('created...sidebar...' + JSON.stringify(this.sidebar))
    console.log('created...device...' + this.device)
    console.log('created...fixedHeader...' + this.fixedHeader)
  },
  mounted () {
    console.log('mounted...sidebar...' + JSON.stringify(this.sidebar))
    console.log('mounted...device...' + this.device)
    console.log('mounted...fixedHeader...' + this.fixedHeader)
  },
}
```

测试结果：左侧为服务端终端打印日志，右侧为浏览器控制端打印日志。
![服务端日志](https://github.com/zptime/resources/blob/master/images/aside-server-console.png)
![客户端日志](https://github.com/zptime/resources/blob/master/images/aside-client-console.png)

测试结论如下：

1. vuex初始化、 computed、created阶段在服务端和客户端均会运行；asyncData、fecth仅在服务端运行；mounted开始之后，仅在客户端运行
2. vuex初始化获取cookie，服务端渲染时无window对象，故此值为undefined；客户端有beforeMount阶段前没有，beforeMount开始有window对象，可正确获取到值
3. asyncData、fetch仅在页面组件有效，在default.vue中无效
4. 生命周期先后顺序：vuex(store) -> asyncData(数据合并到data) -> fetch(数据同步到store) -> computed -> created -> mounted
5. 客户端aside_status打印两次，是因为aside_status有值，getLocalCache(sideBarFlag, 'vuex')为true，执行了两遍

- 分析问题原因
  - 分析resizeHandler.js：mounted()阶段会在页面刷新时触发，页面进来的一瞬间isMobile为false，mounted()完后才变成true，这会导致侧栏组件显示和隐藏都慢半拍。default.vue的computed(classObj)在mounted之前就执行了，所以是以false来赋值的，之后才变为true，导致侧栏会闪现一下。
  - store.app.sidebar初始化时，总是一个值，判断条件无效

```js
// store/app.js
export const state = () => {
  return {
    sidebar: {
      // 每次刷新页面，都相当于打开服务端渲染的第一个页面，服务端运行到该处时，getLocalCache(sideBarFlag, 'vuex')为undefined，所以该三元判断的结果一直为true，每次刷新页面PC端侧栏都是展开的状态，H5端都是先展开后隐藏的状态。不刷新页面，直接路由跳转是没问题的。
      opened: getLocalCache(sideBarFlag, 'vuex') ? !!+getLocalCache(sideBarFlag, 'vuex') : true,
      withoutAnimation: false
    }
  }
}
```

- 尝试解决问题
  - store.app.sidebar固定默认值，opened为false。
  - default.vue页面sidebar()不放在computed阶段。
  - 改造resizeHandler.js：经过测试，beforeMount()在computed()之前运行，而mounted()在computed之后运行，故此可将isMobile的判断放在beforeMount()，而不是mounted()。

```js
// resizeHandler.js 改造前
beforeMount () {
  window.addEventListener('resize', this.$_resizeHandler)
},
mounted () { // 刷新页面时触发
  const isMobile = this.$_isMobile()
  console.log('_resizeHandler...mounted...' + isMobile)
  this.$store.dispatch('app/toggleMobile', isMobile)
  if (isMobile) {
    this.$store.dispatch('app/closeSideBar', { withoutAnimation: true })
  }
},

// resizeHandler.js 改造后
beforeMount () {
  window.addEventListener('resize', this.$_resizeHandler)

  // 刷新页面时触发
  const isMobile = this.$_isMobile()
  console.log('_resizeHandler...beforeMount...' + isMobile)
  this.$store.dispatch('app/toggleMobile', isMobile)
  if (isMobile) {
    this.$store.dispatch('app/closeSideBar', { withoutAnimation: true })
  } else {
    this.$store.dispatch('app/setSideBar')
  }
}
```

- 上述解决后，当opened为false时刷新页面，会产生新的问题：`The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render`(客户端渲染的虚拟DOM树与服务器渲染的内容不匹配。这可能是由于错误的HTML标记（例如，在`<p>`内嵌套块级元素或缺少`<tbody>`）引起的。保证和执行完整的客户端渲染。)
  - 经排查，是AsideItem组件引起的报错
  - 原因：上述步骤，beforeMount阶段改变了store的值，导致服务端和客户端computed阶段获取的值不匹配。

![问题控制台展示](https://github.com/zptime/resources/blob/master/images/nuxt-aside-problem-1.png)
![问题页面展示](https://github.com/zptime/resources/blob/master/images/nuxt-aside-problem-2.png)
![服务端终端展示](https://github.com/zptime/resources/blob/master/images/nuxt-aside-problem-3.png)

[nodejs实战](https://juejin.im/post/5c1f8e52f265da6170071e43#heading-18)
