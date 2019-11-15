/**
 * @description: 自定义路由配置文件
 * @abstract: 仅仅只用于侧边栏的菜单显示和权限,其它的不做任何功能
 * @author: menus 结构要与 nuxtjs 自动生成的保持一致，特别是 path 和 name
 * @date: 2019/11/15
 * @param {*} title 菜单名
 * @param {*} icon 菜单图标
 * @param {*} hidden 是否隐藏菜单，默认true，即不在左侧菜单栏显示
 * @param {*} requireAuth 菜单权限，默认true
 * @param {*} roles 控制页面的角色，如['admin','editor']
 */
const menus = [
  {
    path: '/',
    name: 'index',
    meta: { hidden: true, requireAuth: true }
  },
  {
    path: '/404',
    name: '404',
    meta: { requireAuth: false }
  },
  {
    path: '/500',
    name: '500',
    meta: { requireAuth: false }
  },
  {
    path: '/restful',
    name: 'restful'
  },
  {
    path: '/login',
    name: 'login',
    meta: { requireAuth: false }
  },
  {
    path: '/info',
    name: 'info',
    meta: { title: '个人中心', icon: 'el-icon-user', hidden: false }
  },
  {
    path: '/log',
    name: 'log',
    meta: { title: '变更日志', icon: 'el-icon-document', hidden: false }
  },
  {
    path: '/system/user',
    name: 'system-user',
    meta: { title: '用户管理', icon: 'el-icon-document', hidden: false }
  }, {
    path: '/system/role',
    name: 'system-role',
    meta: { title: '角色管理', icon: 'el-icon-document', hidden: false }
  }, {
    path: '/system/auth',
    name: 'system-auth',
    meta: { title: '权限管理', icon: 'el-icon-document', hidden: false }
  }
];

/**
 * 递归查询路由权限
 * @param {*} list
 * @param {*} menus
 */
const iterator = (list, menus) => {
  const defaultMeta = {
    hidden: true,
    requireAuth: true
  }
  for (const item in list) {
    for (const m in menus) {
      if ((list[item].name === menus[m].name) && (list[item].path === menus[m].path)) {
        list[item].meta = Object.assign(menus[m].meta || {}, defaultMeta)
        if ('meta' in menus[m] && 'requireAuth' in menus[m].meta && menus[m].meta.requireAuth) {
          list[item].meta.requireAuth = true
        }
        if (list[item].children && list[item].children.length > 0) {
          iterator(list[item].children, menus[m].children)
        }
      }
    }
  }
  return list
}

module.exports = (routes, resolve) => {
  routes = iterator(routes, menus)
  console.log(routes)
}
