import { PlayMode } from 'assets/js/config';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Toast from 'assets/js/toast.js';
import { Shuffle } from 'assets/js/common';

// 用于处理播放器底部遮挡页面
export const playlistMixin = {
  mounted() {
    this.handlePlayList(this.playList);
  },
  computed: {
    ...mapGetters(['playList'])
  },
  // keep-alive激活hook
  activated() {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList(newList) {
      this.handlePlayList(newList);
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('Components must be implement handlePlayList method');
    }
  }
};

// 播放器切换播放模式
export const playerMixin = {
  computed: {
    mode() {
      return this.playMode === PlayMode.sequence
        ? 'icon-sequence'
        : this.playMode === PlayMode.loop
        ? 'icon-loop'
        : 'icon-random';
    },
    modeText() {
      return this.playMode === PlayMode.sequence
        ? '顺序播放'
        : this.playMode === PlayMode.random
        ? '随机播放'
        : '单曲循环';
    },
    ...mapGetters([
      'playMode',
      'sequenceList',
      'playList',
      'currentSong',
      'favoriteList'
    ])
  },
  methods: {
    toggleFavorite(song) {
      this.isFavorite(song) ? this.deleteFav(song) : this.saveFav(song);
    },
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
    },
    isFavorite(song) {
      let fIndex = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return fIndex > -1;
    },
    changeMode() {
      let mode = (this.playMode + 1) % 3;
      this.setPlayMode(mode);
      Toast.show({
        icon: this.mode,
        title: `已切换为${this.modeText}`
      });
      let list = null;
      if (this.playMode === PlayMode.random) {
        list = Shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      // 重置播放索引
      this.resetPlayIndex(list);
      // 设置当前播放的列表
      this.setPlayList(list);
    },
    resetPlayIndex(list) {
      let index = list.findIndex(item => {
        return item.id == this.currentSong.id;
      });
      this.setPlayIndex(index);
    },
    ...mapMutations({
      setPlayIndex: 'SET_PLAY_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions(['saveFav', 'deleteFav'])
  }
};

// 搜索共用的mixin
export const searchMixin = {
  data() {
    return {
      query: '',
      delay: 400
    };
  },
  computed: {
    trimVal() {
      let reg = /^\s*|\s*$/g;
      return this.query.replace(reg, ''); //去除首尾空格
    },
    ...mapGetters(['searchHistory'])
  },
  methods: {
    handleQuery(query) {
      this.query = query;
    },
    addQuery(key) {
      this.setInputActive(true);
      this.$refs.searchBox.setQuery(key);
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    ...mapActions({
      saveOne: 'saveSearchHistory',
      deleteOne: 'deleteSearchHistory'
    })
  }
};

/**
 *
 *  只要组件中使用了mixin
 *  同名方法会覆盖mixin中的方法
 *  hooks函数会合并
 *
 */
