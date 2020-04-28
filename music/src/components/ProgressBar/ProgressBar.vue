<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="cacheBar" :style="cacheWidth"></div>
      <div class="progress" ref="progress">
        <div class="progress-btn-wrapper">
          <div
            class="progress-btn"
            @touchstart.prevent="onProgressTouchStart"
            @touchmove.prevent="onProgressTouchMove"
            @touchend="onProgressTouchEnd"
            ref="progressBall"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'assets/js/common';
const transform = prefixStyle('transform');

const BALL_WIDHT = 16;
export default {
  name: 'progressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    },
    cache: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 创建该实例上的共享数据变量
    this.touch = {};
  },
  computed: {
    cacheWidth() {
      return `width:${this.cache}%;`;
    }
  },
  methods: {
    progressClick(e) {
      let rect = this.$refs.progress.getBoundingClientRect();
      let offset = e.pageX - rect.left;
      // 点击进度条没有问题，点击播放按钮的时候出现问题
      // this._offset(e.offsetX);
      this._offset(offset);
      this._triggerPercent();
    },
    onProgressTouchStart(e) {
      // 标志touchstart
      this.touch.initiated = true;
      // 获取第一个手指触碰的x坐标
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    onProgressTouchMove(e) {
      // 判断是否直接touchmove
      if (!this.touch.initiated) {
        return;
      }
      // 获取位移
      const deltax = e.touches[0].pageX - this.touch.startX;
      // 获取偏移的宽度
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - BALL_WIDHT,
        Math.max(0, this.touch.left + deltax)
      );
      this._offset(offsetWidth);
      // 派发事件，让外部可以改变当前的播放时间
      this._triggerPercent('move');
    },
    onProgressTouchEnd() {
      if (!this.percent) {
        return this._offset(0);
      }
      // 标志结束
      this.touch.initiated = false;
      // 派发事件，让外部可以改变当前的播放时间
      this._triggerPercent('end');
    },
    _triggerPercent(type) {
      let barWidth = this.$refs.progressBar.clientWidth - BALL_WIDHT;
      let percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit('percentChange', percent, type);
    },
    _offset(offset) {
      this.$refs.progress.style.width = `${offset}px`;
      this.$refs.progressBall.style[
        transform
      ] = `translate3d(${offset}px, 0, 0)`;
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 获取进度条宽度 - 小球宽度(因为小球会遮挡一些空间)
        let barWidth = this.$refs.progressBar.clientWidth - BALL_WIDHT;
        let offset = newPercent * barWidth;
        this._offset(offset);
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: $color-background-d;
    .cacheBar {
      position: absolute;
      top: 0;
      left: 0;
      // width: 50%;
      height: 100%;
      border-radius: 10px;
      background-color: #5a5a5a;
    }
    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-theme;
      box-shadow: 0 0 5px $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background-color: $color-theme;
      }
    }
  }
}
</style>
