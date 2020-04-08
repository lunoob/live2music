<template>
  <div class="m-header">
    <h1 class="text" @click="logoClick">
      <i class="icon icon-music"></i>
      LMusic
    </h1>
    <router-link to="/user" class="person" tag="div">
      <i class="icon-person"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'myheader',
  methods: {
    logoClick() {
      this.$emit('LogoClick');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable.scss';
.m-header {
  position: relative;
  height: 44px;
  color: $color-theme;
  font-size: 0;
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
    padding-left: 20px;
    .icon {
      &.icon-music {
        font-size: $font-size-music;
      }
    }
  }
  .person {
    position: absolute;
    top: 0;
    right: 10px;
    .icon-person {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: $color-theme;
      border-radius: 50%;
    }
  }
}
</style>
