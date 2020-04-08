<template>
  <transition name="slide" :appear="true">
    <music-list
      :title="toplist.name"
      :bg-image="bgImage"
      :songs="songList"
      :rank="rank"
    ></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/MusicList/MusicList';
import { NewSong } from 'assets/js/song';
import { mapGetters } from 'vuex';
import { getDetail } from 'api/rank';

export default {
  data() {
    return {
      songList: [],
      rank: true
    };
  },
  created() {
    if (!(this.toplist && this.toplist.id)) {
      this.$router.back();
      return;
    }
    this._getSonglist(this.toplist.idx);
  },
  computed: {
    bgImage() {
      if (this.songList.length > 0) {
        return this.songList[0].image;
      }
      return '';
    },
    ...mapGetters(['toplist'])
  },
  methods: {
    async _getSonglist(idx) {
      let { tracks } = await getDetail(idx);
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
