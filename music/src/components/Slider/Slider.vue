<template>
  <div class="slider" ref="sliderBox">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots" v-if="dots.length > 0">
      <span
        :class="['dot', { active: currentPageIndex === index }]"
        v-for="(item, index) in dots"
        :key="index"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';

BScroll.use(Slide);

export default {
  name: 'slider',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0,
      children: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this._initConfig();
      }, 20);
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.slider.destroy();
  },
  methods: {
    _initConfig() {
      try {
        this._setSliderWidth();
        this._initDot();
        this._initSlider();
      } catch (error) {
        console.error('data not ready');
      }
    },
    // 设置滑动容器宽度
    _setSliderWidth() {
      // 获取子元素 获取到一个伪数组
      this.children = this.$refs.sliderGroup.children;
      // 初始化一个宽度变量
      let width = 0;
      // 获取最外层盒子宽度
      this.sliderWidth = this.$refs.sliderBox.clientWidth
        ? this.$refs.sliderBox.clientWidth
        : window.innerWidth;
      // 设置图片容器的宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        child.style.width = `${this.sliderWidth}px`;
        if (!child.classList.contains('slider-item')) {
          child.classList.add('slider-item');
        }
        width += this.sliderWidth;
      }
      if (this.loop) {
        width += 2 * this.sliderWidth;
      }
      this.$refs.sliderGroup.style.width = `${width}px`;
    },
    // 初始化滑动
    _initSlider() {
      this.slider = new BScroll('.slider', {
        scrollX: true,
        scrollY: false,
        momentum: false,
        slide: {
          loop: this.loop
        },
        bounce: false
      });
      this.slider.on('scrollEnd', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
      this.slider.on('beforeScrollStart', () => {
        clearTimeout(this.timer);
      });
      this.slider.on('slideWillChange', page => {
        this.currentPageIndex = page.pageX;
      });
      // 检测自动播放
      if (this.autoPlay) {
        this._play();
      }
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    },
    // 初始化白点
    _initDot() {
      this.dots = new Array(this.children.length);
    }
  },
  watch: {
    data(newData) {
      if (newData.length > 0) {
        this.$nextTick(() => {
          this._initConfig();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
.slider {
  min-height: 1px;
  overflow: hidden;
  position: relative;
  border-radius: $radiu-banner;
  box-shadow: $shadow-banner;
  .slider-group {
    position: relative;
    white-space: nowrap;
    &:after {
      content: '';
      width: 100%;
      display: block;
      clear: both;
    }
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
