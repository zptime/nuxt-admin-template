export default function ({ store, error, redirect }) {
  // 可通过组件的props接收error信息
  if (!store.state.token) {
    // error({
    //   message: 'cookie失效或未登录，请登录后操作',
    //   statusCode: 403
    // })
    redirect('/login')
  }
}
