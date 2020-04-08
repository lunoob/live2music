<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="scroll">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList" :key="item.id">
          <div class="icon">
            <div class="updateTime">{{item.updateFrequency}}</div>
            <img v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <template v-if="item.songlist.length > 0">
              <li class="song" v-for="(song, index) in item.songlist" :key="index">
                <span>{{ index + 1 }}.</span>
                <span>{{ song.first }}-{{ song.second }}</span>
              </li>
            </template>
            <template v-else>
              <li class="song">
                <h2 class="name">{{ item.name }}</h2>
                <p class="description">{{ item.description }}</p>
              </li>
            </template>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-if="!topList.length">
      <loading type="breath"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'components/Scroll/Scroll';
import Loading from 'components/Loading/Loading';
import { getToplist } from 'api/rank';
import { playlistMixin } from 'assets/js/mixin';
import { topMap } from 'assets/js/config';
import { mapMutations } from 'vuex';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      officalList: [],
      topList: [],
      rankConfig: {
        imgSize: 80,
        type: 'rank'
      }
    };
  },
  created() {
    this._getRankList();
  },
  methods: {
    selectItem(item) {
      const idx = topMap.get(item.name);
      item.idx = idx;
      this.$router.push(`/rank/${idx}`);
      this.setTopList(item);
    },
    handlePlayList(playlist) {
      // 因为rank使用了padding:10px 0; 所以需要减去10px 默认是60px
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    async _getRankList() {
      let list = await getToplist();
      if (list.length > 0) {
        this.topList = list.map(item => {
          return {
            id: item.id,
            description: item.description,
            name: item.name,
            picUrl: item.coverImgUrl,
            songlist: item.tracks,
            updateFrequency: item.updateFrequency
          };
        });
      }
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    ul {
      padding: 20px 0;
    }
    .item {
      display: flex;
      margin: 20px 20px 0;
      height: 100px;
      border: 1px solid $color-highlight-background;
      border-radius: 2px;
      overflow: hidden;
      &:first-child {
        margin-top: 0px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
        position: relative;
        .updateTime {
          position: absolute;
          bottom: 5px;
          right: 5px;
          padding: 3px 5px;
          border-radius: 10px;
          background-color: $color-background-d;
          font-size: 10px;
          color: white;
        }
        img {
          height: 100%;
          width: 100%;
        }
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap;
          line-height: 26px;
          .name {
            color: $color-text;
            font-size: $font-size-medium;
          }
          .description {
            @include showLine(2);
          }
        }
      }
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
