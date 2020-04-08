<template>
  <div id="app">
    <div class="nav-wrapper" :class="{ hiddenTransform: inputActive }">
      <my-header @LogoClick="hanleLogo"></my-header>
      <tab></tab>
    </div>
    <div class="body-wrapper" :style="mapInputActive">
      <keep-alive>
        <transition name="slide">
          <router-view></router-view>
        </transition>
      </keep-alive>
    </div>
    <player></player>
  </div>
</template>

<script>
import MyHeader from 'components/MyHeader/MyHeader';
import Tab from 'components/Tab/Tab';
import Player from 'components/Player/Player';
import { mapGetters } from 'vuex';
import Toast from 'assets/js/toast.js';

export default {
  data() {
    return {};
  },
  components: {
    MyHeader,
    Tab,
    Player
  },
  methods: {
    hanleLogo() {
      Toast.show({
        icon: 'icon-music',
        title: '恭喜发现彩蛋'
      });
    }
  },
  computed: {
    mapInputActive() {
      return this.inputActive ? 'top: 0px;' : '';
    },
    ...mapGetters(['inputActive'])
  }
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
  transition: all 0.3s ease;
  &.hiddenTransform {
    transform: translate3d(0, -100%, 0);
  }
}
.body-wrapper {
  position: absolute;
  top: 88px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.toastActive {
  transition: all 0.5s;
}

.show {
  opacity: 0;
}
</style>
