<template>
  <transition name="slide">
    <div class="user-center">
      <div class="nav">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="switches-wrapper">
          <switches @switch="switchItem" :switches="switches" :activeIndex="activeIndex"></switches>
        </div>
      </div>
      <div class="play-btn" ref="playBtn">
        <i class="icon-play"></i>
        <span class="text" @click="randomPlay">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <!-- 我喜欢的 -->
        <scroll
          class="list-scroll"
          v-show="activeIndex === 0"
          :data="favoriteList"
          ref="favoriteScroll"
        >
          <div class="list-inner">
            <song-list @select="selectItem" :songs="favoriteList"></song-list>
          </div>
        </scroll>
        <!-- 我喜欢的 -->

        <!-- 最近听的 -->
        <scroll
          v-show="activeIndex === 1"
          class="list-scroll"
          :data="playHistory"
          ref="recentScroll"
        >
          <div class="list-inner">
            <song-list @select="selectItem" :songs="playHistory"></song-list>
          </div>
        </scroll>
        <!-- 最近听的 -->
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'components/Switches/Switches';
import Scroll from 'components/Scroll/Scroll';
import SongList from 'components/SongList/SongList';
import NoResult from 'components/NoResult/NoResult';
import { NewSong } from 'assets/js/song';
import { mapGetters, mapActions } from 'vuex';
import { playlistMixin } from 'assets/js/mixin';
export default {
  mixins: [playlistMixin],
  data() {
    return {
      activeIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ]
    };
  },
  computed: {
    noResult() {
      if (this.activeIndex === 0) {
        return this.favoriteList.length === 0;
      } else {
        return this.playHistory.length === 0;
      }
    },
    noResultTitle() {
      if (this.activeIndex === 0) {
        return '暂无收藏的歌曲';
      }
      return '暂未听任何歌曲';
    },
    ...mapGetters(['favoriteList', 'playHistory'])
  },
  methods: {
    randomPlay() {
      let list = this.activeIndex === 0 ? this.favoriteList : this.playHistory;
      if (list.length === 0) {
        return;
      }
      list = list.map(item => {
        return NewSong(item);
      });
      this.playRandom(list);
    },
    handlePlayList(songlist) {
      let bottom = songlist.length > 0 ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;
      this.refresh();
    },
    selectItem(song) {
      this.insertSong(song);
    },
    refresh() {
      setTimeout(() => {
        if (this.activeIndex === 0) {
          this.$refs.favoriteScroll.refresh();
        } else if (this.activeIndex === 1) {
          this.$refs.recentScroll.refresh();
        }
      }, 20);
    },
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.activeIndex = index;
      this.refresh();
    },
    ...mapActions(['insertSong', 'playRandom'])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0 30px 0;
  }
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .back {
    position: absolute;
    left: 6px;
    z-index: 50;
    border-radius: 50%;
    .icon-back {
      display: block;
      padding: 5px;
      font-size: $font-size-back;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    // margin: 10px 0 30px 0;
  }
  .play-btn {
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
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>