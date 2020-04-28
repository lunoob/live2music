<template>
  <div class="player" v-show="playList.length > 0">
    <!-- 展开状态 -->
    <!-- 背景 -->
    <transition
      name="normal"
      :appear="true"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="pageWrapper">
          <!-- 顶部开始 -->
          <div class="top">
            <div class="back" @click="back">
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
            <div class="playlist" @click="showPlayList">
              <i class="icon-playlist"></i>
            </div>
          </div>
          <!-- 顶部结束 -->

          <!-- 中间部分开始 -->
          <div
            class="middle"
            @touchstart.prevent="onMiddleTouchStart"
            @touchmove.prevent="onMiddleTouchMove"
            @touchend="onMiddleTouchEnd"
          >
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd">
                  <img :src="currentSong.image" alt class="image" :class="cdAnimation" />
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{ playingLryic }}</div>
              </div>
            </div>
            <!-- 中间部分结束 -->

            <!-- 歌词部分开始 -->
            <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p
                    ref="lyricLine"
                    class="text"
                    :class="{ current: index === currentLineNum }"
                    v-for="(line, index) in currentLyric.lines"
                    :key="index"
                  >{{ line.txt }}</p>
                </div>
              </div>
            </scroll>
            <!-- 歌词部分结束 -->
          </div>

          <!-- 底部开始 -->
          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
              <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
            </div>

            <!-- 进度条 -->
            <div class="progress-wrapper">
              <span class="time time-l">{{ format(currentTime) }}</span>
              <div class="progress-bar-wrapper">
                <progress-bar
                  :percent="percent"
                  :cache="bufferPercent"
                  @percentChange="changePercent"
                ></progress-bar>
              </div>
              <span class="time time-r">{{ format(duration) }}</span>
            </div>

            <div class="operators">
              <div class="icon i-left">
                <!-- 播放模式 -->
                <i :class="mode" @click="changeMode"></i>
              </div>
              <div class="icon i-left" :class="disableCl">
                <!-- 上一曲 -->
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableCl">
                <i :class="playAndPause" @click="togglePlaying"></i>
              </div>
              <div class="icon i-right" :class="disableCl">
                <!-- 下一曲 -->
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                <i
                  class="icon"
                  @click="toggleFavorite(currentSong)"
                  :class="getFavoriteIcon(currentSong)"
                ></i>
              </div>
            </div>
          </div>
          <!-- 底部结束 -->
        </div>
      </div>
    </transition>

    <transition name="mini" :appear="true">
      <!-- mini状态 -->
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!-- 头像部分 -->
        <div class="icon">
          <img :src="currentSong.image" alt height="40" width="40" :class="cdAnimation" />
        </div>
        <!-- 文本 -->
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 控制按钮 -->
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="MiniPlayAndPause" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlayList"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <!-- 
      防止切换的太快，需要做标志位
      只有当前歌曲准备好，可以播放的时候才能进行切换
    -->
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="playEnd"
    ></audio>
  </div>
</template>

<script>
import ProgressBar from 'components/ProgressBar/ProgressBar';
import ProgressCircle from 'components/ProgressCircle/ProgressCircle';
import Scroll from 'components/Scroll/Scroll';
import PlayList from 'components/PlayList/PlayList';
import Toast from 'assets/js/toast.js';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import animations from 'create-keyframe-animation';
import { prefixStyle } from 'assets/js/common';
import {
  getMusicUrl,
  getMusicLyric,
  getMusicImage,
  checkUse
} from 'api/player';
import { PlayMode } from 'assets/js/config';
import Lyric from 'lyric-parser';
import { playerMixin } from 'assets/js/mixin';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');
const MiniAvatarWidth = 40;

export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      // 当前播放的时间
      currentTime: 0,
      // 歌曲总时长
      duration: 0,
      currentLyric: null,
      // 当前播放的行数
      currentLineNum: 0,
      currentShow: 'cd',
      playingLryic: '',
      // 缓冲
      bufferPercent: 0
    };
  },
  computed: {
    percent() {
      return this.currentTime ? this.currentTime / this.duration : 0;
    },
    disableCl() {
      return this.songReady ? '' : 'disable';
    },
    cdAnimation() {
      return this.playing ? 'play' : 'play pause';
    },
    MiniPlayAndPause() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    playAndPause() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    ...mapGetters(['fullScreen', 'playing', 'playIndex'])
  },
  created() {
    this.touch = {};
  },
  methods: {
    showPlayList() {
      this.$refs.playlist.show();
    },
    handleScroll() {},
    onMiddleTouchStart(e) {
      this.touch.init = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
      // 这里初始化percent同时重置上次touchend遗留下值
      this.touch.percent = undefined;
    },
    onMiddleTouchMove(e) {
      if (!this.touch.init) {
        return;
      }
      let deltaX = e.touches[0].pageX - this.touch.startX;
      let deltaY = e.touches[0].pageY - this.touch.startY;
      /**
       *
       *  从移动开始的第二次可以得知滑动的方向
       *  然后锁定该方向，直到触摸结束
       *
       */
      if (!this.touch.direction) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          this.touch.direction = 'y';
          // 垂直滑动
          return;
        }
        this.touch.direction = 'x';
      } else if (this.touch.direction === 'y') {
        return;
      }

      let left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      // 控制边界行为，当是从左向右滑动的时候，width长度不能超过0。 从右向左滑动的时候，width的长度不能小于-window.innerWidth
      let offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, deltaX + left)
      );
      // 当从cd切换到lyric, percent从0递增，相反percent从100递减
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
    },
    onMiddleTouchEnd() {
      let offsetWidth, opacity;
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          opacity = 0;
          offsetWidth = -window.innerWidth;
          this.currentShow = 'lyric';
        } else {
          opacity = 1;
          offsetWidth = 0;
        }
      } else {
        if (this.touch.percent < 0.9) {
          opacity = 1;
          offsetWidth = 0;
          this.currentShow = 'cd';
        } else {
          opacity = 0;
          offsetWidth = -window.innerWidth;
        }
      }
      const time = 300;
      this.touch.init = false;
      this.touch.direction = null;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
    },

    changePercent(percent, type) {
      if (!this.songReady) {
        return (this.currentTime = 0);
      }
      const time = this.duration * percent;
      if (type === 'move') {
        if (this.currentLyric) {
          // 调用seek之后会自动播放
          this.currentLyric.seek(1000 * time);
        }
      } else {
        this.$refs.audio.currentTime = time;
        if (!this.playing) {
          this.togglePlaying();
        }
        if (this.currentLyric) {
          // 调用seek之后会自动播放
          this.currentLyric.seek(1000 * time);
        }
      }
    },
    updateTime(e) {
      if (this.bufferPercent < 100) {
        // 获取buffered对象
        if (e.target.buffered.length !== 0) {
          const timeRanges = e.target.buffered;
          // 获取已缓冲的时间
          const rangVal = timeRanges.end(timeRanges.length - 1);
          this.bufferPercent = parseInt((rangVal / e.target.duration) * 100);
        }
      }
      if (!this.songReady) return;
      this.currentTime = e.target.currentTime; // e.target.currentTime是一个可读写的属性
    },
    format(interval) {
      // 向下取整
      interval = interval | 0;
      let minute = ((interval / 60) | 0).toString();
      let second = (interval % 60).toString();
      return `${minute.padStart(2, 0)}:${second.padStart(2, 0)}`;
    },
    ready(e) {
      console.log(e.target, 'audio');
      this.duration = e.target.duration;
      this.songReady = true;
      if (!this.playing) {
        this.togglePlaying();
      }
      this.savePlayHistory(this.currentSong);
    },
    error() {
      this.songReady = true;
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      // 防止歌曲未加载好，还是处于暂停状态，点击播放产生错误
      if (this.currentLyric && this.currentLyric) {
        this.currentLyric.togglePlay();
      }
      this.setPlaying(!this.playing);
    },
    prev() {
      if (this.playList.length === 1) {
        this.loop();
        return;
      }
      if (!this.songReady) {
        return;
      }
      let index = this.playIndex - 1;
      if (index < 0) {
        index = this.playList.length - 1;
      }
      this.setPlayIndex(index);
      this.songReady = false;
    },
    next() {
      // 播放列表只有一个首歌的时候
      if (this.playList.length === 1) {
        this.loop();
        return;
      }
      if (!this.songReady) {
        return;
      }
      let index = this.playIndex + 1;
      if (index === this.playList.length) {
        // 当前歌曲已经是当前播放列表的最后一首,this.playList[this.playList.length] 是不存在的
        index = 0;
      }
      this.setPlayIndex(index);
      this.songReady = false;
    },
    playEnd() {
      this.playMode === PlayMode.loop ? this.loop() : this.next();
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    enter(el, done) {
      let { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0px, 0px, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0px, 0px, 0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave(el, done) {
      let cdWrapper = this.$refs.cdWrapper;
      cdWrapper.style.transition = 'all .4s';
      let { x, y, scale } = this._getPosAndScale();
      cdWrapper.style[
        transform
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave() {
      let cdWrapper = this.$refs.cdWrapper;
      cdWrapper.style.transition = '';
      cdWrapper.style[transform] = '';
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      // 当前显示的歌词行数>5
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLryic = txt;
    },
    async _watchCurrentSong(newSong) {
      // 切换歌曲时需要的重置操作
      this.currentTime = 0;
      this.duration = 0;
      this.songReady = false;
      this.bufferPercent = 0;
      this.setPlaying(false);
      // 获取数据

      let canUse = await checkUse(newSong.id);
      if (canUse === 'ok') {
        let res = await Promise.all([
          getMusicUrl(newSong.id),
          getMusicLyric(newSong.id),
          newSong.image ? null : getMusicImage(newSong.id)
        ]);

        if (res.length > 0) {
          // 修改当前歌曲信息
          this.setSongInfo({
            newSong,
            info: {
              url: res[0].url,
              duration: res[0].size,
              image: newSong.image ? newSong.image : res[2][0].al.picUrl
            }
          });
          this.currentLyric = new Lyric(res[1].lyric, this.handleLyric);

          this.$nextTick(() => {
            if (!this.playing) {
              // 暂停后播放
              this.togglePlaying();
            } else {
              // 首次进入和切换歌曲
              this.$refs.audio.play();
              // 播放歌词
              this.currentLyric.play();
            }
          });
        }
      } else {
        Toast.show({
          duration: 2000,
          title: canUse
        });
      }
    },
    _getPosAndScale() {
      // mini头像信息
      let miniAvatar = {
        // mini头像大小
        size: MiniAvatarWidth,
        // 中心点到左边的距离(通过计算)
        paddingLeft: 40,
        // 中心点到底部的距离(通过计算)
        paddingBottom: 30
      };

      // cd头像信息
      let cdAvatar = {
        // cd头像大小
        size: window.innerWidth * 0.8,
        // 中心点到左边的距离(通过计算)
        paddingLeft: window.innerWidth * 0.5,
        // 中心点到底部的距离(通过计算)
        paddingBottom: window.innerHeight - ((window.innerWidth * 0.8) / 2 + 80)
      };
      let x = -(cdAvatar.paddingLeft - miniAvatar.paddingLeft);
      let y = cdAvatar.paddingBottom - miniAvatar.paddingBottom;
      let scale = miniAvatar.size / cdAvatar.size;

      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations({
      // 起别名
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setSongInfo: 'SET_SONG_INFO'
    }),
    ...mapActions(['savePlayHistory'])
  },
  watch: {
    /*

    监听当前歌曲：
      1. 歌曲发生变化，根据id获取音乐的播放地址
      2. 在dom更新完之后，执行播放
        - 如果暂停状态，切换为播放状态
          - 切换为播放状态之前，判断当前audio元素是否已经准备好
          - 当audio元素准备好之后，如果是暂停状态 --> 播放
        - 否则 播放当前音乐

    */
    async currentSong(newSong, oldSong) {
      // 如果currentSong发生变化，可是内容没有变
      if (!newSong.id || newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentLineNum = 0;
        this.currentLyric = null;
        this.playingLryic = '';
      }
      this._watchCurrentSong(newSong);
    },
    playing(newVal) {
      let audio = this.$refs.audio;
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';

.player {
  & .normal-enter-active,
  & .normal-leave-active {
    transition: all 0.4s;
    .top,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  & .normal-enter,
  & .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0.6;
      filter: opacity(0.2) blur(20px);
    }
    .pageWrapper {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-back;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }

        .playlist {
          position: absolute;
          top: 0;
          right: 6px;
          z-index: 50;
          .icon-playlist {
            display: block;
            padding: 9px;
            font-size: $font-size-back;
            color: $color-theme;
          }
        }

        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap;
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            &::after {
              content: '';
              background: inherit;
              width: 100%;
              height: 100%;
              box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.3);
              display: block;
              z-index: 2;
              position: absolute;
              top: 0;
              left: 0;
              border-radius: 50%;
            }
            .cd {
              width: 100%;
              height: 100%;
              border: 5px solid rgba(0, 0, 0, 0.1);
              border-radius: 50%;
              box-sizing: border-box;
              & .play {
                animation: rotate 20s linear infinite;
              }
              & .pause {
                animation-play-state: paused;
              }
              .image {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
        }
      }
      .playing-lyric-wrapper {
        width: 80%;
        margin: 30px auto 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-theme;
          font-weight: bold;
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-dialog-background;
            font-size: $font-size-medium;
            &.current {
              color: $color-theme;
              font-weight: bold;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-background-d;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-background-dd;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l {
              text-align: left;
              padding-right: 5px;
            }
            &.time-r {
              text-align: right;
              padding-left: 5px;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
    }
  }

  & .mini-enter-active,
  & .mini-leave-active {
    transition: all 0.4s;
  }
  & .mini-enter,
  & .mini-leave-to {
    opacity: 0;
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-background;
    box-shadow: $shadow-simple;
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include no-wrap;
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap;
        font-size: $font-size-small;
        color: $color-text-dd;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 30px;
        color: $color-theme;
      }
      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.7);
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
