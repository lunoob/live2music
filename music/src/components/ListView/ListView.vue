<template>
  <scroll
    :data="data"
    class="listview"
    ref="listview"
    :probetype="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll"
  >
    <div>
      <ul>
        <li
          class="list-item-group"
          v-for="(itemgroup, index) in data"
          :key="index"
          ref="itemGroup"
        >
          <h1 class="item-group-title">{{ itemgroup.title }}</h1>
          <ul>
            <li
              @click="selectSinger(item)"
              class="group-item"
              v-for="item in itemgroup.items"
              :key="item.id"
            >
              <img class="avatar" v-lazy="item.avatar" />
              <span class="name">{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="list-shortcut">
      <!-- 快速拖动 -->
      <ul>
        <li
          @touchstart="onShortCutTouchStart"
          @touchmove.stop.prevent="onShortCutTouchMove"
          @touchend="onShortCutTouchEnd"
          class="item"
          :class="{ active: currentIndex === index }"
          v-for="(item, index) in data"
          :key="index"
          :data-index="index"
          ref="listItem"
        >
          {{ item.title.substr(0, 1) }}
        </li>
        <li class="pointPosi" :style="currentTop" v-show="pointShow">
          {{ currentText }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY < 0" ref="fixedTop">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'components/Scroll/Scroll';
import { getData } from 'assets/js/common';

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  name: 'list-view',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      pointShow: false
    };
  },
  computed: {
    currentTop() {
      let top = this.currentIndex ? (this.currentIndex - 1) * 18 : -18;
      return `top:${top}px;`;
    },
    currentText() {
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title.substr(0, 1)
        : 'null';
    },
    fixedTitle() {
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : '';
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  methods: {
    selectSinger(item) {
      this.$emit('select', item);
    },
    onShortCutTouchStart(e) {
      this.pointShow = true;
      let target = e.target;
      let AnchorIndex = getData(target, 'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.AnchorIndex = AnchorIndex;
      this._scrollTo(AnchorIndex);
    },
    onShortCutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      // 获取偏离了多少个索引位置
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0; // 向下取整 | 0 , Math.floor();
      let AnchorIndex = parseInt(this.touch.AnchorIndex) + delta;
      this._scrollTo(AnchorIndex);
    },
    onShortCutTouchEnd() {
      this.pointShow = false;
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    _calculateHeight() {
      // 初始化listHeight[]
      this.listHeight = [];
      const list = this.$refs.itemGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight; //padding + border + content
        this.listHeight.push(height);
      }
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.$refs.listview.scrollToElement(this.$refs.itemGroup[index], 0);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newVal) {
      let listHeight = this.listHeight;
      if (newVal > 0) {
        // 活动>0
        this.currentIndex = 0;
        return;
      }
      // 中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let prevHeight = listHeight[i];
        let nextHeight = listHeight[i + 1];
        if (-newVal >= prevHeight && -newVal < nextHeight) {
          this.currentIndex = i;
          this.diff = nextHeight + newVal;
          return;
        }
      }
      // 当滚动到底部，且-newVal 大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      // 判断向上滑的时机和位移
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop == fixedTop) {
        // 归0的情况
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixedTop.style.transform = `translateY(${this.fixedTop}px)`;
    }
  },
  components: {
    Scroll
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';
.listview {
  position: relative;
  height: 100%;
  overflow: hidden;
  .list-item-group {
    padding-bottom: 20px;
    .item-group-title {
      @include list-title;
    }
    .group-item {
      padding: 20px 0 0 30px;
      display: flex;
      align-items: center;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-dd;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 10px 0;
    text-align: center;
    border-radius: 10px;
    box-shadow: $shadow-simple;
    ul {
      position: relative;
    }
    .pointPosi {
      position: absolute;
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-radius: 50%;
      top: -15px;
      right: 50px;
      background-color: $color-theme;
      color: white;
      font-weight: bold;
      &::after {
        content: '';
        top: 50%;
        left: 100%;
        -webkit-transform: translate3d(-20px, -50%, 0);
        transform: translate3d(-15px, -50%, 0);
        position: absolute;
        border-radius: 25px;
        border-width: 25px;
        border-style: solid;
        border-color: transparent transparent transparent $color-theme;
      }
    }
    .item {
      color: $color-text-d;
      font-size: $font-size-small;
      padding: 3px;
      // 参照字体大小 这里相当于 line-height: $font-size-small;
      line-height: 1;
    }
    .active {
      color: $color-theme !important;
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      @include list-title;
    }
  }
}
</style>
