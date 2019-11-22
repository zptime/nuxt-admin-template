import { getToken, setToken } from '~/utils/utils.js'

export default ({ $axios, redirect }) => {
  // 基本配置
  $axios.defaults.timeout = 10000
  $axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  // 请求拦截器
  $axios.onRequest((config) => {
    const token = getToken()
    if (token) {
      // Bearer是JWT的认证头部信息
      config.headers.common.Authorization = `Bearer ${token}`
      // config.headers.Authorization = `Bearer ${token}`
    }
    // console.log('Making request to ' + config.url)
    return config
  })

  // 响应拦截器
  $axios.onResponse((resp) => {
    // 获取更新的token
    const { authorization } = resp.headers
    // 如果token存在，则存在cookie中
    authorization && setToken(authorization)
    return Promise.resolve(resp.data)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 404) {
      redirect('/404')
    }
    if (code === 500) {
      redirect('/500')
    }
    // if (code === 10002) { // token 异常
    //   redirect('/login')
    // }
    // 请求不会就此结束，会继续传到then中，即无论请求成功还是失败，在成功的回调中都能收到通知
    return Promise.resolve(error)
  })
}
