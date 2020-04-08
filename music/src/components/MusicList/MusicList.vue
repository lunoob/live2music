<template>
  <div class="music-list">
    <div class="downNarrow" ref="downNarrow" @click="dropDown">
      <i class="icon-drop"></i>
    </div>
    <div class="nav-wrapper" ref="navWrapper">
      <div class="title">
        <p>{{ title }}</p>
        <i class="icon-back" ref="narrow" @click="retract"></i>
      </div>
      <div class="nav" ref="navBar">
        <div class="back" @click="back">
          <i class="icon-back"></i>
          <p class="text">返回</p>
        </div>
        <div class="play" @click="randomPlay">
          <i class="icon-play"></i>
          <p class="text">随机播放全部</p>
        </div>
      </div>
    </div>

    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length > 0" class="play" @click="randomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>-->
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-lazyer" ref="lazyer"></div>
    <scroll
      :data="songs"
      :probetype="probetype"
      :listenScroll="listenScroll"
      class="list"
      ref="list"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @select="select"
          :showIcon="true"
          :rank="rank"
        ></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading type="breath"></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/Scroll/Scroll';
import SongList from 'components/SongList/SongList';
import Loading from 'components/Loading/Loading';
import { prefixStyle } from 'assets/js/common';
import { mapActions } from 'vuex';
import { playlistMixin } from 'assets/js/mixin';

const transform = prefixStyle('transform');

export default {
  name: 'MusicList',
  mixins: [playlistMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  mounted() {
    // 获取到navbar的高度
    this.navBarHeight = this.$refs.navBar.clientHeight + 2; // 1是作为辅助量，避免偏差
    this.translateTop = this.$refs.navWrapper.clientHeight - this.navBarHeight;
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.MaxTranslate = -this.imageHeight + this.navBarHeight; // 最大偏移量
    this.triggerHeight =
      -this.imageHeight + this.$refs.navWrapper.clientHeight - 20; // 20是偏移量 标准值为10
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;

    // 给navWrapp加动画
    this._initNavWrapper();
  },
  created() {
    this.probetype = 3;
    this.listenScroll = true;
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  methods: {
    dropDown() {
      this.navWrapperFlag = true;
      this.$refs.downNarrow.classList.add('sildeOut');
      setTimeout(() => {
        this.$refs.downNarrow.style.display = 'none';
        this.$refs.downNarrow.classList.remove('sildeOut');
        this.$refs.navWrapper.style.display = 'block';
        this._initNavWrapper();
      }, 500);
    },
    retract() {
      this.navWrapperFlag = false;
      let wrapper = this.$refs.navWrapper;
      wrapper.classList.add('slideUp');
      setTimeout(() => {
        wrapper.style.display = 'none';
        wrapper.classList.remove('slideUp');
        this.$refs.downNarrow.style.display = 'block';
        this.$refs.downNarrow.classList.add('fadeIn');
        setTimeout(() => {
          this.$refs.downNarrow.classList.remove('fadeIn');
        }, 500);
      }, 500);
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    randomPlay() {
      this.playRandom(this.songs);
    },
    select(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    _initNavWrapper() {
      this.navWrapperFlag = true;
      this.$refs.navWrapper.classList.add('slideDown');
      setTimeout(() => {
        if (this.$refs.navWrapper) {
          this.$refs.navWrapper.classList.remove('slideDown');
        }
      }, 1000);
    },
    ...mapActions(['selectPlay', 'playRandom'])
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0,
        scale = 1;
      let wrapper = this.$refs.navWrapper;
      let translateY = Math.max(this.MaxTranslate, newY);
      this.$refs.lazyer.style[transform] = `translateY(${translateY}px)`;

      const percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale += percent;
        zIndex = 10;
        wrapper.style[transform] = `translate3d(0, -100%, 0)`;
      } else if (!wrapper.classList.contains('allwidth')) {
        wrapper.style[transform] = `translate3d(0, 0, 0)`;
      }

      // 文字越过图片
      if (newY < this.MaxTranslate) {
        // 到达导航位置
        zIndex = 10;
        this.$refs.bgImage.style.height = `${this.navBarHeight}px`;
        this.$refs.bgImage.style.paddingTop = 0;
        if (!wrapper.classList.contains('fixed')) {
          wrapper.classList.add('fixed');
          wrapper.style.top = -this.translateTop + 'px';
        }
        if (!this.navWrapperFlag) {
          this.navWrapperFlag = true;
          this.dropDown();
        }
      } else {
        this.$refs.bgImage.style.height = 0;
        this.$refs.bgImage.style.paddingTop = '70%';
        if (wrapper.classList.contains('fixed')) {
          wrapper.classList.remove('fixed');
        }
      }

      // 是否到达触发位置
      if (newY <= this.triggerHeight) {
        if (!wrapper.classList.contains('allwidth')) {
          wrapper.classList.add('allwidth');
        }
        // 还未到达导航位置时
        if (!wrapper.classList.contains('fixed')) {
          wrapper.style.top = newY - this.triggerHeight - 10 + 'px';
        }
      } else {
        if (wrapper.classList.contains('allwidth')) {
          wrapper.classList.remove('allwidth');
        }
        wrapper.style.top = -10 + 'px';
      }

      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .downNarrow {
    position: fixed;
    left: 10px;
    top: 20px;
    z-index: 20;
    padding: 5px;
    background-color: $color-background;
    border-radius: 50%;
    box-shadow: $shadow-nav;
    display: none;
    &:active {
      opacity: 0.5;
    }
    .icon-drop {
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .nav-wrapper {
    position: absolute;
    width: 90%;
    left: 50%;
    top: -10px;
    z-index: 20;
    margin-left: -45%;
    border-radius: 2px;
    background-color: $color-background;
    box-shadow: $shadow-nav;
    overflow: hidden;
    transition: all 0.5s;
    &.allwidth {
      width: 100%;
      left: 0;
      margin-left: 0%;
      transform: translate3d(0, 0, 0) !important;
      transition: none;
    }
    &.fixed {
      position: fixed;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      p {
        @include no-wrap;
      }
      .icon-back {
        font-size: $font-size-large-x;
        transform: rotate(90deg);
        transition: all 0.5s;
        padding: 5px;
        border-radius: 50%;
        &:active {
          background-color: $color-background-active;
        }
      }
    }
    .nav {
      display: flex;
      justify-content: space-between;
      padding: 0 12px;
      .text {
        font-size: $font-size-medium;
        color: $color-text-dd;
      }
      .back,
      .play {
        display: flex;
        padding: 10px;
      }
      .play {
        align-items: center;
        border-radius: 10px;
        &:active {
          background-color: $color-background-active;
        }
        .icon-play {
          font-size: $font-size-music-detail;
          color: $color-theme;
        }
        p {
          margin-left: 10px;
        }
      }
      .back {
        flex-direction: column;
        justify-content: center;
        border-radius: 10px;
        &:active {
          background-color: $color-background-active;
        }
        .icon-back {
          font-size: $font-size-back-detail;
          color: $color-text-dd;
        }
      }
    }
  }

  .navBar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
    display: flex;
    align-items: center;
    .back {
      margin-left: 6px;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      width: 80%;
      @include no-wrap;
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
  }
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }
  .bg-lazyer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .song-list-wrapper {
    padding: 20px 30px;
  }

  .slideDown {
    animation: slideDown 0.5s cubic-bezier(0.18, 0.89, 1, 1.32);
  }

  .slideUp {
    animation: slideUp 0.5s cubic-bezier(0.18, 0.89, 1, 1.32);
  }

  .sildeOut {
    animation: sildeDownFadeOut 0.5s ease-in-out;
  }
  .fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes sildeDownFadeOut {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      opacity: 0;
      transform: translate3d(0, 50px, 0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(0, -100%, 0);
    }
  }

  @keyframes slideDown {
    0% {
      transform: translate3d(0, -100%, 0);
    }
    80% {
      transform: translate3d(0, 10%, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>
