<template>
  <div class="search-list" v-show="searches.length">
    <transition-group tag="ul" name="list">
      <li
        @click="selectItem(item)"
        class="search-item"
        v-for="item in searches"
        :key="item + '_search_'"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    deleteItem(item) {
      this.$emit('delete', item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
@import 'assets/css/mixin';
.search-list {
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s;
  }
  .list-enter,
  .list-leave-to {
    transform: translate3d(-100%, 0, 0);
  }
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    .text {
      flex: 1;
      color: $color-text-dd;
    }
    .icon {
      @include extend-click;
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
