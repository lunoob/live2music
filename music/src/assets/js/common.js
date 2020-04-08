/**
 * 获取data-set属性
 * @date 2020-03-23
 * @param {any} el  Dom元素
 * @param {any} name  data-{name}
 * @param {any} val   如果有val，则进行设置
 * @returns {null} | {String}
 */
function getData(el, name, val) {
  let prefix = 'data-';
  name = prefix + name;
  if (val) {
    el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}

export { getData };

/* ------------------------------------------------------------------------------- */

// 检测浏览器前缀(css在webpack中有loader会自动加前缀, js就不会, 需要自己配置)
let elementStyle = document.createElement('div').style;

/**
 * 检测当前浏览器厂商对应的前缀
 * @date 2020-03-23
 * @param null
 * @returns {String} | {Boolean}
 */
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
    return false;
  }
})();

/**
 * 对style进行加厂商前缀并返回
 * @date 2020-03-23
 * @param {any} css样式属性
 * @returns {Boolean} | {String}
 */
function prefixStyle(style) {
  // 如果检测不到浏览器厂商
  if (!vendor) {
    return false;
  }
  // 标准浏览器
  if (vendor === 'standard') {
    return style;
  }
  // return 厂商前缀+style名字
  return vendor + style.substr(0, 1).toUpperCase() + style.substr(1);
}

export { prefixStyle };

/* ------------------------------------------------------------------------------- */

/**
 * 打乱函数(洗牌算法)
 * 遍历list，从0-i区间中随机取一个数，与当前list[i]做替换
 * @date 2020-03-23
 * @param {Array} list
 * @returns {Array}
 */
function Shuffle(list) {
  // 注意这里会间接地把list也改变了，因为js中对象是引用机制; 所以需要拷贝一个数组
  let arr = list.slice();
  for (let i = 0; i < arr.length; i++) {
    let index = getRandom(0, i);
    let tem = arr[i];
    arr[i] = arr[index];
    arr[index] = tem;
  }
  return arr;
}

/**
 * 返回min - max区间中随意一个数（包含max）
 * @date 2020-03-23
 * @param {Number} min  小值
 * @param {Number} max  大值
 * @returns {Number}
 */
function getRandom(min, max) {
  return (Math.random() * (max - min + 1) + min) | 0;
}

export { Shuffle };

/* ------------------------------------------------------------------------------- */

/**
 * 查找数组中相对应的索引值
 * @date 2020-03-23
 * @param {any} list  列表歌曲信息
 * @param {any} song  歌曲信息
 * @returns {Number}
 */
function findIndex(list, song) {
  let index = list.findIndex(item => {
    return item.id === song.id;
  });
  return index;
}

export { findIndex };

/* ------------------------------------------------------------------------------- */

/**
 * 节流函数(闭包)
 * @date 2020-03-28
 * @param {Function} func
 * @param {Number|String} delay
 * @returns {Function}
 */
function debounce(func, delay) {
  let timer;

  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export { debounce };
