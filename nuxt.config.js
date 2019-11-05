
module.exports = {
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~assets/css/main.scss'
  ],
  styleResources: {
    // 配置全局 scss 变量 和 mixin
    scss: [
      './assets/css/variables.scss',
      './assets/css/mixins.scss'
    ]
  },
  plugins: [
    '@/plugins/element-ui',
    { src: '~plugins/axios' }
  ],
  buildModules: [
    '@nuxtjs/eslint-module'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources'
  ],
  axios: {
    proxy: true, // 代理
    debug: false,
    baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT ||
      3000}`
  },
  proxy: { // 代理配置
    '/api': 'http://localhost:3000'
  },
  build: {
    transpile: [/^element-ui/],
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
