<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    @beforeScroll="HandlebeforeScroll"
    :beforeScroll="beforeScroll"
    ref="scroll"
  >
    <ul class="suggest-list" v-show="hasMore || result.length">
      <li @click="toPlay(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getName(item)"></p>
        </div>
      </li>
      <li>
        <p class="more-text" v-show="!flag">{{ tipMsg }}</p>
        <div class="loading-container" v-show="flag">
          <loading :show-title="false"></loading>
        </div>
      </li>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉、暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
// 只搜索歌曲
import { keySearch } from 'api/search';
import { NewSong } from 'assets/js/song';
import Scroll from 'components/Scroll/Scroll';
import Loading from 'components/Loading/Loading';
import NoResult from 'components/NoResult/NoResult';
import { mapActions } from 'vuex';

const SEARCH_NUM = 30;

export default {
  name: 'suggesti',
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      // 是否还有更多
      hasMore: true,
      // 标识loading和加载更多是否显示
      flag: true,
      beforeScroll: true
    };
  },
  computed: {
    tipMsg() {
      return this.hasMore ? '加载更多' : '已显示全部';
    }
  },
  methods: {
    refresh() {
      this.$refs.scroll.refresh();
    },
    HandlebeforeScroll() {
      // 针对移动端优化：滚动列表的时候，输入框失去焦点，收起键盘，显示更多内容
      this.$emit('scroll');
    },
    toPlay(item) {
      // item是一个Song的实例对象
      this.insertSong(item);
      // 保存搜索历史记录(不在当前组件处理)
      this.$emit('select', this.query);
    },
    async searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.flag = true;
      let result = await keySearch(this.query, ++this.page, SEARCH_NUM);
      this._checkMore(result);
      if (result.songs && result.songs.length) {
        this.result = this.result.concat(
          result.songs.map(item => {
            return NewSong({
              id: item.id,
              name: item.name,
              singer: item.artists
            });
          })
        );
      }
      this.flag = false;
    },
    async search() {
      this.firstInit();

      let result = await keySearch(this.query, this.page, SEARCH_NUM);
      this._checkMore(result);
      if (result.songs && result.songs.length) {
        this.result = result.songs.map(item => {
          return NewSong({
            id: item.id,
            name: item.name,
            singer: item.artists
          });
        });
      }
      this.flag = false;
    },
    getName(item) {
      return `${item.name} - ${item.singer}`;
    },
    firstInit() {
      this.page = 1;
      this.flag = true;
      this.hasMore = true;
      this.result = [];
      this.$refs.scroll.scrollTo(0, 0);
    },
    _checkMore({ songs, songCount }) {
      if (!songs || songs.length + this.page * SEARCH_NUM > songCount) {
        this.hasMore = false;
      }
    },
    ...mapActions(['insertSong'])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  watch: {
    query(newQuery) {
      if (newQuery.length === 0) {
        return;
      }
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #f9f9f9;
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      [class^='icon-'] {
        font-size: 14px;
        color: $color-theme;
      }
      &:last-child {
        margin-top: 10px;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-dialog-background;
      overflow: hidden;
      .text {
        @include no-wrap;
      }
    }
    .more-text {
      text-align: center;
      color: $color-text-d;
    }
    .loading-container {
      width: 100%;
      opacity: 0.5;
    }
    .more-text,
    .loading-container {
      padding: 20px 0;
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
