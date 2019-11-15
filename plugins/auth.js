/**
 * @Description: 导航守卫
 * @date: 2019/11/15
 */
export default ({ app }) => {
  // app.router.beforeEach((to, from, next) => {
  //   if (process.client) {
  //     // const token = sessionStorage.getItem('token');
  //     const token = true;
  //     // if (to.matched.length ===0) {                                        //如果未匹配到路由
  //     //   // from.name ? next({ name:from.name }) : next({path: '/notfind'});
  //     // } else {
  //     //   next();                                                                           //如果匹配到正确跳转
  //     // }
  //     if (to.meta.requireAuth) {
  //       if (token) {
  //         next()
  //       } else {
  //         next({
  //           path: '/login'
  //           // query: {redirect: to.fullPath}//把要跳转的地址作为参数传到下一步
  //         })
  //       }
  //     } else {
  //       next()
  //     }
  //   }
  // })
}
