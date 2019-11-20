/**
 * @Description: 路由鉴权(中间件配置路由拦截)
 *
 * 服务端渲染(process.server)：第一个页面打开 或者 刷新页面时触发。前端调试(debugger)时，不会触发该页面，但使用console.log 可以在服务端控制台看到效果。服务端调试(.vscode/launch.json)时，也是无效的，只能console.log。
 *
 * 客户端渲染(process.client)：路由地址改变时是有效的，但是刷新不会触发，而且在服务器端渲染的第一个页面也是不会触发的。
 *
 * 注意：页面初次加载，第一个页面会在服务器端渲染，要注意window对象的问题，例如无法获取cookie、部分UI库无法正常渲染等等问题。可合理使用fetch、asyncData，fetch可以将数据同步到store，asyncData会将数据合并到当前页面的data中。
 */
import { getToken, getTokenInServer } from '~/utils/utils.js'
export default function ({ req, route, redirect }) {
  const isLogin = (route.name && route.name.indexOf('login') === 0) // 登录页不需验证
  const isAuth = route.meta.some(record => record.requireAuth) // 是否需要强制登录
  const path = route.fullPath.split('?')[1] ? ('?' + route.fullPath.split('?')[1]) : ''
  const redirectURL = '/login' + path
  const token = process.server ? getTokenInServer(req) : getToken()
  if (process.server) { // 服务端渲染
    // console.log('server...' + route.name)
    if (!isLogin && isAuth && !token) {
      // console.log('server...' + route.name + '...' + isLogin + '...' + isAuth + '...' + token)
      return redirect(redirectURL)
    }
  }

  if (process.client) { // 客户端渲染
    // console.log('client...' + route.name)
    if (!isLogin && isAuth && !token) {
      // console.log('client...' + route.name + '...' + isLogin + '...' + isAuth + '...' + token)
      return redirect(redirectURL)
    }
  }
}
