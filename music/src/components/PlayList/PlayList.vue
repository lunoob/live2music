<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-topWrapper">
          <div class="list-header">
            <h1 class="title">
              <i class="icon" @click="changeMode" :class="mode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-recover"></i>
              </span>
            </h1>
          </div>
          <scroll :refreshDelay="delay" class="list-content" :data="sequenceList" ref="scroll">
            <transition-group name="list" tag="ul">
              <li
                class="item"
                v-for="(item, index) in sequenceList"
                :key="item + item.id"
                ref="songItem"
                @click="selectItem(item, index)"
              >
                <i class="current" :class="playCurrent(item)"></i>
                <span class="text">{{ item.name }} - {{ item.singer }}</span>
                <span class="like" @click.stop="toggleFavorite(item)">
                  <i :class="getFavoriteIcon(item)"></i>
                </span>
                <span class="delete" @click.stop="deleteOne(item)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-operate">
            <div class="add" @click="showAddSong">
              <i class="icon-delete"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" title="是否清空播放列表" confirmBtnText="确定" @confirm="handleConfirm"></confirm>
      <add-song ref="AddSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from 'components/Scroll/Scroll';
import Confirm from 'components/Confirm/Confirm';
import AddSong from 'components/AddSong/AddSong';
import { mapActions } from 'vuex';
import { playerMixin } from 'assets/js/mixin';
import { PlayMode } from 'assets/js/config';

// 单次点击的时间间隔
const STime = 300;

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      delay: STime
    };
  },
  created() {},
  computed: {
    // modeText() {
    //   return this.playMode === PlayMode.sequence
    //     ? '顺序播放'
    //     : this.playMode === PlayMode.random
    //     ? '随机播放'
    //     : '单曲循环';
    // }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  methods: {
    showAddSong() {
      this.$refs.AddSong.show();
    },
    handleConfirm() {
      // 清空列表之后，player会关闭， 所以会自动关闭
      this.deleteList();
      this.hide();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    deleteOne(item) {
      if (this.oldTime && new Date().getTime() - this.oldTime > STime) {
        this.deleteSong(item);
        if (!this.playList.length) {
          this.hide();
        }
      }
      this.oldTime = new Date().getTime();
    },
    scrollToCurrent(item) {
      // 从序列列表中找到item对应的索引
      let fIndex = this.sequenceList.findIndex(song => {
        return song.id === item.id;
      });
      this.$refs.scroll.scrollToElement(this.$refs.songItem[fIndex], 200);
    },
    selectItem(item, index) {
      if (this.playMode === PlayMode.random) {
        index = this.playList.findIndex(song => {
          return song.id === item.id;
        });
      }
      // 设置播放列表
      this.setPlayIndex(index);
    },
    playCurrent(item) {
      return this.currentSong.id === item.id ? 'icon-play' : '';
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.scroll.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    ...mapActions(['deleteSong', 'deleteList'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 没有显示 || 切换前后的歌曲都是同一首歌
      if (!newSong.id || !this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      this.$nextTick(() => {
        this.scrollToCurrent(newSong);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: all 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  //   &.list-fade-enter {
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 20px 20px 0 0;
    box-sizing: border-box;
    padding: 5px;
    .list-topWrapper {
      background-color: $color-background;
      border-radius: 20px 20px 10px 10px;
      margin-bottom: 10px;
    }
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-title;
          font-weight: bold;
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
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        color: $color-text-dd;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.3s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
          // transform: translate3d(-100%, 0, 0);
        }
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme;
        }
        .text {
          flex: 1;
          @include no-wrap;
          font-size: $font-size-medium;
          color: $color-text-dd;
        }
        .like {
          @include extend-click;
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click;
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }
    .list-operate {
      width: 140px;
      padding: 20px 0 30px 0;
      margin: 0 auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-theme;
        border-radius: 100px;
        color: $color-theme;
        .icon-delete {
          margin-right: 5px;
          font-size: $font-size-small-s;
          transform: rotate(45deg);
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text;
      border-radius: 10px;
      &:active {
        background: $color-background-active;
        color: $color-theme;
      }
    }
  }
}
// }
</style>
