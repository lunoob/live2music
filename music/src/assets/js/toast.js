import Vue from 'vue';
import Toast from 'components/Toast/Toast';

// 创建vue的子类，即让Toast成为vue的子类
const ToastInstance = Vue.extend(Toast);

/**
 * 调用方法(使用闭包)
 * @date 2020-04-06
 * @param {Object || String} option 配置项 默认空对象
 *  {
 *      duration: 显示时间,
 *      title: 显示标题,
 *      icon: 显示的图标
 *  }
 * @returns {any}
 */
function show() {
  // 创建ToastInstance的一个实例对象
  const newToast = new ToastInstance();
  // 获取该对象的vue实例
  const vm = newToast.$mount();
  return {
    show(option = {}) {
      if (typeof option === 'string') {
        option = {
          title: option
        };
      }
      // 插入body元素中
      for (let key in option) {
        vm[key] = option[key];
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        document.querySelector('#app').removeChild(vm.$el);
      }, option.duration || 1500);
      document.querySelector('#app').appendChild(vm.$el);
    }
  };
}

let toast = show();

export default toast;
