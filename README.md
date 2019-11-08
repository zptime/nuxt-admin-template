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
  - 问题：computed 阶段：Cookies.get('sidebarStatus')一直为 undefined。原因：computed 阶段，document 对象不存在；mounted 阶段，可获取到 cookied 值。
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
![JWT过程演示](JWT.png)

koa-jwt 中间件的验证方式有三种：

1. 在请求头中设置 authorization 为 Bearer + token，注意 Bearer 后有空格。（koa-jwt 的默认验证方式 {'authorization': "Bearer " + token}）
2. 自定义 getToken 方法
3. 利用 Cookie（此 cookie 非彼 cookie）此处的 Cookie 只作为存储介质发给服务端的区域，校验并不依赖于服务端的 session 机制，服务端不会进行任何状态的保存。

实战逻辑：

1. 在登录路由中进行验证，可携带用户名等必要信息，并将其放至上下文对象中。详见 server/routes/user.js 的 login 接口

### cookie 认证

## 路由鉴权
