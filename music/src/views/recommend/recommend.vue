<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-show="Banners.length > 0" class="slider-wrapper">
          <slider :data="Banners">
            <div v-for="item in Banners" :key="item.bannerId">
              <a :href="item.url">
                <img @load="imageload" class="needsclick" :src="item.pic" />
              </a>
            </div>
          </slider>
        </div>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" :key="item.id" @click="ToDetail(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.picUrl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
                <p class="desc" v-html="item.copywriter"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-if="!discList.length">
        <loading type="breath"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Slider from 'components/Slider/Slider';
import Scroll from 'components/Scroll/Scroll';
import Loading from 'components/Loading/Loading';
import { getRecommend, getDiscList } from 'api/recommend';
import { playlistMixin } from 'assets/js/mixin';
import { mapMutations } from 'vuex';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      Banners: [],
      discList: []
    };
  },
  created() {
    this._getRecommendBanner();
    this._getRecommendDiscList();
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  methods: {
    ToDetail(desc) {
      this.$router.push(`/recommend/${desc.id}`);
      this.setDesc(desc);
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    async _getRecommendBanner() {
      let vm = this;
      let banners = await getRecommend();
      vm.Banners = banners.map(item => {
        return {
          bannerId: item.bannerId,
          pic: item.pic,
          url: item.url,
          typeTitle: item.typeTitle
        };
      });
    },
    async _getRecommendDiscList() {
      let vm = this;
      let result = await getDiscList();
      vm.discList = result;
    },
    imageload() {
      // 防止进行多次刷新
      if (!this.checkImage) {
        this.$refs.scroll.refresh();
        this.checkImage = true;
      }
    },
    ...mapMutations({
      setDesc: 'SET_DESC'
    })
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .recommend-list {
      position: relative;
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        margin: 0 20px 10px 20px;
        padding: 5px;
        border-radius: 4px;
        overflow: hidden;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
          img {
            border-radius: $radiu-icon;
          }
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc {
            @include no-wrap;
            // @include showLine(2);
            color: $color-text-d;
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
