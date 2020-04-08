<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input
      type="text"
      ref="searchInput"
      class="box"
      @focus="handleFocus"
      @blur="handleBlur"
      v-model="query"
      :placeholder="placeholder"
    />
    <i class="icon-close" v-show="query" @click="clearQuery"></i>
  </div>
</template>

<script>
import { debounce } from 'assets/js/common';
export default {
  name: 'searchbox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌手、歌曲'
    }
  },
  data() {
    return {
      query: ''
    };
  },
  created() {
    this.$watch(
      'query',
      debounce(newQuery => {
        this.$emit('query', newQuery);
      }, 500)
    );
  },
  methods: {
    handleFocus() {
      this.focus = true;
      this.$emit('focus');
    },
    handleBlur() {
      this.$emit('blur');
    },
    blur() {
      this.$refs.searchInput.blur();
    },
    setQuery(query) {
      this.query = query;
    },
    clearQuery() {
      this.query = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: 0 6px;
  height: 40px;
  transition: all 0.3s;
  background-color: $color-switches-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-switches-background;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background-color: $color-switches-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: none;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-close {
    font-size: 16px;
    color: $color-dialog-background;
  }
}
</style>
