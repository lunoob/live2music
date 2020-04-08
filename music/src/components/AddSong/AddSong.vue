<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-back"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="handleQuery"></search-box>
      </div>
      <div class="shortcut" v-show="!trimVal">
        <switches :switches="switches" :activeIndex="activeIndex" @switch="hanldeSwitch"></switches>
        <div class="list-wrapper">
          <!-- 最近播放 -->
          <scroll
            class="list-scroll"
            v-show="activeIndex === 0"
            :data="playHistory"
            ref="playScroll"
          >
            <div class="list-inner">
              <song-list @select="selectItem" :songs="playHistory"></song-list>
            </div>
          </scroll>
          <!-- 搜索历史 -->
          <scroll
            v-show="activeIndex === 1"
            class="list-scroll"
            :data="searchHistory"
            ref="searchScroll"
            :refreshDelay="delay"
          >
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="trimVal">
        <suggest ref="suggest" @select="suggestSelect" @scroll="blurInput" :query="trimVal"></suggest>
      </div>
      <top-tip ref="toptip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">已添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'components/SearchBox/SearchBox';
import Suggest from 'components/Suggest/Suggest';
import Switches from 'components/Switches/Switches';
import SearchList from 'components/SearchList/SearchList';
import Scroll from 'components/Scroll/Scroll';
import SongList from 'components/SongList/SongList';
import TopTip from 'components/TopTip/TopTip';
import { NewSong } from 'assets/js/song';
import { searchMixin } from 'assets/js/mixin';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'add-song',
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      activeIndex: 0,
      switches: [{ name: '最近播放' }, { name: '搜索历史' }]
    };
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  methods: {
    suggestSelect(query) {
      this.toptipShow();
      this.saveOne(query);
    },
    toptipShow() {
      this.$refs.toptip.show();
    },
    selectItem(song, index) {
      if (index !== 0) {
        this.insertSong(NewSong(song));
        this.toptipShow();
      }
    },
    hanldeSwitch(index) {
      this.activeIndex = index;
      this.refresh();
    },
    refresh() {
      setTimeout(() => {
        if (this.activeIndex === 0) {
          this.$refs.playScroll.refresh();
        } else if (this.activeIndex === 1) {
          this.$refs.searchScroll.refresh();
        }
      }, 20);
    },
    show() {
      this.showFlag = true;
      this.refresh();
    },
    hide() {
      this.showFlag = false;
    },
    ...mapActions(['insertSong'])
  },
  watch: {
    query(newQuery) {
      // 如果为空的时候
      if (!newQuery) {
        // 从suggest切换到shortcut页面,需要刷新一下
        setTimeout(() => {
          this.refresh();
        }, 20);
      }
    },
    searchHistory() {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      // top: 0;
      left: 8px;
      .icon-back {
        display: block;
        padding: 12px;
        font-size: $font-size-back;
        color: $color-theme;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
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
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-background;
      font-weight: bold;
    }
  }
}
</style>
