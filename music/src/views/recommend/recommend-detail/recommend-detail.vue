<template>
  <transition name="slide" :appear="true">
    <music-list :title="desc.name" :bg-image="desc.picUrl" :songs="songList"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/MusicList/MusicList';
import { NewSong } from 'assets/js/song';
import { mapGetters } from 'vuex';
import { getDetail } from 'api/recommend';

export default {
  data() {
    return {
      songList: []
    };
  },
  created() {
    if (!(this.desc && this.desc.id)) {
      this.$router.back();
      return;
    }
    this._getSonglist(this.desc.id);
  },
  computed: {
    ...mapGetters(['desc'])
  },
  methods: {
    async _getSonglist(id) {
      let { tracks } = await getDetail(id);
      this.songList = tracks.map(item => {
        return NewSong({
          id: item.id,
          singer: item.ar,
          name: item.name,
          album: item.al.name,
          image: item.al.picUrl
        });
      });
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
