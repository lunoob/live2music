<template>
  <!-- 这里需要appear的原因是，当退出当前组件的时候，当前组件被卸载掉，不是单纯的display:none; -->
  <transition name="slide" appear>
    <music-list
      :title="singer.name"
      :songs="songList"
      :bgImage="singer.avatar"
    ></music-list>
  </transition>
</template>

<script>
import { getSongList } from 'api/singer';
import { NewSong } from 'assets/js/song';
import { mapGetters } from 'vuex';
import MusicList from 'components/MusicList/MusicList';

export default {
  data() {
    return {
      songList: []
    };
  },
  created() {
    this._getSingerList();
  },
  computed: {
    ...mapGetters(['singer'])
  },
  components: {
    MusicList
  },
  methods: {
    async _getSingerList() {
      let id = this.singer.id;
      if (!id) {
        return this.$router.push('/singer');
      }
      let res = await getSongList(id);
      let { hotSongs } = res;
      // 如果没有数据
      if (!hotSongs || !hotSongs.length) {
        return;
      }
      this.songList = hotSongs.map(item => {
        return NewSong({
          id: item.id,
          singer: item.ar,
          name: item.name,
          album: item.al.name,
          image: item.al.picUrl
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 300;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: royalblue;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
