<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" :style="computedMargin" @focus="handleFocus" @query="handleQuery"></search-box>
      <transition name="slide">
        <button class="cancelBtn" @click="cancelInputActive" v-show="inputActive">取消</button>
      </transition>
    </div>
    <div ref="shortCutWrapper" class="shortcut-wrapper" v-show="!trimVal">
      <scroll :refreshDelay="delay" ref="shortcut" class="shortcut" :data="shortcutData">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                class="item"
                v-for="(item, index) in hotKey"
                :key="index"
                @click="addQuery(item.first)"
              >
                <span>{{ item.first }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-if="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-recover"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteOne" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="trimVal">
      <suggest ref="suggest" @select="saveOne" @scroll="blurInput" :query="trimVal"></suggest>
    </div>
    <confirm ref="confirm" title="是否清空搜索历史" confirmBtnText="清空" @confirm="clearAll"></confirm>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox/SearchBox';
import Suggest from 'components/Suggest/Suggest';
import SearchList from 'components/SearchList/SearchList';
import Confirm from 'components/Confirm/Confirm';
import Scroll from 'components/Scroll/Scroll';
import { hotSearch } from 'api/search';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { playlistMixin, searchMixin } from 'assets/js/mixin';

export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKey: []
    };
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  computed: {
    computedMargin() {
      return this.inputActive ? 'width: calc(100% - 70px);' : '';
    },
    shortcutData() {
      return this.hotKey.concat(this.searchHistory);
    },
    ...mapGetters(['inputActive'])
  },
  created() {
    this._getHotSearch();
  },
  methods: {
    cancelInputActive() {
      this.$refs.searchBox.clearQuery();
      this.setInputActive(false);
    },
    handleFocus() {
      this.setInputActive(true);
    },
    handlePlayList(playlist) {
      let bottom = playlist.length ? '60px' : '';
      // 热门关键词和搜索历史
      this.$refs.shortCutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      // 搜索建议
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    async _getHotSearch() {
      let { hots } = await hotSearch();
      this.hotKey = hots;
    },
    ...mapActions({
      clearAll: 'clearSearchHistory'
    }),
    ...mapMutations({
      setInputActive: 'SET_INPUT_ACTIVE'
    })
  },
  watch: {
    inputActive() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.shortcut.refresh();
      }, 320);
    },
    query(newQuery) {
      // 如果为空的时候
      if (!newQuery) {
        // 从suggest切换到shortcut页面,需要刷新一下
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    },
    searchHistory() {
      this.$nextTick(() => {
        this.$refs.shortcut.refresh();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
    position: relative;
    .cancelBtn {
      height: 40px;
      width: 60px;
      color: #323233;
      background-color: #fff;
      border: 1px solid #ebedf0;
      border-radius: 5px;
      margin-left: 10px;
      position: absolute;
      top: 0;
      right: 0;
      outline: none;
      &:active {
        background: $color-background-active;
      }
      &.slide-enter-active,
      &.slide-leave-active {
        transition: all 0.3s;
      }
      &.slide-enter,
      &.slide-leave-to {
        transform: translate3d(150%, 0, 0);
      }
    }
  }
  .shortcut-wrapper {
    // position: fixed;
    // top: 178px;
    position: absolute;
    top: 80px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          font-weight: bold;
          color: $color-title;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-dd;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-d;
          .text {
            flex: 1;
            font-weight: bold;
            color: $color-title;
          }
          .clear {
            @include extend-click;
            .icon-recover {
              font-size: $font-size-large-x;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }
  .search-result {
    // position: fixed;
    position: absolute;
    width: 100%;
    // top: 178px;
    top: 80px;
    bottom: 0;
  }
}
</style>
