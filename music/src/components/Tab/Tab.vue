<template>
  <div class="tab" ref="tab" @click="changeLine">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
    <!-- 下划线 -->
    <span class="tabLine" ref="line" v-show="tabLineFlag"></span>
  </div>
</template>


<script>
const links = ['/recommend', '/singer', '/rank', '/search'];

export default {
  name: 'tab',
  data() {
    return {
      tabLineFlag: false
    };
  },
  computed: {
    routePath() {
      return this.$route.path;
    }
  },
  methods: {
    changeLine() {
      this.$nextTick(() => {
        let tabItems = this.$refs.tab.getElementsByClassName('tab-item');
        tabItems.forEach((item, index) => {
          if (item.classList.contains('router-link-active')) {
            this.$refs.line.style.left = `${this.itemInfo.width * index +
              this.itemInfo.width / 4}px`;
          }
        });
      });
    },
    _initTabLine() {
      let tabWidth = this.$refs.tab.clientWidth;
      let tabHeight = this.$refs.tab.clientHeight;
      this.tabItems = this.$refs.tab.getElementsByClassName('tab-item');
      this.itemInfo = {
        height: tabHeight,
        width: tabWidth / this.tabItems.length
      };
      let findex = links.findIndex(item => item === this.$route.path);
      if (findex > -1) {
        this.$refs.line.style.width = `${this.itemInfo.width / 2}px`;
        this.$refs.line.style.left = `${this.itemInfo.width * findex +
          this.itemInfo.width / 4}px`;
        this.tabLineFlag = true;
      }
    }
  },
  mounted() {
    this._initTabLine();
  },
  watch: {
    routePath(newPath) {
      if (!links.includes(newPath)) {
        this.tabLineFlag = false;
      }
      if (this.tabLineFlag) {
        return;
      }
      if (links.includes(newPath)) {
        this._initTabLine();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import 'assets/css/variable';
.tab {
  display: flex;
  position: relative;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  .tabLine {
    display: inline-block;
    height: 2px;
    // width: 50px;
    position: absolute;
    bottom: 6px;
    // left: 10px;
    background-color: $color-theme;
    transition: all 0.2s linear;
  }
  .tab-item {
    flex: 1;
    text-align: center;
    &.router-link-active .tab-link {
      color: $color-theme;
      font-size: $font-size-large;
      // border-bottom: 2px solid $color-theme;
    }
  }
  .tab-link {
    padding-bottom: 5px;
    color: $color-text;
  }
}
</style>