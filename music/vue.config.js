module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        components: '@/components',
        views: '@/views',
        assets: '@/assets',
        api: '@/api'
      }
    }
  }
};
