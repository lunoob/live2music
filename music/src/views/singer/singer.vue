<template>
  <div class="singer" ref="singer">
    <list-view :data="singerlist" ref="singerlist" @select="goSingerDetail"></list-view>
    <router-view></router-view>
    <div class="loading-container" v-if="!singerlist.length">
      <loading type="breath"></loading>
    </div>
  </div>
</template>

<script>
import ListView from 'components/ListView/ListView';
import { getSingerList, getHotSinger } from 'api/singer';
import pinyin from 'assets/js/pinyin';
import Singer from 'assets/js/singer';
import Loading from 'components/Loading/Loading';
import { mapMutations } from 'vuex';
import { playlistMixin } from 'assets/js/mixin';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerlist: []
    };
  },
  created() {
    // 获取歌手
    this._getSingerList();
  },
  components: {
    ListView,
    Loading
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$refs.singerlist.refresh();
    },
    goSingerDetail(singer) {
      this.$router.push(`/singer/${singer.id}`);
      this.setSinger(singer);
    },
    async _getSingerList() {
      let vm = this;
      // 获取歌手
      let res = await getSingerList();
      // 获取热门歌手
      let result = await getHotSinger();
      // 对歌手进行分类，姓名首字母
      vm.singerlist = [];
      let map = {};
      // 对姓名拼音首字母进行排序
      res.forEach(item => {
        let word = pinyin
          .getCamelChars(item.name)
          .substr(0, 1)
          .toUpperCase();
        if (!map[word]) {
          map[word] = {
            title: word,
            items: [
              new Singer({
                id: item.id,
                name: item.name,
                avatar: item.img1v1Url
              })
            ]
          };
        } else {
          map[word].items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url
            })
          );
        }
      });
      // 将对象放进数组
      for (let key in map) {
        let item = map[key];
        vm.singerlist.push(item);
      }
      // 对数组按姓名首字母进行排序
      vm.singerlist.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      if (result) {
        let tem = { title: '热门', items: [] };
        for (let key in result) {
          let item = result[key];
          tem.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url
            })
          );
        }
        vm.singerlist.unshift(tem);
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
};
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
