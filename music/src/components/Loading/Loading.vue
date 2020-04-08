<template>
  <div class="loading">
    <div class="rotate" v-if="type === 'rotate'">
      <img
        height="24"
        width="24"
        class="loadingAnimation"
        :src="imageUrl"
        alt=""
      />
      <p v-if="ShowTitle">{{ title }}</p>
    </div>
    <div class="breath" v-if="type === 'breath'">
      <div class="bounce01"></div>
      <div class="bounce02"></div>
    </div>
  </div>
</template>

<script>
// type --> breath rotate
import loadingImage from 'assets/images/loading.png';
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在加载'
    },
    type: {
      type: String,
      default: 'rotate'
    },
    ShowTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imageUrl: loadingImage
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';

.loading {
  position: relative;
  .rotate {
    opacity: 0.6;
    text-align: center;
    p {
      margin-top: 10px;
    }
  }
  .breath {
    .bounce01,
    .bounce02 {
      height: 40px;
      width: 40px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      border-radius: 50%;
    }
    .bounce01 {
      background-color: $color-theme;
      opacity: 0.1;
    }
    .bounce02 {
      background-color: $color-theme;
      opacity: 0.8;
    }
  }
}
.loadingAnimation {
  animation: rotate 1.5s infinite linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.bounce01 {
  animation: bounce01 2s ease-in-out infinite;
}
.bounce02 {
  animation: bounce02 2s ease-in-out infinite;
}

@keyframes bounce01 {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}
@keyframes bounce02 {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0);
  }
}
</style>
