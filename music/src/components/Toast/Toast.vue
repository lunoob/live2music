<template>
  <div class="tip-wrapper show">
    <div class="icon-wrapper" v-if="icon.length>0">
      <i :class="icon"></i>
    </div>
    <div class="title-wrapper">
      <p>{{title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toast',
  data() {
    return {
      icon: '',
      title: '',
      duration: 1500
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
.tip-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 999;
  transform: translate3d(-50%, -50%, 0);
  background-color: $color-text-dd;
  color: $color-background;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .icon-wrapper {
    text-align: center;
    padding: 20px;
    i {
      font-size: $font-size-back;
    }
  }
  .title-wrapper {
    text-align: center;
    padding: 10px;
  }
}
</style>