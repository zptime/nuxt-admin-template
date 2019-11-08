import Cookies from 'js-cookie'

const TokenKey = 'koa_admin_template_token'
const TokenExp = 'token_exp'

export function getToken () {
  // localStorage.getItem(TokenKey)
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  // localStorage.setItem(TokenKey, res.data)
  // localStorage.setItem(TokenExp, new Date().getTime())
  // 存储当前时间，可以判断 token 是否存在，也可以判断当前 token 是否过期，如果过期，则跳登录页面
  Cookies.set(TokenExp, new Date().getTime())
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 获取服务端cookie
export function getcookiesInServer (req) {
  const serviceCookie = {}
  req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
    const parts = val.split('=')
    serviceCookie[parts[0].trim()] = (parts[1] || '').trim()
  })
  return serviceCookie
}

// 获取客户端cookie
export function getcookiesInClient (key) {
  return Cookies.get(key) ? Cookies.get(key) : ''
}
