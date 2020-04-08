<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
export default {
  name: 'scroll',
  props: {
    probetype: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      let scroll = this.$refs.scroll;
      if (scroll) {
        this.scroll = new BScroll(scroll, {
          probeType: this.probetype,
          click: this.click
        });

        if (this.listenScroll) {
          let vm = this;
          this.scroll.on('scroll', pos => {
            vm.$emit('scroll', pos);
          });
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', ({ y }) => {
            // 加上50是为了做缓冲作用
            if (y < this.scroll.maxScrollY + 50) {
              this.$emit('scrollToEnd');
            }
          });
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll');
          });
        }
      }
    },
    enable() {
      // 如果this.scroll存在则this.scroll.enable()
      // --> if(this.scroll) { this.scroll.enable(); }
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      // 重新计算容器的高度
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      // 使用apply是为了保证this是指向当前调用对象
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style></style>
