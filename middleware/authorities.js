import { getToken, getTokenInServer } from '~/utils/utils.js'
/**
 * @Description: 中间件配置路由拦截
 * @date: 2019/11/15
 *
 * 注意：middleware中进行路由鉴权，路由地址改变时是有效的，但是刷新不会触发。而且在服务器端渲染的第一个页面也是不会触发的。
 * 解决刷新拦截失效：在 layouts/default.vue 页面的 created 阶段判断 token 是否存在，不存在时跳入登录页面
 * 解决刷新拦截失效：或者在 plugins/auth.js 插件中， 在 router.beforeEach 导航守卫中拦截处理
 *
 * 注意：页面初次加载， 第一个页面会在服务器端渲染，要注意window对象的问题，例如无法获取cookie、部分UI库无法正常渲染等等问题。
 * 解决：开发时，将接口分为两部分，不需要依赖客户端资源的放在fetch、asyncData中进行，其他的放在mounted进行。fetch中调用可以将数据同步到store中， 而asyncData会将数据合并到当前页面的data中。
 */
export default function ({ req, route, redirect }) {
  const isLogin = (route.name && route.name.indexOf('login') === 0) // 登录页不强制登录
  const path = route.fullPath.split('?')[1] ? ('?' + route.fullPath.split('?')[1]) : ''
  const redirectURL = '/login' + path
  if (process.server) { // 服务端渲染
    if (!getTokenInServer(req) && route.name !== 'index' && !isLogin) {
      return redirect(redirectURL)
    }
  }

  if (process.client) { // 客户端渲染
    if (!getToken() && route.name !== 'index' && !isLogin) {
      return redirect(redirectURL)
    }
    // const token = false;
    // if (route.meta.length > 0 && route.meta[0].requireAuth) {
    //   if (!token && route.path !== '/login') {
    //     redirect(redirectURL);
    //   }
    // }
  }
}
