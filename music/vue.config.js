module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      title: 'LMusic'
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        components: '@/components',
        views: '@/views',
        assets: '@/assets',
        api: '@/api'
      }
    }
  },
  publicPath: './'
};
