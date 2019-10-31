export default ({ $axios, redirect }) => {
  // 请求拦截器
  $axios.onRequest((config) => {
    // eslint-disable-next-line no-console
    console.log('Making request to ' + config.url)
    return config
  })

  // 响应拦截器
  $axios.onResponse((resp) => {
    return Promise.resolve(resp.data)
  })

  $axios.onError((error) => {
    // const code = parseInt(error.response && error.response.status)
    // if (code === 404) {
    //   redirect('/404')
    // }
    // if (code === 500) {
    //   redirect('/500')
    // }
    // 请求不会就此结束，会继续传到then中，即无论请求成功还是失败，在成功的回调中都能收到通知
    return Promise.resolve(error)
  })
}
