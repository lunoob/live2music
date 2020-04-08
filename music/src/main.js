import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import fastclick from 'fastclick';
import router from './router';
import store from './store';
// 引入图片懒加载
import VueLazyload from 'vue-lazyload';

// 解决移动端点击300ms延迟
fastclick.attach(document.body);

// or with options
Vue.use(VueLazyload, {
  loading: require('assets/images/lazy_Loading.png')
});

import 'assets/css/index.scss';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
