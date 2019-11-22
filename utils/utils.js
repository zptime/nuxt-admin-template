import Cookies from 'js-cookie'

const TokenKey = 'koa_token' // token
const Secret = 'secret' // jwt密钥

export { Secret, TokenKey }

// 获取客户端cookie
export function getToken () {
  // window.localStorage.getItem(TokenKey)
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  // window.localStorage.setItem(TokenKey, token)
  Cookies.set(TokenKey, token)
}

export function removeToken () {
  // window.localStorage.removeItem(TokenKey)
  Cookies.remove(TokenKey)
}

// 获取服务端token
export function getTokenInServer (req) {
  let serviceCookie = ''
  if (req && req.ctx && req.ctx.cookies) {
    serviceCookie = req.ctx.cookies.get('koa_token')
  }
  return serviceCookie
}

// 从本地缓存取值，如cookies
export function getLocalCache (name) {
  return Cookies.get(name)
}

// 本地缓存设置值，如cookies
export function setLocalCache (name, value) {
  return Cookies.set(name, value)
}
