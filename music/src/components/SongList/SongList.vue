<template>
  <div class="song-list">
    <ul>
      <li
        v-for="(song, index) in songs"
        :key="song.id"
        class="item"
        @click="selectItem(song, index)"
      >
        <div class="rank" v-if="rank">
          <span :class="getRankCls(index)" v-text="getRankIndex(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
    <div v-if="showIcon&&songs.length" class="musicIcon">
      <i class="icon-music"></i>
      <p>Luoob</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'songlist',
  props: {
    songs: {
      type: Array,
      default: null
    },
    rank: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      }
      return 'text';
    },
    getRankIndex(index) {
      if (index > 2) {
        return index + 1;
      }
    },
    selectItem(item, index) {
      this.$emit('select', item, index);
    },
    getDesc(song) {
      return `${song.singer} - ${song.album || '暂无专辑'}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';
// .song-list-wrapper {
//   padding: 20px 30px;
// }
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: 14px;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          text-align: center;
          @include bg-image('first');
        }
        &.icon1 {
          text-align: center;
          @include bg-image('second');
        }
        &.icon2 {
          text-align: center;
          @include bg-image('third');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap;
        color: $color-text;
      }
      .desc {
        @include no-wrap;
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
  .musicIcon {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    font-size: $font-size-large-x;
    color: $color-theme;
    [class^='icon'] {
      font-size: $font-size-large-x;
    }
  }
}
</style>
